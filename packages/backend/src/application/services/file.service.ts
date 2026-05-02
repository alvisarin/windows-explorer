import type { IFileRepository } from "../../domain/repositories/file.repository";
import type { FileEntity } from "../../domain/entities/file.entity";

export class FileService {
  constructor(private readonly fileRepository: IFileRepository) {}

  async getFileById(id: string): Promise<FileEntity | null> {
    return this.fileRepository.findById(id);
  }

  async getFilesByFolder(folderId: string): Promise<FileEntity[]> {
    return this.fileRepository.findByFolderId(folderId);
  }

  async searchFiles(query: string): Promise<FileEntity[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }
    return this.fileRepository.search(query.trim());
  }
}
