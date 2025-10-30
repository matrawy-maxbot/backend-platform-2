import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// Cache للسيرفرات
const guildsCache = new Map<string, { data: any[], timestamp: number }>()
const CACHE_DURATION = 2 * 60 * 1000 // 2 دقيقة لتحديث أسرع

// دالة للانتظار
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    const userId = session.user?.discordId || 'unknown'
    const cacheKey = `user_guilds_${userId}`
    
    // التحقق من parameter لتجاهل الـ cache
    const { searchParams } = new URL(request.url)
    const forceRefresh = searchParams.get('refresh') === 'true'
    
    // التحقق من الـ cache (إلا إذا كان هناك طلب لإعادة التحميل)
    const cached = guildsCache.get(cacheKey)
    if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached user guilds data')
      return NextResponse.json(cached.data)
    }
    
    if (forceRefresh) {
      console.log('Force refresh requested for user guilds, clearing cache')
      guildsCache.delete(cacheKey)
    }

    // محاولة جلب البيانات مع إعادة المحاولة
    let retries = 3
    let guilds = null
    
    while (retries > 0) {
      try {
        const response = await fetch('https://discord.com/api/users/@me/guilds', {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after')
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 2000
          console.log(`Rate limited, waiting ${waitTime}ms before retry`)
          await delay(waitTime)
          retries--
          continue
        }

        if (!response.ok) {
          if (response.status === 401) {
            return NextResponse.json(
              { error: 'انتهت صلاحية جلسة Discord. يرجى تسجيل الدخول مرة أخرى' },
              { status: 401 }
            )
          }
          throw new Error(`Discord API error: ${response.status}`)
        }

        guilds = await response.json()
        break
      } catch (error) {
        retries--
        if (retries === 0) throw error
        await delay(1000)
      }
    }

    if (!guilds) {
      return NextResponse.json(
        { error: 'فشل في جلب بيانات السيرفرات بعد عدة محاولات' },
        { status: 500 }
      )
    }
    
    // تنسيق البيانات لتتوافق مع التطبيق
    const formattedGuilds = guilds.map((guild: any) => ({
      id: guild.id,
      name: guild.name,
      icon: guild.icon,
      owner: guild.owner,
      permissions: guild.permissions,
      features: guild.features || []
    }))

    // حفظ في الـ cache
    guildsCache.set(cacheKey, {
      data: formattedGuilds,
      timestamp: Date.now()
    })

    return NextResponse.json(formattedGuilds)
  } catch (error) {
    console.error('Error fetching Discord guilds:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب بيانات السيرفرات. يرجى المحاولة مرة أخرى لاحقاً' },
      { status: 500 }
    )
  }
}