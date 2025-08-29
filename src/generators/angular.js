import { runCommand } from "../utils/exec.js";

export async function generateAngular(options) {
  const { projectName, tools } = options;

  await runCommand("npx", ["@angular/cli", "new", projectName, "--defaults"]);

  if (tools.includes("Tailwind")) {
    await runCommand("npm", ["install", "tailwindcss", "@tailwindcss/postcss", "postcss", "--force"], { cwd: projectName });
    const fs = await import("fs");
    const path = `${projectName}/src/styles.css`;
    fs.writeFileSync(path, `@import 'tailwindcss';\n`);

    const angularConfigPath = path.join(projectPath, ".postcssrc.json");
    const angularConfigContent = `
        {
            "plugins": {
                "@tailwindcss/postcss": {},
            }
        }
    `;
    fs.writeFileSync(angularConfigPath, angularConfigContent);
  }

  console.log(`Angular project ${projectName} created successfully!\n Run it using:\n ng serve`);
}