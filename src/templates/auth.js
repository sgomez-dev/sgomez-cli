export function getAuthTemplate(strategy) {
  switch (strategy) {
    case "JWT (Express)":
      return {
        dir: "src/middleware",
        filename: "auth.js",
        content: `import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";

export function generateToken(payload, expiresIn = "7d") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Usage:
// import { authMiddleware, generateToken } from "./middleware/auth.js";
//
// app.post("/login", (req, res) => {
//   const token = generateToken({ id: user.id, email: user.email });
//   res.json({ token });
// });
//
// app.get("/protected", authMiddleware, (req, res) => {
//   res.json({ user: req.user });
// });
`,
        deps: ["jsonwebtoken"],
      };

    case "JWT (Hono)":
      return {
        dir: "src/middleware",
        filename: "auth.ts",
        content: `import { jwt } from "hono/jwt";
import type { Context, Next } from "hono";

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";

export const authMiddleware = jwt({ secret: JWT_SECRET });

export function generateToken(payload: Record<string, unknown>): string {
  // Use hono/jwt or a library like jose for production
  const { sign } = require("hono/utils/jwt/jwt");
  return sign(payload, JWT_SECRET);
}

// Usage:
// import { authMiddleware } from "./middleware/auth";
//
// app.use("/api/*", authMiddleware);
//
// app.get("/api/me", (c) => {
//   const payload = c.get("jwtPayload");
//   return c.json(payload);
// });
`,
        deps: [],
      };

    case "JWT (FastAPI)":
      return {
        dir: "app/auth",
        filename: "jwt.py",
        content: `import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from pydantic import BaseModel

SECRET_KEY = os.getenv("JWT_SECRET", "change-me-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

security = HTTPBearer()


class TokenPayload(BaseModel):
    sub: str
    exp: Optional[datetime] = None


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> TokenPayload:
    try:
        payload = jwt.decode(
            credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    return token_data


# Usage:
# from app.auth.jwt import create_access_token, get_current_user
#
# @app.post("/login")
# async def login():
#     token = create_access_token({"sub": user.id})
#     return {"access_token": token}
#
# @app.get("/me")
# async def me(user: TokenPayload = Depends(get_current_user)):
#     return user
`,
        deps: ["python-jose[cryptography]"],
      };

    case "Session (Express)":
      return {
        dir: "src/middleware",
        filename: "session.js",
        content: `import session from "express-session";

const SESSION_SECRET = process.env.SESSION_SECRET || "change-me-in-production";

export const sessionMiddleware = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
  },
});

export function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

// Usage:
// import { sessionMiddleware, requireAuth } from "./middleware/session.js";
//
// app.use(sessionMiddleware);
//
// app.post("/login", (req, res) => {
//   req.session.user = { id: user.id, email: user.email };
//   res.json({ message: "Logged in" });
// });
//
// app.get("/protected", requireAuth, (req, res) => {
//   res.json({ user: req.session.user });
// });
//
// app.post("/logout", (req, res) => {
//   req.session.destroy();
//   res.json({ message: "Logged out" });
// });
`,
        deps: ["express-session"],
      };

    default:
      return {
        dir: "src/middleware",
        filename: "auth.js",
        content: "// Auth template\n",
        deps: [],
      };
  }
}
