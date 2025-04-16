"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Message } from "./message"
import { Send, Smile, Plus } from "lucide-react"
import { useChat } from "@/contexts/chat-context"
import { useAuth } from "@/contexts/auth-context"
import { ThemeSelector } from "./theme-selector"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function ChatInterface() {
  const { messages, sendMessage, currentRoom, isLoading } = useChat()
  const { user, profile } = useAuth()
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

    // Set initial load to false after first load of messages
    if (messages.length > 0 && isInitialLoad) {
      setIsInitialLoad(false)
    }
  }, [messages, isInitialLoad])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || !currentRoom) return

    sendMessage(newMessage)
    setNewMessage("")
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-sand-50/80 dark:bg-dune-900/80 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-sand-200 dark:border-dune-700">
        <div className="p-4 bg-gradient-to-r from-sand-400 to-sand-500 dark:from-dune-800 dark:to-dune-900 flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="h-96 p-4 space-y-6 bg-sand-100/30 dark:bg-dune-800/30">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 bg-white dark:bg-dune-900 border-t border-sand-200 dark:border-dune-700 flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    )
  }

  if (!currentRoom) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-sand-50/80 dark:bg-dune-900/80 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-sand-200 dark:border-dune-700 flex flex-col items-center justify-center p-8 h-96">
        <h3 className="text-xl font-medium text-dune-800 dark:text-sand-100 mb-4 hover:translate-y-[-2px] transition-transform duration-300">
          Select a room to start chatting
        </h3>
        <p className="text-dune-600 dark:text-sand-300 text-center mb-6 hover:translate-y-[-2px] transition-transform duration-300">
          Choose a room from the list or create a new one to begin your desert journey
        </p>
        <Button
          variant="outline"
          className="gap-2 hover:shadow-md hover:translate-y-[-2px] transition-all duration-300"
        >
          <Plus size={16} />
          <span>Create New Room</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-sand-50/80 dark:bg-dune-900/80 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-sand-200 dark:border-dune-700">
      <div className="p-4 bg-gradient-to-r from-sand-400 to-sand-500 dark:from-dune-800 dark:to-dune-900 flex justify-between items-center">
        <h3 className="text-white font-medium hover:translate-y-[-2px] transition-transform duration-300">
          {currentRoom.name}
        </h3>
        <ThemeSelector />
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-6 bg-sand-100/30 dark:bg-dune-800/30 chat-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-dune-600 dark:text-sand-400">
            <p className="hover:translate-y-[-2px] transition-transform duration-300">No messages yet</p>
            <p className="text-sm hover:translate-y-[-2px] transition-transform duration-300">
              Be the first to send a message!
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <Message
              key={message.id}
              id={message.id}
              content={message.content}
              sender={{
                id: message.profiles.id,
                username: message.profiles.username,
                display_name: message.profiles.display_name,
                avatar_url: message.profiles.avatar_url,
              }}
              timestamp={message.created_at}
              delay={isInitialLoad ? index * 300 : 0}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-3 bg-white dark:bg-dune-900 border-t border-sand-200 dark:border-dune-700 flex items-center gap-2"
      >
        <button
          type="button"
          className="p-2 rounded-full text-sand-500 hover:bg-sand-100 dark:hover:bg-dune-800 transition-colors hover:scale-105 duration-300"
        >
          <Smile size={20} />
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={!user || !profile}
          className="flex-1 p-2 rounded-lg bg-sand-50 dark:bg-dune-800 border border-sand-200 dark:border-dune-700 focus:outline-none focus:ring-2 focus:ring-sand-400 dark:focus:ring-sand-600 text-dune-800 dark:text-sand-100 disabled:opacity-50 transition-shadow duration-300 hover:shadow-inner"
        />
        <button
          type="submit"
          disabled={!user || !profile || !newMessage.trim()}
          className="p-2 rounded-full bg-sand-500 hover:bg-sand-600 text-white transition-all duration-300 disabled:opacity-50 disabled:hover:bg-sand-500 hover:shadow-md hover:scale-105"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  )
}
