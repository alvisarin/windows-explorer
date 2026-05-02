import { describe, it, expect } from "bun:test";
import {
  validateFolderName,
  buildFolderPath,
} from "../../src/domain/entities/folder.entity";

describe("Folder Entity", () => {
  describe("validateFolderName", () => {
    it("should return true for valid folder names", () => {
      expect(validateFolderName("Documents")).toBe(true);
      expect(validateFolderName("My Folder")).toBe(true);
      expect(validateFolderName("folder-name")).toBe(true);
      expect(validateFolderName("folder_name")).toBe(true);
      expect(validateFolderName("folder.name")).toBe(true);
      expect(validateFolderName("123")).toBe(true);
    });

    it("should return false for empty names", () => {
      expect(validateFolderName("")).toBe(false);
      expect(validateFolderName("   ")).toBe(false);
    });

    it("should return false for names with invalid characters", () => {
      expect(validateFolderName("folder<name")).toBe(false);
      expect(validateFolderName("folder>name")).toBe(false);
      expect(validateFolderName("folder:name")).toBe(false);
      expect(validateFolderName('folder"name')).toBe(false);
      expect(validateFolderName("folder/name")).toBe(false);
      expect(validateFolderName("folder\\name")).toBe(false);
      expect(validateFolderName("folder|name")).toBe(false);
      expect(validateFolderName("folder?name")).toBe(false);
      expect(validateFolderName("folder*name")).toBe(false);
    });
  });

  describe("buildFolderPath", () => {
    it("should build root level path", () => {
      expect(buildFolderPath(null, "Documents")).toBe("/Documents");
    });

    it("should build nested path", () => {
      expect(buildFolderPath("/Documents", "Work")).toBe("/Documents/Work");
      expect(buildFolderPath("/Documents/Work", "Reports")).toBe(
        "/Documents/Work/Reports"
      );
    });
  });
});
