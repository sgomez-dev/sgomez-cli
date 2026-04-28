import { describe, it, expect } from "vitest";
import { getDockerTemplate } from "../src/templates/docker.js";
import { getCITemplate } from "../src/templates/ci.js";
import { getLintTemplate } from "../src/templates/lint.js";
import { getComponentTemplate } from "../src/templates/component.js";
import { getGitignoreTemplate } from "../src/templates/gitignore.js";
import { getApiTemplate } from "../src/templates/api.js";
import { getAuthTemplate } from "../src/templates/auth.js";
import { getDbTemplate } from "../src/templates/db.js";
import { getTestTemplate } from "../src/templates/test.js";
import { getEnvTemplate } from "../src/templates/env.js";
import { getReadmeTemplate } from "../src/templates/readme.js";

// =========================================================
// Docker Templates
// =========================================================
describe("Docker templates", () => {
  const stacks = ["Node.js", "Python", "Go", "Bun", "Static (Nginx)"];

  for (const stack of stacks) {
    it(`generates valid ${stack} Dockerfile with FROM and EXPOSE`, () => {
      const result = getDockerTemplate(stack);
      expect(result.dockerfile).toContain("FROM");
      expect(result.dockerfile).toContain("EXPOSE");
    });

    it(`generates valid ${stack} docker-compose with services`, () => {
      const result = getDockerTemplate(stack);
      expect(result.compose).toContain("services:");
    });
  }

  it("always includes .dockerignore with node_modules", () => {
    const result = getDockerTemplate("Node.js");
    expect(result.dockerignore).toContain("node_modules");
    expect(result.dockerignore).toContain(".env");
    expect(result.dockerignore).toContain(".git");
  });

  it("Node.js template uses multi-stage build", () => {
    const result = getDockerTemplate("Node.js");
    const fromCount = (result.dockerfile.match(/^FROM /gm) || []).length;
    expect(fromCount).toBeGreaterThanOrEqual(3);
  });

  it("Go template uses multi-stage build with alpine", () => {
    const result = getDockerTemplate("Go");
    expect(result.dockerfile).toContain("golang:");
    expect(result.dockerfile).toContain("alpine:");
    expect(result.dockerfile).toContain("CGO_ENABLED=0");
  });

  it("falls back to Node.js for unknown stack", () => {
    const result = getDockerTemplate("Unknown");
    expect(result.dockerfile).toContain("node:");
  });
});

// =========================================================
// CI Templates
// =========================================================
describe("CI templates", () => {
  it("generates GitHub Actions with checkout and node setup", () => {
    const result = getCITemplate("GitHub Actions", {});
    expect(result).toContain("name: CI");
    expect(result).toContain("actions/checkout@v4");
    expect(result).toContain("actions/setup-node@v4");
    expect(result).toContain("npm ci");
    expect(result).toContain("npm test");
  });

  it("generates GitLab CI with proper stages", () => {
    const result = getCITemplate("GitLab CI", {});
    expect(result).toContain("stages:");
    expect(result).toContain("install");
    expect(result).toContain("lint");
    expect(result).toContain("test");
    expect(result).toContain("build");
  });

  it("GitHub Actions uses matrix strategy", () => {
    const result = getCITemplate("GitHub Actions", {});
    expect(result).toContain("matrix");
    expect(result).toContain("node-version");
  });
});

// =========================================================
// Lint Templates
// =========================================================
describe("Lint templates", () => {
  it("generates JS lint config without TS plugins", () => {
    const result = getLintTemplate({ hasTsConfig: false });
    expect(result.eslint).toContain("eslint:recommended");
    expect(result.eslint).not.toContain("@typescript-eslint");
    expect(result.devDeps).toContain("eslint");
    expect(result.devDeps).toContain("prettier");
  });

  it("generates TS lint config with TS plugins", () => {
    const result = getLintTemplate({ hasTsConfig: true });
    expect(result.eslint).toContain("@typescript-eslint");
    expect(result.devDeps).toContain("@typescript-eslint/parser");
    expect(result.devDeps).toContain("@typescript-eslint/eslint-plugin");
  });

  it("generates valid JSON for eslint config", () => {
    const result = getLintTemplate({ hasTsConfig: false });
    expect(() => JSON.parse(result.eslint)).not.toThrow();
  });

  it("generates valid JSON for prettier config", () => {
    const result = getLintTemplate({ hasTsConfig: false });
    expect(() => JSON.parse(result.prettier)).not.toThrow();
  });

  it("editorconfig has root = true", () => {
    const result = getLintTemplate({ hasTsConfig: false });
    expect(result.editorconfig).toContain("root = true");
  });
});

// =========================================================
// Component Templates
// =========================================================
describe("Component templates", () => {
  it("generates React TSX with props interface", () => {
    const result = getComponentTemplate("React (TSX)", "UserCard");
    expect(result.filename).toBe("UserCard.tsx");
    expect(result.content).toContain("interface UserCardProps");
    expect(result.content).toContain("export const UserCard");
    expect(result.content).toContain("user-card");
  });

  it("generates React JSX with export", () => {
    const result = getComponentTemplate("React (JSX)", "Button");
    expect(result.filename).toBe("Button.jsx");
    expect(result.content).toContain("export function Button");
    expect(result.content).toContain("export default Button");
  });

  it("generates Vue SFC with script setup", () => {
    const result = getComponentTemplate("Vue 3", "NavBar");
    expect(result.filename).toBe("NavBar.vue");
    expect(result.content).toContain("<script setup");
    expect(result.content).toContain("<template>");
    expect(result.content).toContain("<style scoped>");
  });

  it("generates Svelte component with props", () => {
    const result = getComponentTemplate("Svelte", "Header");
    expect(result.filename).toBe("Header.svelte");
    expect(result.content).toContain("$props");
  });

  it("handles PascalCase conversion for multi-word names", () => {
    const result = getComponentTemplate("React (TSX)", "my-awesome-card");
    expect(result.filename).toBe("MyAwesomeCard.tsx");
    expect(result.content).toContain("MyAwesomeCard");
  });

  it("handles single word names", () => {
    const result = getComponentTemplate("React (TSX)", "button");
    expect(result.filename).toBe("Button.tsx");
    expect(result.content).toContain("Button");
  });

  it("handles already-PascalCase names", () => {
    const result = getComponentTemplate("React (JSX)", "DataTable");
    expect(result.filename).toBe("DataTable.jsx");
    expect(result.content).toContain("data-table");
  });
});

// =========================================================
// Gitignore Templates
// =========================================================
describe("Gitignore templates", () => {
  it("includes selected stacks", () => {
    const result = getGitignoreTemplate(["Node.js", "macOS"]);
    expect(result).toContain("node_modules");
    expect(result).toContain(".DS_Store");
  });

  it("includes Python patterns", () => {
    const result = getGitignoreTemplate(["Python"]);
    expect(result).toContain("__pycache__");
    expect(result).toContain("*.py[cod]");
    expect(result).toContain("venv");
  });

  it("includes Go patterns", () => {
    const result = getGitignoreTemplate(["Go"]);
    expect(result).toContain("*.exe");
    expect(result).toContain("vendor/");
  });

  it("includes Environment files patterns", () => {
    const result = getGitignoreTemplate(["Environment files"]);
    expect(result).toContain(".env");
    expect(result).toContain("!.env.example");
  });

  it("always includes logs and coverage", () => {
    const result = getGitignoreTemplate([]);
    expect(result).toContain("*.log");
    expect(result).toContain("coverage/");
  });

  it("handles empty selections", () => {
    const result = getGitignoreTemplate([]);
    expect(result).toContain("Generated by sgomez-cli");
  });
});

// =========================================================
// API Templates
// =========================================================
describe("API templates", () => {
  it("generates Express CRUD with all HTTP methods", () => {
    const result = getApiTemplate("Express", "users");
    expect(result.dir).toBe("src/routes");
    expect(result.filename).toBe("users.js");
    expect(result.content).toContain("router.get");
    expect(result.content).toContain("router.post");
    expect(result.content).toContain("router.put");
    expect(result.content).toContain("router.delete");
    expect(result.content).toContain("Router");
  });

  it("generates Hono CRUD with TypeScript", () => {
    const result = getApiTemplate("Hono", "products");
    expect(result.filename).toBe("products.ts");
    expect(result.content).toContain('from "hono"');
    expect(result.content).toContain("c.req.json()");
  });

  it("generates FastAPI with Pydantic models", () => {
    const result = getApiTemplate("FastAPI", "orders");
    expect(result.dir).toBe("app/routes");
    expect(result.filename).toBe("orders.py");
    expect(result.content).toContain("APIRouter");
    expect(result.content).toContain("BaseModel");
    expect(result.content).toContain("OrdersCreate");
  });

  it("generates Go handler with struct", () => {
    const result = getApiTemplate("Go (net/http)", "tasks");
    expect(result.dir).toBe("handlers");
    expect(result.filename).toBe("tasks.go");
    expect(result.content).toContain("package handlers");
    expect(result.content).toContain("TasksHandler");
    expect(result.content).toContain("RegisterRoutes");
  });

  it("capitalizes model names correctly", () => {
    const result = getApiTemplate("FastAPI", "items");
    expect(result.content).toContain("ItemsCreate");
    expect(result.content).toContain("ItemsResponse");
  });
});

// =========================================================
// Auth Templates
// =========================================================
describe("Auth templates", () => {
  it("JWT Express: generates token functions and middleware", () => {
    const result = getAuthTemplate("JWT (Express)");
    expect(result.dir).toBe("src/middleware");
    expect(result.filename).toBe("auth.js");
    expect(result.content).toContain("generateToken");
    expect(result.content).toContain("verifyToken");
    expect(result.content).toContain("authMiddleware");
    expect(result.deps).toContain("jsonwebtoken");
  });

  it("JWT Hono: uses hono/jwt", () => {
    const result = getAuthTemplate("JWT (Hono)");
    expect(result.filename).toBe("auth.ts");
    expect(result.content).toContain('hono/jwt');
  });

  it("JWT FastAPI: generates with python-jose", () => {
    const result = getAuthTemplate("JWT (FastAPI)");
    expect(result.dir).toBe("app/auth");
    expect(result.filename).toBe("jwt.py");
    expect(result.content).toContain("create_access_token");
    expect(result.content).toContain("get_current_user");
    expect(result.content).toContain("jose");
    expect(result.deps).toContain("python-jose[cryptography]");
  });

  it("Session Express: generates session middleware", () => {
    const result = getAuthTemplate("Session (Express)");
    expect(result.content).toContain("sessionMiddleware");
    expect(result.content).toContain("requireAuth");
    expect(result.content).toContain("req.session");
    expect(result.deps).toContain("express-session");
  });

  it("all strategies have a dir and filename", () => {
    const strategies = [
      "JWT (Express)",
      "JWT (Hono)",
      "JWT (FastAPI)",
      "Session (Express)",
    ];
    for (const strategy of strategies) {
      const result = getAuthTemplate(strategy);
      expect(result.dir).toBeTruthy();
      expect(result.filename).toBeTruthy();
      expect(result.content.length).toBeGreaterThan(50);
    }
  });
});

// =========================================================
// Database Templates
// =========================================================
describe("Database templates", () => {
  it("Prisma: generates schema and client", () => {
    const result = getDbTemplate("Prisma (PostgreSQL)");
    expect(result.files.length).toBe(2);
    expect(result.files[0].content).toContain("generator client");
    expect(result.files[0].content).toContain("datasource db");
    expect(result.files[0].content).toContain("model User");
    expect(result.files[0].content).toContain("model Post");
    expect(result.deps).toContain("prisma");
    expect(result.deps).toContain("@prisma/client");
    expect(result.envLine).toContain("postgresql");
  });

  it("Drizzle: generates schema, index, and config", () => {
    const result = getDbTemplate("Drizzle (PostgreSQL)");
    expect(result.files.length).toBe(3);
    expect(result.files[0].content).toContain("pgTable");
    expect(result.files[2].content).toContain("defineConfig");
    expect(result.deps).toContain("drizzle-orm");
    expect(result.devDeps).toContain("drizzle-kit");
  });

  it("Mongoose: generates connection and models", () => {
    const result = getDbTemplate("Mongoose (MongoDB)");
    expect(result.files.length).toBe(3);
    expect(result.files[0].content).toContain("mongoose.connect");
    expect(result.files[1].content).toContain("mongoose.Schema");
    expect(result.deps).toContain("mongoose");
    expect(result.envLine).toContain("mongodb");
  });

  it("SQLAlchemy: generates database and models", () => {
    const result = getDbTemplate("SQLAlchemy (Python)");
    expect(result.files.length).toBe(2);
    expect(result.files[0].content).toContain("create_engine");
    expect(result.files[1].content).toContain("class User");
    expect(result.deps).toContain("sqlalchemy");
  });

  it("all ORMs have envLine for database URL", () => {
    const orms = [
      "Prisma (PostgreSQL)",
      "Drizzle (PostgreSQL)",
      "Mongoose (MongoDB)",
      "SQLAlchemy (Python)",
    ];
    for (const orm of orms) {
      const result = getDbTemplate(orm);
      expect(result.envLine).toBeTruthy();
      expect(result.files.length).toBeGreaterThan(0);
    }
  });
});

// =========================================================
// Test Templates
// =========================================================
describe("Test templates", () => {
  it("Vitest: generates config and example test", () => {
    const result = getTestTemplate("Vitest");
    expect(result.configFile).toBe("vitest.config.ts");
    expect(result.configContent).toContain("vitest/config");
    expect(result.exampleContent).toContain("describe");
    expect(result.exampleContent).toContain("expect");
    expect(result.deps).toContain("vitest");
    expect(result.scripts.test).toBe("vitest run");
  });

  it("Jest: generates config and example", () => {
    const result = getTestTemplate("Jest");
    expect(result.configFile).toBe("jest.config.js");
    expect(result.exampleContent).toContain("describe");
    expect(result.deps).toContain("jest");
  });

  it("Playwright: generates config with devices", () => {
    const result = getTestTemplate("Playwright");
    expect(result.configContent).toContain("@playwright/test");
    expect(result.configContent).toContain("chromium");
    expect(result.configContent).toContain("firefox");
    expect(result.configContent).toContain("webkit");
    expect(result.exampleContent).toContain("test(");
    expect(result.postInstall).toContain("playwright install");
  });

  it("pytest: generates valid config and test", () => {
    const result = getTestTemplate("pytest");
    expect(result.configContent).toContain("[tool.pytest.ini_options]");
    expect(result.exampleContent).toContain("def test_");
    expect(result.deps).toContain("pytest");
  });

  it("all runners have config and example files", () => {
    const runners = ["Vitest", "Jest", "Playwright", "pytest"];
    for (const runner of runners) {
      const result = getTestTemplate(runner);
      expect(result.configFile).toBeTruthy();
      expect(result.configContent.length).toBeGreaterThan(20);
      expect(result.exampleFile).toBeTruthy();
      expect(result.exampleContent.length).toBeGreaterThan(20);
    }
  });
});

// =========================================================
// Env Templates
// =========================================================
describe("Env templates", () => {
  it("node env has DATABASE_URL and JWT_SECRET", () => {
    const result = getEnvTemplate("node");
    expect(result.env).toContain("DATABASE_URL");
    expect(result.env).toContain("JWT_SECRET");
    expect(result.env).toContain("PORT=3000");
  });

  it("python env has DEBUG and CORS", () => {
    const result = getEnvTemplate("python");
    expect(result.env).toContain("DEBUG");
    expect(result.env).toContain("ALLOWED_ORIGINS");
  });

  it("go env has PORT=8080", () => {
    const result = getEnvTemplate("go");
    expect(result.env).toContain("PORT=8080");
  });

  it("frontend env uses VITE_ prefix", () => {
    const result = getEnvTemplate("frontend");
    expect(result.env).toContain("VITE_");
  });

  it(".env.example strips all values", () => {
    const result = getEnvTemplate("node");
    const lines = result.envExample
      .split("\n")
      .filter((l) => l.includes("=") && !l.startsWith("#"));
    for (const line of lines) {
      const value = line.split("=")[1];
      expect(value).toBe("");
    }
  });

  it("validation template uses zod", () => {
    const result = getEnvTemplate("node");
    expect(result.validation).toContain("z.object");
    expect(result.validation).toContain("z.string");
    expect(result.validationDeps).toContain("zod");
  });
});

// =========================================================
// README Templates
// =========================================================
describe("README templates", () => {
  it("generates README with project name and description", () => {
    const result = getReadmeTemplate(
      { framework: "react", language: "typescript", packageManager: "npm" },
      { name: "my-app", description: "A cool app" }
    );
    expect(result).toContain("# my-app");
    expect(result).toContain("A cool app");
    expect(result).toContain("npm run dev");
    expect(result).toContain("sgomez-cli");
  });

  it("uses correct package manager commands", () => {
    const result = getReadmeTemplate(
      { packageManager: "pnpm" },
      { name: "test" }
    );
    expect(result).toContain("pnpm install");
    expect(result).toContain("pnpm dev");
  });

  it("defaults gracefully with minimal input", () => {
    const result = getReadmeTemplate({}, {});
    expect(result).toContain("#");
    expect(result).toContain("npm");
  });

  it("includes framework info when available", () => {
    const result = getReadmeTemplate(
      { framework: "nextjs", language: "typescript" },
      { name: "test" }
    );
    expect(result).toContain("Nextjs");
    expect(result).toContain("TypeScript");
  });
});
