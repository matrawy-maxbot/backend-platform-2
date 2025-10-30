'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/hooks/useAuth'
import { useMembersWithPermissions } from '@/hooks/useMembersWithPermissions'
import { useSelectedServer } from '@/contexts/selected-server-context'
import { useAdminPermissions } from '@/hooks/useAdminPermissions'
import { ProtectedRoute } from '@/components/protected-route'
import { useActivityTracker } from '@/components/ActivityTracker'
import { useAdminBackups } from '@/hooks/useAdminBackups'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Users, 
  Shield, 
  Settings, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  UserX,
  Crown,
  MoreHorizontal,
  Plus,
  UserPlus,
  X,
  Eye,
  EyeOff,
  Database,
  Download,
  Upload
} from 'lucide-react'



// Current admins will be loaded from real data
const mockAdmins: any[] = []

const availablePermissions = [
  { id: 'manage_messages', label: 'Manage Messages', description: 'Delete and edit member messages' },
  { id: 'kick_members', label: 'Kick Members', description: 'Kick members from the server' },
  { id: 'ban_members', label: 'Ban Members', description: 'Ban members from the server' },
  { id: 'timeout_members', label: 'Timeout Members', description: 'Temporarily mute members' },
  { id: 'manage_channels', label: 'Manage Channels', description: 'Create and edit channels' },
  { id: 'manage_roles', label: 'Manage Roles', description: 'Create and edit member roles' }
]

function AdminsPage() {
  const { discordData, user } = useAuth()
  const { selectedServer } = useSelectedServer()
  const { members: membersWithPermissions, loading: membersLoading, error: membersError, refetch } = useMembersWithPermissions()
  const { isOwner, isCurrentAdmin, canAccessProtectedPages } = useAdminPermissions()
  const { trackAdminAdded, trackAdminRemoved, logActivity } = useActivityTracker()
  const { 
    backups, 
    stats, 
    loading: backupLoading, 
    createBackup, 
    restoreBackup, 
    cleanupOldBackups, 
    formatDate, 
    formatFileSize 
  } = useAdminBackups()
  
  const [admins, setAdmins] = useState([])
  const [currentAdmins, setCurrentAdmins] = useState<any[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [memberSearchTerm, setMemberSearchTerm] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null)
  const [isLoadingCurrentAdmins, setIsLoadingCurrentAdmins] = useState(true)
  const [showBackupModal, setShowBackupModal] = useState(false)

  // Load admins specific to the selected server from localStorage
  useEffect(() => {
    if (selectedServer?.id) {
      const savedAdmins = localStorage.getItem(`admins_${selectedServer.id}`)
      if (savedAdmins) {
        setAdmins(JSON.parse(savedAdmins))
      } else {
        setAdmins([])
      }
      setIsInitialized(true)
    }
  }, [selectedServer?.id])

  // Load current admins list from API
  useEffect(() => {
    const fetchCurrentAdmins = async () => {
      if (!selectedServer?.id) {
        setIsLoadingCurrentAdmins(false)
        return
      }

      try {
        setIsLoadingCurrentAdmins(true)
        const response = await fetch(`/api/servers/${selectedServer.id}/current-admins`)
        if (response.ok) {
          const data = await response.json()
          setCurrentAdmins(data)
        } else {
          console.error('Failed to fetch current admins')
          setCurrentAdmins([])
        }
      } catch (error) {
        console.error('Error fetching current admins:', error)
        setCurrentAdmins([])
      } finally {
        setIsLoadingCurrentAdmins(false)
      }
    }

    fetchCurrentAdmins()
  }, [selectedServer?.id])

  // Save admins to localStorage when they change
  useEffect(() => {
    if (selectedServer?.id && isInitialized) {
      localStorage.setItem(`admins_${selectedServer.id}`, JSON.stringify(admins))
    }
  }, [admins, selectedServer?.id, isInitialized])

  // Filter available members (those with kick/ban permissions who are not already admins)
  const availableMembers = membersWithPermissions.filter(member => 
    !currentAdmins.some(admin => (admin.discordId || admin.id) === member.id)
  )

  const filteredMembers = availableMembers.filter(member => 
    member.username.toLowerCase().includes(memberSearchTerm.toLowerCase())
  )

  const handleAddAdmin = async (member) => {
    if (!selectedServer?.id) return
    
    try {
      const response = await fetch(`/api/servers/${selectedServer.id}/current-admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discordId: member.id,
          username: member.username,
          discriminator: member.discriminator,
          avatar: member.avatar,
          permissions: ['manage_messages'] // Default permissions
        })
      })
      
      if (response.ok) {
        const newAdmin = await response.json()
        setCurrentAdmins([...currentAdmins, newAdmin])
        
        // Add to local list as well for compatibility with current code
        const localAdmin = {
          id: member.id,
          username: member.username,
          discriminator: member.discriminator,
          avatar: member.avatar,
          role: 'moderator',
          permissions: member.permissions.map(perm => {
            switch(perm) {
              case 'KICK_MEMBERS': return 'kick_members'
              case 'BAN_MEMBERS': return 'ban_members'
              case 'ADMINISTRATOR': return 'manage_messages'
              default: return 'manage_messages'
            }
          }),
          status: 'active',
          lastActivity: new Date().toISOString(),
          joinedAt: member.joinedAt || new Date().toISOString().split('T')[0]
        }
        setAdmins([...admins, localAdmin])
        
        // تسجيل النشاط
        await trackAdminAdded(member.username)
        
        // Refresh the available members list
        refetch()
      } else {
        console.error('Failed to add admin')
      }
    } catch (error) {
      console.error('Error adding admin:', error)
    }
  }


  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || admin.status === statusFilter
    const matchesRole = roleFilter === 'all' || admin.role === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })





  const handleDeleteAdmin = async (adminId) => {
    if (!selectedServer?.id) return
    
    try {
      const response = await fetch(`/api/servers/${selectedServer.id}/current-admins/${adminId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // العثور على المشرف المحذوف لتسجيل النشاط
        const deletedAdmin = currentAdmins.find(admin => (admin.discordId || admin.id) === adminId)
        
        // Remove from current admins list only
        setCurrentAdmins(currentAdmins.filter(admin => (admin.discordId || admin.id) !== adminId))
        
        // تسجيل النشاط
        if (deletedAdmin) {
          await trackAdminRemoved(deletedAdmin.username || deletedAdmin.discordId)
        }
        
        // Refresh the available members list
        refetch()
        console.log('Admin deleted successfully')
      } else {
        console.error('Failed to delete admin')
      }
    } catch (error) {
      console.error('Error deleting admin:', error)
    }
  }

  const handleToggleStatus = (adminId) => {
    setAdmins(admins.map(admin => 
      admin.id === adminId 
        ? { ...admin, status: admin.status === 'active' ? 'inactive' : 'active' }
        : admin
    ))
  }



  const totalAdmins = currentAdmins.length
  const activeAdmins = currentAdmins.filter(admin => admin.status === 'active').length
  const inactiveAdmins = totalAdmins - activeAdmins
  const lastActivity = currentAdmins.reduce((latest, admin) => {
    return new Date(admin.addedAt) > new Date(latest) ? admin.addedAt : latest
  }, currentAdmins[0]?.addedAt || new Date().toISOString())

  // Backup functions
  const handleCreateBackup = async () => {
    try {
      await createBackup()
      await logActivity('backup_created', 'Created admin backup')
    } catch (error) {
      console.error('Error creating backup:', error)
    }
  }

  const handleRestoreBackup = async (backupId: string) => {
    try {
      await restoreBackup(backupId)
      await logActivity('backup_restored', `Restored admin backup: ${backupId}`)
      // Refresh the page data after restore
      window.location.reload()
    } catch (error) {
      console.error('Error restoring backup:', error)
    }
  }

  const handleCleanupBackups = async () => {
    try {
      await cleanupOldBackups()
      await logActivity('backup_cleanup', 'Cleaned up old admin backups')
    } catch (error) {
      console.error('Error cleaning up backups:', error)
    }
  }

  // Show message if no server is selected
  if (!selectedServer) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6 lg:p-8 min-h-screen relative">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Server Selected</h2>
            <p className="text-gray-400">Please select a server from the servers page first</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* User Welcome Section */}
      {discordData && (
        <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-xl mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={discordData.avatarUrl}
                alt={discordData.username}
                className="w-16 h-16 rounded-full object-cover border-2 border-red-500/30"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/defaults/avatar.svg';
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome, {discordData.username}!</h2>
              <p className="text-gray-400">Manage Admins and Permissions</p>
            </div>
          </div>
        </div>
      )}

      {/* Data Backup Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Admin Statistics */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Admin Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Admins:</span>
              <span className="text-white font-semibold">{stats?.totalAdmins || admins.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Active:</span>
              <span className="text-green-400 font-semibold">{activeAdmins}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Recently Added:</span>
              <span className="text-blue-400 font-semibold">{stats?.recentlyAdded || 1}</span>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Users className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </CardContent>
        </Card>

        {/* Data Backup */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-400 text-sm">
              Automatic backups ensure your admin data is never lost.
            </p>
            <div className="flex justify-between">
              <span className="text-gray-400">Available Backups:</span>
              <span className="text-white font-semibold">{stats?.totalBackups || 0}</span>
            </div>
            <Button 
              onClick={() => setShowBackupModal(true)} 
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Database className="h-4 w-4 mr-2" />
              Manage Backups
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={handleCreateBackup} 
              disabled={backupLoading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Create Backup
            </Button>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              <Users className="h-4 w-4 mr-2" />
              Refresh Stats
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Protection Settings Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Control Panel Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-300 text-sm">
                  Only the server owner and members who have been granted access 
                  can enter this control panel. All members with access 
                  will automatically receive admin privileges within the Discord server.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <UserX className="h-5 w-5" />
                Access Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-300 text-sm">
                  The server owner can add or remove control panel access 
                  from any member at any time. When access is removed, the member 
                  will immediately lose the ability to access the control panel.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Management</h1>
        <p className="text-gray-400">Add or remove admins from the control panel</p>
        
        {/* Manager View Only Notice */}
        {!isOwner && isCurrentAdmin && (
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-400" />
              <p className="text-blue-400 font-medium">View Only Mode</p>
            </div>
            <p className="text-blue-300 text-sm mt-1">
              You can view the current admins list but cannot add or remove any of them. These permissions are available to the server owner only.
            </p>
          </div>
        )}
      </div>

      {/* Member Selection Section */}
      <div className="mb-8">
        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Select Admins</h3>
              <div className="w-20 h-1 bg-blue-500 mx-auto mb-4"></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Admins */}
            {currentAdmins.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Current Admins
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentAdmins.map((admin) => (
                    <div
                      key={admin.id}
                      className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12 ring-2 ring-blue-500">
                          <AvatarImage src={admin.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                            {admin.username.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">{admin.username}</p>
                          <p className="text-sm text-gray-400">#{admin.discriminator}</p>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => isOwner ? handleDeleteAdmin(admin.discordId || admin.id) : null}
                        variant="destructive"
                        size="sm"
                        disabled={!isOwner}
                        className={`transition-colors ${
                          isOwner 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-gray-600 cursor-not-allowed opacity-50'
                        }`}
                        title={!isOwner ? 'Admin can only view' : ''}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Add New Admin Section */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Add New Admin</h3>
                  <p className="text-sm text-gray-400">Select a member from the list to add as admin</p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={memberSearchTerm}
                  onChange={(e) => setMemberSearchTerm(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {membersLoading ? (
                  <div className="col-span-full text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3"></div>
                    <p className="text-gray-400">Loading members...</p>
                  </div>
                ) : membersError ? (
                  <div className="col-span-full text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                    <p className="text-red-400 mb-2">Error loading members</p>
                    <p className="text-gray-400 text-sm">{membersError}</p>
                  </div>
                ) : filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600 transition-all duration-200 hover:bg-gray-800/50"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar} alt={member.username} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                              {member.username.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                            member.isOnline ? 'bg-green-500' : 'bg-gray-500'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white truncate">{member.username}</h4>
                          <p className="text-xs text-gray-400 truncate">{member.discriminator}</p>
                        </div>
                      </div>
                      

                      
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            member.isOnline ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            'bg-gray-500/10 text-gray-400 border-gray-500/20'
                          }`}
                        >
                          {member.isOnline ? 'Online' : 'Offline'}
                        </Badge>
                        <Button
                          size="sm"
                          disabled={!isOwner}
                          className={`text-white border-0 h-8 px-3 ${
                            isOwner 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' 
                              : 'bg-gray-600 cursor-not-allowed opacity-50'
                          }`}
                          onClick={() => isOwner ? handleAddAdmin(member) : null}
                          title={!isOwner ? 'Admin can only view' : ''}
                        >
                          <Plus className="h-3 w-3 ml-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <Users className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No members available with administrative permissions</p>
                  </div>
                )}
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Current Admins Section */}
      {canAccessProtectedPages && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Current Admins</h2>
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              {isLoadingCurrentAdmins ? '...' : currentAdmins.length}
            </Badge>
          </div>
          
          {isLoadingCurrentAdmins ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading current admins...</p>
            </div>
          ) : currentAdmins.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No current admins</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {currentAdmins.map((admin) => (
                <div key={admin.id} className="bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12 border-2 border-yellow-400/50">
                          <AvatarImage 
                            src={admin.avatar ? `https://cdn.discordapp.com/avatars/${admin.discordId}/${admin.avatar}.png` : undefined} 
                            alt={admin.username} 
                          />
                          <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white font-semibold">
                            {admin.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 border-2 border-gray-900 rounded-full"></div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-semibold text-lg">{admin.username}</h3>
                          <span className="text-gray-400 text-sm">#{admin.discriminator}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                            Current Admin
                          </Badge>
                          <span className="text-gray-400 text-sm">Assigned on {new Date(admin.addedAt).toLocaleDateString('en')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAdmin(admin.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Admins</p>
                <p className="text-2xl font-bold text-white">{totalAdmins}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Admins</p>
                <p className="text-2xl font-bold text-green-400">{activeAdmins}</p>
              </div>
              <Shield className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Inactive Admins</p>
                <p className="text-2xl font-bold text-red-400">{inactiveAdmins}</p>
              </div>
              <UserX className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Last Activity</p>
                <p className="text-sm font-medium text-white">
                  {new Date(lastActivity).toLocaleDateString('en')}
                </p>
              </div>
              <Settings className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Available Backups</p>
                <p className="text-2xl font-bold text-purple-400">{stats?.totalBackups || 0}</p>
              </div>
              <Database className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Backup Management Modal */}
      <Dialog open={showBackupModal} onOpenChange={setShowBackupModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Backup Management
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Backup Actions */}
            <div className="flex gap-4">
              <Button 
                onClick={handleCreateBackup} 
                disabled={backupLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Create Backup
              </Button>
              <Button 
                onClick={handleCleanupBackups} 
                disabled={backupLoading}
                variant="outline" 
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Cleanup Old
              </Button>
            </div>

            {/* Backup List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Backups</h3>
              {backupLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="text-gray-400 mt-2">Loading backups...</p>
                </div>
              ) : backups && backups.length > 0 ? (
                <div className="grid gap-4">
                  {backups.map((backup) => (
                    <Card key={backup.id} className="bg-gray-800 border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <Database className="h-5 w-5 text-purple-400" />
                              <div>
                                <p className="font-medium text-white">{backup.filename}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                  <span>Created: {formatDate(backup.createdAt)}</span>
                                  <span>Size: {formatFileSize(backup.size)}</span>
                                  <span>Admins: {backup.adminCount}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleRestoreBackup(backup.id)} 
                            disabled={backupLoading}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Restore
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Database className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No backups available</p>
                  <p className="text-sm text-gray-500">Create your first backup to get started</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}

// Wrap the page with ProtectedRoute
function WrappedAdminsPage() {
  return (
    <ProtectedRoute>
      <AdminsPage />
    </ProtectedRoute>
  )
}

export { WrappedAdminsPage as default }