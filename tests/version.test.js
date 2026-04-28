import { describe, it, expect } from "vitest";
import { VERSION, NAME } from "../src/utils/version.js";

describe("version utility", () => {
  it("exports a valid semver version string", () => {
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });

  it("exports the correct package name", () => {
    expect(NAME).toBe("sgomez-cli");
  });

  it("version matches package.json", async () => {
    const { readFileSync } = await import("fs");
    const { join, dirname } = await import("path");
    const { fileURLToPath } = await import("url");
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const pkg = JSON.parse(
      readFileSync(join(__dirname, "..", "package.json"), "utf-8")
    );
    expect(VERSION).toBe(pkg.version);
  });
});
