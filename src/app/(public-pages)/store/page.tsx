"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingBag,
  ShoppingCart,
  Star,
  Heart,
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  Minus,
  Eye,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  CreditCard,
  Smartphone,
  Laptop,
  Headphones,
  Monitor,
  Mouse,
  Keyboard,
  Camera,
  Watch
} from "lucide-react"

const categories = [
  { id: "all", name: "All Products", icon: Grid3X3, count: 156 },
  { id: "electronics", name: "Electronics", icon: Smartphone, count: 45 },
  { id: "computers", name: "Computers", icon: Laptop, count: 32 },
  { id: "gaming", name: "Gaming", icon: Monitor, count: 28 },
  { id: "accessories", name: "Accessories", icon: Headphones, count: 51 }
]

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    category: "electronics",
    price: 4999,
    originalPrice: 5499,
    rating: 4.8,
    reviews: 324,
    image: "/defaults/background.svg",
    badge: "9% Off",
    badgeType: "sale",
    inStock: true,
    features: ["256GB", "48MP Camera", "6.7 inch Display"]
  },
  {
    id: 2,
    name: "MacBook Pro M3 Laptop",
    category: "computers",
    price: 8999,
    originalPrice: null,
    rating: 4.9,
    reviews: 156,
    image: "/defaults/background.svg",
    badge: "New",
    badgeType: "new",
    inStock: true,
    features: ["16GB RAM", "512GB SSD", "Retina Display"]
  },
  {
    id: 3,
    name: "AirPods Pro Headphones",
    category: "accessories",
    price: 899,
    originalPrice: 1099,
    rating: 4.7,
    reviews: 892,
    image: "/defaults/background.svg",
    badge: "Best Seller",
    badgeType: "bestseller",
    inStock: true,
    features: ["Noise Cancellation", "Water Resistant", "30 Hours Playback"]
  },
  {
    id: 4,
    name: "PlayStation 5",
    category: "gaming",
    price: 2299,
    originalPrice: null,
    rating: 4.6,
    reviews: 567,
    image: "/defaults/background.svg",
    badge: null,
    badgeType: null,
    inStock: false,
    features: ["825GB SSD", "4K Gaming", "Ray Tracing"]
  },
  {
    id: 5,
    name: "Samsung 4K Display",
    category: "electronics",
    price: 1899,
    originalPrice: 2199,
    rating: 4.5,
    reviews: 234,
    image: "/defaults/background.svg",
    badge: "14% Off",
    badgeType: "sale",
    inStock: true,
    features: ["55 inch", "HDR10+", "Smart TV"]
  },
  {
    id: 6,
    name: "Logitech MX Master Mouse",
    category: "accessories",
    price: 349,
    originalPrice: null,
    rating: 4.8,
    reviews: 445,
    image: "/defaults/background.svg",
    badge: null,
    badgeType: null,
    inStock: true,
    features: ["Wireless", "70 Day Battery", "7 Buttons"]
  },
  {
    id: 7,
    name: "RGB Mechanical Keyboard",
    category: "accessories",
    price: 599,
    originalPrice: 699,
    rating: 4.4,
    reviews: 178,
    image: "/defaults/background.svg",
    badge: "14% Off",
    badgeType: "sale",
    inStock: true,
    features: ["Mechanical Keys", "RGB Lighting", "Water Resistant"]
  },
  {
    id: 8,
    name: "Canon EOS R5 Camera",
    category: "electronics",
    price: 12999,
    originalPrice: null,
    rating: 4.9,
    reviews: 89,
    image: "/defaults/background.svg",
    badge: "Professional",
    badgeType: "pro",
    inStock: true,
    features: ["45MP", "8K Video", "Image Stabilization"]
  },
  {
    id: 9,
    name: "Apple Watch Series 9",
    category: "electronics",
    price: 1599,
    originalPrice: null,
    rating: 4.7,
    reviews: 312,
    image: "/defaults/background.svg",
    badge: "New",
    badgeType: "new",
    inStock: true,
    features: ["GPS + Cellular", "Water Resistant", "Health Monitor"]
  }
]

const getBadgeColor = (type: string | null) => {
  switch (type) {
    case 'sale':
      return 'bg-red-500/10 text-red-400 border-red-500/20'
    case 'new':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    case 'bestseller':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
    case 'pro':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  }
}

export default function StorePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState("grid")
  const [cart, setCart] = useState<{[key: number]: number}>({})
  const [favorites, setFavorites] = useState<number[]>([])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const addToCart = (productId: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }))
  }

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const newCart = { ...prev }
      if (newCart[productId] > 1) {
        newCart[productId]--
      } else {
        delete newCart[productId]
      }
      return newCart
    })
  }

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const cartItemsCount = Object.values(cart).reduce((sum, count) => sum + count, 0)
  const cartTotal = Object.entries(cart).reduce((sum, [productId, count]) => {
    const product = products.find(p => p.id === parseInt(productId))
    return sum + (product ? product.price * count : 0)
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black p-6 -mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Online Store</h1>
                <p className="text-gray-400">Discover the best products at great prices</p>
              </div>
            </div>
            
            {/* Cart Button */}
            <Button className="relative bg-green-600 hover:bg-green-700">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Shopping Cart
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-[20px] h-5 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Products</p>
                    <p className="text-2xl font-bold text-blue-400">{products.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Categories</p>
                    <p className="text-2xl font-bold text-green-400">{categories.length - 1}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Grid3X3 className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">In Cart</p>
                    <p className="text-2xl font-bold text-yellow-400">{cartItemsCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Cart Total</p>
                    <p className="text-2xl font-bold text-purple-400">{cartTotal.toLocaleString()} ر.س</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900/50 border-gray-800 sticky top-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        selectedCategory === category.id 
                          ? "bg-green-600 hover:bg-green-700" 
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
                  placeholder="Search products..."
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
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-green-600 hover:bg-green-700" : "border-gray-600"}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-green-600 hover:bg-green-700" : "border-gray-600"}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {sortedProducts.map((product) => (
                <Card key={product.id} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="relative">
                      <div className="w-full h-48 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg mb-3 flex items-center justify-center">
                        <ShoppingBag className="h-16 w-16 text-green-400" />
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        {product.badge && (
                          <Badge className={getBadgeColor(product.badgeType)}>
                            {product.badge}
                          </Badge>
                        )}
                        {!product.inStock && (
                          <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                            Out of Stock
                          </Badge>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 p-0 border-gray-600 bg-gray-900/80 backdrop-blur-sm"
                          onClick={() => toggleFavorite(product.id)}
                        >
                          <Heart className={`h-3 w-3 ${
                            favorites.includes(product.id) ? 'text-red-400 fill-red-400' : 'text-gray-400'
                          }`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 p-0 border-gray-600 bg-gray-900/80 backdrop-blur-sm"
                        >
                          <Eye className="h-3 w-3 text-gray-400" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 p-0 border-gray-600 bg-gray-900/80 backdrop-blur-sm"
                        >
                          <Share2 className="h-3 w-3 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <CardTitle className="text-white text-lg group-hover:text-green-400 transition-colors">
                        {product.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-gray-400">{product.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Features */}
                    <div className="flex flex-wrap gap-1">
                      {product.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-400">
                        {product.price.toLocaleString()} ر.س
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.originalPrice.toLocaleString()} ر.س
                        </span>
                      )}
                    </div>

                    {/* Cart Controls */}
                    <div className="flex items-center gap-2">
                      {cart[product.id] ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(product.id)}
                            className="w-8 h-8 p-0 border-green-600 text-green-400 hover:bg-green-600/10"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-white font-medium px-3">
                            {cart[product.id]}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addToCart(product.id)}
                            className="w-8 h-8 p-0 border-green-600 text-green-400 hover:bg-green-600/10"
                            disabled={!product.inStock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:text-gray-400"
                          onClick={() => addToCart(product.id)}
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      )}
                    </div>

                    {/* Shipping Info */}
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-800">
                      <div className="flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        <span>Free Express Shipping</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        <span>Premium Warranty</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <RotateCcw className="h-3 w-3" />
                        <span>Hassle-Free Returns</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Products Found</h3>
                <p className="text-gray-400 mb-6">We couldn't find any products matching your search criteria. Try adjusting your filters or browse our complete collection.</p>
                <Button className="bg-green-600 hover:bg-green-700">
                  Explore All Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}