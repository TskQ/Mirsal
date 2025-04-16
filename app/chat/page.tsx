"use client"

import { useEffect, useState } from "react"
import { ChatInterface } from "@/components/chat-interface"
import { ChatRoomList } from "@/components/chat-room-list"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useChat } from "@/contexts/chat-context"
import { Loader2 } from "lucide-react"
import { createDefaultRooms } from "@/app/actions/rooms"

export default function ChatPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { fetchRooms, rooms, joinRoom } = useChat()
  const router = useRouter()
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  // Fetch rooms and join the first room if available
  useEffect(() => {
    if (user) {
      const initializeChat = async () => {
        await fetchRooms()

        // Create default rooms if none exist
        if (rooms.length === 0) {
          await createDefaultRooms()
          await fetchRooms() // Fetch again after creating rooms
        }

        // Join the first room automatically if available
        if (rooms.length > 0 && isInitialLoad) {
          await joinRoom(rooms[0].id)
          setIsInitialLoad(false)
        }
      }

      initializeChat()
    }
  }, [user, fetchRooms, rooms, joinRoom, isInitialLoad])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sand-600 dark:text-sand-400" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in the useEffect
  }

  return (
    <main className="pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/3">
            <ChatRoomList />
          </div>
          <div className="w-full md:w-2/3">
            <ChatInterface />
          </div>
        </div>
      </div>
    </main>
  )
}
