import inquirer from "inquirer";

export async function askCommon() {
  const { license } = await inquirer.prompt({
    type: "list",
    name: "license",
    message: "Select a license:",
    choices: ["MIT", "GPL-3.0", "Apache-2.0", "ISC", "Unlicensed"],
  });

  const { projectName } = await inquirer.prompt({
    type: "input",
    name: "projectName",
    message: "Project name:",
    validate: (input) => {
      if (!input.trim()) return "Project name is required";
      if (/[^a-zA-Z0-9._-]/.test(input))
        return "Use only letters, numbers, dots, hyphens, and underscores";
      return true;
    },
  });

  return { license, projectName };
}
