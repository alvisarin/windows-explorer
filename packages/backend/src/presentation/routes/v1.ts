import { Elysia } from "elysia";
import { FolderController, SearchController } from "../controllers";
import type { FolderService } from "../../application/services/folder.service";
import type { FileService } from "../../application/services/file.service";

export function createV1Routes(
  folderService: FolderService,
  fileService: FileService
) {
  const folderController = new FolderController(folderService, fileService);
  const searchController = new SearchController(folderService, fileService);

  return new Elysia({ prefix: "/v1" })
    .use(folderController.createRoutes())
    .use(searchController.createRoutes());
}
