import session, { CookieOptions, SessionOptions } from 'express-session';
import { RedisStore } from 'connect-redis';
import redis from '@/config/redis';
import env from '@/lib/env';

const redisStore = new RedisStore({
    client: redis.getClient(),
    prefix: 'sess:',
    ttl: 86400,
    disableTouch: false
});

const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax' as const
};

const sessionConfig: SessionOptions = {
    store: redisStore,
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: cookieOptions,
    rolling: true
};

export default sessionConfig;