import inquirer from "inquirer";

export async function askBackend() {
  const { hasBackend } = await inquirer.prompt({
    type: "confirm",
    name: "hasBackend",
    message: "¿Vas a hacer un backend?"
  });

  if (!hasBackend) return null;

  const { backendLang } = await inquirer.prompt({
    type: "list",
    name: "backendLang",
    message: "Selecciona backend:",
    choices: ["Node.js + Express", "NestJS", "Django", "Go"]
  });

  return { backendLang };
}