export function getTestTemplate(runner) {
  switch (runner) {
    case "Vitest":
      return {
        configFile: "vitest.config.ts",
        configContent: `import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
`,
        exampleFile: "src/__tests__/example.test.ts",
        exampleContent: `import { describe, it, expect } from "vitest";

describe("Example", () => {
  it("should work", () => {
    expect(1 + 1).toBe(2);
  });

  it("should handle strings", () => {
    expect("hello world").toContain("world");
  });

  it("should handle async", async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
});
`,
        scripts: {
          test: "vitest run",
          "test:watch": "vitest",
          "test:coverage": "vitest run --coverage",
        },
        deps: ["vitest"],
        devDeps: ["@vitest/coverage-v8"],
      };

    case "Jest":
      return {
        configFile: "jest.config.js",
        configContent: `export default {
  testEnvironment: "node",
  transform: {},
  extensionsToTreatAsEsm: [".ts"],
  collectCoverageFrom: ["src/**/*.{js,ts}", "!src/**/*.d.ts"],
  coverageReporters: ["text", "json", "html"],
};
`,
        exampleFile: "src/__tests__/example.test.js",
        exampleContent: `describe("Example", () => {
  it("should work", () => {
    expect(1 + 1).toBe(2);
  });

  it("should handle strings", () => {
    expect("hello world").toContain("world");
  });

  it("should handle async", async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
});
`,
        scripts: {
          test: "jest",
          "test:watch": "jest --watch",
          "test:coverage": "jest --coverage",
        },
        deps: ["jest"],
        devDeps: [],
      };

    case "Playwright":
      return {
        configFile: "playwright.config.ts",
        configContent: `import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
`,
        exampleFile: "e2e/example.spec.ts",
        exampleContent: `import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/./);
});

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toBeVisible();
});
`,
        scripts: {
          "test:e2e": "playwright test",
          "test:e2e:ui": "playwright test --ui",
        },
        deps: ["@playwright/test"],
        devDeps: [],
        postInstall: "npx playwright install",
      };

    case "pytest":
      return {
        configFile: "pyproject.toml",
        configContent: `[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_functions = ["test_*"]
addopts = "-v --tb=short"
`,
        exampleFile: "tests/test_example.py",
        exampleContent: `def test_addition():
    assert 1 + 1 == 2


def test_string():
    assert "world" in "hello world"


def test_list():
    items = [1, 2, 3]
    assert len(items) == 3
    assert 2 in items
`,
        scripts: {},
        deps: ["pytest", "pytest-asyncio"],
        devDeps: [],
      };

    default:
      return { files: [], deps: [] };
  }
}
