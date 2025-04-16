"use client"

import { useState } from "react"
import { Logo } from "./logo"
import { Menu, X, Moon, Sun, LogOut, User } from "lucide-react"
import { useThemeContext } from "@/contexts/theme-context"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isDarkMode, toggleDarkMode } = useThemeContext()
  const { user, logout } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dune-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Logo />

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-dune-800 dark:text-sand-100 hover:text-sand-600 dark:hover:text-sand-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/features"
              className="text-dune-800 dark:text-sand-100 hover:text-sand-600 dark:hover:text-sand-400 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/about"
              className="text-dune-800 dark:text-sand-100 hover:text-sand-600 dark:hover:text-sand-400 transition-colors"
            >
              About
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg?height=32&width=32"} />
                    <AvatarFallback className="bg-sand-300 text-sand-800">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-dune-800 dark:text-sand-100">{user.name}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User size={16} />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="flex items-center gap-2 cursor-pointer">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/chat"
                className="px-6 py-2 bg-sand-500 hover:bg-sand-600 text-white rounded-full transition-colors"
              >
                Get Started
              </Link>
            )}

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-sand-100 dark:hover:bg-dune-800 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-dune-950 py-4 px-4 animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-dune-800 dark:text-sand-100 hover:text-sand-600 dark:hover:text-sand-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/features"
              className="text-dune-800 dark:text-sand-100 hover:text-sand-600 dark:hover:text-sand-400 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/about"
              className="text-dune-800 dark:text-sand-100 hover:text-sand-600 dark:hover:text-sand-400 transition-colors"
            >
              About
            </Link>

            {user ? (
              <div className="flex flex-col space-y-2 pt-2 border-t border-sand-200 dark:border-dune-700">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg?height=32&width=32"} />
                    <AvatarFallback className="bg-sand-300 text-sand-800">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-dune-800 dark:text-sand-100">{user.name}</span>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-dune-800 dark:text-sand-100 hover:text-sand-600 dark:hover:text-sand-400 transition-colors"
                >
                  <User size={16} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-dune-800 dark:text-sand-100 hover:text-sand-600 dark:hover:text-sand-400 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/chat"
                className="px-6 py-2 bg-sand-500 hover:bg-sand-600 text-white rounded-full transition-colors w-full text-center"
              >
                Get Started
              </Link>
            )}

            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 p-2 rounded-full hover:bg-sand-100 dark:hover:bg-dune-800 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
