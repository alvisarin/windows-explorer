import {
  mysqlTable,
  varchar,
  timestamp,
  bigint,
  index,
} from "drizzle-orm/mysql-core";

export const folders = mysqlTable(
  "folders",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    parentId: varchar("parent_id", { length: 36 }),
    path: varchar("path", { length: 1000 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    parentIdIdx: index("idx_parent_id").on(table.parentId),
    pathIdx: index("idx_path").on(table.path),
  })
);

export const files = mysqlTable(
  "files",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    folderId: varchar("folder_id", { length: 36 }).notNull(),
    size: bigint("size", { mode: "number" }).default(0),
    mimeType: varchar("mime_type", { length: 100 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    folderIdIdx: index("idx_folder_id").on(table.folderId),
  })
);

export type Folder = typeof folders.$inferSelect;
export type NewFolder = typeof folders.$inferInsert;
export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
