function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getApiTemplate(framework, name) {
  const lower = name.toLowerCase();
  const cap = capitalize(lower);

  switch (framework) {
    case "Express":
      return {
        dir: "src/routes",
        filename: `${lower}.js`,
        content: `import { Router } from "express";

const router = Router();

// GET /${lower}
router.get("/", async (req, res) => {
  try {
    // TODO: fetch ${lower} from database
    res.json({ data: [], message: "List all ${lower}" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /${lower}/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: fetch ${lower} by id
    res.json({ data: { id }, message: "Get ${lower} by id" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /${lower}
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    // TODO: create ${lower}
    res.status(201).json({ data: body, message: "${cap} created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /${lower}/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    // TODO: update ${lower}
    res.json({ data: { id, ...body }, message: "${cap} updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /${lower}/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: delete ${lower}
    res.json({ message: "${cap} deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

// Usage: app.use("/${lower}", router);
`,
      };

    case "Hono":
      return {
        dir: "src/routes",
        filename: `${lower}.ts`,
        content: `import { Hono } from "hono";

const ${lower} = new Hono();

${lower}.get("/", async (c) => {
  // TODO: fetch ${lower} from database
  return c.json({ data: [], message: "List all ${lower}" });
});

${lower}.get("/:id", async (c) => {
  const id = c.req.param("id");
  // TODO: fetch ${lower} by id
  return c.json({ data: { id }, message: "Get ${lower} by id" });
});

${lower}.post("/", async (c) => {
  const body = await c.req.json();
  // TODO: create ${lower}
  return c.json({ data: body, message: "${cap} created" }, 201);
});

${lower}.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  // TODO: update ${lower}
  return c.json({ data: { id, ...body }, message: "${cap} updated" });
});

${lower}.delete("/:id", async (c) => {
  const id = c.req.param("id");
  // TODO: delete ${lower}
  return c.json({ message: "${cap} deleted" });
});

export default ${lower};

// Usage: app.route("/${lower}", ${lower});
`,
      };

    case "FastAPI":
      return {
        dir: "app/routes",
        filename: `${lower}.py`,
        content: `from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/${lower}", tags=["${lower}"])


class ${cap}Create(BaseModel):
    name: str
    # TODO: add fields


class ${cap}Response(BaseModel):
    id: str
    name: str


@router.get("/")
async def list_${lower}():
    """List all ${lower}."""
    # TODO: fetch from database
    return {"data": [], "message": "List all ${lower}"}


@router.get("/{item_id}")
async def get_${lower}(item_id: str):
    """Get ${lower} by ID."""
    # TODO: fetch from database
    return {"data": {"id": item_id}, "message": "Get ${lower}"}


@router.post("/", status_code=201)
async def create_${lower}(item: ${cap}Create):
    """Create a new ${lower}."""
    # TODO: save to database
    return {"data": item.model_dump(), "message": "${cap} created"}


@router.put("/{item_id}")
async def update_${lower}(item_id: str, item: ${cap}Create):
    """Update ${lower}."""
    # TODO: update in database
    return {"data": {"id": item_id, **item.model_dump()}, "message": "${cap} updated"}


@router.delete("/{item_id}")
async def delete_${lower}(item_id: str):
    """Delete ${lower}."""
    # TODO: delete from database
    return {"message": "${cap} deleted"}


# Usage: app.include_router(router)
`,
      };

    case "Go (net/http)":
      return {
        dir: "handlers",
        filename: `${lower}.go`,
        content: `package handlers

import (
\t"encoding/json"
\t"net/http"
)

type ${cap}Handler struct {
\t// TODO: add dependencies (database, etc.)
}

func New${cap}Handler() *${cap}Handler {
\treturn &${cap}Handler{}
}

func (h *${cap}Handler) RegisterRoutes(mux *http.ServeMux) {
\tmux.HandleFunc("GET /${lower}", h.List)
\tmux.HandleFunc("GET /${lower}/{id}", h.GetByID)
\tmux.HandleFunc("POST /${lower}", h.Create)
\tmux.HandleFunc("PUT /${lower}/{id}", h.Update)
\tmux.HandleFunc("DELETE /${lower}/{id}", h.Delete)
}

func (h *${cap}Handler) List(w http.ResponseWriter, r *http.Request) {
\t// TODO: fetch from database
\tjson.NewEncoder(w).Encode(map[string]any{
\t\t"data":    []any{},
\t\t"message": "List all ${lower}",
\t})
}

func (h *${cap}Handler) GetByID(w http.ResponseWriter, r *http.Request) {
\tid := r.PathValue("id")
\tjson.NewEncoder(w).Encode(map[string]any{
\t\t"data":    map[string]string{"id": id},
\t\t"message": "Get ${lower}",
\t})
}

func (h *${cap}Handler) Create(w http.ResponseWriter, r *http.Request) {
\t// TODO: parse body and save
\tw.WriteHeader(http.StatusCreated)
\tjson.NewEncoder(w).Encode(map[string]any{
\t\t"message": "${cap} created",
\t})
}

func (h *${cap}Handler) Update(w http.ResponseWriter, r *http.Request) {
\tid := r.PathValue("id")
\t// TODO: parse body and update
\tjson.NewEncoder(w).Encode(map[string]any{
\t\t"data":    map[string]string{"id": id},
\t\t"message": "${cap} updated",
\t})
}

func (h *${cap}Handler) Delete(w http.ResponseWriter, r *http.Request) {
\t// TODO: delete from database
\tjson.NewEncoder(w).Encode(map[string]any{
\t\t"message": "${cap} deleted",
\t})
}
`,
      };

    default:
      return {
        dir: "src/routes",
        filename: `${lower}.js`,
        content: `// ${cap} API route\n`,
      };
  }
}
