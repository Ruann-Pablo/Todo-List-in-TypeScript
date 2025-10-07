import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export interface AuthRequest extends Request {
	userId?: number;
}

export function authMiddleware(
	req: AuthRequest,
	res: Response,
	next: NextFunction
) {
	const header = req.headers.authorization;
	if (!header) return res.status(401).json({ error: "No token provided" });

	const parts = header.split(" ");
	if (parts.length !== 2)
		return res.status(401).json({ error: "Invalid token" });

	const [, token] = parts;
	try {
		const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
		req.userId = payload.userId;
		next();
	} catch {
		res.status(401).json({ error: "Invalid token" });
	}
}
