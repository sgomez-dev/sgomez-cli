import { runCommand } from "../utils/exec.js";
import fs from "fs";
import path from "path";
import logger from "../utils/logger.js";

export async function generateFastAPI(options) {
  const { projectName } = options;

  const spinner = logger.spinner("Setting up FastAPI project...");

  fs.mkdirSync(path.join(projectName, "app"), { recursive: true });

  // Detect python command
  const pythonCmd = await detectPython();

  logger.info("Creating virtual environment...");
  await runCommand(pythonCmd, ["-m", "venv", "venv"], { cwd: projectName });

  const pipPath =
    process.platform === "win32" ? "venv\\Scripts\\pip" : "venv/bin/pip";

  logger.info("Installing FastAPI + Uvicorn...");
  await runCommand(pipPath, ["install", "fastapi[standard]", "uvicorn"], {
    cwd: projectName,
  });

  const mainCode = `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="${projectName}",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello from ${projectName}!"}


@app.get("/health")
async def health():
    return {"status": "ok"}
`;

  const requirementsContent = `fastapi[standard]>=0.115.0\nuvicorn>=0.30.0\npython-dotenv>=1.0.0\n`;

  const readmeContent = `# ${projectName}

A FastAPI project created with **SGOMEZ CLI**.

## Setup

\`\`\`bash
source venv/bin/activate    # macOS/Linux
venv\\\\Scripts\\\\activate       # Windows

uvicorn app.main:app --reload
\`\`\`

- App: http://localhost:8000
- API Docs: http://localhost:8000/docs
`;

  const gitignoreContent = `venv/\n.venv/\n.env\n*.pyc\n__pycache__/\n.DS_Store\n`;

  fs.writeFileSync(path.join(projectName, "app", "__init__.py"), "");
  fs.writeFileSync(path.join(projectName, "app", "main.py"), mainCode);
  fs.writeFileSync(path.join(projectName, "requirements.txt"), requirementsContent);
  fs.writeFileSync(path.join(projectName, "README.md"), readmeContent);
  fs.writeFileSync(path.join(projectName, ".gitignore"), gitignoreContent);
  fs.writeFileSync(path.join(projectName, ".env"), "DEBUG=true\n");

  spinner.succeed("FastAPI project created");
  logger.success(`FastAPI project '${projectName}' created successfully.`);
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
