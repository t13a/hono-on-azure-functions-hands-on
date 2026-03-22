# Hono on Azure Functions Hands-on

A hands-on environment for running [Hono](https://hono.dev/) on Azure Functions v4, featuring type-safe API clients powered by Hono RPC.

## Project Structure

This is a monorepo using npm workspaces.

```
packages/
  api/      ... Azure Functions + Hono server
  client/   ... Hono RPC client + E2E tests
```

### api package

- Runs a Hono app via Azure Functions v4 (Node.js) HTTP trigger
- Uses `@marplex/hono-azurefunc-adapter` for the adapter layer
- Validates requests with `@hono/zod-validator` + `zod`
- Provides an in-memory Todo CRUD API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/todos` | List all todos |
| GET | `/api/todos/:id` | Get a todo by ID |
| POST | `/api/todos` | Create a todo |
| PUT | `/api/todos/:id` | Update a todo |
| DELETE | `/api/todos/:id` | Delete a todo |

### client package

- References the `AppType` type exported from the `api` package
- Generates a type-safe RPC client with `hc<AppType>()`
- Verifies behavior through E2E tests using vitest

## Prerequisites

- Node.js 18+
- [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local) v4

## Setup

```bash
npm install
npm run build
```

## Start the Server

```bash
npm start
```

The server starts at `http://localhost:7071`.

## Run Tests

With the server running, open another terminal and run:

```bash
npm test
```

## Type Safety with Hono RPC

When you define routes in the `api` package, response types and request parameter types are automatically inferred.

```typescript
// Server side: route definition
const app = new Hono()
  .post("/", zValidator("json", z.object({ title: z.string() })), (c) => {
    return c.json({ id: "1", title: "...", completed: false }, 201);
  });

export type AppType = typeof app;
```

```typescript
// Client side: type-safe client
import { hc } from "hono/client";
import type { AppType } from "api/src/app.js";

const client = hc<AppType>("http://localhost:7071");

// Request json and response types are fully auto-completed
const res = await client.api.todos.$post({
  json: { title: "Buy milk" },
});
const todo = await res.json(); // { id: string, title: string, completed: boolean }
```

TypeScript Project References (`references` in `tsconfig.json`) enable IDE type completions without building first.
