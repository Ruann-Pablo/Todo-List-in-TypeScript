import { Request, Response } from "express";
import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RegisterSchema, LoginSchema } from "../schemas/user.schema";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function register(req: Request, res: Response) {
	const parsed = RegisterSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ error: parsed.error });
	}
	const { name, email, password } = parsed.data;

	try {
		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing)
			return res.status(400).json({ error: "Email already registered" });

		const hashed = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: { name, email, password: hashed },
			select: { id: true, name: true, email: true },
		});

		res.status(201).json(user);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to register user" });
	}
}

export async function login(req: Request, res: Response) {
	const parsed = LoginSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ error: parsed.error });
	}
	const { email, password } = parsed.data;

	try {
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user)
			return res.status(400).json({ error: "Invalid credentials" });

		const valid = await bcrypt.compare(password, user.password);
		if (!valid)
			return res.status(400).json({ error: "Invalid credentials" });

		const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
			expiresIn: "1d",
		});

		res.json({
			token,
			user: { id: user.id, name: user.name, email: user.email },
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to login" });
	}
}
