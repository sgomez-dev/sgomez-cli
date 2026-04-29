import { runCommand } from "../utils/exec.js";
import logger from "../utils/logger.js";

export async function generateAstro(options) {
  const { projectName, language, tools } = options;

  const args = [
    "create-astro@latest",
    projectName,
    "--template",
    "basics",
    "--install",
    "--no-git",
    "--yes",
  ];

  if (language === "TypeScript") {
    args.push("--typescript", "strict");
  } else {
    args.push("--typescript", "relaxed");
  }

  const spinner = logger.spinner("Creating Astro project...");
  await runCommand("npm", args);
  spinner.succeed("Astro project created");

  if (tools?.includes("TailwindCSS")) {
    const s = logger.spinner("Adding TailwindCSS...");
    await runCommand("npx", ["astro", "add", "tailwind", "--yes"], {
      cwd: projectName,
    });
    s.succeed("TailwindCSS added");
  }

  if (tools?.includes("React")) {
    const s = logger.spinner("Adding React integration...");
    await runCommand("npx", ["astro", "add", "react", "--yes"], {
      cwd: projectName,
    });
    s.succeed("React integration added");
  }

  if (tools?.includes("Vue")) {
    const s = logger.spinner("Adding Vue integration...");
    await runCommand("npx", ["astro", "add", "vue", "--yes"], {
      cwd: projectName,
    });
    s.succeed("Vue integration added");
  }

  if (tools?.includes("Svelte")) {
    const s = logger.spinner("Adding Svelte integration...");
    await runCommand("npx", ["astro", "add", "svelte", "--yes"], {
      cwd: projectName,
    });
    s.succeed("Svelte integration added");
  }

  logger.success(`Astro project '${projectName}' created successfully.`);
}
