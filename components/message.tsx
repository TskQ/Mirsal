"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"

interface MessageProps {
  id: string
  content: string
  sender: {
    id: string
    username?: string | null
    display_name?: string | null
    avatar_url?: string | null
  }
  timestamp: string
  delay?: number
}

export function Message({ id, content, sender, timestamp, delay = 0 }: MessageProps) {
  const [visible, setVisible] = useState(false)
  const [particles, setParticles] = useState<{ id: number; left: string }[]>([])

  // Safely get display name
  const displayName = sender.display_name || sender.username || "User"
  const formattedTime = format(new Date(timestamp), "h:mm a")

  // Get initials safely
  const getInitials = () => {
    if (displayName && displayName.length > 0) {
      return displayName.substring(0, 2).toUpperCase()
    }
    return "MI" // Default to Mirsal Initials
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true)
      // Generate random sand particles
      const particleCount = Math.floor(Math.random() * 3) + 2 // 2-4 particles
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        left: `${Math.floor(Math.random() * 80) + 10}%`,
      }))
      setParticles(newParticles)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  if (!visible) return null

  return (
    <div className="relative">
      {/* Sand particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bottom-0 w-1 h-1 rounded-full bg-sand-300 dark:bg-sand-700 opacity-0 animate-sand-particle"
          style={{ left: particle.left, animationDelay: `${particle.id * 100}ms` }}
        />
      ))}

      <div className="flex items-start gap-3 opacity-0 animate-message-rise group">
        <Avatar className="transition-transform group-hover:scale-105 duration-300">
          <AvatarImage src={sender.avatar_url || "/placeholder.svg?height=40&width=40"} />
          <AvatarFallback className="bg-sand-300 text-sand-800">{getInitials()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 group-hover:translate-y-[-2px] transition-transform duration-300">
            <span className="font-medium text-dune-800 dark:text-sand-200">{displayName}</span>
            <span className="text-xs text-dune-500 dark:text-dune-400">{formattedTime}</span>
          </div>
          <div
            className="p-3 bg-white dark:bg-dune-800 rounded-lg shadow-sm relative overflow-hidden 
                      transition-all duration-300 ease-in-out
                      group-hover:shadow-md group-hover:translate-y-[-2px]
                      dark:shadow-sand-900/20 shadow-sand-500/10 hover:shadow-sand-500/20 dark:hover:shadow-sand-800/30"
          >
            {/* Subtle sand gradient at the bottom of the message */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sand-300/20 via-sand-400/30 to-sand-300/20"></div>
            <p className="text-dune-700 dark:text-sand-100">{content}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
