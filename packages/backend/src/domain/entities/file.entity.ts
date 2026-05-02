export interface FileEntity {
  id: string;
  name: string;
  folderId: string;
  size: number;
  mimeType: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFileInput {
  name: string;
  folderId: string;
  size?: number;
  mimeType?: string;
}

export function validateFileName(name: string): boolean {
  if (!name || name.trim().length === 0) {
    return false;
  }
  // Disallow characters that are invalid in file systems
  const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
  return !invalidChars.test(name);
}

export function getFileExtension(name: string): string {
  const lastDot = name.lastIndexOf(".");
  if (lastDot === -1 || lastDot === name.length - 1) {
    return "";
  }
  return name.slice(lastDot + 1).toLowerCase();
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
