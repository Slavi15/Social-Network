import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpCode } from '@/exceptions/AppError';
import env from '@/lib/env';
import { redisService } from '@/services/tokens';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

		if (!token) {
			return res.status(HttpCode.UNAUTHORIZED).json({ error: 'No token provided' });
		}

		if (await redisService.isBlacklisted(token)) {
			return res.status(HttpCode.UNAUTHORIZED).json({ error: 'Token revoked' });
		}

		const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as jwt.JwtPayload;
		req.body.user = decoded;
		next();
	} catch (err) {
		res.status(HttpCode.UNAUTHORIZED).json({ error: 'Invalid token' });
	}
};