import type { FolderEntity, CreateFolderInput } from "../entities/folder.entity";

export interface IFolderRepository {
  findAll(): Promise<FolderEntity[]>;
  findById(id: string): Promise<FolderEntity | null>;
  findByParentId(parentId: string | null): Promise<FolderEntity[]>;
  findChildren(id: string): Promise<FolderEntity[]>;
  search(query: string): Promise<FolderEntity[]>;
  create(input: CreateFolderInput & { id: string; path: string }): Promise<FolderEntity>;
  update(id: string, data: Partial<FolderEntity>): Promise<FolderEntity | null>;
  delete(id: string): Promise<boolean>;
}
