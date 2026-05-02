import { describe, it, expect, mock, beforeEach } from "bun:test";
import { setActivePinia, createPinia } from "pinia";
import { useExplorerStore } from "./explorer";

const mockFolderApi = {
  getTree: mock(() => Promise.resolve([])),
  getChildren: mock(() => Promise.resolve({ folders: [], files: [] })),
};

const mockSearchApi = {
  search: mock(() => Promise.resolve({ folders: [], files: [] })),
};

mock.module("@/services/api", () => ({
  folderApi: mockFolderApi,
  searchApi: mockSearchApi,
}));

describe("Explorer Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockFolderApi.getTree.mockClear();
    mockFolderApi.getChildren.mockClear();
    mockSearchApi.search.mockClear();
  });

  describe("fetchFolderTree", () => {
    it("should fetch and store folder tree", async () => {
      const mockTree = [
        {
          id: "1",
          name: "Documents",
          parentId: null,
          path: "/Documents",
          children: [],
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
      ];

      mockFolderApi.getTree.mockResolvedValue(mockTree);

      const store = useExplorerStore();
      await store.fetchFolderTree();

      expect(store.folderTree).toEqual(mockTree);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });
  });

  describe("toggleFolderExpanded", () => {
    it("should toggle folder expansion state", () => {
      const store = useExplorerStore();

      expect(store.isFolderExpanded("1")).toBe(false);

      store.toggleFolderExpanded("1");
      expect(store.isFolderExpanded("1")).toBe(true);

      store.toggleFolderExpanded("1");
      expect(store.isFolderExpanded("1")).toBe(false);
    });
  });

  describe("expandAll / collapseAll", () => {
    it("should collapse all folders", () => {
      const store = useExplorerStore();
      store.expandFolder("1");
      store.expandFolder("2");
      store.collapseAll();

      expect(store.isFolderExpanded("1")).toBe(false);
      expect(store.isFolderExpanded("2")).toBe(false);
    });
  });

  describe("clearSelection", () => {
    it("should clear selection and search", () => {
      const store = useExplorerStore();
      store.clearSelection();

      expect(store.selectedFolderId).toBeNull();
      expect(store.currentFolders).toEqual([]);
      expect(store.currentFiles).toEqual([]);
      expect(store.searchQuery).toBe("");
    });
  });
});
