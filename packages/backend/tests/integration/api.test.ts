import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { Elysia } from "elysia";
import { FolderService, FileService } from "../../src/application";
import { createV1Routes } from "../../src/presentation";
import type { IFolderRepository } from "../../src/domain/repositories/folder.repository";
import type { IFileRepository } from "../../src/domain/repositories/file.repository";
import type { FolderEntity } from "../../src/domain/entities/folder.entity";
import type { FileEntity } from "../../src/domain/entities/file.entity";

// In-memory mock repositories for testing
const mockFolders: FolderEntity[] = [
  {
    id: "folder-1",
    name: "Documents",
    parentId: null,
    path: "/Documents",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "folder-2",
    name: "Work",
    parentId: "folder-1",
    path: "/Documents/Work",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockFiles: FileEntity[] = [
  {
    id: "file-1",
    name: "report.pdf",
    folderId: "folder-2",
    size: 1024,
    mimeType: "application/pdf",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockFolderRepo: IFolderRepository = {
  findAll: () => Promise.resolve(mockFolders),
  findById: (id) => Promise.resolve(mockFolders.find((f) => f.id === id) || null),
  findByParentId: (parentId) =>
    Promise.resolve(mockFolders.filter((f) => f.parentId === parentId)),
  findChildren: (id) =>
    Promise.resolve(mockFolders.filter((f) => f.parentId === id)),
  search: (query) =>
    Promise.resolve(
      mockFolders.filter((f) =>
        f.name.toLowerCase().includes(query.toLowerCase())
      )
    ),
  create: (input) =>
    Promise.resolve({ ...input, createdAt: new Date(), updatedAt: new Date() } as FolderEntity),
  update: () => Promise.resolve(null),
  delete: () => Promise.resolve(true),
};

const mockFileRepo: IFileRepository = {
  findById: (id) => Promise.resolve(mockFiles.find((f) => f.id === id) || null),
  findByFolderId: (folderId) =>
    Promise.resolve(mockFiles.filter((f) => f.folderId === folderId)),
  search: (query) =>
    Promise.resolve(
      mockFiles.filter((f) =>
        f.name.toLowerCase().includes(query.toLowerCase())
      )
    ),
  create: (input) =>
    Promise.resolve({ ...input, createdAt: new Date(), updatedAt: new Date() } as FileEntity),
  update: () => Promise.resolve(null),
  delete: () => Promise.resolve(true),
};

describe("API Integration Tests", () => {
  let app: Elysia;

  beforeAll(() => {
    const folderService = new FolderService(mockFolderRepo);
    const fileService = new FileService(mockFileRepo);

    app = new Elysia()
      .group("/api", (app) => app.use(createV1Routes(folderService, fileService)));
  });

  describe("GET /api/v1/folders", () => {
    it("should return folder tree", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/v1/folders")
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBe(1); // Only root folder
      expect(data.data[0].name).toBe("Documents");
      expect(data.data[0].children.length).toBe(1);
    });
  });

  describe("GET /api/v1/folders/:id", () => {
    it("should return folder by id", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/v1/folders/folder-1")
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe("Documents");
    });

    it("should return 404 for non-existent folder", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/v1/folders/non-existent")
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });
  });

  describe("GET /api/v1/folders/:id/children", () => {
    it("should return children folders and files", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/v1/folders/folder-2/children")
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.folders).toEqual([]);
      expect(data.data.files.length).toBe(1);
      expect(data.data.files[0].name).toBe("report.pdf");
    });
  });

  describe("GET /api/v1/search", () => {
    it("should search folders and files", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/v1/search?q=doc")
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.folders.length).toBe(1);
      expect(data.data.folders[0].name).toBe("Documents");
    });

    it("should return empty results for no match", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/v1/search?q=xyz123")
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.folders).toEqual([]);
      expect(data.data.files).toEqual([]);
    });
  });
});
