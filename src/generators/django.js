import { runCommand } from "../utils/exec.js";

export async function generateDjango(options) {
  const { projectName } = options;

  await runCommand("django-admin", ["startproject", projectName]);

  console.log(`Django project ${projectName} created successfully!`);
}