export function getEnvTemplate(stack) {
  const sections = {
    node: `# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app"

# Auth
JWT_SECRET="change-me-in-production"
SESSION_SECRET="change-me-in-production"

# External APIs
# API_KEY=
# API_SECRET=
`,
    python: `# Server
DEBUG=true
PORT=8000

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app"

# Auth
JWT_SECRET="change-me-in-production"
SECRET_KEY="change-me-in-production"

# CORS
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"
`,
    go: `# Server
PORT=8080
ENV=development

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app"

# Auth
JWT_SECRET="change-me-in-production"
`,
    frontend: `# API
VITE_API_URL=http://localhost:3000
VITE_APP_NAME="My App"

# Feature Flags
VITE_ENABLE_ANALYTICS=false
`,
  };

  const envContent = sections[stack] || sections.node;

  const envExampleContent = envContent
    .split("\n")
    .map((line) => {
      if (line.startsWith("#") || line.trim() === "") return line;
      const [key] = line.split("=");
      return `${key}=`;
    })
    .join("\n");

  const validationContent = `import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
});

export const env = envSchema.parse(process.env);

// Usage: import { env } from "./env.js";
// env.PORT, env.DATABASE_URL, etc.
`;

  return {
    env: envContent,
    envExample: envExampleContent,
    validation: validationContent,
    validationDeps: ["zod"],
  };
}
