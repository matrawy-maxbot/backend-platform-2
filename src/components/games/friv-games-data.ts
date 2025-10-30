// قائمة ألعاب Friv المختارة
export interface FrivGameData {
  id: string
  title: string
  titleAr: string
  category: string
  categoryAr: string
  description: string
  descriptionAr: string
  url: string
  thumbnail: string
  difficulty: 'سهل' | 'متوسط' | 'صعب'
  players: string
  playersAr: string
  rating: number
  coinReward: number
  tags: string[]
  tagsAr: string[]
}

export const frivGames: FrivGameData[] = [
  {
    id: 'friv-subway-surfers',
    title: 'Subway Surfers',
    titleAr: 'عدائي المترو',
    category: 'Arcade',
    categoryAr: 'أكشن',
    description: 'Run as far as you can in this endless running adventure',
    descriptionAr: 'اجر بأقصى ما تستطيع في هذه المغامرة اللانهائية!',
    url: 'https://poki.com/en/g/subway-surfers',
    thumbnail: '/games/subway-surfers.svg',
    difficulty: 'متوسط',
    players: 'Single Player',
    playersAr: 'لاعب واحد',
    rating: 4.8,
    coinReward: 15,
    tags: ['running', 'endless', 'adventure'],
    tagsAr: ['جري', 'لانهائي', 'مغامرة']
  },
  {
    id: 'friv-temple-run',
    title: 'Temple Run 2',
    titleAr: 'جري المعبد 2',
    category: 'Arcade',
    categoryAr: 'أكشن',
    description: 'Navigate perilous cliffs, zip lines, mines and forests',
    descriptionAr: 'اهرب من المعبد بينما تتجنب العقبات وتجمع العملات!',
    url: 'https://poki.com/en/g/temple-run-2',
    thumbnail: '/games/temple-run.svg',
    difficulty: 'متوسط',
    players: 'Single Player',
    playersAr: 'لاعب واحد',
    rating: 4.7,
    coinReward: 15,
    tags: ['running', 'adventure', 'temple'],
    tagsAr: ['جري', 'معبد', 'مغامرة']
  },
  {
    id: 'friv-cut-the-rope',
    title: 'Cut the Rope',
    titleAr: 'قطع الحبل',
    category: 'Puzzle',
    categoryAr: 'ألغاز',
    description: 'Cut the rope to feed candy to Om Nom',
    descriptionAr: 'أطعم الحلوى لأوم نوم عن طريق قطع الحبال بالترتيب الصحيح!',
    url: 'https://poki.com/en/g/cut-the-rope-remastered',
    thumbnail: '/games/cut-the-rope.svg',
    difficulty: 'متوسط',
    players: 'Single Player',
    playersAr: 'لاعب واحد',
    rating: 4.6,
    coinReward: 20,
    tags: ['puzzle', 'physics', 'cute'],
    tagsAr: ['ألغاز', 'فيزياء', 'حلوى']
  },
  {
    id: 'friv-angry-birds',
    title: 'Angry Birds',
    titleAr: 'الطيور الغاضبة',
    category: 'Arcade',
    categoryAr: 'أكشن',
    description: 'Use the unique powers of the Angry Birds to destroy the greedy pigs',
    descriptionAr: 'ساعد الطيور الغاضبة على استرداد بيضها المسروق من الخنازير الخضراء!',
    url: 'https://poki.com/en/g/angry-birds-classic',
    thumbnail: '/games/angry-birds.svg',
    difficulty: 'سهل',
    players: 'Single Player',
    playersAr: 'لاعب واحد',
    rating: 4.9,
    coinReward: 12,
    tags: ['physics', 'strategy', 'birds'],
    tagsAr: ['طيور', 'فيزياء', 'استراتيجية']
  },
  {
    id: 'friv-fruit-ninja',
    title: 'Fruit Ninja',
    titleAr: 'نينجا الفواكه',
    category: 'Arcade',
    categoryAr: 'أكشن',
    description: 'Slice fruit with your finger and avoid the bombs',
    descriptionAr: 'قطع الفواكه بإصبعك لكن تجنب القنابل!',
    url: 'https://poki.com/en/g/fruit-ninja',
    thumbnail: '/games/fruit-ninja.svg',
    difficulty: 'سهل',
    players: 'Single Player',
    playersAr: 'لاعب واحد',
    rating: 4.5,
    coinReward: 10,
    tags: ['action', 'fruit', 'ninja'],
    tagsAr: ['فواكه', 'تقطيع', 'أركيد']
  },
  {
    id: 'friv-bubble-shooter',
    title: 'Bubble Shooter',
    titleAr: 'رامي الفقاعات',
    category: 'Puzzle',
    categoryAr: 'ألغاز',
    description: 'Match 3 or more bubbles of the same color to clear them',
    descriptionAr: 'اربط 3 فقاعات أو أكثر من نفس اللون لتفجيرها!',
    url: 'https://poki.com/en/g/bubble-shooter',
    thumbnail: '/games/bubble-shooter.svg',
    difficulty: 'سهل',
    players: 'Single Player',
    playersAr: 'لاعب واحد',
    rating: 4.4,
    coinReward: 8,
    tags: ['puzzle', 'match3', 'bubbles'],
    tagsAr: ['فقاعات', 'مطابقة', 'ملون']
  },
  {
    id: 'friv-piano-tiles',
    title: 'Piano Tiles',
    titleAr: 'بلاط البيانو',
    category: 'Music',
    categoryAr: 'موسيقى',
    description: 'Tap the black tiles and avoid the white ones',
    descriptionAr: 'اضغط على البلاط الأسود وتجنب الأبيض في هذا التحدي الموسيقي!',
    url: 'https://poki.com/en/g/piano-tiles',
    thumbnail: '/games/piano-tiles.svg',
    difficulty: 'متوسط',
    players: 'Single Player',
    playersAr: 'لاعب واحد',
    rating: 4.3,
    coinReward: 12,
    tags: ['music', 'rhythm', 'piano'],
    tagsAr: ['موسيقى', 'إيقاع', 'بيانو']
  },
  {
    id: 'friv-2048',
    title: '2048',
    titleAr: '2048',
    category: 'Puzzle',
    categoryAr: 'ألغاز',
    description: 'Combine tiles with the same number to reach 2048',
    descriptionAr: 'ادمج البلاط بنفس الرقم للوصول إلى 2048!',
    url: 'https://poki.com/en/g/2048',
    thumbnail: '/games/2048.svg',
    difficulty: 'صعب',
    players: 'Single Player',
    playersAr: 'لاعب واحد',
    rating: 4.6,
    coinReward: 25,
    tags: ['puzzle', 'numbers', 'strategy'],
    tagsAr: ['ألغاز', 'أرقام', 'استراتيجية']
  },
  {
    id: 'friv-geometry-dash',
    title: 'Geometry Dash',
    titleAr: 'داش الهندسة',
    category: 'Arcade',
    categoryAr: 'أكشن',
    description: 'Jump and fly your way through danger in this rhythm-based action platformer',
    descriptionAr: 'اقفز وطر عبر الخطر في هذه اللعبة الإيقاعية المليئة بالتحدي!',
    url: 'https://poki.com/en/g/geometry-dash-lite',
    thumbnail: '/games/geometry-dash.svg',
    difficulty: 'صعب',
    players: 'Single Player',
    playersAr: 'لاعب واحد',
    rating: 4.7,
    coinReward: 20,
    tags: ['rhythm', 'platformer', 'challenging'],
    tagsAr: ['إيقاع', 'منصات', 'تحدي']
  },
  {
    id: 'friv-flappy-bird',
    title: 'Flappy Bird',
    titleAr: 'الطائر المرفرف',
    category: 'Arcade',
    categoryAr: 'أكشن',
    description: 'Tap to flap your wings and fly between the pipes',
    descriptionAr: 'اضغط لترفرف بجناحيك وطر بين الأنابيب!',
    url: 'https://poki.com/en/g/flappy-bird',
    thumbnail: '/games/flappy-bird.svg',
    difficulty: 'صعب',
    players: 'Single Player',
    playersAr: 'لاعب واحد',
    rating: 4.2,
    coinReward: 15,
    tags: ['arcade', 'flying', 'challenging'],
    tagsAr: ['أركيد', 'طيران', 'تحدي']
  }
]

// دالة للحصول على اللعبة بواسطة المعرف
export const getFrivGameById = (id: string): FrivGameData | undefined => {
  return frivGames.find(game => game.id === id)
}

// دالة للحصول على الألعاب حسب الفئة
export const getFrivGamesByCategory = (category: string): FrivGameData[] => {
  if (category === 'all') return frivGames
  return frivGames.filter(game => game.categoryAr === category || game.category === category)
}

// دالة للبحث في الألعاب
export const searchFrivGames = (query: string): FrivGameData[] => {
  const lowercaseQuery = query.toLowerCase()
  return frivGames.filter(game => 
    game.titleAr.toLowerCase().includes(lowercaseQuery) ||
    game.title.toLowerCase().includes(lowercaseQuery) ||
    game.categoryAr.toLowerCase().includes(lowercaseQuery) ||
    game.category.toLowerCase().includes(lowercaseQuery) ||
    game.tagsAr.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    game.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}