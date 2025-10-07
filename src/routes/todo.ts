import { Router } from "express";
import {
	getTodos,
	getTodo,
	createTodo,
	updateTodo,
	deleteTodo,
	createProjectTodo,
} from "../controllers/todoController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", getTodos);
router.get("/:id", getTodo);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

router.post("/projects/:projectId", createProjectTodo);

export default router;
