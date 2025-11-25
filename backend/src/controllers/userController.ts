import { Request, Response } from "express";
import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RegisterSchema, LoginSchema } from "../schemas/user.schema";
import { AuthRequest } from "../middleware/auth";
import { UpdateUserSchema } from "../schemas/user.schema";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

const USER_SELECT = {
	id: true,
	name: true,
	email: true,
};

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
			select: USER_SELECT,
		});

		const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
			expiresIn: "1d",
		});

		res.status(201).json({ 
			token, 
			user: {
				id: user.id,
				name: user.name,
				email: user.email
			} 
		});
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

export async function getMe(req: AuthRequest, res: Response) {
	if (!req.userId) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	try {
		const user = await prisma.user.findUnique({
			where: { id: req.userId },
			select: USER_SELECT,
		});

		if (!user) return res.status(404).json({ error: "User not found" });

		res.json(user);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch user" });
	}
}

export async function updateUser(req: AuthRequest, res: Response) {
	const id = Number(req.params.id);
	if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

	if (req.userId !== id) {
		return res.status(403).json({ error: "Forbidden" });
	}

	const parsed = UpdateUserSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ error: parsed.error });
	}

	const { name, email, password } = parsed.data;

	try {
		if (email) {
			const existing = await prisma.user.findUnique({ where: { email } });
			if (existing && existing.id !== id) {
				return res.status(400).json({ error: "Email already in use" });
			}
		}

		const data: any = {};
		if (name) data.name = name;
		if (email) data.email = email;
		if (password) {
			data.password = await bcrypt.hash(password, 10);
		}

		const user = await prisma.user.update({
			where: { id },
			data,
			select: USER_SELECT,
		});

		return res.json(user);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Failed to update user" });
	}
}


export async function deleteUser(req: AuthRequest, res: Response) {
	const id = Number(req.params.id);
	if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

	// Apenas o próprio usuário pode se deletar
	if (req.userId !== id) {
		return res.status(403).json({ error: "Forbidden" });
	}

	try {
		await prisma.user.delete({
			where: { id },
		});

		res.status(204).send();
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to delete user" });
	}
}
