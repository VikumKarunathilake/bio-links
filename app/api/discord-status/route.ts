import { NextResponse } from "next/server"

// Your Discord User ID - Replace with your actual Discord user ID
const DISCORD_USER_ID = "781158548364853270"

interface LanyardDiscordUser {
  id: string
  username: string
  discriminator: string
  avatar: string | null
  bot: boolean
  global_name?: string | null
  display_name?: string | null
  public_flags?: number
  clan?: any
  primary_guild?: any
  avatar_decoration_data?: any
  collectibles?: any
}

interface LanyardActivity {
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
  application_id?: string
  created_at?: number
  platform?: string
  metadata?: any
}

interface LanyardData {
  discord_user: LanyardDiscordUser // Note: it's discord_user, not user
  discord_status: "online" | "idle" | "dnd" | "offline"
  activities: LanyardActivity[]
  listening_to_spotify: boolean
  spotify?: {
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
  kv?: Record<string, string>
  active_on_discord_web: boolean
  active_on_discord_desktop: boolean
  active_on_discord_mobile: boolean
  active_on_discord_embedded: boolean
}

interface LanyardResponse {
  success: boolean
  data?: LanyardData
  error?: {
    message: string
    code: string
  }
}

export async function GET() {
  try {
    console.log(`Fetching Discord status for user ID: ${DISCORD_USER_ID}`)

    // Fetch from Lanyard API
    const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, {
      headers: {
        "User-Agent": "Discord-Profile-Integration/1.0",
        Accept: "application/json",
      },
      // Add cache control to prevent stale data
      cache: "no-store",
    })

    console.log(`Lanyard API response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Lanyard API error: ${response.status} - ${errorText}`)

      if (response.status === 404) {
        return NextResponse.json(
          {
            error: "User not found",
            details:
              "Discord user not found or not being monitored by Lanyard. Make sure to join the Lanyard Discord server.",
            code: "USER_NOT_FOUND",
            helpUrl: "https://discord.gg/lanyard",
          },
          { status: 404 },
        )
      }

      if (response.status === 429) {
        return NextResponse.json(
          {
            error: "Rate limited",
            details: "Too many requests to Lanyard API. Please try again later.",
            code: "RATE_LIMITED",
          },
          { status: 429 },
        )
      }

      throw new Error(`Lanyard API returned ${response.status}: ${errorText}`)
    }

    const lanyardResponse: LanyardResponse = await response.json()
    console.log("Raw Lanyard response:", JSON.stringify(lanyardResponse, null, 2))

    if (!lanyardResponse.success) {
      console.error("Lanyard API returned success: false", lanyardResponse.error)
      throw new Error(`Lanyard API error: ${lanyardResponse.error?.message || "Unknown error"}`)
    }

    if (!lanyardResponse.data) {
      console.error("Lanyard API returned no data")
      throw new Error("Lanyard API returned no data")
    }

    const { data } = lanyardResponse

    // Validate that we have the required user data (note: it's discord_user, not user)
    if (!data.discord_user) {
      console.error("No discord_user data in Lanyard response")
      throw new Error("No discord_user data received from Lanyard API")
    }

    const discordUser = data.discord_user
    console.log("Discord user data:", JSON.stringify(discordUser, null, 2))

    // Build avatar URL with proper fallback handling
    let avatarUrl: string

    if (discordUser.avatar) {
      // Check if avatar is animated (starts with 'a_')
      const isAnimated = discordUser.avatar.startsWith("a_")
      const extension = isAnimated ? "gif" : "png"
      avatarUrl = `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.${extension}?size=256`
    } else {
      // Use default Discord avatar
      // For new usernames (discriminator is 0), use new calculation
      // For legacy usernames, use old calculation
      const defaultAvatarIndex =
        discordUser.discriminator === "0"
          ? Number((BigInt(discordUser.id) >> 22n) % 6n)
          : Number.parseInt(discordUser.discriminator) % 5

      avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`
    }

    console.log("Generated avatar URL:", avatarUrl)

    // Filter out non-relevant activities (like Spotify, which is handled separately)
    const relevantActivities = (data.activities || []).filter(
      (activity) => activity.type !== 2 && activity.name !== "Spotify",
    )

    // Get the most relevant activity (usually the first non-Spotify one)
    const primaryActivity = relevantActivities[0] || null

    const responseData = {
      user: {
        id: discordUser.id,
        username: discordUser.username,
        discriminator: discordUser.discriminator,
        globalName: discordUser.global_name || null,
        displayName: discordUser.display_name || null,
        avatar: avatarUrl,
        publicFlags: discordUser.public_flags || 0,
      },
      presence: {
        status: data.discord_status,
        activities: relevantActivities.map((activity) => ({
          id: activity.id,
          name: activity.name,
          type: activity.type,
          state: activity.state,
          details: activity.details,
          timestamps: activity.timestamps,
          assets: activity.assets,
          platform: activity.platform,
        })),
        primaryActivity,
        spotify: data.listening_to_spotify ? data.spotify : null,
        activeOn: {
          web: data.active_on_discord_web,
          desktop: data.active_on_discord_desktop,
          mobile: data.active_on_discord_mobile,
          embedded: data.active_on_discord_embedded,
        },
      },
      lastUpdated: new Date().toISOString(),
      source: "lanyard",
    }

    console.log("Successfully processed Discord status:", {
      username: discordUser.username,
      globalName: discordUser.global_name,
      displayName: discordUser.display_name,
      status: data.discord_status,
      activitiesCount: relevantActivities.length,
      hasSpotify: data.listening_to_spotify,
      activeDevices: {
        desktop: data.active_on_discord_desktop,
        web: data.active_on_discord_web,
        mobile: data.active_on_discord_mobile,
      },
    })

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Discord API error:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    const errorStack = error instanceof Error ? error.stack : undefined

    console.error("Error stack:", errorStack)

    return NextResponse.json(
      {
        error: "Failed to fetch Discord status",
        details: errorMessage,
        code: "FETCH_ERROR",
        timestamp: new Date().toISOString(),
        userId: DISCORD_USER_ID,
        debug: process.env.NODE_ENV === "development" ? { stack: errorStack } : undefined,
      },
      { status: 500 },
    )
  }
}
