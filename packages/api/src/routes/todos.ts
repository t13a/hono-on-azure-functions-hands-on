import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

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

const app = new Hono()
  .get("/", (c) => {
    return c.json(todos);
  })
  .get("/:id", (c) => {
    const todo = todos.find((t) => t.id === c.req.param("id"));
    if (!todo) {
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
    return c.json(todo, 201);
  })
  .put("/:id", zValidator("json", updateSchema), (c) => {
    const id = c.req.param("id");
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) {
      return c.json({ message: "Not found" }, 404);
    }
    const { title, completed } = c.req.valid("json");
    todos[index] = { ...todos[index], title, completed };
    return c.json(todos[index]);
  })
  .delete("/:id", (c) => {
    const id = c.req.param("id");
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) {
      return c.json({ message: "Not found" }, 404);
    }
    const deleted = todos.splice(index, 1)[0];
    return c.json(deleted);
  });

export default app;
