import { app } from "@azure/functions";
import { azureHonoHandler } from "./adapter.js";
import honoApp from "./app.js";

app.http("httpTrigger", {
  methods: ["GET", "POST", "PUT", "DELETE"],
  authLevel: "anonymous",
  route: "{*proxy}",
  handler: azureHonoHandler(honoApp),
});
