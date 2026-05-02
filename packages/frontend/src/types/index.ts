export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  path: string;
  createdAt: string;
  updatedAt: string;
}

export interface FolderTreeNode extends Folder {
  children: FolderTreeNode[];
}

export interface File {
  id: string;
  name: string;
  folderId: string;
  size: number;
  mimeType: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FolderChildren {
  folders: Folder[];
  files: File[];
}

export interface SearchResult {
  folders: Folder[];
  files: File[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
