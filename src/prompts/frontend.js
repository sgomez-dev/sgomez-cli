import inquirer from "inquirer";

export async function askFrontend() {
    const { hasFrontend } = await inquirer.prompt({
        type: "confirm",
        name: "hasFrontend",
        message: "¿Vas a hacer un frontend?"
    });
    
    if (!hasFrontend) return null;
    
    const { framework } = await inquirer.prompt({
        type: "list",
        name: "framework",
        message: "Select a frontend framework:",
        choices: ["React (Vite)", "Next.js", "Angular"]
    });
    
    let options = { framework };
    
    if (framework === "React (Vite)") {
        const reactOptions = await inquirer.prompt([
            {
                type: "checkbox",
                name: "tools",
                message: "Select additional tools for React (Vite):",
                choices: ["TailwindCSS", "Framer Motion"]
            },
            {
                type: "list",
                name: "language",
                message: "Select a language:",
                choices: ["JavaScript", "TypeScript"]
            }
        ]);
        options = { ...options, ...reactOptions };
    }
    
    if (framework === "Next.js") {
        const nextOptions = await inquirer.prompt([
            {
                type: "checkbox",
                name: "tools",
                message: "Select additional tools for Next.js:",
                choices: ["TailwindCSS", "Framer Motion"]
            },
            {
                type: "list",
                name: "language",
                message: "Select a language:",
                choices: ["JavaScript", "TypeScript"]
            }
        ]);
        options = { ...options, ...nextOptions };
    }
    
    if (framework === "Angular") {
        const angularOptions = await inquirer.prompt([
            {
                type: "checkbox",
                name: "tools",
                message: "Select additional tools for Angular:",
                choices: ["TailwindCSS"]
            }
        ]);
        options = { ...options, ...angularOptions };
    }
    
    return options;
}