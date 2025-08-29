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

export async function runCLI() {
    try {
        logger.info("Hello! Let's set up your project.");

        const frontendOptions = await askFrontend();
        const backendOptions = await askBackend();
        const commonOptions = await askCommon();

        if (frontendOptions && frontendOptions.framework) {
            switch (frontendOptions.framework) {
                case "React (Vite)":
                    await generateReact({ ...frontendOptions, ...commonOptions});
                    break;
                case "Next.js":
                    await generateNextJs({ ...frontendOptions, ...commonOptions});
                    break;
                case "Angular":
                    await generateAngular({ ...frontendOptions, ...commonOptions});
                    break;
            }
        }

        if (backendOptions) {
            switch (backendOptions.backendLang) {
                case "Node.js + Express":
                    await generateNode({ ...backendOptions, ...commonOptions });
                    break;
                case "NestJS":
                    await generateNestJs({ ...backendOptions, ...commonOptions });
                    break;
                case "Django":
                    await generateDjango({ ...backendOptions, ...commonOptions });
                    break;
                case "Go":
                    await generateGo({ ...backendOptions, ...commonOptions });
                    break;
            }
        }

        logger.success(`Project setup complete!\n Remember to do 'npm i' to install all dependencies!\n Happy coding!🚀`);
    } catch (error) {
        logger.error("An error occurred:");
        console.log("Error type:", typeof error);
        console.log("Error value:", error);
        console.log("Error stack:", error?.stack);
        process.exit(1);
    }
}