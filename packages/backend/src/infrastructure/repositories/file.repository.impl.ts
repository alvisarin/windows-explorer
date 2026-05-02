import { eq, like } from "drizzle-orm";
import type { IFileRepository } from "../../domain/repositories/file.repository";
import type { FileEntity, CreateFileInput } from "../../domain/entities/file.entity";
import { db } from "../database/connection";
import { files } from "../database/schema";

export class FileRepositoryImpl implements IFileRepository {
  async findById(id: string): Promise<FileEntity | null> {
    const result = await db.select().from(files).where(eq(files.id, id));
    return result[0] ? this.mapToEntity(result[0]) : null;
  }

  async findByFolderId(folderId: string): Promise<FileEntity[]> {
    const result = await db
      .select()
      .from(files)
      .where(eq(files.folderId, folderId))
      .orderBy(files.name);
    return result.map(this.mapToEntity);
  }

  async search(query: string): Promise<FileEntity[]> {
    const searchPattern = `%${query}%`;
    const result = await db
      .select()
      .from(files)
      .where(like(files.name, searchPattern))
      .orderBy(files.name)
      .limit(50);
    return result.map(this.mapToEntity);
  }

  async create(input: CreateFileInput & { id: string }): Promise<FileEntity> {
    await db.insert(files).values({
      id: input.id,
      name: input.name,
      folderId: input.folderId,
      size: input.size ?? 0,
      mimeType: input.mimeType ?? null,
    });

    const created = await this.findById(input.id);
    if (!created) {
      throw new Error("Failed to create file");
    }
    return created;
  }

  async update(id: string, data: Partial<FileEntity>): Promise<FileEntity | null> {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.folderId !== undefined) updateData.folderId = data.folderId;
    if (data.size !== undefined) updateData.size = data.size;
    if (data.mimeType !== undefined) updateData.mimeType = data.mimeType;

    if (Object.keys(updateData).length > 0) {
      await db.update(files).set(updateData).where(eq(files.id, id));
    }

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(files).where(eq(files.id, id));
    return result[0]?.affectedRows > 0;
  }

  private mapToEntity(row: typeof files.$inferSelect): FileEntity {
    return {
      id: row.id,
      name: row.name,
      folderId: row.folderId,
      size: row.size ?? 0,
      mimeType: row.mimeType,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
