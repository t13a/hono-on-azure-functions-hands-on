import { Hono } from "hono";
import type { AzureEnv } from "./adapter.js";
import todos from "./routes/todos.js";

const app = new Hono<AzureEnv>().route("/api/todos", todos);

export type AppType = typeof app;
export default app;
