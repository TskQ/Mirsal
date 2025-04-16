"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

export async function createDefaultRooms() {
  const supabase = createServerSupabaseClient()

  // Get the first user to set as creator
  const { data: users } = await supabase.from("profiles").select("id").limit(1)

  if (!users || users.length === 0) {
    return { error: "No users found" }
  }

  const createdBy = users[0].id

  // Create default rooms
  const defaultRooms = [
    {
      id: "00000000-0000-0000-0000-000000000001",
      name: "General",
      description: "General discussion about desert life and culture",
      is_private: false,
      created_by: createdBy,
    },
    {
      id: "00000000-0000-0000-0000-000000000002",
      name: "Desert Travelers",
      description: "Share your journey across the sands",
      is_private: false,
      created_by: createdBy,
    },
    {
      id: "00000000-0000-0000-0000-000000000003",
      name: "Dune Photography",
      description: "Share your best desert landscape photos",
      is_private: false,
      created_by: createdBy,
    },
  ]

  // Insert rooms
  for (const room of defaultRooms) {
    const { error } = await supabase.from("rooms").upsert(room)

    if (error) {
      console.error("Error creating default room:", error)
    }
  }

  return { success: true }
}
