import { Elysia, t } from "elysia";
import type { FolderService } from "../../application/services/folder.service";
import type { FileService } from "../../application/services/file.service";

export class FolderController {
  constructor(
    private readonly folderService: FolderService,
    private readonly fileService: FileService
  ) {}

  createRoutes() {
    return new Elysia({ prefix: "/folders" })
      .get("/", async () => {
        const tree = await this.folderService.getFolderTree();
        return { success: true, data: tree };
      })
      .get(
        "/:id",
        async ({ params, set }) => {
          const folder = await this.folderService.getFolderById(params.id);
          if (!folder) {
            set.status = 404;
            return { success: false, error: "Folder not found" };
          }
          return { success: true, data: folder };
        },
        {
          params: t.Object({
            id: t.String(),
          }),
        }
      )
      .get(
        "/:id/children",
        async ({ params }) => {
          const [folders, files] = await Promise.all([
            this.folderService.getChildren(params.id),
            this.fileService.getFilesByFolder(params.id),
          ]);
          return {
            success: true,
            data: {
              folders,
              files,
            },
          };
        },
        {
          params: t.Object({
            id: t.String(),
          }),
        }
      );
  }
}
