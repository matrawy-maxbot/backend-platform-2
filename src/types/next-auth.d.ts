import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      discordId: string
      username: string
      discriminator: string
      avatar: string
      verified: boolean
    }
    accessToken: string
  }

  interface User {
    discordId: string
    username: string
    discriminator: string
    avatar: string
    verified: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    discordId: string
    username: string
    discriminator: string
    avatar: string
    verified: boolean
    accessToken: string
  }
}