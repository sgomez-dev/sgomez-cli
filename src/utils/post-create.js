import { execa } from "execa";
import logger from "./logger.js";

export async function postCreate(projectDir, opts = {}) {
  const isInteractive = opts.interactive !== false;

  // Git init
  if (opts.git === true) {
    // Explicit --git flag: just do it, no prompt
    await initGit(projectDir);
  } else if (isInteractive && opts.git !== false) {
    // Interactive mode: ask
    const inquirer = await import("inquirer");
    const { shouldGit } = await inquirer.default.prompt({
      type: "confirm",
      name: "shouldGit",
      message: "Initialize a git repository?",
      default: true,
    });
    if (shouldGit) await initGit(projectDir);
  }

  // Open in editor (only in interactive mode)
  if (isInteractive) {
    const inquirer = await import("inquirer");
    const { openEditor } = await inquirer.default.prompt({
      type: "list",
      name: "openEditor",
      message: "Open in editor?",
      choices: [
        { name: "No", value: null },
        { name: "VS Code", value: "code" },
        { name: "Cursor", value: "cursor" },
        { name: "WebStorm", value: "webstorm" },
        { name: "Zed", value: "zed" },
      ],
    });

    if (openEditor) {
      try {
        await execa(openEditor, [projectDir]);
        logger.success(`Opened in ${openEditor}`);
      } catch {
        logger.warn(`Could not open ${openEditor} — is it in your PATH?`);
      }
    }
  }
}

async function initGit(projectDir) {
  try {
    await execa("git", ["init"], { cwd: projectDir });
    await execa("git", ["add", "."], { cwd: projectDir });
    await execa("git", ["commit", "-m", "Initial commit from sgomez-cli"], {
      cwd: projectDir,
    });
    logger.success("Initialized git repo with initial commit");
  } catch {
    logger.warn("Git init failed — skipping");
  }
}
