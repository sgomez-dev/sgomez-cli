import { runCommand } from '../utils/exec.js';

export async function generateReact(options) {
    const { projectName, language, tools } = options;
    const templateFlag = language === 'TypeScript' ? '-- --template react-ts' : '-- --template react';
    await runCommand("npm", ["create", "vite@latest", projectName, templateFlag]);

    if (tools.includes('TailwindCSS')){
        await runCommand("npm", ["install", "tailwindcss", "@tailwindcss/vite"], { cwd: projectName });
         const fs = await import('fs');
         const path = `${projectName}/src/index.css`;
         fs.writeFileSync(path, `@import "tailwindcss";\n`)

         const viteConfigPath = path.join(projectPath, "vite.config.ts");
         const viteConfigContent = `
            import { defineConfig } from 'vite'
            import tailwindcss from '@tailwindcss/vite'

            export default defineConfig({
                plugins: [
                    tailwindcss(),
                ],
            })
        `;
    fs.writeFileSync(viteConfigPath, viteConfigContent);
    } 

    if (tools.includes('Framer Motion')) await runCommand("npm", ["install", "framer-motion"], { cwd: projectName });

    console.log(`React (Vite) project '${projectName}' created successfully.\n Run it using:\n npm run dev`);
}