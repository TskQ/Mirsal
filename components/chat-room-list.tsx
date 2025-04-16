"use client"

import { useState } from "react"
import { useChat } from "@/contexts/chat-context"
import { useAuth } from "@/contexts/auth-context"
import { Users, Plus, Lock, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"

export function ChatRoomList() {
  const { rooms, joinRoom, currentRoom, createRoom, isLoading } = useChat()
  const { user } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newRoomName, setNewRoomName] = useState("")
  const [newRoomDescription, setNewRoomDescription] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return

    setIsCreating(true)

    try {
      const { error } = await createRoom(newRoomName, newRoomDescription, isPrivate)

      if (!error) {
        setNewRoomName("")
        setNewRoomDescription("")
        setIsPrivate(false)
        setIsDialogOpen(false)
      }
    } finally {
      setIsCreating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-md bg-white/80 dark:bg-dune-900/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-sand-200 dark:border-dune-700">
        <div className="p-4 bg-gradient-to-r from-sand-400 to-sand-500 dark:from-dune-800 dark:to-dune-900 flex justify-between items-center">
          <h3 className="text-white font-medium">Chat Rooms</h3>
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>

        <div className="divide-y divide-sand-200 dark:divide-dune-800">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4">
              <div className="flex justify-between items-start mb-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-3/4 mt-1" />
              <Skeleton className="h-3 w-24 mt-3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md bg-white/80 dark:bg-dune-900/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-sand-200 dark:border-dune-700">
      <div className="p-4 bg-gradient-to-r from-sand-400 to-sand-500 dark:from-dune-800 dark:to-dune-900 flex justify-between items-center">
        <h3 className="text-white font-medium">Chat Rooms</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white hover:bg-sand-600/20 dark:hover:bg-dune-700/50"
            >
              <Plus className="h-5 w-5" />
              <span className="sr-only">Create Room</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Room</DialogTitle>
              <DialogDescription>Create a new chat room for desert conversations</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Room Name</Label>
                <Input
                  id="name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Enter room name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newRoomDescription}
                  onChange={(e) => setNewRoomDescription(e.target.value)}
                  placeholder="Describe what this room is about"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="private" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Private Room</span>
                </Label>
                <Switch id="private" checked={isPrivate} onCheckedChange={setIsPrivate} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateRoom} disabled={!newRoomName.trim() || isCreating}>
                {isCreating ? "Creating..." : "Create Room"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="divide-y divide-sand-200 dark:divide-dune-800 max-h-[500px] overflow-y-auto">
        {rooms.length === 0 ? (
          <div className="p-4 text-center text-dune-600 dark:text-sand-400">
            <p>No rooms available</p>
            <p className="text-sm">Create a new room to start chatting</p>
          </div>
        ) : (
          rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => joinRoom(room.id)}
              className={`w-full p-4 text-left transition-colors hover:bg-sand-100 dark:hover:bg-dune-800 ${
                currentRoom?.id === room.id ? "bg-sand-100 dark:bg-dune-800" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  {room.is_private ? (
                    <Lock className="h-4 w-4 text-sand-500" />
                  ) : (
                    <Globe className="h-4 w-4 text-sand-500" />
                  )}
                  <h4 className="font-medium text-dune-800 dark:text-sand-100">{room.name}</h4>
                </div>
                <div className="flex items-center text-xs text-dune-500 dark:text-sand-400">
                  <Users size={12} className="mr-1" />
                  <span>{room.member_count}</span>
                </div>
              </div>
              {room.description && (
                <p className="text-sm text-dune-600 dark:text-sand-300 line-clamp-2 mb-2">{room.description}</p>
              )}
              <p className="text-xs text-dune-500 dark:text-sand-500">
                Created {formatDistanceToNow(new Date(room.created_at), { addSuffix: true })}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
