import express from "express";
import cors from "cors";
import { db, nowMs } from "./db.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

function list(table) {
  const rows = db.prepare(`SELECT data FROM ${table} ORDER BY updated_at DESC`).all();
  return rows.map((r) => JSON.parse(r.data));
}

function getById(table, id) {
  const row = db.prepare(`SELECT data FROM ${table} WHERE id = ?`).get(id);
  return row ? JSON.parse(row.data) : null;
}

function upsert(table, id, obj) {
  const updatedAt = nowMs();
  const data = JSON.stringify(obj);
  db.prepare(
    `INSERT INTO ${table} (id, data, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at`,
  ).run(id, data, updatedAt);
}

function del(table, id) {
  db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
}

function requireId(obj) {
  const id = String(obj?.id ?? "").trim();
  if (!id) {
    const err = new Error("Missing id");
    // @ts-ignore
    err.status = 400;
    throw err;
  }
  return id;
}

function apiFor(table, basePath) {
  app.get(`/api/${basePath}`, (_req, res) => res.json(list(table)));

  app.get(`/api/${basePath}/:id`, (req, res) => {
    const item = getById(table, req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  });

  app.post(`/api/${basePath}`, (req, res, next) => {
    try {
      const id = requireId(req.body);
      upsert(table, id, req.body);
      res.status(201).json(getById(table, id));
    } catch (e) {
      next(e);
    }
  });

  app.put(`/api/${basePath}/:id`, (req, res, next) => {
    try {
      const id = String(req.params.id ?? "").trim();
      if (!id) return res.status(400).json({ error: "Missing id" });
      const bodyId = String(req.body?.id ?? id).trim();
      if (bodyId !== id) return res.status(400).json({ error: "Body id must match path id" });
      upsert(table, id, req.body);
      res.json(getById(table, id));
    } catch (e) {
      next(e);
    }
  });

  app.delete(`/api/${basePath}/:id`, (req, res) => {
    del(table, req.params.id);
    res.status(204).end();
  });
}

apiFor("campaigns", "campaigns");
apiFor("content_items", "content");
apiFor("audience_segments", "audience");

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = Number(err?.status) || 500;
  res.status(status).json({ error: err?.message || "Server error" });
});

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});

