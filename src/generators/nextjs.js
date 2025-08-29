import { runCommand } from "../utils/exec.js";
import path from 'path';

export async function generateNextJs(options) {
    const { projectName, language, tools } = options;
    
    const args = [
        "create-next-app@latest", 
        projectName
    ];
    
    if (language === "TypeScript") {
        args.push("--typescript");
    } else {
        args.push("--javascript");
    }
    
    if (tools && tools.includes("TailwindCSS")) {
        args.push("--tailwind");
    } else {
        args.push("--no-tailwind");
    }
    
    await runCommand("npx", args);
    
    if (tools && tools.includes("Framer Motion")) {
        await runCommand("npm", ["install", "framer-motion"], { cwd: projectName });
    }
    
    console.log(`Next.js project ${projectName} created successfully! Run it using:\nnpm run build\nnpm run dev`);
}