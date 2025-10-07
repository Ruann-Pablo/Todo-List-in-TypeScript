import { Router } from "express";
import {
	register,
	login,
	getMe,
	updateUser,
	deleteUser,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authMiddleware, getMe);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
