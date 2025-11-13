import { Response } from "express";
import { prisma } from "../prisma";
import { AuthRequest } from "../middleware/auth";
import {
	CreateProjectSchema,
	UpdateProjectSchema,
} from "../schemas/project.schema";

const PROJECT_SELECT = {
	id: true,
	name: true,
	description: true,
	createdAt: true,
	updatedAt: true,
};

export async function listProjects(req: AuthRequest, res: Response) {
	try {
		const projects = await prisma.project.findMany({
			where: { userId: req.userId },
			orderBy: { createdAt: "desc" },
			select: PROJECT_SELECT,
		});
		res.json(projects);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch projects" });
	}
}

export async function getProject(req: AuthRequest, res: Response) {
	const id = Number(req.params.id);
	if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

	try {
		const project = await prisma.project.findFirst({
			where: { id, userId: req.userId },
			include: {
				todos: {
					select: {
						id: true,
						title: true,
						description: true,
						done: true,
						createdAt: true,
						updatedAt: true,
					},
				},
			},
		});

		if (!project)
			return res.status(404).json({ error: "Project not found" });

		res.json(project);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch project" });
	}
}

export async function createProject(req: AuthRequest, res: Response) {
	const parsed = CreateProjectSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ error: parsed.error });
	}
	const { name, description } = parsed.data;

	try {
		const project = await prisma.project.create({
			data: {
				name,
				description,
				userId: req.userId!,
			},
			select: PROJECT_SELECT,
		});

		res.status(201).json(project);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to create project" });
	}
}

export async function updateProject(req: AuthRequest, res: Response) {
	const id = Number(req.params.id);
	if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

	const parsed = UpdateProjectSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ error: parsed.error });
	}
	const { name, description } = parsed.data;

	try {
		const updated = await prisma.project.updateMany({
			where: { id, userId: req.userId },
			data: { name, description },
		});

		if (updated.count === 0)
			return res.status(404).json({ error: "Project not found" });

		const project = await prisma.project.findUnique({
			where: { id },
			select: PROJECT_SELECT,
		});

		res.json(project);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to update project" });
	}
}

export async function deleteProject(req: AuthRequest, res: Response) {
	const id = Number(req.params.id);
	if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

	try {
		const deleted = await prisma.project.deleteMany({
			where: { id, userId: req.userId },
		});

		if (deleted.count === 0)
			return res.status(404).json({ error: "Project not found" });

		res.status(204).send();
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to delete project" });
	}
}
