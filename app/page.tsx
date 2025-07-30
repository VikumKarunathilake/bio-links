"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import ExitFullscreenButton from "@/components/ExitFullscreenButton"
import DiscordStatusIndicator from "@/components/DiscordStatusIndicator"
import MediaControls from "@/components/MediaControls"
import { SocialLinks } from "@/components/social-links"
import { useDiscordStatus } from "@/hooks/useDiscordStatus"
import { EntryGate } from "@/components/ui/entry-gate"
import Badges from "@/components/Badges"
import LyricsDisplay from "@/components/lyrics-display"

const lyrics = [
  { time: 0.03, text: "(Notice me, Senpai, I'm-)" },
  { time: 6.58, text: "(Notice me, Senpai, I'm-)" },
  { time: 19.22, text: "Notice me, Senpai, I'm your girl, Hentai" },
  { time: 22.37, text: "やめてください let's watch some anime" },
  { time: 25.52, text: "SugarCrash, Senpai, without you, I die" },
  { time: 28.76, text: "やめてください I'll be your waifu" },
  { time: 32.0, text: "Hey, Senpai" },
  { time: 33.67, text: "Be my boyfriend, samurai" },
  { time: 35.13, text: "Don't be shy, you're my うるさい バカ" },
  { time: 38.56, text: "オニイチャン, I'll be your Sister-chan" },
  { time: 41.76, text: "Don't hide, don't run, I'll use my Byakugan" },
  { time: 44.81, text: "I'll be anything you want, cutie, furry, neko girl" },
  { time: 48.09, text: "UwU ロリ, ヤンデレ, メイド, デーモン, ツンデレ" },
  { time: 51.43, text: "Big boobs, king size, colored hair, big eyes" },
  { time: 54.52, text: "Hot like fire, cold like ice, かわいい, sweet nice" },
  { time: 57.77, text: "Notice me, Senpai, I'm your girl, Hentai" },
  { time: 60.82, text: "やめてください let's watch some anime" },
  { time: 64.04, text: "SugarCrash, Senpai, without you, I die" },
  { time: 67.14, text: "やめてください I'll be your waifu" },
  { time: 75.23, text: "Notice me, Senpai" },
  { time: 81.79, text: "I'll be your waifu" },
  { time: 83.39, text: "Notice me, Senpai" },
  { time: 88.09, text: "Notice me, Senpai" },
  { time: 94.36, text: "I'll be your waifu" },
]

export default function ProfileLanding() {
  const [hasEntered, setHasEntered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { status } = useDiscordStatus(30000)
  const user = status?.user

  const handleEnter = async () => {
    try {
      const container = document.documentElement

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
      setHasEntered(true)
    }
  }

  useEffect(() => {
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
      audioRef.current.volume = 0.15
    }
    if (videoRef.current) {
      videoRef.current.volume = 0.15
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
        <source src="/bg10.mp4" type="video/mp4" />
      </video>

      {/* Background Audio */}
      <audio ref={audioRef} autoPlay loop className="hidden">
        <source src="/SugarCrash!2.mp3" type="audio/mpeg" />
      </audio>

      {/* Lyrics Display Component */}
      <LyricsDisplay lyrics={lyrics} audioRef={audioRef} hasEntered={hasEntered} />

      {/* Media Controls */}
      <MediaControls videoRef={videoRef} audioRef={audioRef} hasEntered={hasEntered} />

      {/* Entry Gate */}
      <EntryGate show={!hasEntered} onEnter={handleEnter} title="Click To Enter..." />

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
                  className="relative mx-auto w-32 h-32 mb-2"
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <Badges />
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
                <SocialLinks />
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
