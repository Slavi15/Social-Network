import redisClient from '@/config/redis';
import jwt from 'jsonwebtoken';

class RedisService {

  async addToBlacklist(token: string): Promise<void> {
    try {
      const decoded = jwt.decode(token) as jwt.JwtPayload;
      if (!decoded?.exp) return;

      const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

      if (expiresIn > 0) {
        await redisClient.set(`bl_${token}`, 'blacklisted', {
          EX: expiresIn
        });
      }
    } catch (err) {
      console.error('Blacklist error:', err);
    }
  }

  async isBlacklisted(token: string): Promise<boolean> {
    try {
      const result = await redisClient.get(`bl_${token}`);
      return result === 'blacklisted';
    } catch (err) {
      console.error('Blacklist check error:', err);
      return false;
    }
  }

}

export default new RedisService();