"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Github, Linkedin, ExternalLink } from "lucide-react"
import Image from "next/image"
import ExitFullscreenButton from "@/components/ExitFullscreenButton"
import DiscordStatusIndicator from "@/components/DiscordStatusIndicator"
import MediaControls from "@/components/MediaControls"
import { useDiscordStatus } from "@/hooks/useDiscordStatus"
import { FaSteam, FaSpotify, FaYoutube, FaTiktok } from "react-icons/fa";

export default function ProfileLanding() {
  const [hasEntered, setHasEntered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { status } = useDiscordStatus(30000)
  const user = status?.user


  const handleEnter = async () => {
    try {
      const container = document.documentElement // or document.body if you prefer

      if (container.requestFullscreen) {
        await container.requestFullscreen()
      } else if ((container as any).webkitRequestFullscreen) {
        await (container as any).webkitRequestFullscreen()
      } else if ((container as any).msRequestFullscreen) {
        await (container as any).msRequestFullscreen()
      }

      // Try to play video and audio
      if (videoRef.current) {
        await videoRef.current.play()
      }
      if (audioRef.current) {
        await audioRef.current.play()
      }

      setHasEntered(true)
    } catch (error) {
      console.log("Autoplay or fullscreen blocked:", error)
      // Still allow entry even if fullscreen fails
      setHasEntered(true)
    }
  }

  useEffect(() => {
    // Try to autoplay on load (may be blocked by browser)
    const tryAutoplay = async () => {
      try {
        if (videoRef.current) {
          await videoRef.current.play()
        }
        if (audioRef.current) {
          await audioRef.current.play()
        }
      } catch (error) {
        console.log("Initial autoplay blocked:", error)
      }
    }

    if (audioRef.current) {
      audioRef.current.volume = 0.03 // 3% volume
    }

    tryAutoplay()
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover brightness-50"
        autoPlay
        loop
        muted={true}
        playsInline
      >
        <source src="/bg4.mp4" type="video/mp4" />
      </video>

      {/* Background Audio */}
      <audio ref={audioRef} autoPlay loop className="hidden">
        <source src="/bg2.mp3" type="audio/mpeg" />
      </audio>

      {/* Media Controls */}
      <MediaControls videoRef={videoRef} audioRef={audioRef} hasEntered={hasEntered} />

      {/* Entry Gate Overlay */}
      <AnimatePresence>
        {!hasEntered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm cursor-pointer"
              onClick={handleEnter}
            >
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <h2 className="text-white text-xl opacity-70">
                  <b>Click To Enter...</b>
                </h2>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Content */}
      <AnimatePresence>
        {hasEntered && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 min-h-screen flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-md mx-auto bg-[#2e3050]/30 backdrop-blur-md border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500">
              <div className="p-8 text-center space-y-6">
                {/* Profile Picture */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                  className="relative mx-auto w-32 h-32 mb-6"
                >
                  <div className="absolute inset-0 rounded-full">
                    <div className="w-full h-full rounded-full p-1">
                      {user && (
                        <>
                          <Image
                            src={status.user.avatar || "/placeholder.svg"}
                            alt={`${user.username}'s Avatar`}
                            width={120}
                            height={120}
                            className="w-full h-full rounded-full object-cover"
                          />
                          <Image
                            src="/bush_camper.png"
                            alt="Avatar Decoration - Bush Camper"
                            width={120}
                            height={120}
                            className="absolute top-0 left-0 w-full h-full rounded-full object-cover pointer-events-none z-10"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Name */}
                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                >
                  Vikum Karunathilake
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-white/80 text-lg mb-6 leading-relaxed text-center"
                >
                  <span className="text-sm tracking-widest whitespace-nowrap text-white drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]">
                    Student&nbsp;|&nbsp;Tech Explorer&nbsp;|&nbsp;Building web apps with AI
                  </span>

                  <br /> <br />
                  Full-stack web developer focused on creating scalable applications using AI tools
                </motion.p>

                {/* Discord Status */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="mb-6"
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <DiscordStatusIndicator />
                  </div>
                </motion.div>

                {/* Social Links */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="flex justify-center space-x-4"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#010409]/10 border-[#010409]/20 text-white hover:bg-[#010409]/20 hover:scale-110 transition-all duration-300"
                    asChild
                  >
                    <a href="https://github.com/VikumKarunathilake" target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#171d25]/10 border-[#171d25]/20 text-white hover:bg-[#171d25]/20 hover:scale-110 transition-all duration-300"
                    asChild
                  >
                    <a href="https://steamcommunity.com/id/Vikum_K/" target="_blank" rel="noopener noreferrer">
                      <FaSteam className="w-4 h-4" />
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-700/10 border-green-700/20 text-white hover:bg-green-700/30 hover:scale-110 transition-all duration-300"

                    asChild
                  >
                    <a href="https://open.spotify.com/user/31q2s45y56ymwfy5zhlbfqwkzb3y" target="_blank" rel="noopener noreferrer">
                      <FaSpotify className="w-4 h-4" />
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-red-700/10 border-red-700/20 text-white hover:bg-red-700/30 hover:scale-110 transition-all duration-300"
                    asChild
                  >
                    <a href="https://www.youtube.com/@Vikum_K" target="_blank" rel="noopener noreferrer">
                      <FaYoutube className="w-4 h-4" />
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#2cf4ef]/10 border-[#2cf4ef]/20 text-white hover:bg-[#ef0549]/10 hover:border-[#ef0549]/20 hover:scale-110 transition-all duration-300"
                    asChild
                  >
                    <a href="https://www.youtube.com/@Vikum_K" target="_blank" rel="noopener noreferrer">
                      <FaTiktok className="w-4 h-4" />
                    </a>
                  </Button>

                </motion.div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Exit Fullscreen Button */}
      <ExitFullscreenButton />
    </div>
  )
}
