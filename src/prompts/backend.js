import inquirer from "inquirer";

export async function askBackend() {
  const { hasBackend } = await inquirer.prompt({
    type: "confirm",
    name: "hasBackend",
    message: "Do you want a backend?",
  });

  if (!hasBackend) return null;

  const { backendLang } = await inquirer.prompt({
    type: "list",
    name: "backendLang",
    message: "Select a backend framework:",
    choices: [
      "Node.js + Express",
      "NestJS",
      "Hono (Bun)",
      "FastAPI (Python)",
      "Django",
      "Go",
    ],
  });

  return { backendLang };
}
