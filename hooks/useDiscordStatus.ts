"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface DiscordUser {
  id: string
  username: string
  discriminator: string
  globalName: string | null
  displayName: string | null
  avatar: string
  publicFlags: number
}

interface DiscordActivity {
  id: string
  name: string
  type: number
  state?: string
  details?: string
  timestamps?: {
    start?: number
    end?: number
  }
  assets?: {
    large_image?: string
    large_text?: string
    small_image?: string
    small_text?: string
  }
  platform?: string
}

interface SpotifyData {
  track_id: string
  timestamps: {
    start: number
    end: number
  }
  song: string
  artist: string
  album_art_url: string
  album: string
}

interface DiscordStatus {
  user: DiscordUser
  presence: {
    status: "online" | "idle" | "dnd" | "offline"
    activities: DiscordActivity[]
    primaryActivity: DiscordActivity | null
    spotify: SpotifyData | null
    activeOn: {
      web: boolean
      desktop: boolean
      mobile: boolean
      embedded: boolean
    }
  }
  lastUpdated: string
  source: string
}

interface DiscordError {
  error: string
  details: string
  code: string
  timestamp?: string
  helpUrl?: string
}

interface UseDiscordStatusReturn {
  status: DiscordStatus | null
  loading: boolean
  error: DiscordError | null
  refetch: () => Promise<void>
  isOnline: boolean
  lastFetchTime: Date | null
}

export function useDiscordStatus(updateInterval = 30000): UseDiscordStatusReturn {
  const [status, setStatus] = useState<DiscordStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<DiscordError | null>(null)
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchStatus = useCallback(async () => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      setError(null)

      const response = await fetch("/api/discord-status", {
        signal: abortControllerRef.current.signal,
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw {
          error: data.error || "Failed to fetch Discord status",
          details: data.details || `HTTP ${response.status}`,
          code: data.code || "HTTP_ERROR",
          timestamp: data.timestamp,
          helpUrl: data.helpUrl,
        }
      }

      setStatus(data)
      setLastFetchTime(new Date())
      console.log("Discord status updated:", {
        username: data.user.username,
        displayName: data.user.displayName,
        status: data.presence.status,
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      // Don't set error if request was aborted (component unmounting or new request)
      if (err instanceof Error && err.name === "AbortError") {
        return
      }

      const discordError: DiscordError = {
        error: "Connection failed",
        details: "Unable to fetch Discord status",
        code: "NETWORK_ERROR",
        ...(typeof err === "object" && err !== null ? err : {}),
      }

      setError(discordError)
      console.error("Failed to fetch Discord status:", discordError)
    } finally {
      setLoading(false)
    }
  }, [])

  // Manual refetch function
  const refetch = useCallback(async () => {
    setLoading(true)
    await fetchStatus()
  }, [fetchStatus])

  useEffect(() => {
    // Initial fetch
    fetchStatus()

    // Set up periodic updates
    intervalRef.current = setInterval(fetchStatus, updateInterval)

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchStatus, updateInterval])

  // Determine if user is considered "online"
  const isOnline = status?.presence.status === "online" || status?.presence.status === "idle"

  return {
    status,
    loading,
    error,
    refetch,
    isOnline,
    lastFetchTime,
  }
}
