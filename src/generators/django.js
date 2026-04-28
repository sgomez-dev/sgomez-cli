import { runCommand } from "../utils/exec.js";
import fs from "fs";
import path from "path";
import logger from "../utils/logger.js";

export async function generateDjango(options) {
  const { projectName } = options;
  const pythonCmd = await detectPython();

  const spinner = logger.spinner("Setting up Django project...");

  fs.mkdirSync(projectName, { recursive: true });

  logger.info("Creating virtual environment...");
  await runCommand(pythonCmd, ["-m", "venv", "venv"], { cwd: projectName });

  const pipPath =
    process.platform === "win32" ? "venv\\Scripts\\pip" : "venv/bin/pip";
  const djangoAdminPath =
    process.platform === "win32"
      ? "venv\\Scripts\\django-admin"
      : "venv/bin/django-admin";

  logger.info("Installing Django...");
  await runCommand(pipPath, ["install", "django"], { cwd: projectName });

  logger.info("Creating Django project...");
  await runCommand(djangoAdminPath, ["startproject", "core", "."], {
    cwd: projectName,
  });

  const requirementsContent = `Django>=4.2.0\npython-decouple>=3.6\n`;

  const readmeContent = `# ${projectName}

A Django project created with **SGOMEZ CLI**.

## Setup

\`\`\`bash
source venv/bin/activate    # macOS/Linux
venv\\\\Scripts\\\\activate       # Windows

python manage.py migrate
python manage.py runserver
\`\`\`

Open http://127.0.0.1:8000
`;

  const gitignoreContent = `venv/\n.env\n*.pyc\n__pycache__/\ndb.sqlite3\n.DS_Store\n`;

  fs.writeFileSync(path.join(projectName, "requirements.txt"), requirementsContent);
  fs.writeFileSync(path.join(projectName, "README.md"), readmeContent);
  fs.writeFileSync(path.join(projectName, ".gitignore"), gitignoreContent);

  spinner.succeed("Django project created");
  logger.success(`Django project '${projectName}' created successfully.`);
}

async function detectPython() {
  const { execa } = await import("execa");
  try {
    await execa("python3", ["--version"]);
    return "python3";
  } catch {
    try {
      await execa("python", ["--version"]);
      return "python";
    } catch {
      throw new Error(
        "Python is not installed. Install Python 3.8+ and try again.\nRun 'sgomez doctor' to check your system."
      );
    }
  }
}
