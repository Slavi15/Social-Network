import jwt from 'jsonwebtoken';
import env from '@/lib/env';
import redis from '@/config/redis';

class RedisService {
	private readonly BLACKLIST_PREFIX = 'bl_';

	async addToBlacklist(token: string): Promise<void> {
		try {
			const client = redis.getClient();
			let ttl: number;

			try {
				const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as { exp: number };
				ttl = decoded.exp - Math.floor(Date.now() / 1000);
			} catch (accessErr) {
				if (accessErr instanceof jwt.TokenExpiredError) {
					return;
				}

				try {
					const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { exp: number };
					ttl = decoded.exp - Math.floor(Date.now() / 1000);
				} catch (refreshErr) {
					if (refreshErr instanceof jwt.TokenExpiredError) {
						return;
					}
					throw refreshErr;
				}
			}

			if (ttl > 0) {
				await client.set(`${this.BLACKLIST_PREFIX}${token}`, '1', 'EX', ttl);
			}
		} catch (err) {
			console.error('Redis blacklist error:', err);
			throw err;
		}
	}

	async isBlacklisted(token: string): Promise<boolean> {
		try {
			const client = redis.getClient();
			const result = await client.exists(`${this.BLACKLIST_PREFIX}${token}`);
			return result === 1;
		} catch (err) {
			console.error('Redis blacklist check error:', err);
			return true;
		}
	}

	async clearBlacklist(): Promise<void> {
		try {
			const client = redis.getClient();
			const keys = await client.keys(`${this.BLACKLIST_PREFIX}*`);

			if (keys.length > 0) {
				await client.del(...keys);
			}
		} catch (err) {
			console.error('Redis clear blacklist error:', err);
			throw err;
		}
	}
}

export const redisService = new RedisService();