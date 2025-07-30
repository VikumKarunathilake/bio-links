"use client"

import { motion } from "framer-motion"
import { SocialButton } from "@/components/ui/social-button"
import { Github } from "lucide-react"
import { FaSteam, FaSpotify, FaYoutube, FaTiktok } from "react-icons/fa"

interface SocialLinksProps {
  links?: {
    github?: string
    steam?: string
    spotify?: string
    youtube?: string
    tiktok?: string
  }
  delay?: number
}

const defaultLinks = {
  github: "https://github.com/VikumKarunathilake",
  steam: "https://steamcommunity.com/id/Vikum_K/",
  spotify: "https://open.spotify.com/user/31q2s45y56ymwfy5zhlbfqwkzb3y",
  youtube: "https://www.youtube.com/@Vikum_K",
  tiktok: "https://www.youtube.com/@Vikum_K",
}

export function SocialLinks({ links = defaultLinks, delay = 1 }: SocialLinksProps) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
      className="flex justify-center space-x-4"
    >
      {links.github && <SocialButton href={links.github} icon={Github} label="GitHub" variant="github" />}

      {links.steam && <SocialButton href={links.steam} icon={FaSteam} label="Steam" variant="steam" />}

      {links.spotify && <SocialButton href={links.spotify} icon={FaSpotify} label="Spotify" variant="spotify" />}

      {links.youtube && <SocialButton href={links.youtube} icon={FaYoutube} label="YouTube" variant="youtube" />}

      {links.tiktok && <SocialButton href={links.tiktok} icon={FaTiktok} label="TikTok" variant="tiktok" />}
    </motion.div>
  )
}
