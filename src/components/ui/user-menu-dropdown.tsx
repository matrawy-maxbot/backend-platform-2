import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AvatarCrown from "@/components/ui/avatar-crown"
import { useAuth } from "@/hooks/useAuth"
import {
  Settings,
  LogOut,
  User,
  Activity,
} from "lucide-react"

export const UserMenuDropdownHeader = () => {
    const { session } = useAuth()
    
    return (
        <div className="p-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
                <div className="relative">
                <Avatar className="h-10 w-10">
                    <AvatarImage 
                        src={session?.user?.image || (session?.user?.discordId && session?.user?.avatar ? 
                          `https://cdn.discordapp.com/avatars/${session.user.discordId}/${session.user.avatar}.png` : 
                          '/defaults/avatar.svg')}
                        alt={session?.user?.name || "User"}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/defaults/avatar.svg';
                        }}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-yellow-500 text-white">
                    {session?.user?.username?.slice(0, 2).toUpperCase() || session?.user?.name?.slice(0, 2).toUpperCase() || 'JW'}
                    </AvatarFallback>
                </Avatar>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 h-3 w-3" style={{ left: '4%', bottom: '100%', top: 'unset', transform: 'rotate(-34deg)', width: '24px', zIndex: 1 }}>
                    <AvatarCrown />
                </div>
                </div>
                <div>
                <p className="text-white font-medium">{session?.user?.username || session?.user?.name || 'User'}</p>
                <p className="text-gray-400 text-sm">#{session?.user?.discordId?.slice(-4) || '3554'}</p>
                </div>
            </div>
        </div>
    )
}

export const UserMenuDropdownBody = () => {
    return (
        <div className="py-2">
            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                <User className="h-4 w-4 mr-3" />
                View profile
            </button>
            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                <Settings className="h-4 w-4 mr-3" />
                Manage subscriptions
            </button>
            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                <Activity className="h-4 w-4 mr-3" />
                View history
            </button>
            <div className="border-t border-gray-800 my-2"></div>
            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                <LogOut className="h-4 w-4 mr-3" />
                Logout
                <div className="ml-auto">
                    <kbd className="px-2 py-1 text-xs bg-gray-800 border border-gray-600 rounded">⌘Q</kbd>
                </div>
            </button>
        </div>
    )
}
