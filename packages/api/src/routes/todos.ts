import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { AzureEnv } from "../adapter.js";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

let todos: Todo[] = [];
let nextId = 1;

const createSchema = z.object({
  title: z.string().min(1),
});

const updateSchema = z.object({
  title: z.string().min(1),
  completed: z.boolean(),
});

const app = new Hono<AzureEnv>()
  .get("/", (c) => {
    c.env.context.log("Listing all todos");
    return c.json(todos);
  })
  .get("/:id", (c) => {
    const id = c.req.param("id");
    c.env.context.log(`Fetching todo ${id}`);
    const todo = todos.find((t) => t.id === id);
    if (!todo) {
      c.env.context.warn(`Todo ${id} not found`);
      return c.json({ message: "Not found" }, 404);
    }
    return c.json(todo);
  })
  .post("/", zValidator("json", createSchema), (c) => {
    const { title } = c.req.valid("json");
    const todo: Todo = {
      id: String(nextId++),
      title,
      completed: false,
    };
    todos.push(todo);
    c.env.context.log(`Created todo ${todo.id}: ${todo.title}`);
    return c.json(todo, 201);
  })
  .put("/:id", zValidator("json", updateSchema), (c) => {
    const id = c.req.param("id");
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) {
      c.env.context.warn(`Todo ${id} not found for update`);
      return c.json({ message: "Not found" }, 404);
    }
    const { title, completed } = c.req.valid("json");
    todos[index] = { ...todos[index], title, completed };
    c.env.context.log(`Updated todo ${id}`);
    return c.json(todos[index]);
  })
  .delete("/:id", (c) => {
    const id = c.req.param("id");
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) {
      c.env.context.warn(`Todo ${id} not found for deletion`);
      return c.json({ message: "Not found" }, 404);
    }
    const deleted = todos.splice(index, 1)[0];
    c.env.context.log(`Deleted todo ${id}`);
    return c.json(deleted);
  });

export default app;
