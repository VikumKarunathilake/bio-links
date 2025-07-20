"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function ExitFullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleChange)
    return () => document.removeEventListener("fullscreenchange", handleChange)
  }, [])

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }
  }

  if (!isFullscreen) return null

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button
        onClick={exitFullscreen}
        variant="outline"
        size="sm"
        className="bg-white/10 text-white border-white/20 hover:bg-white/20 flex items-center gap-2"
      >
        <X className="w-4 h-4" />
        Exit Fullscreen
      </Button>
    </div>
  )
}
