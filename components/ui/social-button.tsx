"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface SocialButtonProps {
  href: string
  icon: LucideIcon | React.ComponentType<{ className?: string }>
  label: string
  variant?: "github" | "steam" | "spotify" | "youtube" | "tiktok" | "linkedin" | "default"
  size?: "sm" | "md" | "lg"
}

const variantStyles = {
  github: "bg-[#010409]/10 border-[#010409]/20 hover:bg-[#010409]/20",
  steam: "bg-[#171d25]/10 border-[#171d25]/20 hover:bg-[#171d25]/20",
  spotify: "bg-green-700/10 border-green-700/20 hover:bg-green-700/30",
  youtube: "bg-red-700/10 border-red-700/20 hover:bg-red-700/30",
  tiktok: "bg-[#2cf4ef]/10 border-[#2cf4ef]/20 hover:bg-[#ef0549]/10 hover:border-[#ef0549]/20",
  linkedin: "bg-blue-700/10 border-blue-700/20 hover:bg-blue-700/30",
  default: "bg-white/10 border-white/20 hover:bg-white/20",
}

export function SocialButton({ href, icon: Icon, label, variant = "default", size = "sm" }: SocialButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Button
        variant="outline"
        size={size}
        className={`text-white hover:scale-110 transition-all duration-300 ${variantStyles[variant]}`}
        asChild
      >
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
          <Icon className="w-4 h-4" />
        </a>
      </Button>
    </motion.div>
  )
}
