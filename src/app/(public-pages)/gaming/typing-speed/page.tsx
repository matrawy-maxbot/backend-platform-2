import TypingSpeedGame from '@/components/games/typing-speed-game'

export default function TypingSpeedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      <div className="container mx-auto py-8">
        <TypingSpeedGame />
      </div>
    </div>
  )
}