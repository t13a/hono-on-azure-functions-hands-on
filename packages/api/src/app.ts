import { Hono } from "hono";
import todos from "./routes/todos.js";

const app = new Hono().route("/api/todos", todos);

export type AppType = typeof app;
export default app;
