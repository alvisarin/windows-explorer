import { describe, it, expect, mock, beforeEach } from "bun:test";
import { FolderService } from "../../src/application/services/folder.service";
import type { IFolderRepository } from "../../src/domain/repositories/folder.repository";
import type { FolderEntity } from "../../src/domain/entities/folder.entity";

describe("FolderService", () => {
  let folderService: FolderService;
  let mockRepository: IFolderRepository;

  const mockFolders: FolderEntity[] = [
    {
      id: "1",
      name: "Documents",
      parentId: null,
      path: "/Documents",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: "Work",
      parentId: "1",
      path: "/Documents/Work",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      name: "Pictures",
      parentId: null,
      path: "/Pictures",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    mockRepository = {
      findAll: mock(() => Promise.resolve(mockFolders)),
      findById: mock((id: string) =>
        Promise.resolve(mockFolders.find((f) => f.id === id) || null)
      ),
      findByParentId: mock((parentId: string | null) =>
        Promise.resolve(mockFolders.filter((f) => f.parentId === parentId))
      ),
      findChildren: mock((id: string) =>
        Promise.resolve(mockFolders.filter((f) => f.parentId === id))
      ),
      search: mock((query: string) =>
        Promise.resolve(
          mockFolders.filter((f) =>
            f.name.toLowerCase().includes(query.toLowerCase())
          )
        )
      ),
      create: mock(() => Promise.resolve(mockFolders[0])),
      update: mock(() => Promise.resolve(null)),
      delete: mock(() => Promise.resolve(true)),
    };

    folderService = new FolderService(mockRepository);
  });

  describe("getAllFolders", () => {
    it("should return all folders", async () => {
      const result = await folderService.getAllFolders();
      expect(result).toEqual(mockFolders);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });
  });

  describe("getFolderTree", () => {
    it("should build folder tree correctly", async () => {
      const tree = await folderService.getFolderTree();
      expect(tree.length).toBe(2);
      expect(tree[0].name).toBe("Documents");
      expect(tree[0].children.length).toBe(1);
      expect(tree[0].children[0].name).toBe("Work");
      expect(tree[1].name).toBe("Pictures");
      expect(tree[1].children.length).toBe(0);
    });
  });

  describe("getFolderById", () => {
    it("should return folder by id", async () => {
      const result = await folderService.getFolderById("1");
      expect(result?.name).toBe("Documents");
    });

    it("should return null for non-existent id", async () => {
      const result = await folderService.getFolderById("999");
      expect(result).toBeNull();
    });
  });

  describe("getChildren", () => {
    it("should return children of a folder", async () => {
      const children = await folderService.getChildren("1");
      expect(children.length).toBe(1);
      expect(children[0].name).toBe("Work");
    });
  });

  describe("searchFolders", () => {
    it("should search folders by name", async () => {
      const results = await folderService.searchFolders("doc");
      expect(results.length).toBe(1);
      expect(results[0].name).toBe("Documents");
    });

    it("should return empty array for empty query", async () => {
      const results = await folderService.searchFolders("");
      expect(results).toEqual([]);
    });
  });
});
