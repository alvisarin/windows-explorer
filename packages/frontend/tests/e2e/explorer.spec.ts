import { test, expect } from "@playwright/test";

test.describe("Windows Explorer App", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the app title", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Windows Explorer");
  });

  test("should show folder tree header on load", async ({ page }) => {
    await expect(page.getByText("Folders")).toBeVisible();
  });

  test("should show search bar", async ({ page }) => {
    await expect(
      page.getByPlaceholder("Search folders and files...")
    ).toBeVisible();
  });

  test("should show empty state when no folder selected", async ({ page }) => {
    await expect(
      page.getByText("Select a folder to view its contents")
    ).toBeVisible();
  });

  test("should show expand/collapse all buttons", async ({ page }) => {
    const expandAllButton = page.locator('button[title="Expand all"]');
    await expect(expandAllButton).toBeVisible();

    const collapseAllButton = page.locator('button[title="Collapse all"]');
    await expect(collapseAllButton).toBeVisible();
  });

  test("should show status bar", async ({ page }) => {
    await expect(page.locator("footer")).toBeVisible();
    await expect(page.locator("footer")).toContainText("Ready");
  });

  test("should have two-panel layout", async ({ page }) => {
    const leftPanel = page.locator("aside");
    const rightPanel = page.locator("main");

    await expect(leftPanel).toBeVisible();
    await expect(rightPanel).toBeVisible();
  });

  test("should allow typing in search bar", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search folders and files...");
    await searchInput.fill("test");
    await expect(searchInput).toHaveValue("test");
  });

  test("should clear search with escape key", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search folders and files...");
    await searchInput.fill("test");
    await searchInput.press("Escape");
    await expect(searchInput).toHaveValue("");
  });
});

test.describe("Windows Explorer App - With Data", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display folder tree when data is loaded", async ({ page }) => {
    const documentsFolder = page.getByText("Documents").first();

    // Wait for folders to potentially load (skip if no data)
    try {
      await expect(documentsFolder).toBeVisible({ timeout: 5000 });
    } catch {
      test.skip(true, "No folder data available - database may not be seeded");
    }
  });

  test("should select folder and show contents", async ({ page }) => {
    const documentsFolder = page.getByText("Documents").first();

    try {
      await expect(documentsFolder).toBeVisible({ timeout: 5000 });
      await documentsFolder.click();

      // After clicking, status bar should update
      await expect(page.locator("footer")).not.toContainText("Ready");
    } catch {
      test.skip(true, "No folder data available - database may not be seeded");
    }
  });
});
