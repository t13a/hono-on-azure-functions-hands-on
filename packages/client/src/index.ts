import { hc } from "hono/client";
import type { AppType } from "api/src/app.js";

export function createClient(baseUrl = "http://localhost:7071") {
  return hc<AppType>(baseUrl);
}
