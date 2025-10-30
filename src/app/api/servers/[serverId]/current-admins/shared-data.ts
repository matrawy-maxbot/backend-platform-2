// ملف مشترك للبيانات التجريبية للأدمن الحاليين
// في التطبيق الحقيقي، ستأتي هذه البيانات من قاعدة البيانات

// استخدام let بدلاً من const لجعل البيانات قابلة للتعديل
export let mockCurrentAdmins: { [serverId: string]: any[] } = {
  // بيانات تجريبية
  '487547068475506698': [
    {
      id: '420285977940983808',
      discordId: '420285977940983808',
      username: 'AdminUser1',
      discriminator: '1234',
      avatar: 'avatar_hash_1',
      addedAt: '2024-01-01T00:00:00Z',
      addedBy: '123456789',
      permissions: ['manage_messages', 'kick_members', 'ban_members'],
      status: 'active'
    },
    {
      id: '461922887717224478',
      discordId: '461922887717224478',
      username: 'AdminUser2',
      discriminator: '5678',
      avatar: 'avatar_hash_2',
      addedAt: '2024-01-02T00:00:00Z',
      addedBy: '123456789',
      permissions: ['manage_messages', 'kick_members'],
      status: 'active'
    }
  ],
  '423067123225722891': [
    {
      id: '448666246766919680',
      discordId: '448666246766919680',
      username: 'TestAdmin1',
      discriminator: '0001',
      avatar: 'test_avatar_1',
      addedAt: '2024-01-03T00:00:00Z',
      addedBy: '123456789',
      permissions: ['manage_messages', 'kick_members'],
      status: 'active'
    },
    {
      id: '355930150657064960',
      discordId: '355930150657064960',
      username: 'TestAdmin2',
      discriminator: '0002',
      avatar: 'test_avatar_2',
      addedAt: '2024-01-04T00:00:00Z',
      addedBy: '123456789',
      permissions: ['manage_messages'],
      status: 'active'
    }
  ],
  '123456789': [
    {
      id: '1',
      discordId: '987654321',
      username: 'AdminUser1',
      discriminator: '1234',
      avatar: 'avatar_hash_1',
      addedAt: '2024-01-01T00:00:00Z',
      addedBy: '123456789',
      permissions: ['manage_messages', 'kick_members', 'ban_members'],
      status: 'active'
    }
  ]
}