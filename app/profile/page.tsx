"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useThemeContext } from "@/contexts/theme-context"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { user, profile, isLoading, updateProfile, signOut } = useAuth()
  const { theme, setTheme } = useThemeContext()
  const router = useRouter()
  const [displayName, setDisplayName] = useState("")
  const [username, setUsername] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    } else if (profile) {
      setDisplayName(profile.display_name || "")
      setUsername(profile.username || "")
    }
  }, [user, profile, isLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setIsSaving(true)
    setError(null)

    try {
      const { error } = await updateProfile({
        display_name: displayName || null,
        username,
        theme: theme as string,
      })

      if (error) {
        setError(error.message)
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    signOut()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sand-600 dark:text-sand-400" />
      </div>
    )
  }

  if (!user || !profile) {
    return null // Will redirect in the useEffect
  }

  // Get initials safely
  const getInitials = () => {
    if (profile.display_name) {
      return profile.display_name.substring(0, 2).toUpperCase()
    }
    if (profile.username) {
      return profile.username.substring(0, 2).toUpperCase()
    }
    return "MI" // Default to Mirsal Initials
  }

  return (
    <main className="pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar_url || "/placeholder.svg?height=96&width=96"} />
                    <AvatarFallback className="bg-sand-300 text-sand-800 text-2xl">{getInitials()}</AvatarFallback>
                  </Avatar>
                </div>

                {error && (
                  <div className="p-3 text-sm bg-red-100 border border-red-200 text-red-800 rounded-md">{error}</div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your username"
                    className="bg-white dark:bg-dune-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your display name"
                    className="bg-white dark:bg-dune-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={theme} onValueChange={(value) => setTheme(value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dawn">Desert Dawn</SelectItem>
                      <SelectItem value="dusk">Desert Dusk</SelectItem>
                      <SelectItem value="night">Desert Night</SelectItem>
                      <SelectItem value="sunset">Fiery Sunset</SelectItem>
                      <SelectItem value="oasis">Oasis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={isSaving} className="w-full">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/chat")}>
                Back to Chat
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
