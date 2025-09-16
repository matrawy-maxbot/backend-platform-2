import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../../../config/security.config.js';
import fetch from 'node-fetch';

class AuthService {
  async generateToken(discordToken) {
    return jwt.sign({ discordToken }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }

  async loginWithDiscord(discordToken) {
    try {
      // التحقق من صحة توكن Discord
      const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
          'Authorization': `Bearer ${discordToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Invalid Discord token.');
      }

      const discordUser = await response.json();
      
      // إنشاء JWT token يحتوي على Discord token
      const token = await this.generateToken(discordToken);
      
      return { 
        user: {
          id: discordUser.id,
          username: discordUser.username,
          discriminator: discordUser.discriminator,
          avatar: discordUser.avatar,
          email: discordUser.email,
          role: 'user'
        }, 
        token 
      };
    } catch (error) {
      throw new Error('Discord authentication failed: ' + error.message);
    }
  }

  // دالة للتحقق من صحة Discord token
  async validateDiscordToken(discordToken) {
    try {
      const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
          'Authorization': `Bearer ${discordToken}`
        }
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export default new AuthService();