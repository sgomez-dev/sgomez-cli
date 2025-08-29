import { runCommand } from "../utils/exec.js";
import logger from "../utils/logger.js";

export async function generateDjango(options) {
    const { projectName } = options;
    
    try {
        logger.info("Setting up Django project...");
        
        await runCommand("mkdir", [projectName]);
        
        logger.info("Creating virtual environment...");
        await runCommand("python3", ["-m", "venv", "venv"], { cwd: projectName });
        
        logger.info("Installing Django...");
        const pipPath = process.platform === "win32" ? "venv/Scripts/pip" : "venv/bin/pip";
        await runCommand(pipPath, ["install", "django"], { cwd: projectName });
        
        logger.info("Creating Django project...");
        const djangoAdminPath = process.platform === "win32" ? "venv/Scripts/django-admin" : "venv/bin/django-admin";
        await runCommand(djangoAdminPath, ["startproject", "core", "."], { cwd: projectName });
        
        const fs = await import("fs");
        const requirementsContent = `Django>=4.2.0
python-decouple>=3.6
`;
        fs.writeFileSync(`${projectName}/requirements.txt`, requirementsContent);
        
        const readmeContent = `# ${projectName}

A Django project created with sgomez CLI.

## Setup

1. Activate the virtual environment:
   \`\`\`bash
   # On macOS/Linux:
   source venv/bin/activate
   
   # On Windows:
   venv\\Scripts\\activate
   \`\`\`

2. Run migrations:
   \`\`\`bash
   python manage.py migrate
   \`\`\`

3. Create a superuser (optional):
   \`\`\`bash
   python manage.py createsuperuser
   \`\`\`

4. Run the development server:
   \`\`\`bash
   python manage.py runserver
   \`\`\`

Your Django app will be available at http://127.0.0.1:8000/
`;
        fs.writeFileSync(`${projectName}/README.md`, readmeContent);
        
        console.log(`Django project ${projectName} created successfully!

Next steps:
1. cd ${projectName}
2. source venv/bin/activate (macOS/Linux) or venv\\Scripts\\activate (Windows)
3. python manage.py migrate
4. python manage.py runserver`);
        
    } catch (error) {
        if (error.message.includes('python3')) {
            logger.warn("python3 not found, trying with python...");
            await generateDjangoFallback(options);
        } else {
            throw error;
        }
    }
}

async function generateDjangoFallback(options) {
    const { projectName } = options;
    
    await runCommand("mkdir", [projectName]);
    
    logger.info("Creating virtual environment with python...");
    await runCommand("python", ["-m", "venv", "venv"], { cwd: projectName });
    
    logger.info("Installing Django...");
    const pipPath = process.platform === "win32" ? "venv/Scripts/pip" : "venv/bin/pip";
    await runCommand(pipPath, ["install", "django"], { cwd: projectName });
    
    logger.info("Creating Django project...");
    const djangoAdminPath = process.platform === "win32" ? "venv/Scripts/django-admin" : "venv/bin/django-admin";
    await runCommand(djangoAdminPath, ["startproject", "core", "."], { cwd: projectName });
    
    const fs = await import("fs");
    const requirementsContent = `Django>=4.2.0
python-decouple>=3.6
`;
    fs.writeFileSync(`${projectName}/requirements.txt`, requirementsContent);
    
    const readmeContent = `# ${projectName}

A Django project created with sgomez CLI.

## Setup

1. Activate the virtual environment:
   \`\`\`bash
   # On macOS/Linux:
   source venv/bin/activate
   
   # On Windows:
   venv\\Scripts\\activate
   \`\`\`

2. Run migrations:
   \`\`\`bash
   python manage.py migrate
   \`\`\`

3. Create a superuser (optional):
   \`\`\`bash
   python manage.py createsuperuser
   \`\`\`

4. Run the development server:
   \`\`\`bash
   python manage.py runserver
   \`\`\`

Your Django app will be available at http://127.0.0.1:8000/
`;
    fs.writeFileSync(`${projectName}/README.md`, readmeContent);
    
    console.log(`Django project ${projectName} created successfully!

Next steps:
1. cd ${projectName}
2. source venv/bin/activate (macOS/Linux) or venv\\Scripts\\activate (Windows)
3. python manage.py migrate
4. python manage.py runserver`);
}