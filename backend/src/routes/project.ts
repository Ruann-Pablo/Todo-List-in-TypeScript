import { Router } from "express";
import {
	listProjects,
	getProject,
	createProject,
	updateProject,
	deleteProject,
} from "../controllers/projectController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", listProjects);
router.get("/:id", getProject);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
