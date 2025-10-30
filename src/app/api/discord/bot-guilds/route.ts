import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// Cache للسيرفرات
const botGuildsCache = new Map<string, { data: any[], timestamp: number }>()
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes to avoid rate limiting

// Function to clear cache
export function clearBotGuildsCache() {
  botGuildsCache.clear()
  console.log('Bot guilds cache cleared')
}

// Function for waiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Function to fetch data with retry
async function fetchWithRetry(url: string, options: any, maxRetries = 2) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch(url, options)
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after')
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000
        
        // If wait time is more than 5 minutes, return error directly
        if (waitTime > 300000) {
          console.log(`Rate limit too long (${waitTime}ms), returning error`)
          throw new Error(`Rate limit: ${Math.round(waitTime / 60000)} minutes wait required`)
        }
        
        if (i < maxRetries) {
          console.log(`Rate limited, waiting ${waitTime}ms before retry ${i + 1}/${maxRetries}`)
          await delay(waitTime)
          continue
        }
        
        throw new Error('Rate limit exceeded after retries')
      }
      
      return response
    } catch (error) {
      if (i === maxRetries) throw error
      await delay(1000 * (i + 1)) // Incremental delay
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Must login first' }, { status: 401 })
    }

    const userId = session.user?.discordId || 'unknown'
    const cacheKey = `bot_guilds_${userId}`
    
    // Check parameter to ignore cache
    const { searchParams } = new URL(request.url)
    const forceRefresh = searchParams.get('refresh') === 'true'
    
    const botToken = process.env.DISCORD_BOT_TOKEN
    
    if (!botToken) {
      return NextResponse.json(
        { error: 'Bot token not available' },
        { status: 500 }
      )
    }

    // Check if this is a mock session (from session-bypass)
    if (session.accessToken === 'mock_access_token') {
      console.log('🔍 BOT-GUILDS: Mock session detected, returning mock guilds data')
      
      // Return mock guilds data for testing
      const mockGuilds = [
        {
          id: '423067123225722891',
          name: 'Test Server 1',
          icon: null,
          owner: true,
          permissions: '8',
          features: [],
          hasBotAccess: true
        },
        {
          id: '987654321098765432',
          name: 'Test Server 2', 
          icon: null,
          owner: false,
          permissions: '8',
          features: [],
          hasBotAccess: true
        }
      ]
      
      console.log('🔍 BOT-GUILDS: Returning', mockGuilds.length, 'mock guilds')
      return NextResponse.json(mockGuilds)
    }

    // Check cache (unless there's a refresh request)
    const cached = botGuildsCache.get(cacheKey)
    if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached bot guilds data')
      return NextResponse.json(cached.data)
    }
    
    if (forceRefresh) {
      console.log('Force refresh requested, clearing cache')
      botGuildsCache.delete(cacheKey)
    }

    // Fetch servers where the user exists first
    const userGuildsResponse = await fetchWithRetry('https://discord.com/api/users/@me/guilds', {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!userGuildsResponse.ok) {
      if (userGuildsResponse.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }
      throw new Error(`User guilds API error: ${userGuildsResponse.status}`)
    }

    const userGuilds = await userGuildsResponse.json()
    
    // Short delay before next request
    await delay(500)
    
    // Fetch servers where the bot exists
    const botGuildsResponse = await fetchWithRetry('https://discord.com/api/users/@me/guilds', {
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json'
      }
    })

    let botGuildIds = new Set<string>()
    
    if (botGuildsResponse.ok) {
      const botGuilds = await botGuildsResponse.json()
      botGuildIds = new Set(botGuilds.map((guild: any) => guild.id))
    } else {
      console.warn('Bot guilds API failed, showing all user guilds:', botGuildsResponse.status)
      // If fetching bot servers fails, show all user servers
      botGuildIds = new Set(userGuilds.map((guild: any) => guild.id))
    }
    
    // Filter servers where both bot and user exist
    const commonGuilds = userGuilds.filter((guild: any) => 
      botGuildIds.has(guild.id)
    )
    
    // Format data to match the application
    const formattedGuilds = commonGuilds.map((guild: any) => ({
      id: guild.id,
      name: guild.name,
      icon: guild.icon,
      owner: guild.owner,
      permissions: guild.permissions,
      features: guild.features || [],
      hasBotAccess: true // Add flag to confirm bot exists
    }))

    // Save result in cache
    botGuildsCache.set(cacheKey, {
      data: formattedGuilds,
      timestamp: Date.now()
    })

    return NextResponse.json(formattedGuilds)
  } catch (error) {
    console.error('Error fetching bot guilds:', error)
    
    // In case of rate limiting, try to return previously cached data
    if (error instanceof Error && error.message.includes('Rate limit')) {
      const cachedData = botGuildsCache.get(cacheKey)
      if (cachedData) {
        console.log('Returning cached data due to rate limiting')
        return NextResponse.json(cachedData.data)
      }
      
      return NextResponse.json(
        { error: 'Discord rate limit exceeded. Please try again after a minute.' },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch servers data' },
      { status: 500 }
    )
  }
}