"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Lyric {
  time: number
  text: string
}

interface LyricsDisplayProps {
  lyrics: Lyric[]
  audioRef: React.RefObject<HTMLAudioElement>
  hasEntered: boolean
}

export default function LyricsDisplay({ lyrics, audioRef, hasEntered }: LyricsDisplayProps) {
  const [currentLyric, setCurrentLyric] = useState<string | null>(null)
  const [previousLyrics, setPreviousLyrics] = useState<string[]>([])
  const lastLyricIndexRef = useRef(-1)

  useEffect(() => {
    if (!audioRef.current || !hasEntered) return

    const audio = audioRef.current

    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime

      // Find the current lyric
      for (let i = 0; i < lyrics.length; i++) {
        if (currentTime >= lyrics[i].time && i > lastLyricIndexRef.current) {
          // Check if we're within 0.5 seconds of the lyric time to avoid duplicates
          if (currentTime - lyrics[i].time < 0.5) {
            // Add current lyric to previous lyrics (limited to last 3)
            setPreviousLyrics((prev) => {
              const newPrevious = [...prev, lyrics[i].text]
              return newPrevious.slice(-3)
            })

            // Set current lyric
            setCurrentLyric(lyrics[i].text)
            lastLyricIndexRef.current = i
            break
          }
        }
      }
    }

    const handleSeeked = () => {
      // Reset lyric index when user seeks
      const currentTime = audio.currentTime
      lastLyricIndexRef.current = -1
      setPreviousLyrics([])
      setCurrentLyric(null)

      // Find the last lyric that should have been shown
      for (let i = lyrics.length - 1; i >= 0; i--) {
        if (currentTime >= lyrics[i].time) {
          lastLyricIndexRef.current = i
          setCurrentLyric(lyrics[i].text)
          break
        }
      }
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("seeked", handleSeeked)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("seeked", handleSeeked)
    }
  }, [lyrics, audioRef, hasEntered])

  if (!hasEntered) return null

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={{
        top: 0,
        left: 0,
        right: window.innerWidth - 320, // 320px is the width of the component
        bottom: window.innerHeight - 200, // Approximate height of the component
      }}
      initial={{ x: 32, y: window.innerHeight - 240 }} // Start at bottom-left with some margin
      className="fixed z-40 w-80 backdrop-blur rounded-lg shadow-lg overflow-hidden cursor-move select-none hidden md:block"
      whileDrag={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
    >
      <div className="p-4 space-y-2">

        {/* Current lyric (highlighted) */}
        <AnimatePresence mode="wait">
          {currentLyric && (
            <motion.div
              key={currentLyric}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-xl font-bold"
            >
              <span className="text-white drop-shadow-[0_0_8px_rgba(255,0,247,0.8)] animate-pulse">
                {currentLyric}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
