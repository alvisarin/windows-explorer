export interface FolderEntity {
  id: string;
  name: string;
  parentId: string | null;
  path: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FolderTreeNode extends FolderEntity {
  children: FolderTreeNode[];
}

export interface CreateFolderInput {
  name: string;
  parentId?: string | null;
}

export function validateFolderName(name: string): boolean {
  if (!name || name.trim().length === 0) {
    return false;
  }
  // Disallow characters that are invalid in file systems
  const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
  return !invalidChars.test(name);
}

export function buildFolderPath(parentPath: string | null, name: string): string {
  if (!parentPath) {
    return `/${name}`;
  }
  return `${parentPath}/${name}`;
}
