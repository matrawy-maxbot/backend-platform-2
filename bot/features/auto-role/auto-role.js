// نظام الرتبة التلقائية للبوت
// Auto Role System for Discord Bot

/**
 * تعيين رتبة تلقائية للعضو الجديد
 * Assign auto role to new member
 * @param {GuildMember} member - العضو الجديد
 * @param {Object} settings - إعدادات السيرفر
 */
async function assignAutoRole(member, settings) {
  try {
    console.log(`🔍 [AUTO-ROLE] Checking auto role for ${member.user.tag} (${member.user.id}) in ${member.guild.name} (${member.guild.id})...`);
    console.log(`📋 [AUTO-ROLE] Settings received:`, JSON.stringify(settings?.members?.autoRole, null, 2));
    
    const autoRoleSettings = settings.members?.autoRole;
    
    if (!autoRoleSettings?.enabled || !autoRoleSettings.roleId) {
      console.log(`⚠️ [AUTO-ROLE] Auto role assignment disabled or no role specified for server ${member.guild.name}`);
      return { success: false, reason: 'Auto role disabled or no role ID' };
    }

    console.log(`🎭 [AUTO-ROLE] Auto role assignment enabled for server ${member.guild.name}`);
    console.log(`🔍 [AUTO-ROLE] Looking for role with ID: ${autoRoleSettings.roleId}`);
    
    const role = member.guild.roles.cache.get(autoRoleSettings.roleId);
    
    if (!role) {
      console.error(`❌ [AUTO-ROLE] Auto role not found: ${autoRoleSettings.roleId}`);
      console.error(`   The specified role may have been deleted. Please update auto role settings.`);
      console.log(`📋 [AUTO-ROLE] Available roles in server:`);
      member.guild.roles.cache.forEach(r => {
        console.log(`   - ${r.name} (ID: ${r.id})`);
      });
      return { success: false, reason: `Role ${autoRoleSettings.roleId} not found` };
    }

    console.log(`✅ [AUTO-ROLE] Found role: ${role.name} (${role.id})`);

    // فحص صلاحيات البوت
    // Check bot permissions
    const botMember = member.guild.members.me;
    const canManageRoles = botMember.permissions.has('ManageRoles');
    const botHighestRole = botMember.roles.highest;
    const canAssignThisRole = botHighestRole.position > role.position;
    
    console.log(`🔍 [AUTO-ROLE] Bot permissions check:`);
    console.log(`   - Manage Roles permission: ${canManageRoles}`);
    console.log(`   - Bot highest role: ${botHighestRole.name} (position: ${botHighestRole.position})`);
    console.log(`   - Target role: ${role.name} (position: ${role.position})`);
    console.log(`   - Can assign this role: ${canAssignThisRole}`);
    
    if (!canManageRoles) {
      console.error(`❌ [AUTO-ROLE] Bot missing 'Manage Roles' permission in server ${member.guild.name}`);
      console.error(`   Please give the bot 'Manage Roles' permission to enable auto role assignment.`);
      return { success: false, reason: 'Bot lacks ManageRoles permission' };
    }
    
    if (!canAssignThisRole) {
      console.error(`❌ [AUTO-ROLE] Bot role hierarchy insufficient in server ${member.guild.name}`);
      console.error(`   Bot's highest role (${botHighestRole.name}) must be above target role (${role.name})`);
      console.error(`   Please move the bot's role above the auto-assign role in server settings.`);
      return { success: false, reason: `Role hierarchy issue: ${role.name} is too high` };
    }
    
    console.log(`✅ [AUTO-ROLE] Role hierarchy check passed`);
    
    // Check if member already has the role
    if (member.roles.cache.has(autoRoleSettings.roleId)) {
      console.log(`ℹ️ [AUTO-ROLE] Member ${member.user.tag} already has role ${role.name}`);
      return { success: true, reason: 'Member already has role' };
    }
    
    console.log(`🔄 [AUTO-ROLE] Attempting to assign role ${role.name} to ${member.user.tag}...`);
    
    // تعيين الرتبة للعضو
    // Assign role to member
    await member.roles.add(role, 'Auto role assignment');
    console.log(`✅ [AUTO-ROLE] Auto role "${role.name}" assigned to ${member.user.tag}`);
    
    return { success: true, reason: 'Role assigned successfully' };
    
  } catch (error) {
    console.error(`❌ [AUTO-ROLE] Failed to assign auto role to ${member.user.tag}:`, error.message);
    console.error(`❌ [AUTO-ROLE] Error details:`, error);
    
    if (error.code === 50013) {
      console.error(`   This is a permissions error. Check bot role hierarchy and permissions.`);
    } else if (error.code === 10011) {
      console.error(`   The specified role no longer exists. Please update auto role settings.`);
    }
    
    return { success: false, reason: `Error: ${error.message}` };
  }
}

/**
 * التحقق من صحة إعدادات الرتبة التلقائية
 * Validate auto role settings
 * @param {Guild} guild - السيرفر
 * @param {string} roleId - معرف الرتبة
 * @returns {Object} نتيجة التحقق
 */
function validateAutoRoleSettings(guild, roleId) {
  const result = {
    valid: false,
    role: null,
    errors: []
  };

  if (!roleId) {
    result.errors.push('No role ID specified');
    return result;
  }

  const role = guild.roles.cache.get(roleId);
  if (!role) {
    result.errors.push(`Role with ID ${roleId} not found`);
    return result;
  }

  const botMember = guild.members.me;
  if (!botMember) {
    result.errors.push('Bot member not found in guild');
    return result;
  }

  const canManageRoles = botMember.permissions.has('ManageRoles');
  if (!canManageRoles) {
    result.errors.push('Bot missing Manage Roles permission');
  }

  const botHighestRole = botMember.roles.highest;
  const canAssignThisRole = botHighestRole.position > role.position;
  if (!canAssignThisRole) {
    result.errors.push(`Bot role hierarchy insufficient. Bot highest role: ${botHighestRole.name} (${botHighestRole.position}), Target role: ${role.name} (${role.position})`);
  }

  if (result.errors.length === 0) {
    result.valid = true;
    result.role = role;
  }

  return result;
}

/**
 * الحصول على قائمة بالرتب المتاحة للتعيين التلقائي
 * Get list of roles available for auto assignment
 * @param {Guild} guild - السيرفر
 * @returns {Array} قائمة الرتب المتاحة
 */
function getAvailableRoles(guild) {
  const botMember = guild.members.me;
  if (!botMember) return [];

  const botHighestRole = botMember.roles.highest;
  
  return guild.roles.cache
    .filter(role => 
      !role.managed && // ليست رتبة مُدارة بواسطة البوت أو التطبيقات
      role.id !== guild.id && // ليست رتبة @everyone
      botHighestRole.position > role.position // البوت يستطيع تعيينها
    )
    .map(role => ({
      id: role.id,
      name: role.name,
      color: role.color,
      position: role.position,
      memberCount: role.members.size
    }))
    .sort((a, b) => b.position - a.position); // ترتيب حسب الموقع (الأعلى أولاً)
}

module.exports = {
  assignAutoRole,
  validateAutoRoleSettings,
  getAvailableRoles
};