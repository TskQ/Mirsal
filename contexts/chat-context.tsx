"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./auth-context"
import type { Message, Room, Profile } from "@/types/supabase"

interface MessageWithProfile extends Message {
  profiles: Profile
}

interface RoomWithMemberCount extends Room {
  member_count: number
}

interface ChatContextType {
  messages: MessageWithProfile[]
  rooms: RoomWithMemberCount[]
  currentRoom: Room | null
  isLoading: boolean
  sendMessage: (content: string) => Promise<void>
  joinRoom: (roomId: string) => Promise<void>
  leaveRoom: (roomId: string) => Promise<void>
  createRoom: (name: string, description: string, isPrivate: boolean) => Promise<{ error: any }>
  fetchRooms: () => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth()
  const [messages, setMessages] = useState<MessageWithProfile[]>([])
  const [rooms, setRooms] = useState<RoomWithMemberCount[]>([])
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [subscription, setSubscription] = useState<any>(null)

  // Fetch rooms
  const fetchRooms = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("rooms")
        .select(`
          *,
          member_count:room_members(count)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Transform the data to get the member count
      const roomsWithCount = data.map((room) => ({
        ...room,
        member_count: room.member_count?.[0]?.count || 0,
      }))

      setRooms(roomsWithCount)
    } catch (error) {
      console.error("Error fetching rooms:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Fetch messages for current room
  const fetchMessages = useCallback(
    async (roomId: string) => {
      if (!user || !roomId) return

      try {
        const { data, error } = await supabase
          .from("messages")
          .select(`
        *,
        profiles(*)
      `)
          .eq("room_id", roomId)
          .order("created_at", { ascending: true })
          .limit(50) // Limit to last 50 messages for performance

        if (error) throw error

        setMessages(data as MessageWithProfile[])
      } catch (error) {
        console.error("Error fetching messages:", error)
      }
    },
    [user],
  )

  // Subscribe to new messages
  const subscribeToMessages = useCallback(
    (roomId: string) => {
      if (!user || !roomId) return

      // Unsubscribe from previous subscription if exists
      if (subscription) {
        subscription.unsubscribe()
      }

      const newSubscription = supabase
        .channel(`room:${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `room_id=eq.${roomId}`,
          },
          async (payload) => {
            // Fetch the complete message with profile
            const { data, error } = await supabase
              .from("messages")
              .select(`
            *,
            profiles(*)
          `)
              .eq("id", payload.new.id)
              .single()

            if (!error && data) {
              setMessages((prev) => [...prev, data as MessageWithProfile])
            }
          },
        )
        .subscribe()

      setSubscription(newSubscription)

      return () => {
        newSubscription.unsubscribe()
      }
    },
    [user, subscription],
  )

  // Join a room
  const joinRoom = useCallback(
    async (roomId: string) => {
      if (!user || !profile) return

      setIsLoading(true)

      try {
        // Check if room exists
        const { data: roomData, error: roomError } = await supabase.from("rooms").select("*").eq("id", roomId).single()

        if (roomError) throw roomError

        // Join the room if not already a member
        const { error: memberError } = await supabase.from("room_members").upsert({
          room_id: roomId,
          user_id: user.id,
        })

        if (memberError) throw memberError

        // Set current room
        setCurrentRoom(roomData)

        // Fetch messages for the room
        await fetchMessages(roomId)

        // Subscribe to new messages
        subscribeToMessages(roomId)
      } catch (error) {
        console.error("Error joining room:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [user, profile, fetchMessages, subscribeToMessages],
  )

  // Leave a room
  const leaveRoom = useCallback(
    async (roomId: string) => {
      if (!user) return

      try {
        const { error } = await supabase.from("room_members").delete().eq("room_id", roomId).eq("user_id", user.id)

        if (error) throw error

        // If leaving the current room, set current room to null
        if (currentRoom?.id === roomId) {
          setCurrentRoom(null)
          setMessages([])

          // Unsubscribe from messages
          if (subscription) {
            subscription.unsubscribe()
            setSubscription(null)
          }
        }

        // Refresh rooms
        fetchRooms()
      } catch (error) {
        console.error("Error leaving room:", error)
      }
    },
    [user, currentRoom, subscription, fetchRooms],
  )

  // Send a message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!user || !profile || !currentRoom) return

      try {
        const { error } = await supabase.from("messages").insert({
          room_id: currentRoom.id,
          user_id: user.id,
          content,
        })

        if (error) throw error
      } catch (error) {
        console.error("Error sending message:", error)
      }
    },
    [user, profile, currentRoom],
  )

  // Create a new room
  const createRoom = useCallback(
    async (name: string, description: string, isPrivate: boolean) => {
      if (!user) return { error: new Error("Not authenticated") }

      try {
        // Create the room
        const { data, error } = await supabase
          .from("rooms")
          .insert({
            name,
            description,
            is_private: isPrivate,
            created_by: user.id,
          })
          .select()
          .single()

        if (error) throw error

        // Join the room
        const { error: joinError } = await supabase.from("room_members").insert({
          room_id: data.id,
          user_id: user.id,
        })

        if (joinError) throw joinError

        // Refresh rooms
        fetchRooms()

        return { error: null }
      } catch (error) {
        console.error("Error creating room:", error)
        return { error }
      }
    },
    [user, fetchRooms],
  )

  // Initial fetch of rooms
  useEffect(() => {
    if (user) {
      fetchRooms()
    }
  }, [user, fetchRooms])

  return (
    <ChatContext.Provider
      value={{
        messages,
        rooms,
        currentRoom,
        isLoading,
        sendMessage,
        joinRoom,
        leaveRoom,
        createRoom,
        fetchRooms,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
