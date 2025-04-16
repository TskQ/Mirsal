"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type ThemeType = "dawn" | "dusk" | "night" | "sunset" | "oasis"

interface ThemeContextType {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>("dawn")
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("mirsal-theme") as ThemeType | null
    if (savedTheme) {
      setTheme(savedTheme)
    }

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem("mirsal-dark-mode")
    if (savedDarkMode) {
      setIsDarkMode(savedDarkMode === "true")
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDarkMode(prefersDark)
    }
  }, [])

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem("mirsal-theme", theme)

    // Apply theme classes to body
    document.body.classList.remove("theme-dawn", "theme-dusk", "theme-night", "theme-sunset", "theme-oasis")
    document.body.classList.add(`theme-${theme}`)
  }, [theme])

  useEffect(() => {
    // Save dark mode preference
    localStorage.setItem("mirsal-dark-mode", isDarkMode.toString())

    // Apply dark mode class
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>
  )
}

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider")
  }
  return context
}
