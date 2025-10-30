import { NextRequest, NextResponse } from 'next/server'

// Sample activities to seed the database
const sampleActivities = [
  {
    user: "Ahmed Mohamed",
    userId: "123456789",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
    action: "Created new advertisement",
    section: "Ads",
    details: "Created advertisement titled 'Welcome New Members'",
    type: "create",
    severity: "info"
  },
  {
    user: "Sarah Ahmed",
    userId: "987654321",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
    action: "Updated protection settings",
    section: "Protection",
    details: "Enabled spam protection",
    type: "update",
    severity: "success"
  },
  {
    user: "Mohamed Ali",
    userId: "123456789",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
    action: "Added new admin member",
    section: "Admins",
    details: "Added user 'NewModerator' as moderator",
    type: "create",
    severity: "warning"
  },
  {
    user: "System",
    userId: "system",
    action: "Updated members list",
    section: "Members",
    details: "Automatically updated member statistics",
    type: "system",
    severity: "info"
  },
  {
    user: "Fatima Hassan",
    userId: "123456789",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
    action: "Updated welcome message",
    section: "Members",
    details: "Updated welcome message for new members",
    type: "update",
    severity: "info"
  },
  {
    user: "Admin",
    userId: "123456789",
    avatar: "/defaults/avatar.svg",
    action: "Enabled auto reply",
    section: "Auto Reply",
    details: "Enabled auto reply for specified keywords",
    type: "update",
    severity: "success"
  },
  {
    user: "System",
    userId: "system",
    action: "Failed to update data",
    section: "System",
    details: "Failed to connect to database",
    type: "error",
    severity: "error"
  },
  {
    user: "Moderator",
    userId: "987654321",
    avatar: "/defaults/avatar.svg",
    action: "Deleted expired advertisement",
    section: "Ads",
    details: "Deleted expired 'Special Offer' advertisement",
    type: "delete",
    severity: "warning"
  },
  {
    user: "System",
    userId: "system",
    action: "Backup completed",
    section: "System",
    details: "Daily backup completed successfully",
    type: "system",
    severity: "success"
  },
  {
    user: "Omar Hassan",
    userId: "456789123",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
    action: "Updated server settings",
    section: "System",
    details: "Changed server timezone and language settings",
    type: "update",
    severity: "info"
  }
]

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const count = parseInt(searchParams.get('count') || '10')
    const serverId = searchParams.get('serverId')

    // Add sample activities
    const activitiesToAdd = sampleActivities.slice(0, count).map(activity => ({
      ...activity,
      serverId: serverId || undefined,
      metadata: {
        seeded: true,
        seedTime: new Date().toISOString()
      }
    }))

    const results = []
    
    for (const activity of activitiesToAdd) {
      const response = await fetch(`${request.nextUrl.origin}/api/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activity),
      })

      if (response.ok) {
        const result = await response.json()
        results.push(result.log)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Added ${results.length} sample activities`,
      activities: results
    })
  } catch (error) {
    console.error('Error seeding activities:', error)
    return NextResponse.json({ error: 'Failed to seed activities' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Activity seeding endpoint",
    usage: "POST /api/logs/seed?count=10&serverId=optional",
    description: "Adds sample activity data for testing purposes"
  })
}