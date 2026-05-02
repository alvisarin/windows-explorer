import { eq, like, isNull } from "drizzle-orm";
import type { IFolderRepository } from "../../domain/repositories/folder.repository";
import type { FolderEntity, CreateFolderInput } from "../../domain/entities/folder.entity";
import { db } from "../database/connection";
import { folders } from "../database/schema";

export class FolderRepositoryImpl implements IFolderRepository {
  async findAll(): Promise<FolderEntity[]> {
    const result = await db.select().from(folders).orderBy(folders.path);
    return result.map(this.mapToEntity);
  }

  async findById(id: string): Promise<FolderEntity | null> {
    const result = await db.select().from(folders).where(eq(folders.id, id));
    return result[0] ? this.mapToEntity(result[0]) : null;
  }

  async findByParentId(parentId: string | null): Promise<FolderEntity[]> {
    const result = parentId
      ? await db.select().from(folders).where(eq(folders.parentId, parentId)).orderBy(folders.name)
      : await db.select().from(folders).where(isNull(folders.parentId)).orderBy(folders.name);
    return result.map(this.mapToEntity);
  }

  async findChildren(id: string): Promise<FolderEntity[]> {
    const result = await db
      .select()
      .from(folders)
      .where(eq(folders.parentId, id))
      .orderBy(folders.name);
    return result.map(this.mapToEntity);
  }

  async search(query: string): Promise<FolderEntity[]> {
    const searchPattern = `%${query}%`;
    const result = await db
      .select()
      .from(folders)
      .where(like(folders.name, searchPattern))
      .orderBy(folders.name)
      .limit(50);
    return result.map(this.mapToEntity);
  }

  async create(
    input: CreateFolderInput & { id: string; path: string }
  ): Promise<FolderEntity> {
    await db.insert(folders).values({
      id: input.id,
      name: input.name,
      parentId: input.parentId ?? null,
      path: input.path,
    });

    const created = await this.findById(input.id);
    if (!created) {
      throw new Error("Failed to create folder");
    }
    return created;
  }

  async update(id: string, data: Partial<FolderEntity>): Promise<FolderEntity | null> {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.parentId !== undefined) updateData.parentId = data.parentId;
    if (data.path !== undefined) updateData.path = data.path;

    if (Object.keys(updateData).length > 0) {
      await db.update(folders).set(updateData).where(eq(folders.id, id));
    }

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(folders).where(eq(folders.id, id));
    return result[0]?.affectedRows > 0;
  }

  private mapToEntity(row: typeof folders.$inferSelect): FolderEntity {
    return {
      id: row.id,
      name: row.name,
      parentId: row.parentId,
      path: row.path,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
