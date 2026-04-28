import fs from "fs";
import path from "path";

export function detectProject() {
  const cwd = process.cwd();
  const result = {
    cwd,
    hasPackageJson: false,
    hasTsConfig: false,
    framework: null,
    language: null,
    packageManager: null,
  };

  // Check package.json
  const pkgPath = path.join(cwd, "package.json");
  if (fs.existsSync(pkgPath)) {
    result.hasPackageJson = true;
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
      };

      if (allDeps.next) result.framework = "nextjs";
      else if (allDeps.nuxt) result.framework = "nuxt";
      else if (allDeps["@sveltejs/kit"]) result.framework = "sveltekit";
      else if (allDeps.astro) result.framework = "astro";
      else if (allDeps.react) result.framework = "react";
      else if (allDeps.vue) result.framework = "vue";
      else if (allDeps["@angular/core"]) result.framework = "angular";
      else if (allDeps["@nestjs/core"]) result.framework = "nestjs";
      else if (allDeps.express) result.framework = "express";
      else if (allDeps.hono) result.framework = "hono";
    } catch {}
  }

  // Check TypeScript
  if (fs.existsSync(path.join(cwd, "tsconfig.json"))) {
    result.hasTsConfig = true;
    result.language = "typescript";
  } else {
    result.language = "javascript";
  }

  // Check package manager
  if (fs.existsSync(path.join(cwd, "bun.lockb"))) result.packageManager = "bun";
  else if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml")))
    result.packageManager = "pnpm";
  else if (fs.existsSync(path.join(cwd, "yarn.lock")))
    result.packageManager = "yarn";
  else result.packageManager = "npm";

  // Check Python
  if (
    fs.existsSync(path.join(cwd, "requirements.txt")) ||
    fs.existsSync(path.join(cwd, "pyproject.toml"))
  ) {
    result.language = "python";
  }

  // Check Go
  if (fs.existsSync(path.join(cwd, "go.mod"))) {
    result.language = "go";
  }

  return result;
}
