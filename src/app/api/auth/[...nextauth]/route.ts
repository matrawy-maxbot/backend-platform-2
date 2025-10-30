import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { NextAuthOptions } from 'next-auth'

const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'identify email guilds'
        }
      }
    })
  ],
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === 'production',
  callbacks: {
    async jwt({ token, account, profile }) {
      try {
        // حفظ بيانات Discord في JWT token
        if (account && profile) {
          token.discordId = profile.id
          token.username = profile.username
          token.discriminator = profile.discriminator
          token.avatar = profile.avatar
          token.email = profile.email
          token.verified = profile.verified
          token.accessToken = account.access_token
        }
        return token
      } catch (error) {
        console.error('JWT callback error:', error)
        return token
      }
    },
    async session({ session, token }) {
      try {
        // إرسال بيانات Discord إلى session
        if (token) {
          session.user.discordId = token.discordId as string
          session.user.username = token.username as string
          session.user.discriminator = token.discriminator as string
          session.user.avatar = token.avatar as string
          session.user.verified = token.verified as boolean
          session.accessToken = token.accessToken as string
        }
        return session
      } catch (error) {
        console.error('Session callback error:', error)
        return session
      }
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  events: {
    async signOut(message) {
      console.log('User signed out:', message)
    }
  },
  pages: {
    error: '/auth/error'
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST, authOptions }