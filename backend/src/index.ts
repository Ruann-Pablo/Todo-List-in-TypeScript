import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/user";
import todoRouter from "./routes/todo";
import projectRouter from "./routes/project";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger";

dotenv.config();
const app = express();
app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"https://todo-list-in-typescript-3k8l.onrender.com",
		],
		credentials: true,
	})
);
app.use(express.json());

app.use("/users", userRouter);
app.use("/todos", todoRouter);
app.use("/projects", projectRouter);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/health", (_req, res) => res.json({ ok: true }));

const port = process.env.PORT;
<<<<<<< HEAD
app.listen(port, () =>
	console.log(
		`Server running on http://localhost:${port} - docs: http://localhost:${port}/docs`
	)
);
=======
app.listen(port, () => console.log(`Server running on port ${port}`));
>>>>>>> 2233a609b9e14010161f0f40df9e71e93f624203
