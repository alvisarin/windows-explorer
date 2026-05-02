import type { IFolderRepository } from "../../domain/repositories/folder.repository";
import type {
  FolderEntity,
  FolderTreeNode,
} from "../../domain/entities/folder.entity";

export class FolderService {
  constructor(private readonly folderRepository: IFolderRepository) {}

  async getAllFolders(): Promise<FolderEntity[]> {
    return this.folderRepository.findAll();
  }

  async getFolderTree(): Promise<FolderTreeNode[]> {
    const allFolders = await this.folderRepository.findAll();
    return this.buildTree(allFolders);
  }

  async getFolderById(id: string): Promise<FolderEntity | null> {
    return this.folderRepository.findById(id);
  }

  async getRootFolders(): Promise<FolderEntity[]> {
    return this.folderRepository.findByParentId(null);
  }

  async getChildren(folderId: string): Promise<FolderEntity[]> {
    return this.folderRepository.findChildren(folderId);
  }

  async searchFolders(query: string): Promise<FolderEntity[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }
    return this.folderRepository.search(query.trim());
  }

  private buildTree(folders: FolderEntity[]): FolderTreeNode[] {
    const folderMap = new Map<string, FolderTreeNode>();
    const rootNodes: FolderTreeNode[] = [];

    for (const folder of folders) {
      folderMap.set(folder.id, { ...folder, children: [] });
    }

    for (const folder of folders) {
      const node = folderMap.get(folder.id)!;
      if (folder.parentId && folderMap.has(folder.parentId)) {
        folderMap.get(folder.parentId)!.children.push(node);
      } else if (!folder.parentId) {
        rootNodes.push(node);
      }
    }

    const sortChildren = (nodes: FolderTreeNode[]) => {
      nodes.sort((a, b) => a.name.localeCompare(b.name));
      for (const node of nodes) {
        sortChildren(node.children);
      }
    };
    sortChildren(rootNodes);

    return rootNodes;
  }
}
