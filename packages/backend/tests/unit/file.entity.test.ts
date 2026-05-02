import { describe, it, expect } from "bun:test";
import {
  validateFileName,
  getFileExtension,
  formatFileSize,
} from "../../src/domain/entities/file.entity";

describe("File Entity", () => {
  describe("validateFileName", () => {
    it("should return true for valid file names", () => {
      expect(validateFileName("document.pdf")).toBe(true);
      expect(validateFileName("my-file.txt")).toBe(true);
      expect(validateFileName("image_001.png")).toBe(true);
      expect(validateFileName("file")).toBe(true);
    });

    it("should return false for empty names", () => {
      expect(validateFileName("")).toBe(false);
      expect(validateFileName("   ")).toBe(false);
    });

    it("should return false for names with invalid characters", () => {
      expect(validateFileName("file<name.txt")).toBe(false);
      expect(validateFileName("file>name.txt")).toBe(false);
      expect(validateFileName("file:name.txt")).toBe(false);
      expect(validateFileName("file/name.txt")).toBe(false);
    });
  });

  describe("getFileExtension", () => {
    it("should return correct extension", () => {
      expect(getFileExtension("document.pdf")).toBe("pdf");
      expect(getFileExtension("image.PNG")).toBe("png");
      expect(getFileExtension("archive.tar.gz")).toBe("gz");
    });

    it("should return empty string for files without extension", () => {
      expect(getFileExtension("README")).toBe("");
      expect(getFileExtension("file.")).toBe("");
    });
  });

  describe("formatFileSize", () => {
    it("should format bytes correctly", () => {
      expect(formatFileSize(0)).toBe("0 B");
      expect(formatFileSize(500)).toBe("500 B");
      expect(formatFileSize(1024)).toBe("1 KB");
      expect(formatFileSize(1536)).toBe("1.5 KB");
      expect(formatFileSize(1048576)).toBe("1 MB");
      expect(formatFileSize(1073741824)).toBe("1 GB");
    });
  });
});
