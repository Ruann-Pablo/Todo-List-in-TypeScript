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
app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/todos", todoRouter);
app.use("/projects", projectRouter);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/health", (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () =>
	console.log(
		`Server running on http://localhost:${port} - docs: http://localhost:${port}/docs`
	)
);
