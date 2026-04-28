export function getDbTemplate(orm) {
  switch (orm) {
    case "Prisma (PostgreSQL)":
      return {
        files: [
          {
            path: "prisma/schema.prisma",
            content: `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`,
          },
          {
            path: "src/lib/db.js",
            content: `import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
`,
          },
        ],
        envLine: 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app?schema=public"',
        deps: ["prisma", "@prisma/client"],
        postInstall: "npx prisma generate",
      };

    case "Drizzle (PostgreSQL)":
      return {
        files: [
          {
            path: "src/db/schema.ts",
            content: `import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content"),
  published: boolean("published").default(false).notNull(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
`,
          },
          {
            path: "src/db/index.ts",
            content: `import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const DATABASE_URL = process.env.DATABASE_URL!;

export const db = drizzle(DATABASE_URL, { schema });
`,
          },
          {
            path: "drizzle.config.ts",
            content: `import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
`,
          },
        ],
        envLine: 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app"',
        deps: ["drizzle-orm", "pg"],
        devDeps: ["drizzle-kit"],
        postInstall: "npx drizzle-kit generate",
      };

    case "SQLAlchemy (Python)":
      return {
        files: [
          {
            path: "app/db/database.py",
            content: `import os
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/app"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
`,
          },
          {
            path: "app/db/models.py",
            content: `from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    name: Mapped[str | None] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )

    posts: Mapped[list["Post"]] = relationship(back_populates="author")


class Post(Base):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str | None] = mapped_column(Text)
    published: Mapped[bool] = mapped_column(Boolean, default=False)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )

    author: Mapped["User"] = relationship(back_populates="posts")
`,
          },
        ],
        envLine: 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app"',
        deps: ["sqlalchemy", "psycopg2-binary"],
      };

    case "Mongoose (MongoDB)":
      return {
        files: [
          {
            path: "src/db/connection.js",
            content: `import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/app";

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}
`,
          },
          {
            path: "src/db/models/User.js",
            content: `import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, trim: true },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
`,
          },
          {
            path: "src/db/models/Post.js",
            content: `import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: String,
    published: { type: Boolean, default: false },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
`,
          },
        ],
        envLine: 'MONGODB_URI="mongodb://localhost:27017/app"',
        deps: ["mongoose"],
      };

    default:
      return { files: [], deps: [], envLine: "" };
  }
}
