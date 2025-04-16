"use client"

import { useThemeContext } from "@/contexts/theme-context"
import { Palette } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const themes = [
  { id: "dawn", name: "Desert Dawn", description: "Warm morning light on golden dunes" },
  { id: "dusk", name: "Desert Dusk", description: "Soft twilight hues as the sun sets" },
  { id: "night", name: "Desert Night", description: "Starlit sky over moonlit sands" },
  { id: "sunset", name: "Fiery Sunset", description: "Vibrant orange and red tones" },
  { id: "oasis", name: "Oasis", description: "Cool greens amid the warm sands" },
]

export function ThemeSelector() {
  const { theme, setTheme } = useThemeContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Desert Themes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => setTheme(t.id as any)}
            className={`flex flex-col items-start cursor-pointer ${theme === t.id ? "bg-sand-100 dark:bg-dune-800" : ""}`}
          >
            <span className="font-medium">{t.name}</span>
            <span className="text-xs text-muted-foreground">{t.description}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
