export function getDockerTemplate(stack) {
  const templates = {
    "Node.js": {
      dockerfile: `FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS deps
RUN npm ci --only=production

FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./
EXPOSE 3000
USER node
CMD ["node", "dist/index.js"]
`,
      compose: `services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    volumes:
      - .:/app
      - /app/node_modules
    restart: unless-stopped

  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
`,
    },
    Python: {
      dockerfile: `FROM python:3.13-slim AS base
WORKDIR /app

FROM base AS deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM deps AS runtime
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
`,
      compose: `services:
  app:
    build: .
    ports:
      - "8000:8000"
    env_file:
      - .env
    volumes:
      - .:/app
    restart: unless-stopped

  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
`,
    },
    Go: {
      dockerfile: `FROM golang:1.23-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /server .

FROM alpine:3.20 AS runtime
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=build /server .
EXPOSE 8080
USER nobody
CMD ["./server"]
`,
      compose: `services:
  app:
    build: .
    ports:
      - "8080:8080"
    env_file:
      - .env
    restart: unless-stopped

  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
`,
    },
    Bun: {
      dockerfile: `FROM oven/bun:1 AS base
WORKDIR /app
COPY package.json bun.lockb ./

FROM base AS deps
RUN bun install --frozen-lockfile --production

FROM base AS build
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1-alpine AS runtime
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
EXPOSE 3000
USER bun
CMD ["bun", "run", "dist/index.js"]
`,
      compose: `services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    volumes:
      - .:/app
      - /app/node_modules
    restart: unless-stopped
`,
    },
    "Static (Nginx)": {
      dockerfile: `FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`,
      compose: `services:
  web:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
`,
    },
  };

  const t = templates[stack] || templates["Node.js"];

  return {
    dockerfile: t.dockerfile,
    compose: t.compose,
    dockerignore: `node_modules
npm-debug.log
.git
.gitignore
.env
.env.*
dist
build
.next
.nuxt
.svelte-kit
__pycache__
*.pyc
venv
.venv
*.test
coverage
.DS_Store
Thumbs.db
`,
  };
}
