"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function FloatingNavbar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Track scroll position to adjust navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "About", path: "/about" },
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
      <nav
        className={cn(
          "flex items-center justify-between w-full max-w-7xl px-6 py-3 rounded-full transition-all duration-300",
          isScrolled
            ? "bg-white/80 dark:bg-dune-900/80 backdrop-blur-md shadow-md"
            : "bg-white/60 dark:bg-dune-900/60 backdrop-blur-sm",
        )}
      >
        <div className="flex items-center">
          <Link href="/" className="flex items-center mr-6">
            <span className="text-xl font-bold text-dune-800 dark:text-sand-100">Mirsal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  "hover:bg-sand-200/50 dark:hover:bg-dune-800/50 hover:scale-105",
                  pathname === item.path ? "text-dune-900 dark:text-sand-100" : "text-dune-600 dark:text-sand-300",
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <ThemeToggle />

          {user ? (
            <div className="hidden md:flex space-x-2">
              <Button variant="ghost" size="sm" className="rounded-full hover:scale-105 transition-transform" asChild>
                <Link href="/chat">Chat</Link>
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full hover:scale-105 transition-transform" asChild>
                <Link href="/profile">Profile</Link>
              </Button>
              <Button
                variant="default"
                size="sm"
                className="rounded-full hover:scale-105 transition-transform"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="hidden md:flex rounded-full hover:scale-105 transition-transform"
              asChild
            >
              <Link href="/">Get Started</Link>
            </Button>
          )}

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                      "hover:bg-sand-200/50 dark:hover:bg-dune-800/50",
                      pathname === item.path
                        ? "bg-sand-200/30 dark:bg-dune-800/30 text-dune-900 dark:text-sand-100"
                        : "text-dune-600 dark:text-sand-300",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {user ? (
                  <>
                    <Link
                      href="/chat"
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-sand-200/50 dark:hover:bg-dune-800/50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Chat
                    </Link>
                    <Link
                      href="/profile"
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-sand-200/50 dark:hover:bg-dune-800/50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Button
                      variant="default"
                      className="rounded-lg"
                      onClick={() => {
                        signOut()
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button variant="default" className="rounded-lg" asChild onClick={() => setIsMobileMenuOpen(false)}>
                    <Link href="/">Get Started</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  )
}
