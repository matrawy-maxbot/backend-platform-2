// مخزن البيانات العام للأدمن الحاليين
// يستخدم متغير global لضمان المشاركة عبر جميع الطلبات

interface AdminData {
  id: string;
  discordId: string;
  username: string;
  discriminator: string;
  avatar: string;
  addedAt: string;
  addedBy: string;
  permissions: string[];
  status: string;
}

interface GlobalAdminStore {
  currentAdmins: { [serverId: string]: AdminData[] };
}

// استخدام global object لضمان المشاركة عبر جميع الطلبات
declare global {
  var adminStore: GlobalAdminStore | undefined;
}

// تهيئة البيانات إذا لم تكن موجودة
if (!global.adminStore) {
  global.adminStore = {
    currentAdmins: {
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
        },
        {
          id: '726837802406248539',
          discordId: '726837802406248539',
          username: 'shytnbsly',
          discriminator: '0',
          avatar: 'shytnbsly_avatar',
          addedAt: '2025-10-17T12:47:44.969Z',
          addedBy: '123456789',
          permissions: ['manage_messages', 'kick_members', 'ban_members'],
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
  };
}

// دالة لإعادة تهيئة البيانات التجريبية
function initializeMockData() {
  if (!global.adminStore) {
    global.adminStore = { currentAdmins: {} };
  }
  
  // إضافة البيانات التجريبية فقط إذا لم تكن موجودة
  if (!global.adminStore.currentAdmins['487547068475506698']) {
    global.adminStore.currentAdmins['487547068475506698'] = [
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
    ];
  }
  
  if (!global.adminStore.currentAdmins['423067123225722891']) {
    global.adminStore.currentAdmins['423067123225722891'] = [
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
      },
      {
        id: '726837802406248539',
        discordId: '726837802406248539',
        username: 'shytnbsly',
        discriminator: '0',
        avatar: 'shytnbsly_avatar',
        addedAt: '2025-10-17T12:47:44.969Z',
        addedBy: '123456789',
        permissions: ['manage_messages', 'kick_members', 'ban_members'],
        status: 'active'
      }
    ];
  }
}

// دوال للوصول للبيانات وتعديلها
export function getCurrentAdmins(serverId: string): AdminData[] {
  initializeMockData(); // تأكد من وجود البيانات التجريبية
  return global.adminStore?.currentAdmins[serverId] || [];
}

export function addCurrentAdmin(serverId: string, admin: AdminData): boolean {
  initializeMockData(); // تأكد من وجود البيانات التجريبية
  
  if (!global.adminStore?.currentAdmins[serverId]) {
    global.adminStore!.currentAdmins[serverId] = [];
  }
  
  // التحقق من عدم وجود الأدمن مسبقاً لتجنب التكرار
  const existingAdmin = global.adminStore!.currentAdmins[serverId].find(
    existingAdmin => existingAdmin.discordId === admin.discordId || existingAdmin.id === admin.id
  );
  
  if (existingAdmin) {
    console.log('Admin already exists:', admin.discordId);
    return false; // الأدمن موجود مسبقاً
  }
  
  global.adminStore!.currentAdmins[serverId].push(admin);
  console.log('Admin added successfully:', admin.discordId);
  return true; // تم إضافة الأدمن بنجاح
}

export function removeCurrentAdmin(serverId: string, adminId: string): boolean {
  // لا نستدعي initializeMockData هنا لتجنب إعادة تهيئة البيانات المحذوفة
  
  if (!global.adminStore?.currentAdmins[serverId]) {
    console.log(`No admins found for server: ${serverId}`);
    return false;
  }
  
  console.log(`Before deletion for server ${serverId}:`, global.adminStore.currentAdmins[serverId].map(a => a.discordId));
  
  const initialLength = global.adminStore.currentAdmins[serverId].length;
  global.adminStore.currentAdmins[serverId] = global.adminStore.currentAdmins[serverId].filter(
    admin => admin.id !== adminId && admin.discordId !== adminId
  );
  
  console.log(`After deletion for server ${serverId}:`, global.adminStore.currentAdmins[serverId].map(a => a.discordId));
  console.log(`Deletion successful: ${global.adminStore.currentAdmins[serverId].length < initialLength}`);
  
  return global.adminStore.currentAdmins[serverId].length < initialLength;
}

export function getAllCurrentAdmins(): { [serverId: string]: AdminData[] } {
  return global.adminStore?.currentAdmins || {};
}