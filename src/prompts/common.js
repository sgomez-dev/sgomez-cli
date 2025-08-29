import inquirer from "inquirer";

export async function askCommon() {
  const { license } = await inquirer.prompt({
    type: "list",
    name: "license",
    message: "Selecciona la licencia:",
    choices: ["MIT", "GPL", "Apache 2.0"]
  });

  const { projectName } = await inquirer.prompt({
    type: "input",
    name: "projectName",
    message: "Nombre del proyecto:"
  });

  return { license, projectName };
}