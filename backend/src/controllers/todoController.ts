import { Response } from "express";
import { prisma } from "../prisma";
import { AuthRequest } from "../middleware/auth";
import { CreateTodoSchema, UpdateTodoSchema } from "../schemas/todo.schema";

const TODO_SELECT = {
	id: true,
	title: true,
	description: true,
	done: true,
	createdAt: true,
	updatedAt: true,
	projectId: true,
};

export async function getTodos(req: AuthRequest, res: Response) {
	try {
		const todos = await prisma.todo.findMany({
			where: { userId: req.userId },
			orderBy: { createdAt: "desc" },
			select: TODO_SELECT,
		});
		res.json(todos);
	} catch (error) {
		console.error("Error fetching todos:", error);
		res.status(500).json({ error: "Failed to fetch todos" });
	}
}

export async function getTodo(req: AuthRequest, res: Response) {
	const id = Number(req.params.id);
	if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

	try {
		const todo = await prisma.todo.findFirst({
			where: { id, userId: req.userId },
			select: TODO_SELECT,
		});

		if (!todo) return res.status(404).json({ error: "Todo not found" });

		res.json(todo);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch todo" });
	}
}

export async function createProjectTodo(req: AuthRequest, res: Response) {
	const projectId = Number(req.params.projectId);
	if (isNaN(projectId)) {
		return res.status(400).json({ error: "Invalid projectId" });
	}

	const parsed = CreateTodoSchema.omit({ projectId: true }).safeParse(
		req.body
	);
	if (!parsed.success) {
		return res.status(400).json({ error: parsed.error });
	}
	const { title, description } = parsed.data;

	try {
		const project = await prisma.project.findFirst({
			where: { id: projectId, userId: req.userId },
		});
		if (!project) {
			return res.status(404).json({ error: "Project not found" });
		}

		const todo = await prisma.todo.create({
			data: {
				title,
				description,
				projectId,
				userId: req.userId!,
			},
			select: TODO_SELECT,
		});

		res.status(201).json(todo);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to create todo" });
	}
}

export async function createTodo(req: AuthRequest, res: Response) {
	const parsed = CreateTodoSchema.omit({ projectId: true }).safeParse(
		req.body
	);
	if (!parsed.success) {
		return res.status(400).json({ error: parsed.error });
	}
	const { title, description } = parsed.data;

	try {
		const todo = await prisma.todo.create({
			data: {
				title,
				description,
				projectId: null,
				userId: req.userId!,
			},
			select: TODO_SELECT,
		});

		res.status(201).json(todo);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to create todo" });
	}
}

export async function updateTodo(req: AuthRequest, res: Response) {
	const id = Number(req.params.id);
	if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

	const parsed = UpdateTodoSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ error: parsed.error });
	}
	const { title, description, done } = parsed.data;

	try {
		const updated = await prisma.todo.updateMany({
			where: { id, userId: req.userId },
			data: { title, description, done },
		});

		if (updated.count === 0)
			return res.status(404).json({ error: "Todo not found" });

		const todo = await prisma.todo.findUnique({
			where: { id },
			select: TODO_SELECT,
		});

		res.json(todo);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to update todo" });
	}
}

export async function deleteTodo(req: AuthRequest, res: Response) {
	const id = Number(req.params.id);
	if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

	try {
		const deleted = await prisma.todo.deleteMany({
			where: { id, userId: req.userId },
		});

		if (deleted.count === 0)
			return res.status(404).json({ error: "Todo not found" });

		res.status(204).send();
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to delete todo" });
	}
}
