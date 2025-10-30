"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import GameManager from "@/components/games/game-manager"
import { frivGames } from "@/components/games/friv-games-data"
import {
  Gamepad2,
  Trophy,
  Users,
  Star,
  Play,
  Calendar,
  Clock,
  Target,
  Zap,
  Crown,
  Medal,
  Sword,
  Shield,
  Search,
  Filter,
  Plus,
  TrendingUp,
  Flame,
  Eye,
  Heart,
  Share2,
  Coins
} from "lucide-react"

const games = [
  {
    id: 1,
    title: "Snake Game",
    category: "Arcade",
    players: "Single Player",
    playersCount: 1,
    difficulty: "Medium",
    rating: 4.5,
    image: "/games/snake-icon.svg",
    status: "Available",
    gameType: "snake",
    coinReward: 10,
    description: "Classic game where you control a snake that eats food and grows. Avoid hitting walls or yourself!",
    features: ["Easy arrow controls", "Increasing score", "Variable speed", "Best score saved"],
    howToPlay: "Use arrows to control the snake. Collect food to earn points and grow. Avoid collisions!"
  },
  {
    id: 2,
    title: "Tic Tac Toe",
    category: "Strategy",
    players: "Two Players",
    playersCount: 2,
    difficulty: "Easy",
    rating: 4.2,
    image: "/games/tictactoe-icon.svg",
    status: "Available",
    gameType: "tictactoe",
    coinReward: 15,
    description: "Classic strategy game for two players. Be the first to line up three marks in a straight line!",
    features: ["Play against friend", "Simple interface", "Win statistics", "Quick replay"],
    howToPlay: "Choose an empty square to place your mark. First to get three marks in a line wins!"
  },
  {
    id: 3,
    title: "Memory Game",
    category: "Brain",
    players: "Single Player",
    playersCount: 1,
    difficulty: "Medium",
    rating: 4.7,
    image: "/games/memory-icon.svg",
    status: "Available",
    gameType: "memory",
    coinReward: 20,
    description: "Test your memory! Flip cards and find matching pairs in the fewest attempts.",
    features: ["Colorful cards", "Timer", "Attempt counter", "Difficulty levels"],
    howToPlay: "Click on cards to flip them. Find matching pairs and complete the game in the shortest time!"
  },
  {
    id: 4,
    title: "2048 Game",
    category: "Puzzle",
    players: "Single Player",
    playersCount: 1,
    difficulty: "Hard",
    rating: 4.8,
    image: "/games/2048.svg",
    status: "Available",
    gameType: "2048",
    coinReward: 25,
    description: "Exciting mathematical puzzle game! Merge numbers to reach 2048.",
    features: ["Swipe controls", "Auto save", "Best score", "Undo move"],
    howToPlay: "Swipe to move tiles. Merge matching numbers to reach 2048!"
  },
  {
    id: 5,
    title: "Typing Speed Game",
    category: "Skills",
    players: "Single Player",
    playersCount: 1,
    difficulty: "Medium",
    rating: 4.6,
    image: "/games/typing-icon.svg",
    status: "Available",
    gameType: "typing",
    coinReward: 15,
    description: "Develop fast and accurate typing skills. Type texts as quickly as possible!",
    features: ["Various texts", "Speed measurement", "Accuracy measurement", "Detailed statistics"],
    howToPlay: "Type the displayed text as fast as possible while maintaining accuracy. The faster you are, the more points you get!"
  },
  {
    id: 6,
    title: "Rock Paper Scissors",
    category: "Luck",
    players: "Two Players",
    playersCount: 2,
    difficulty: "Easy",
    rating: 4.1,
    image: "/games/rps-icon.svg",
    status: "Available",
    gameType: "rps",
    coinReward: 5,
    description: "The classic simple game! Choose rock, paper, or scissors and challenge your opponent.",
    features: ["Quick play", "Simple rules", "Multiple matches", "Win statistics"],
    howToPlay: "Choose rock, paper, or scissors. Rock breaks scissors, scissors cut paper, paper covers rock!"
  },
  {
    id: 7,
    title: "Connect Four",
    category: "Strategy",
    players: "Two Players",
    playersCount: 2,
    difficulty: "Medium",
    rating: 4.4,
    image: "/games/connect4-icon.svg",
    status: "Available",
    gameType: "connect4",
    coinReward: 20,
    description: "Exciting strategy game! Be the first to line up four pieces in a straight line.",
    features: ["7×6 board", "Deep strategy", "Animations", "Betting system"],
    howToPlay: "Drop your piece in the desired column. First to get four pieces in a row horizontally, vertically, or diagonally wins!"
  }
]

const tournaments = [
  {
    id: 1,
    name: "Global Gaming Championship",
    game: "League of Legends",
    startDate: "2024-02-15",
    endDate: "2024-02-20",
    prize: "$100,000",
    participants: 128,
    status: "live",
    viewers: 45000
  },
  {
    id: 2,
    name: "International Esports Cup",
    game: "FIFA 24",
    startDate: "2024-02-18",
    endDate: "2024-02-22",
    prize: "$50,000",
    participants: 64,
    status: "upcoming",
    viewers: 0
  },
  {
    id: 3,
    name: "Elite Challenge Tournament",
    game: "Call of Duty",
    startDate: "2024-02-10",
    endDate: "2024-02-14",
    prize: "$75,000",
    participants: 96,
    status: "ended",
    viewers: 32000
  }
]

const topPlayers = [
  {
    id: 1,
    name: "Ahmed Al-Ghamdi",
    username: "ProGamer_AH",
    rank: 1,
    points: 2850,
    wins: 145,
    avatar: "AG",
    country: "🇸🇦"
  },
  {
    id: 2,
    name: "Fatima Al-Ali",
    username: "QueenGamer_FA",
    rank: 2,
    points: 2720,
    wins: 132,
    avatar: "FA",
    country: "🇦🇪"
  },
  {
    id: 3,
    name: "Mohammed Hassan",
    username: "Lightning_MH",
    rank: 3,
    points: 2650,
    wins: 128,
    avatar: "MH",
    country: "🇪🇬"
  },
  {
    id: 4,
    name: "Sara Ahmed",
    username: "StarPlayer_SA",
    rank: 4,
    points: 2580,
    wins: 119,
    avatar: "SA",
    country: "🇯🇴"
  },
  {
    id: 5,
    name: "Abdullah Al-Mutairi",
    username: "Champion_AM",
    rank: 5,
    points: 2510,
    wins: 115,
    avatar: "AM",
    country: "🇰🇼"
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'live':
      return 'bg-red-500/10 text-red-400 border-red-500/20'
    case 'upcoming':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    case 'ended':
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'live':
      return 'Live'
    case 'upcoming':
      return 'Upcoming'
    case 'ended':
      return 'Ended'
    default:
      return 'Unknown'
  }
}

export default function GamingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [activeTab, setActiveTab] = useState("games")
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [isGameDialogOpen, setIsGameDialogOpen] = useState(false)
  const [previewGame, setPreviewGame] = useState<any>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Convert Friv games to match the local games format
  const frivGamesFormatted = frivGames.map(game => ({
    id: game.id,
    title: game.titleAr,
    category: game.category,
    players: game.players === 1 ? "لاعب واحد" : "متعدد اللاعبين",
    playersCount: game.players,
    difficulty: game.difficulty,
    rating: game.rating,
    image: game.thumbnail,
    status: "متاح",
    gameType: game.id,
    coinReward: game.coinReward,
    description: game.description,
    features: game.tags,
    howToPlay: `لعبة ${game.titleAr} من موقع Friv. استمتع بتجربة لعب ممتعة ومثيرة!`,
    isFrivGame: true
  }))

  // Combine local games with Friv games
  const allGames = [...games, ...frivGamesFormatted]

  // Game categories for sidebar
  const gameCategories = [
    { id: "all", name: "All Games", icon: Filter, count: allGames.length },
    { id: "Arcade", name: "Arcade", icon: Zap, count: games.filter(game => game.category === "Arcade").length },
    { id: "Strategy", name: "Strategy", icon: Target, count: games.filter(game => game.category === "Strategy").length },
    { id: "Brain", name: "Brain", icon: Star, count: games.filter(game => game.category === "Brain").length },
    { id: "Puzzle", name: "Puzzle", icon: Shield, count: games.filter(game => game.category === "Puzzle").length },
    { id: "Skills", name: "Skills", icon: Sword, count: games.filter(game => game.category === "Skills").length },
    { id: "Luck", name: "Luck", icon: Medal, count: games.filter(game => game.category === "Luck").length },
    { id: "Two Players", name: "Two Players", icon: Users, count: games.filter(game => game.playersCount === 2).length },
    { id: "Friv", name: "Friv Games", icon: Flame, count: frivGames.length }
  ]

  const handlePlayGame = (gameType: string) => {
    setSelectedGame(gameType)
    setIsGameDialogOpen(true)
  }

  const handlePreviewGame = (game: any) => {
    setPreviewGame(game)
    setIsPreviewOpen(true)
  }

  const filteredGames = allGames.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || 
                           game.category === selectedCategory ||
                           (selectedCategory === "Two Players" && game.playersCount === 2) ||
                           (selectedCategory === "Friv" && game.isFrivGame)
    return matchesSearch && matchesCategory
  })

  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      case 'name':
        return a.title.localeCompare(b.title, 'ar')
      case 'category':
        return a.category.localeCompare(b.category, 'ar')
      case 'difficulty':
        const difficultyOrder = { 'سهل': 1, 'متوسط': 2, 'صعب': 3 }
        return (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0) - (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0)
      default:
        return 0
    }
  })

  const totalPlayers = games.reduce((sum, game) => sum + game.playersCount, 0)
  const liveTournaments = tournaments.filter(t => t.status === 'live').length
  const totalPrize = tournaments.reduce((sum, t) => sum + parseInt(t.prize.replace(/[^0-9]/g, '')), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black p-6 -mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Elite Gaming Arena</h1>
              <p className="text-gray-400">Discover epic games, thrilling tournaments, and competitive excellence</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Players</p>
                    <p className="text-2xl font-bold text-blue-400">{totalPlayers.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Live Tournaments</p>
                    <p className="text-2xl font-bold text-red-400">{liveTournaments}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Prizes</p>
                    <p className="text-2xl font-bold text-yellow-400">${totalPrize.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <Crown className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Available Games</p>
                    <p className="text-2xl font-bold text-purple-400">{allGames.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Gamepad2 className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-gray-800">
            <TabsTrigger value="games" className="data-[state=active]:bg-purple-600">
              <Gamepad2 className="h-4 w-4 mr-2" />
              Games
            </TabsTrigger>
            <TabsTrigger value="tournaments" className="data-[state=active]:bg-purple-600">
              <Trophy className="h-4 w-4 mr-2" />
              Tournaments
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-purple-600">
              <Crown className="h-4 w-4 mr-2" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar - Categories */}
              <div className="lg:col-span-1">
                <Card className="bg-gray-900/50 border-gray-800 sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Game Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {gameCategories.map((category) => {
                      const Icon = category.icon
                      return (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "ghost"}
                          className={`w-full justify-start ${
                            selectedCategory === category.id 
                              ? "bg-purple-600 hover:bg-purple-700" 
                              : "text-gray-400 hover:text-white hover:bg-gray-800"
                          }`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          <span className="flex-1 text-right">{category.name}</span>
                          <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                            {category.count}
                          </Badge>
                        </Button>
                      )
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-6">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search games..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-900/50 border-gray-800 text-white"
                    />
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48 bg-gray-900/50 border-gray-800 text-white">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="difficulty">Difficulty</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Game
                  </Button>
                </div>

                {/* Games Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedGames.map((game) => (
                <Card key={game.id} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="relative">
                      <div className="w-full h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                        <Image 
                          src={game.image} 
                          alt={game.title}
                          width={80}
                          height={80}
                          className="object-contain filter drop-shadow-lg"
                        />
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Badge className={getStatusColor(game.status)}>
                          {game.status === 'live' && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1" />}
                          {getStatusText(game.status)}
                        </Badge>
                        {game.isFrivGame && (
                          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                            <Flame className="h-3 w-3 mr-1" />
                            Friv
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg group-hover:text-purple-400 transition-colors">
                        {game.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400">{game.category}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-400" />
                        <span className="text-gray-400">{game.players}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-gray-400">{game.rating}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-orange-400" />
                        <span className="text-gray-400">{game.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-yellow-400" />
                        <span className="text-gray-400">{game.coinReward}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                        onClick={() => handlePlayGame(game.gameType)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Play Now
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-600/10" onClick={() => handlePreviewGame(game)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-600/10">
                        <Heart className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
                </div>

                {/* Empty State */}
                {sortedGames.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Gamepad2 className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Games Found</h3>
                    <p className="text-gray-400 mb-6">We couldn't find any games matching your search criteria. Try adjusting the filters or browse our complete collection.</p>
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedCategory("all")
                      }}
                    >
                      Explore All Games
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Tournaments Tab */}
          <TabsContent value="tournaments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tournaments.map((tournament) => (
                <Card key={tournament.id} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">{tournament.name}</CardTitle>
                        <CardDescription className="text-gray-400">{tournament.game}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(tournament.status)}>
                        {tournament.status === 'live' && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1" />}
                        {getStatusText(tournament.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Tournament Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-400" />
                        <span className="text-gray-400">{tournament.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-400" />
                        <span className="text-gray-400">{tournament.participants}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-yellow-400" />
                        <span className="text-gray-400">{tournament.prize}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-purple-400" />
                        <span className="text-gray-400">{tournament.viewers.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Progress Bar for Live Tournaments */}
                    {tournament.status === 'live' && (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-400">Tournament Progress</span>
                          <span className="text-white">65%</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      {tournament.status === 'live' ? (
                        <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700">
                          <Eye className="h-3 w-3 mr-1" />
                          Watch Live
                        </Button>
                      ) : tournament.status === 'upcoming' ? (
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-3 w-3 mr-1" />
                          Register
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="flex-1 border-gray-600 text-gray-400">
                          <Trophy className="h-3 w-3 mr-1" />
                          Results
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-600/10">
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  Leaderboard
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Top Players in the Region
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPlayers.map((player, index) => (
                    <div key={player.id} className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                      {/* Rank */}
                      <div className="flex items-center justify-center w-8 h-8">
                        {index < 3 ? (
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                          }`}>
                            <span className="text-white text-xs font-bold">{player.rank}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 font-bold">{player.rank}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          {player.avatar}
                        </AvatarFallback>
                      </Avatar>

                      {/* Player Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-medium">{player.name}</h4>
                          <span className="text-lg">{player.country}</span>
                        </div>
                        <p className="text-gray-400 text-sm">@{player.username}</p>
                      </div>

                      {/* Stats */}
                      <div className="text-right">
                        <div className="text-white font-bold">{player.points.toLocaleString()} Points</div>
                        <div className="text-gray-400 text-sm">{player.wins} Wins</div>
                      </div>

                      {/* Medal Icon */}
                      {index < 3 && (
                        <Medal className={`h-5 w-5 ${
                          index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-amber-600'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Game Dialog */}
      <Dialog open={isGameDialogOpen} onOpenChange={setIsGameDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              {selectedGame === 'snake' && 'لعبة الثعبان'}
              {selectedGame === 'tic-tac-toe' && 'لعبة إكس أو'}
              {selectedGame === 'memory' && 'لعبة الذاكرة'}
              {selectedGame === 'puzzle' && 'لعبة الألغاز'}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-auto">
             {selectedGame && (
               <GameManager 
                 selectedGame={selectedGame === 'tic-tac-toe' ? 'tictactoe' : selectedGame as any}
                 onGameSelect={(game) => setSelectedGame(game)}
                 onClose={() => setIsGameDialogOpen(false)}
               />
             )}
           </div>
        </DialogContent>
      </Dialog>

      {/* Game Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white text-xl flex items-center gap-3">
              {previewGame && (
                <>
                  <Image
                    src={previewGame.image}
                    alt={previewGame.title}
                    width={32}
                    height={32}
                    className="rounded"
                  />
                  {previewGame.title}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {previewGame && (
            <div className="space-y-6">
              {/* Game Info */}
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
                  {previewGame.category}
                </Badge>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {previewGame.players}
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {previewGame.difficulty}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {previewGame.rating}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-white font-semibold mb-2">Game Description</h3>
                <p className="text-gray-300 leading-relaxed">{previewGame.description}</p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-white font-semibold mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {previewGame.features?.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to Play */}
              <div>
                <h3 className="text-white font-semibold mb-2">How to Play</h3>
                <p className="text-gray-300 leading-relaxed">{previewGame.howToPlay}</p>
              </div>

              {/* Reward Info */}
              <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-4 rounded-lg border border-yellow-600/30">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Coins className="w-5 h-5" />
                  <span className="font-semibold">مكافأة الفوز: {previewGame.coinReward} عملة ذهبية</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => {
                    setIsPreviewOpen(false)
                    handlePlayGame(previewGame.gameType)
                  }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  العب الآن
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-600 text-gray-400 hover:bg-gray-600/10"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}