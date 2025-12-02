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
		origin: ["https://todo-list-in-type-script.vercel.app/"],
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
app.listen(port, () => console.log(`Server running on port ${port}`));
