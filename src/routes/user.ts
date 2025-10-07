import { Router } from "express";
import {
	register,
	login,
	getUsers,
	getUser,
	updateUser,
	deleteUser,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUser);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
