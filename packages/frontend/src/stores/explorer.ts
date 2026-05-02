import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { FolderTreeNode, Folder, File, SearchResult } from "@/types";
import { folderApi, searchApi } from "@/services";

export const useExplorerStore = defineStore("explorer", () => {
  // State
  const folderTree = ref<FolderTreeNode[]>([]);
  const selectedFolderId = ref<string | null>(null);
  const expandedFolderIds = ref<Set<string>>(new Set());
  const currentFolders = ref<Folder[]>([]);
  const currentFiles = ref<File[]>([]);
  const searchQuery = ref("");
  const searchResults = ref<SearchResult | null>(null);
  const isLoading = ref(false);
  const isLoadingChildren = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const selectedFolder = computed(() => {
    if (!selectedFolderId.value) return null;
    return findFolderById(folderTree.value, selectedFolderId.value);
  });

  const isSearching = computed(() => searchQuery.value.length > 0);

  // Actions
  async function fetchFolderTree() {
    isLoading.value = true;
    error.value = null;
    try {
      folderTree.value = await folderApi.getTree();
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load folders";
      console.error("Failed to fetch folder tree:", e);
    } finally {
      isLoading.value = false;
    }
  }

  async function selectFolder(folderId: string) {
    selectedFolderId.value = folderId;
    searchQuery.value = "";
    searchResults.value = null;
    isLoadingChildren.value = true;
    error.value = null;

    try {
      const children = await folderApi.getChildren(folderId);
      currentFolders.value = children.folders;
      currentFiles.value = children.files;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load folder contents";
      console.error("Failed to fetch folder children:", e);
      currentFolders.value = [];
      currentFiles.value = [];
    } finally {
      isLoadingChildren.value = false;
    }
  }

  function clearSelection() {
    selectedFolderId.value = null;
    currentFolders.value = [];
    currentFiles.value = [];
    searchQuery.value = "";
    searchResults.value = null;
  }

  function toggleFolderExpanded(folderId: string) {
    if (expandedFolderIds.value.has(folderId)) {
      expandedFolderIds.value.delete(folderId);
    } else {
      expandedFolderIds.value.add(folderId);
    }
    // Trigger reactivity
    expandedFolderIds.value = new Set(expandedFolderIds.value);
  }

  function isFolderExpanded(folderId: string): boolean {
    return expandedFolderIds.value.has(folderId);
  }

  function expandFolder(folderId: string) {
    expandedFolderIds.value.add(folderId);
    expandedFolderIds.value = new Set(expandedFolderIds.value);
  }

  function collapseFolder(folderId: string) {
    expandedFolderIds.value.delete(folderId);
    expandedFolderIds.value = new Set(expandedFolderIds.value);
  }

  function expandAll() {
    const allIds = collectAllFolderIds(folderTree.value);
    expandedFolderIds.value = new Set(allIds);
  }

  function collapseAll() {
    expandedFolderIds.value = new Set();
  }

  async function search(query: string) {
    searchQuery.value = query;
    if (!query.trim()) {
      searchResults.value = null;
      return;
    }

    isLoading.value = true;
    error.value = null;
    try {
      searchResults.value = await searchApi.search(query);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Search failed";
      console.error("Search failed:", e);
      searchResults.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  function clearSearch() {
    searchQuery.value = "";
    searchResults.value = null;
  }

  // Helpers
  function findFolderById(
    nodes: FolderTreeNode[],
    id: string
  ): FolderTreeNode | null {
    for (const node of nodes) {
      if (node.id === id) return node;
      const found = findFolderById(node.children, id);
      if (found) return found;
    }
    return null;
  }

  function collectAllFolderIds(nodes: FolderTreeNode[]): string[] {
    const ids: string[] = [];
    for (const node of nodes) {
      ids.push(node.id);
      ids.push(...collectAllFolderIds(node.children));
    }
    return ids;
  }

  return {
    // State
    folderTree,
    selectedFolderId,
    expandedFolderIds,
    currentFolders,
    currentFiles,
    searchQuery,
    searchResults,
    isLoading,
    isLoadingChildren,
    error,
    // Getters
    selectedFolder,
    isSearching,
    // Actions
    fetchFolderTree,
    selectFolder,
    clearSelection,
    toggleFolderExpanded,
    isFolderExpanded,
    expandFolder,
    collapseFolder,
    expandAll,
    collapseAll,
    search,
    clearSearch,
  };
});
