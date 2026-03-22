import { describe, it, expect } from "vitest";
import { createClient } from "../index.js";

const client = createClient();

describe("Todo CRUD API", () => {
  let createdId: string;

  it("POST /api/todos - should create a todo", async () => {
    const res = await client.api.todos.$post({
      json: { title: "Buy milk" },
    });
    expect(res.status).toBe(201);
    const todo = await res.json();
    expect(todo.title).toBe("Buy milk");
    expect(todo.completed).toBe(false);
    createdId = todo.id;
  });

  it("GET /api/todos - should list todos", async () => {
    const res = await client.api.todos.$get();
    expect(res.ok).toBe(true);
    const todos = await res.json();
    expect(todos.length).toBeGreaterThanOrEqual(1);
  });

  it("GET /api/todos/:id - should get a todo by id", async () => {
    const res = await client.api.todos[":id"].$get({
      param: { id: createdId },
    });
    expect(res.ok).toBe(true);
    const todo = await res.json();
    if ("title" in todo) {
      expect(todo.title).toBe("Buy milk");
    }
  });

  it("PUT /api/todos/:id - should update a todo", async () => {
    const res = await client.api.todos[":id"].$put({
      param: { id: createdId },
      json: { title: "Buy oat milk", completed: true },
    });
    expect(res.ok).toBe(true);
    const todo = await res.json();
    if ("title" in todo) {
      expect(todo.title).toBe("Buy oat milk");
      expect(todo.completed).toBe(true);
    }
  });

  it("DELETE /api/todos/:id - should delete a todo", async () => {
    const res = await client.api.todos[":id"].$delete({
      param: { id: createdId },
    });
    expect(res.ok).toBe(true);
  });

  it("GET /api/todos/:id - should return 404 for deleted todo", async () => {
    const res = await client.api.todos[":id"].$get({
      param: { id: createdId },
    });
    expect(res.status).toBe(404);
  });
});
