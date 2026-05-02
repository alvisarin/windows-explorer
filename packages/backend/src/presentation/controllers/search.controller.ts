import { Elysia, t } from "elysia";
import type { FolderService } from "../../application/services/folder.service";
import type { FileService } from "../../application/services/file.service";

export class SearchController {
  constructor(
    private readonly folderService: FolderService,
    private readonly fileService: FileService
  ) {}

  createRoutes() {
    return new Elysia({ prefix: "/search" }).get(
      "/",
      async ({ query }) => {
        const searchQuery = query.q || "";
        if (searchQuery.length === 0) {
          return {
            success: true,
            data: { folders: [], files: [] },
          };
        }

        const [folders, files] = await Promise.all([
          this.folderService.searchFolders(searchQuery),
          this.fileService.searchFiles(searchQuery),
        ]);

        return {
          success: true,
          data: { folders, files },
        };
      },
      {
        query: t.Object({
          q: t.Optional(t.String()),
        }),
      }
    );
  }
}
