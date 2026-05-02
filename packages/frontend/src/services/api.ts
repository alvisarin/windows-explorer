import type {
  FolderTreeNode,
  FolderChildren,
  SearchResult,
  ApiResponse,
} from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP error: ${response.status}`);
  }

  const result: ApiResponse<T> = await response.json();
  if (!result.success) {
    throw new Error(result.error || "Unknown error");
  }

  return result.data as T;
}

export const folderApi = {
  getTree(): Promise<FolderTreeNode[]> {
    return fetchApi<FolderTreeNode[]>("/folders");
  },

  getChildren(folderId: string): Promise<FolderChildren> {
    return fetchApi<FolderChildren>(`/folders/${folderId}/children`);
  },
};

export const searchApi = {
  search(query: string): Promise<SearchResult> {
    const encoded = encodeURIComponent(query);
    return fetchApi<SearchResult>(`/search?q=${encoded}`);
  },
};
