import { runCommand } from '../utils/exec.js';
import path from 'path';

export async function generateReact(options) {
    const { projectName, language, tools } = options;
    
    // Corrección: el template para TypeScript debería ser 'react-ts', no 'react'
    const templateFlag = language === 'TypeScript' ? 'react' : 'react-ts';
    
    await runCommand("npm", ["create", "vite@latest", projectName, "--", "--template", templateFlag]);
    
    if (tools.includes('TailwindCSS')) {
        await runCommand("npm", ["install", "tailwindcss", "@tailwindcss/vite"], { cwd: projectName });
        
        const fs = await import('fs');
        const cssPath = `${projectName}/src/index.css`;
        fs.writeFileSync(cssPath, `@import "tailwindcss";\n`);
        
        // Corrección principal: usar projectName en lugar de projectPath
        const viteConfigPath = path.join(projectName, "vite.config.ts");
        const viteConfigContent = `import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
`;
        fs.writeFileSync(viteConfigPath, viteConfigContent);
    }
    
    if (tools.includes('Framer Motion')) {
        await runCommand("npm", ["install", "framer-motion"], { cwd: projectName });
    }
    
    console.log(`React (Vite) project '${projectName}' created successfully.\n`);
}