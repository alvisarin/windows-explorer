import type { FileEntity, CreateFileInput } from "../entities/file.entity";

export interface IFileRepository {
  findById(id: string): Promise<FileEntity | null>;
  findByFolderId(folderId: string): Promise<FileEntity[]>;
  search(query: string): Promise<FileEntity[]>;
  create(input: CreateFileInput & { id: string }): Promise<FileEntity>;
  update(id: string, data: Partial<FileEntity>): Promise<FileEntity | null>;
  delete(id: string): Promise<boolean>;
}
