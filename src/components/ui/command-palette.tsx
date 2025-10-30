"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Search,
  Command,
  ArrowRight,
  Clock,
  Star,
  FileText,
  Users,
  Settings,
  Calculator,
  Calendar,
  Mail
} from "lucide-react"

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

const quickActions = [
  { icon: FileText, label: "Create new document", shortcut: "⌘N" },
  { icon: Users, label: "Invite team member", shortcut: "⌘I" },
  { icon: Calendar, label: "Schedule meeting", shortcut: "⌘M" },
  { icon: Settings, label: "Open settings", shortcut: "⌘," },
  { icon: Calculator, label: "Open calculator", shortcut: "⌘C" },
  { icon: Mail, label: "Send message", shortcut: "⌘E" }
]

const recentSearches = [
  "Project Alpha",
  "Team Dashboard",
  "User Analytics",
  "Revenue Report"
]

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, quickActions.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === "Enter") {
        e.preventDefault()
        // Handle action selection
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed left-1/2 top-1/4 -translate-x-1/2 w-full max-w-2xl">
        <div className={cn(
          "bg-gray-900 border border-gray-700 rounded-xl shadow-2xl",
          "overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
        )}>
          {/* Search Input */}
          <div className="flex items-center px-4 py-3 border-b border-gray-700">
            <Search className="h-5 w-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search for anything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={cn(
                "flex-1 bg-transparent text-white placeholder-gray-400",
                "focus:outline-none text-lg"
              )}
              autoFocus
            />
            <kbd className="px-2 py-1 text-xs bg-gray-800 border border-gray-600 rounded text-gray-400">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {query === "" ? (
              <>
                {/* Quick Actions */}
                <div className="p-2">
                  <div className="px-2 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Quick Actions
                  </div>
                  {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <button
                        key={index}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-lg",
                          "text-left transition-colors duration-150",
                          selectedIndex === index
                            ? "bg-blue-500/10 text-blue-400"
                            : "text-gray-300 hover:bg-gray-800/50"
                        )}
                        onClick={onClose}
                      >
                        <div className="flex items-center">
                          <Icon className="h-4 w-4 mr-3" />
                          <span className="text-sm">{action.label}</span>
                        </div>
                        <kbd className="px-1.5 py-0.5 text-xs bg-gray-800 border border-gray-600 rounded text-gray-400">
                          {action.shortcut}
                        </kbd>
                      </button>
                    )
                  })}
                </div>

                {/* Recent Searches */}
                <div className="p-2 border-t border-gray-700">
                  <div className="px-2 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Recent Searches
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      className={cn(
                        "w-full flex items-center px-3 py-2 rounded-lg",
                        "text-left transition-colors duration-150",
                        "text-gray-300 hover:bg-gray-800/50"
                      )}
                      onClick={onClose}
                    >
                      <Clock className="h-4 w-4 mr-3 text-gray-400" />
                      <span className="text-sm">{search}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              /* Search Results */
              <div className="p-2">
                <div className="px-2 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Search Results
                </div>
                <div className="text-center py-8 text-gray-400">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No results found for "{query}"</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-gray-700 bg-gray-800/30">
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <div className="flex items-center">
                <kbd className="px-1 py-0.5 bg-gray-700 border border-gray-600 rounded mr-1">↑</kbd>
                <kbd className="px-1 py-0.5 bg-gray-700 border border-gray-600 rounded mr-2">↓</kbd>
                navigate
              </div>
              <div className="flex items-center">
                <kbd className="px-1 py-0.5 bg-gray-700 border border-gray-600 rounded mr-2">↵</kbd>
                select
              </div>
            </div>
            <div className="text-xs text-gray-400">
              Powered by Command
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}