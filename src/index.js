import chalk from "chalk";
import { askFrontend } from "./prompts/frontend.js";
import { askBackend } from "./prompts/backend.js";
import { askCommon } from "./prompts/common.js";

import { generateReact } from "./generators/react.js";
import { generateNextJs } from "./generators/nextjs.js";
import { generateAngular } from "./generators/angular.js";
import { generateNode } from "./generators/node.js";
import { generateNestJs } from "./generators/nestjs.js";
import { generateDjango } from "./generators/django.js";
import { generateGo } from "./generators/go.js";

import logger from "./utils/logger.js";
import { runCommand } from "./utils/exec.js";
import fs from "fs";

export async function runCLI() {
    try {
                // Banner ASCII art con colores
        console.log(chalk.cyan(`                                                                                                                                             
   SSSSSSSSSSSSSSS         GGGGGGGGGGGGG     OOOOOOOOO     MMMMMMMM               MMMMMMMMEEEEEEEEEEEEEEEEEEEEEEZZZZZZZZZZZZZZZZZZZ             CCCCCCCCCCCCCLLLLLLLLLLL             IIIIIIIIII
 SS:::::::::::::::S     GGG::::::::::::G   OO:::::::::OO   M:::::::M             M:::::::ME::::::::::::::::::::EZ:::::::::::::::::Z          CCC::::::::::::CL:::::::::L             I::::::::I
S:::::SSSSSS::::::S   GG:::::::::::::::G OO:::::::::::::OO M::::::::M           M::::::::ME::::::::::::::::::::EZ:::::::::::::::::Z        CC:::::::::::::::CL:::::::::L             I::::::::I
S:::::S     SSSSSSS  G:::::GGGGGGGG::::GO:::::::OOO:::::::OM:::::::::M         M:::::::::MEE::::::EEEEEEEEE::::EZ:::ZZZZZZZZ:::::Z        C:::::CCCCCCCC::::CLL:::::::LL             II::::::II
S:::::S             G:::::G       GGGGGGO::::::O   O::::::OM::::::::::M       M::::::::::M  E:::::E       EEEEEEZZZZZ     Z:::::Z        C:::::C       CCCCCC  L:::::L                 I::::I  
S:::::S            G:::::G              O:::::O     O:::::OM:::::::::::M     M:::::::::::M  E:::::E                     Z:::::Z         C:::::C                L:::::L                 I::::I  
 S::::SSSS         G:::::G              O:::::O     O:::::OM:::::::M::::M   M::::M:::::::M  E::::::EEEEEEEEEE          Z:::::Z          C:::::C                L:::::L                 I::::I  
  SS::::::SSSSS    G:::::G    GGGGGGGGGGO:::::O     O:::::OM::::::M M::::M M::::M M::::::M  E:::::::::::::::E         Z:::::Z           C:::::C                L:::::L                 I::::I  
    SSS::::::::SS  G:::::G    G::::::::GO:::::O     O:::::OM::::::M  M::::M::::M  M::::::M  E:::::::::::::::E        Z:::::Z            C:::::C                L:::::L                 I::::I  
       SSSSSS::::S G:::::G    GGGGG::::GO:::::O     O:::::OM::::::M   M:::::::M   M::::::M  E::::::EEEEEEEEEE       Z:::::Z             C:::::C                L:::::L                 I::::I  
            S:::::SG:::::G        G::::GO:::::O     O:::::OM::::::M    M:::::M    M::::::M  E:::::E                Z:::::Z              C:::::C                L:::::L                 I::::I  
            S:::::S G:::::G       G::::GO::::::O   O::::::OM::::::M     MMMMM     M::::::M  E:::::E       EEEEEEZZZ:::::Z     ZZZZZ      C:::::C       CCCCCC  L:::::L         LLLLLL  I::::I  
SSSSSSS     S:::::S  G:::::GGGGGGGG::::GO:::::::OOO:::::::OM::::::M               M::::::MEE::::::EEEEEEEE:::::EZ::::::ZZZZZZZZ:::Z       C:::::CCCCCCCC::::CLL:::::::LLLLLLLLL:::::LII::::::II
S::::::SSSSSS:::::S   GG:::::::::::::::G OO:::::::::::::OO M::::::M               M::::::ME::::::::::::::::::::EZ:::::::::::::::::Z        CC:::::::::::::::CL::::::::::::::::::::::LI::::::::I
S:::::::::::::::SS      GGG::::::GGG:::G   OO:::::::::OO   M::::::M               M::::::ME::::::::::::::::::::EZ:::::::::::::::::Z          CCC::::::::::::CL::::::::::::::::::::::LI::::::::I
 SSSSSSSSSSSSSSS           GGGGGG   GGGG     OOOOOOOOO     MMMMMMMM               MMMMMMMMEEEEEEEEEEEEEEEEEEEEEEZZZZZZZZZZZZZZZZZZZ             CCCCCCCCCCCCCLLLLLLLLLLLLLLLLLLLLLLLLIIIIIIIIII
            `));

        console.log(`
        ${chalk.bold.magenta('🚀 SGOMEZ CLI')} ${chalk.gray('-')} ${chalk.bold.white('The Ultimate Project Scaffolding Tool')}
        ${chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}

        ${chalk.green('Quickly scaffold full-stack projects with modern frameworks')} 
        ${chalk.blue('Support for React, Next.js, Angular, Node.js, Django, Go and more')}
        ${chalk.yellow('Pre-configured with popular tools like TailwindCSS, ESLint, and TypeScript')}
        ${chalk.magenta('Ready-to-use project structure with best practices')}

        ${chalk.bold.green("Let's build something amazing together!")}
        `);

        const frontendOptions = await askFrontend();
        const backendOptions = await askBackend();
        const commonOptions = await askCommon();

        const hasFrontend = frontendOptions && frontendOptions.framework;
        const hasBackend = backendOptions && backendOptions.backendLang;
        const isFullstack = hasFrontend && hasBackend;

        if (!hasFrontend && !hasBackend) {
            logger.error("You must select at least a frontend or a backend framework to proceed.");
            process.exit(1);
        }
const { projectName } = commonOptions;
        
        // Si es fullstack, crear estructura de monorepo
        if (isFullstack) {
            logger.info("Creating fullstack project structure...");
            await runCommand("mkdir", [projectName]);
            
            // Crear README principal
            const mainReadmeContent = `# ${projectName}

A fullstack project created with SGOMEZ CLI.

## Project Structure

\`\`\`
${projectName}/
├── frontend/    # ${frontendOptions.framework} application
├── backend/     # ${backendOptions.backendLang} server
└── README.md    # This file
\`\`\`

## Getting Started

### Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

### Backend
\`\`\`bash
cd backend
# Follow backend-specific instructions in backend/README.md
\`\`\`

## Development

Run both frontend and backend simultaneously for full development experience.
`;
            fs.writeFileSync(`${projectName}/README.md`, mainReadmeContent);
        }

        // Generar frontend
        if (hasFrontend) {
            const frontendProjectName = isFullstack ? `${projectName}/frontend` : projectName;
            const frontendConfig = { 
                ...frontendOptions, 
                ...commonOptions,
                projectName: frontendProjectName 
            };
            
            switch (frontendOptions.framework) {
                case "React (Vite)":
                    await generateReact(frontendConfig);
                    break;
                case "Next.js":
                    await generateNextJs(frontendConfig);
                    break;
                case "Angular":
                    await generateAngular(frontendConfig);
                    break;
            }
        }

        // Generar backend
        if (hasBackend) {
            const backendProjectName = isFullstack ? `${projectName}/backend` : projectName;
            const backendConfig = { 
                ...backendOptions, 
                ...commonOptions,
                projectName: backendProjectName 
            };
            
            switch (backendOptions.backendLang) {
                case "Node.js + Express":
                    await generateNode(backendConfig);
                    break;
                case "NestJS":
                    await generateNestJs(backendConfig);
                    break;
                case "Django":
                    await generateDjango(backendConfig);
                    break;
                case "Go":
                    await generateGo(backendConfig);
                    break;
            }
        }

        // Mensaje final mejorado
        if (isFullstack) {
            logger.success(`Fullstack project ${chalk.bold.cyan(projectName)} created successfully!

            ${chalk.bold('Project structure:')}
            ${chalk.cyan(projectName)}/
            ├── ${chalk.green('frontend/')}    # ${chalk.gray(frontendOptions.framework)}
            └── ${chalk.blue('backend/')}     # ${chalk.gray(backendOptions.backendLang)}

            ${chalk.bold('Next steps:')}
            ${chalk.gray('$')} cd ${projectName}
    
            ${chalk.bold('Frontend:')}
            ${chalk.gray('$')} cd frontend && npm install && npm run dev
    
            ${chalk.bold('Backend:')}
            ${chalk.gray('$')} cd backend && follow the instructions in backend/README.md

            ${chalk.bold.green('Happy coding! 🚀')}`);
        } else {
            logger.success(`Project setup complete!\n Remember to do 'npm i' to install all dependencies!\n Happy coding!🚀`);
        }
    } catch (error) {
        logger.error("An error occurred:");
        console.log("Error type:", typeof error);
        console.log("Error value:", error);
        console.log("Error stack:", error?.stack);
        process.exit(1);
    }
}