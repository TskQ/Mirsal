"use client"

import { useThemeContext } from "@/contexts/theme-context"
import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "./login-form"
import Link from "next/link"

export function HeroSection() {
  const { isDarkMode } = useThemeContext()
  const { user } = useAuth()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-dune-950 z-10" />
        <img
          src={isDarkMode ? "/images/sanddunes-night.png" : "/images/sanddunes-day.png"}
          alt="Desert dunes"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Sand particles animation */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-sand-300/40 dark:bg-sand-500/30 animate-sand-particle"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 30}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 z-10 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-dune-900 dark:text-sand-100">
              Messages Rising from the Dunes
            </h1>
            <p className="text-lg md:text-xl mb-8 text-dune-700 dark:text-sand-300">
              Experience real-time conversations in a serene desert landscape. Connect with others through Mirsal's
              innovative chat platform.
            </p>
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/chat"
                  className="px-8 py-3 bg-sand-500 hover:bg-sand-600 text-white rounded-full transition-colors text-lg font-medium"
                >
                  Start Chatting
                </Link>
              </div>
            ) : (
              <div className="bg-white/80 dark:bg-dune-900/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-sand-200 dark:border-dune-700">
                <h2 className="text-2xl font-bold mb-4 text-dune-800 dark:text-sand-100">Join the Conversation</h2>
                <LoginForm />
              </div>
            )}
          </div>

          <div className="relative hidden md:block">
            {/* Message bubbles rising from the dunes */}
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-full">
              <div className="relative h-40">
                {[
                  { text: "Hello there!", delay: 0, left: "10%" },
                  { text: "The sunset is beautiful today", delay: 1, left: "60%" },
                  { text: "Has anyone seen the oasis?", delay: 2, left: "30%" },
                ].map((bubble, index) => (
                  <div
                    key={index}
                    className="absolute bottom-0 bg-white dark:bg-dune-800 rounded-lg p-3 shadow-md opacity-0 animate-message-rise"
                    style={{
                      left: bubble.left,
                      animationDelay: `${bubble.delay}s`,
                      maxWidth: "200px",
                    }}
                  >
                    <p className="text-dune-700 dark:text-sand-100">{bubble.text}</p>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-dune-800 rotate-45"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-3/4 h-12 bg-sand-300/30 dark:bg-sand-800/20 blur-xl rounded-full"></div>
            <img
              src={isDarkMode ? "/images/sanddunes-night.png" : "/images/sanddunes-day.png"}
              alt="Desert dunes close-up"
              className="rounded-xl shadow-lg border border-sand-200 dark:border-dune-700 object-cover h-80 w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
