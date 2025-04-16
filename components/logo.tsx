import { MessageSquare } from "lucide-react"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-sand-400 animate-sand-wave" />
        <MessageSquare className="text-sand-600" />
      </div>
      <span className={`font-bold ${sizeClasses[size]}`}>Mirsal</span>
    </div>
  )
}
