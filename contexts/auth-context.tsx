"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/types/supabase"

interface AuthContextType {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  signUp: (username: string, password: string) => Promise<{ error: any }>
  signIn: (username: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for active session
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        setUser(session.user)

        // Fetch user profile
        const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        if (!error && data) {
          setProfile(data)
        }
      }

      setIsLoading(false)
    }

    checkSession()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)

      if (session?.user) {
        // Fetch user profile
        const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        if (!error && data) {
          setProfile(data)
        }

        // Redirect to chat page on successful login
        if (event === "SIGNED_IN") {
          router.push("/chat")
        }
      } else {
        setProfile(null)
      }

      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  // Modified to use phone authentication instead of email
  const signUp = async (username: string, password: string) => {
    try {
      // Use a valid email format that will pass validation
      const email = `${username.toLowerCase().replace(/[^a-z0-9]/g, "")}@mirsal.com`

      // First register the user
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
          // Skip email verification
          emailRedirectTo: window.location.origin + "/chat",
        },
      })

      if (signUpError) return { error: signUpError }

      // Immediately sign in the user after registration
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      return { error: signInError }
    } catch (error) {
      console.error("Authentication error:", error)
      return { error }
    }
  }

  // Modified to use username with valid email format
  const signIn = async (username: string, password: string) => {
    try {
      // Convert username to valid email format
      const email = `${username.toLowerCase().replace(/[^a-z0-9]/g, "")}@mirsal.com`

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      return { error }
    } catch (error) {
      console.error("Authentication error:", error)
      return { error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error("Not authenticated") }

    const { error } = await supabase.from("profiles").update(updates).eq("id", user.id)

    if (!error) {
      setProfile((prev) => (prev ? { ...prev, ...updates } : null))
    }

    return { error }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
