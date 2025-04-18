import Redis from 'ioredis';
import env from '@/lib/env';

class RedisConnection {
  private client: Redis;
  private static instance: RedisConnection;
  private _isConnected = false;

  private constructor() {
    this.client = new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
      retryStrategy: (times) => Math.min(times * 100, 5000)
    });

    this.client.on('error', (err) => console.error('Redis Client Error:', err));

    this.client.on('connect', () => console.log('Redis connecting...'));
    this.client.on('ready', () => {
      console.log('Redis connected');
      this._isConnected = true;
    });

    this.client.on('end', () => {
      console.log('Redis disconnected');
      this._isConnected = false;
    });

    this.client.on('reconnecting', () => {
      this._isConnected = false;
    });
  }

  public static getInstance(): RedisConnection {
    if (!RedisConnection.instance) {
      RedisConnection.instance = new RedisConnection();
    }
    return RedisConnection.instance;
  }

  public getClient(): Redis {
    return this.client;
  }

  public async disconnect(): Promise<void> {
    if (this._isConnected) {
      await this.client.quit();
      this._isConnected = false;
    }
  }

  public isConnected(): boolean {
    return this._isConnected;
  }
}

const redis = RedisConnection.getInstance();
export default redis;