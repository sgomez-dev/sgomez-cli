import { runCommand } from "../utils/exec.js";

export async function generateNextJS(options) {
  const { projectName, language, tools } = options;

  const templateFlag = language === "TypeScript" ? "--ts" : "";

  await runCommand("npx", ["create-next-app@latest", projectName, templateFlag]);

  if (tools.includes("Tailwind")) {
    await runCommand("npm", ["install", "tailwindcss", "@tailwindcss/postcss postcss"], { cwd: projectName });

    const fs = await import("fs");
    const path = `${projectName}/app/globals.css`;
    fs.writeFileSync(path, `@import 'tailwindcss';\n`);

    const nextjsConfigPath = path.join(projectPath, "postcss.config.mjs");
    const nextjsConfigContent = `
        const config = {
            plugins: {
                "@tailwindcss/postcss": {},
            },
        };

        export default config;
    `;
    fs.writeFileSync(nextjsConfigPath, nextjsConfigContent);
  }

  console.log(`Next.js project ${projectName} created successfully! Run it using:\n npm run build\n npm run dev`);
}