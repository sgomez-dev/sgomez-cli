import { describe, it, expect } from "vitest";
import { detectProject } from "../src/utils/detect.js";

describe("detectProject", () => {
  it("returns an object with all expected fields", () => {
    const result = detectProject();
    expect(result).toHaveProperty("cwd");
    expect(result).toHaveProperty("hasPackageJson");
    expect(result).toHaveProperty("hasTsConfig");
    expect(result).toHaveProperty("framework");
    expect(result).toHaveProperty("language");
    expect(result).toHaveProperty("packageManager");
  });

  it("detects the current project has a package.json", () => {
    const result = detectProject();
    expect(result.hasPackageJson).toBe(true);
  });

  it("detects npm as the package manager for this project", () => {
    const result = detectProject();
    expect(result.packageManager).toBe("npm");
  });

  it("cwd is a non-empty string", () => {
    const result = detectProject();
    expect(typeof result.cwd).toBe("string");
    expect(result.cwd.length).toBeGreaterThan(0);
  });

  it("language is a string", () => {
    const result = detectProject();
    expect(["javascript", "typescript", "python", "go"]).toContain(
      result.language
    );
  });
});
