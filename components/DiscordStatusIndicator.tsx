"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useDiscordStatus } from "@/hooks/useDiscordStatus"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RefreshCw, Wifi, WifiOff, AlertCircle, Music, Gamepad2, Code, Monitor, ExternalLink, Globe, Smartphone } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const statusConfig = {
  online: {
    color: "#43b581",
    label: "Online",
    glow: "shadow-green-500/50",
    bgColor: "",
    borderColor: "border-green-500/30",
  },
  idle: {
    color: "#faa61a",
    label: "Away",
    glow: "shadow-yellow-500/50",
    bgColor: "",
    borderColor: "border-yellow-500/30",
  },
  dnd: {
    color: "#f04747",
    label: "Do Not Disturb",
    glow: "shadow-red-500/50",
    bgColor: "",
    borderColor: "border-red-500/30",
  },
  offline: {
    color: "#747f8d",
    label: "Offline",
    glow: "shadow-gray-500/50",
    bgColor: "bg-gray-500/20",
    borderColor: "border-gray-500/30",
  },
}

const activityTypeIcons = {
  0: Gamepad2, // Playing
  1: Monitor, // Streaming
  2: Music, // Listening
  3: Monitor, // Watching
  5: Code, // Competing
}

function formatTimestamp(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  }
  return `${minutes}m`
}

export default function DiscordStatusIndicator() {
  const { status, loading, error, refetch, isOnline, lastFetchTime } = useDiscordStatus(30000)
  const [imageError, setImageError] = useState(false)

  if (loading && !status) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center p-6"
      >
        <div className="flex items-center space-x-3 text-white/60">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm">Connecting to Discord...</span>
        </div>
      </motion.div>
    )
  }

  if (error && !status) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="p-4 space-y-3">
        <div className="flex items-center space-x-2 text-red-400">
          <WifiOff className="w-5 h-5" />
          <span className="text-sm font-medium">Discord Unavailable</span>
        </div>
        <div className="text-xs text-white/50 space-y-1">
          <p>
            <strong>Error:</strong> {error.error}
          </p>
          <p>
            <strong>Details:</strong> {error.details}
          </p>
          {error.code && (
            <p>
              <strong>Code:</strong> {error.code}
            </p>
          )}
          {error.code === "USER_NOT_FOUND" && (
            <div className="mt-2 p-2 bg-blue-500/20 border border-blue-500/30 rounded text-blue-300">
              <p className="text-xs mb-1">To fix this:</p>
              <ol className="text-xs space-y-1 list-decimal list-inside">
                <li>Make sure your Discord profile is public</li>
                <li>Wait a few minutes for monitoring to start</li>
              </ol>
            </div>
          )}
        </div>
        <button
          onClick={refetch}
          className="w-full px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-xs hover:bg-red-500/30 transition-colors"
        >
          Retry Connection
        </button>
      </motion.div>
    )
  }

  if (!status) return null

  const currentStatus = statusConfig[status.presence.status]
  const primaryActivity = status.presence.primaryActivity
  const spotify = status.presence.spotify

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full space-y-4"
      >
        {/* Status Header with Profile Picture */}
        <div className="flex items-center space-x-4">
          {/* Discord Profile Picture */}
          <div className="relative">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
              {!imageError ? (
                <Image
                  src={status.user.avatar || "/placeholder.svg"}
                  alt={`Discord avatar`}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                  unoptimized // Discord CDN images
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {status.user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {/* Status Indicator Dot */}
            <div className="absolute -bottom-1 -right-1">
              <div
                className={`w-4 h-4 rounded-full border-2 border-[#2e3050] ${currentStatus.glow} shadow-lg`}
                style={{ backgroundColor: currentStatus.color }}
              />
              <motion.div
                className="absolute inset-0 w-4 h-4 rounded-full border-2 border-[#2e3050]"
                style={{ backgroundColor: currentStatus.color }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </div>
          </div>

          {/* User Info and Status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium text-sm truncate">
                  {status.user.displayName || status.user.globalName || status.user.username}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-white/60 text-xs">{currentStatus.label}</span>
                  {isOnline && <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />}
                </div>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={refetch}
                    className="text-white/40 hover:text-white/60 transition-colors p-1"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={loading}
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh status</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Spotify Activity */}
        <AnimatePresence>
          {spotify && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`${currentStatus.bgColor} backdrop-blur-sm rounded-lg p-3 border ${currentStatus.borderColor}`}
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={spotify.album_art_url || "/placeholder.svg"}
                    alt={`${spotify.album} cover`}
                    width={80}
                    height={80}
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0 text-left"> {/* <-- ensure text aligns left */}
                  <div className="flex items-center space-x-2 mb-1">
                    <Music className="w-3 h-3 text-green-400" />
                    <span className="text-green-300 text-xs font-medium tracking-wide">Spotify</span>
                  </div>
                  <p className="text-white text-sm font-medium truncate">{spotify.song}</p>
                  <p className="text-white/70 text-xs truncate">by {spotify.artist}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {primaryActivity && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`${currentStatus.bgColor} backdrop-blur-sm rounded-lg p-3 border ${currentStatus.borderColor}`}
            >
              <div className="flex gap-4">
                {/* Activity Image */}
                {primaryActivity.assets?.large_image && (
                  <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-700/50">
                    <Image
                      src={
                        primaryActivity.assets.large_image.startsWith('mp:external/')
                          ? `https://media.discordapp.net/external/${primaryActivity.assets.large_image.replace('mp:external/', '')}`
                          : `https://cdn.discordapp.com/app-assets/${primaryActivity.application_id}/${primaryActivity.assets.large_image}.png`
                      }
                      alt={primaryActivity.assets.large_text || primaryActivity.name}
                      width={64}
                      height={64}
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  {/* Activity Header */}
                  <div className="flex items-center gap-2 mb-1">
                    {(() => {
                      const IconComponent =
                        activityTypeIcons[primaryActivity.type as keyof typeof activityTypeIcons] || Monitor;
                      return <IconComponent className="w-4 h-4 text-indigo-400 flex-shrink-0" />;
                    })()}
                    <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider truncate">
                      {primaryActivity.type === 0
                        ? "Playing a Game"
                        : primaryActivity.type === 1
                          ? "Streaming"
                          : "Activity"}
                    </span>
                    {primaryActivity.timestamps?.start && (
                      <span className="text-xs text-gray-400 ml-auto">
                        {formatTimestamp(primaryActivity.timestamps.start)}
                      </span>
                    )}
                  </div>

                  {/* Activity Details */}
                  <div className="space-y-1">
                    <h3 className="text-white font-medium text-sm leading-tight truncate">
                      {primaryActivity.name}
                    </h3>
                    {primaryActivity.details && (
                      <p className="text-gray-300 text-xs leading-tight truncate">
                        {primaryActivity.details}
                      </p>
                    )}
                    {primaryActivity.state && (
                      <p className="text-gray-400 text-xs leading-tight truncate">
                        {primaryActivity.state}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Badge */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mt-2">
              <Badge variant="destructive" className="text-xs flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>Connection issues detected</span>
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </TooltipProvider>
  )
}
