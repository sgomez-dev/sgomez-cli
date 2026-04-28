import { runCommand } from "../utils/exec.js";
import fs from "fs";
import path from "path";
import logger from "../utils/logger.js";

export async function generateAngular(options) {
  const { projectName, tools } = options;

  const spinner = logger.spinner("Creating Angular project...");
  await runCommand("npx", ["@angular/cli", "new", projectName, "--defaults", "--skip-git"]);
  spinner.succeed("Angular project created");

  if (tools?.includes("TailwindCSS")) {
    const tailwindSpinner = logger.spinner("Setting up TailwindCSS...");
    await runCommand(
      "npm",
      ["install", "tailwindcss", "@tailwindcss/postcss", "postcss", "--force"],
      { cwd: projectName }
    );

    const stylesPath = path.join(projectName, "src", "styles.css");
    fs.writeFileSync(stylesPath, `@import 'tailwindcss';\n`);

    const postcssPath = path.join(projectName, ".postcssrc.json");
    const postcssContent = JSON.stringify(
      { plugins: { "@tailwindcss/postcss": {} } },
      null,
      2
    );
    fs.writeFileSync(postcssPath, postcssContent);
    tailwindSpinner.succeed("TailwindCSS configured");
  }

  logger.success(`Angular project '${projectName}' created successfully.`);
}
