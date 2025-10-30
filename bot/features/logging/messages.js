const { EmbedBuilder } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

class MessagesLogger {
  constructor(client, settingsManager) {
    this.client = client;
    this.settingsManager = settingsManager;
  }

  /**
   * Load server settings from manual-log-settings.json
   */
  async loadServerSettings(guildId) {
    try {
      const settingsPath = path.join(__dirname, '../../data/manual-log-settings.json');
      const data = await fs.readFile(settingsPath, 'utf8');
      const allSettings = JSON.parse(data);
      return allSettings[guildId] || null;
    } catch (error) {
      console.error('❌ Error loading manual log settings:', error);
      return null;
    }
  }

  /**
   * Log message deletions
   */
  async logMessageDelete(message) {
    try {
      // Ignore bot messages
      if (message.author?.bot) return;

      const serverSettings = await this.loadServerSettings(message.guild.id);
      
      if (!serverSettings?.enabled || !serverSettings.categories?.messages?.enabled) {
        return;
      }

      const channelId = serverSettings.categories.messages.channelId;
      if (!channelId) return;

      const logChannel = this.client.channels.cache.get(channelId);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setTitle('🗑️ Message Deleted')
        .setDescription(`A message from **${message.author?.tag || 'Unknown User'}** was deleted`)
        .setColor('#ff0000')
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' })
        .addFields([
          { name: '👤 Author', value: message.author ? `<@${message.author.id}>` : 'Unknown', inline: true },
          { name: '📍 Channel', value: `<#${message.channel.id}>`, inline: true },
          { name: '🆔 Message ID', value: message.id, inline: true }
        ]);

      // Add message content if available
      if (message.content && message.content.length > 0) {
        const content = message.content.length > 1024 ? 
          message.content.substring(0, 1021) + '...' : message.content;
        embed.addFields([
          { name: '📝 Message Content', value: `\`\`\`${content}\`\`\``, inline: false }
        ]);
      }

      // Add attachment information if present
      if (message.attachments && message.attachments.size > 0) {
        const attachmentList = message.attachments.map(att => `• ${att.name} (${att.size} bytes)`).join('\n');
        embed.addFields([
          { name: '📎 Attachments', value: attachmentList, inline: false }
        ]);
      }

      // Add embed information if present
      if (message.embeds && message.embeds.length > 0) {
        embed.addFields([
          { name: '📋 Embeds', value: `${message.embeds.length} embed(s)`, inline: true }
        ]);
      }

      // Add author avatar
      if (message.author?.displayAvatarURL) {
        embed.setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
      }

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Logged message delete for ${message.author?.tag} in ${message.guild.name}`);

    } catch (error) {
      console.error('❌ Error logging message delete:', error);
    }
  }

  /**
   * Log message edits
   */
  async logMessageEdit(oldMessage, newMessage) {
    try {
      // Ignore bot messages
      if (oldMessage.author?.bot || newMessage.author?.bot) return;

      // Ignore if content hasn't changed
      if (oldMessage.content === newMessage.content) return;

      const serverSettings = await this.loadServerSettings(newMessage.guild.id);
      
      if (!serverSettings?.enabled || !serverSettings.categories?.messages?.enabled) {
        return;
      }

      const channelId = serverSettings.categories.messages.channelId;
      if (!channelId) return;

      const logChannel = this.client.channels.cache.get(channelId);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setTitle('✏️ Message Edited')
        .setDescription(`A message from **${newMessage.author.tag}** was edited`)
        .setColor('#0099ff')
        .setThumbnail(newMessage.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' })
        .addFields([
          { name: '👤 Author', value: `<@${newMessage.author.id}>`, inline: true },
          { name: '📍 Channel', value: `<#${newMessage.channel.id}>`, inline: true },
          { name: '🆔 Message ID', value: newMessage.id, inline: true },
          { name: '🔗 Message Link', value: `[Go to Message](${newMessage.url})`, inline: true }
        ]);

      // Add old content
      if (oldMessage.content && oldMessage.content.length > 0) {
        const oldContent = oldMessage.content.length > 1024 ? 
          oldMessage.content.substring(0, 1021) + '...' : oldMessage.content;
        embed.addFields([
          { name: '📝 Old Content', value: `\`\`\`${oldContent}\`\`\``, inline: false }
        ]);
      }

      // Add new content
      if (newMessage.content && newMessage.content.length > 0) {
        const newContent = newMessage.content.length > 1024 ? 
          newMessage.content.substring(0, 1021) + '...' : newMessage.content;
        embed.addFields([
          { name: '📝 New Content', value: `\`\`\`${newContent}\`\`\``, inline: false }
        ]);
      }

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Logged message edit for ${newMessage.author.tag} in ${newMessage.guild.name}`);

    } catch (error) {
      console.error('❌ Error logging message edit:', error);
    }
  }

  /**
   * Log bulk message deletion
   */
  async logBulkMessageDelete(messages, channel) {
    try {
      const serverSettings = await this.loadServerSettings(channel.guild.id);
      
      if (!serverSettings?.enabled || !serverSettings.categories?.messages?.enabled) {
        return;
      }

      const channelId = serverSettings.categories.messages.channelId;
      if (!channelId) return;

      const logChannel = this.client.channels.cache.get(channelId);
      if (!logChannel) return;

      // Filter messages to exclude bot messages
      const userMessages = messages.filter(msg => msg.author && !msg.author.bot);
      
      if (userMessages.size === 0) return;

      const embed = new EmbedBuilder()
        .setTitle('🗑️ Multiple Messages Deleted')
        .setDescription(`**${userMessages.size}** messages were deleted from the channel`)
        .setColor('#ff0000')
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' })
        .addFields([
          { name: '📍 Channel', value: `<#${channel.id}>`, inline: true },
          { name: '📊 Message Count', value: userMessages.size.toString(), inline: true }
        ]);

      // Add information about authors
      const authors = new Map();
      userMessages.forEach(msg => {
        if (msg.author) {
          const count = authors.get(msg.author.id) || 0;
          authors.set(msg.author.id, count + 1);
        }
      });

      if (authors.size > 0) {
        const authorsList = Array.from(authors.entries())
          .map(([userId, count]) => `<@${userId}>: ${count} messages`)
          .slice(0, 10) // First 10 authors only
          .join('\n');
        
        embed.addFields([
          { name: '👥 Authors', value: authorsList, inline: false }
        ]);

        if (authors.size > 10) {
          embed.addFields([
            { name: '📝 Note', value: `And ${authors.size - 10} other authors...`, inline: false }
          ]);
        }
      }

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Logged bulk message delete (${userMessages.size} messages) in ${channel.guild.name}`);

    } catch (error) {
      console.error('❌ Error logging bulk message delete:', error);
    }
  }

  /**
   * Log message pin/unpin
   */
  async logMessagePin(message, action) {
    try {
      // Ignore bot messages
      if (message.author?.bot) return;

      const serverSettings = await this.loadServerSettings(message.guild.id);
      
      if (!serverSettings?.enabled || !serverSettings.categories?.messages?.enabled) {
        return;
      }

      const channelId = serverSettings.categories.messages.channelId;
      if (!channelId) return;

      const logChannel = this.client.channels.cache.get(channelId);
      if (!logChannel) return;

      const isPinned = action === 'pin';
      const embed = new EmbedBuilder()
        .setTitle(isPinned ? '📌 Message Pinned' : '📌 Message Unpinned')
        .setDescription(`A message from **${message.author.tag}** was ${isPinned ? 'pinned' : 'unpinned'}`)
        .setColor(isPinned ? '#00ff00' : '#ff9900')
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ text: 'Manual Log System' })
        .addFields([
          { name: '👤 Author', value: `<@${message.author.id}>`, inline: true },
          { name: '📍 Channel', value: `<#${message.channel.id}>`, inline: true },
          { name: '🆔 Message ID', value: message.id, inline: true },
          { name: '🔗 Message Link', value: `[Go to Message](${message.url})`, inline: true }
        ]);

      // Add message content if available
      if (message.content && message.content.length > 0) {
        const content = message.content.length > 1024 ? 
          message.content.substring(0, 1021) + '...' : message.content;
        embed.addFields([
          { name: '📝 Message Content', value: `\`\`\`${content}\`\`\``, inline: false }
        ]);
      }

      await logChannel.send({ embeds: [embed] });
      console.log(`✅ Logged message ${action} for ${message.author.tag} in ${message.guild.name}`);

    } catch (error) {
      console.error(`❌ Error logging message ${action}:`, error);
    }
  }
}

module.exports = MessagesLogger;