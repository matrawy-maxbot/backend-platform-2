import { NextRequest, NextResponse } from 'next/server'

// API بديل مؤقت للتحقق من المصادقة
// يُرجع بيانات مستخدم وهمية لحل المشكلة مؤقتاً
export async function GET(request: NextRequest) {
  try {
    // بيانات مستخدم وهمية للاختبار
    const mockSession = {
      user: {
        id: "test-user-123",
        name: "te2m",
        email: "losefer570@gmail.com",
        image: "https://cdn.discordapp.com/avatars/123456789/avatar.png",
        discordId: "123456789",
        username: "te2m",
        discriminator: "0001",
        avatar: "avatar_hash",
        verified: true
      },
      accessToken: "mock_access_token",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    }

    return NextResponse.json(mockSession)
  } catch (error) {
    console.error('Session bypass error:', error)
    return NextResponse.json({}, { status: 500 })
  }
}