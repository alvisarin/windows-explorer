import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { FolderService, FileService } from "./application";
import { FolderRepositoryImpl, FileRepositoryImpl } from "./infrastructure";
import { createV1Routes } from "./presentation";

// Initialize repositories
const folderRepository = new FolderRepositoryImpl();
const fileRepository = new FileRepositoryImpl();

// Initialize services
const folderService = new FolderService(folderRepository);
const fileService = new FileService(fileRepository);

// Create and configure the app
const app = new Elysia()
  .use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .get("/", () => ({
    name: "Windows Explorer API",
    version: "1.0.0",
    documentation: "/api/v1",
  }))
  .get("/health", () => ({
    status: "healthy",
    timestamp: new Date().toISOString(),
  }))
  .group("/api", (app) => app.use(createV1Routes(folderService, fileService)))
  .onError(({ code, error, set }) => {
    console.error(`Error [${code}]:`, error);

    if (code === "NOT_FOUND") {
      set.status = 404;
      return { success: false, error: "Route not found" };
    }

    if (code === "VALIDATION") {
      set.status = 400;
      return { success: false, error: "Validation error", details: error.message };
    }

    set.status = 500;
    return { success: false, error: "Internal server error" };
  })
  .listen(Number(process.env.PORT) || 3000);

console.log(
  `🦊 Windows Explorer API running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
