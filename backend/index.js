import express from "express";
import cors from "cors";
import pool from "./db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test
app.get("/", (req, res) => {
  res.send("API funcionando ✔");
});

// Obtener todas las tareas
app.get("/tareas", async (req, res) => {
  const result = await pool.query("SELECT * FROM tareas ORDER BY id ASC");
  res.json(result.rows);
});

// Crear tarea
app.post("/tareas", async (req, res) => {
  const { titulo } = req.body;
  const result = await pool.query(
    "INSERT INTO tareas (titulo, completada) VALUES ($1, false) RETURNING *",
    [titulo]
  );
  res.json(result.rows[0]);
});

// Cambiar estado completada
app.put("/tareas/:id", async (req, res) => {
  const { id } = req.params;
  const { completada } = req.body;

  await pool.query(
    "UPDATE tareas SET completada = $1 WHERE id = $2",
    [completada, id]
  );

  res.json({ success: true });
});

// Eliminar tarea
app.delete("/tareas/:id", async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM tareas WHERE id = $1", [id]);

  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor backend en puerto " + PORT));
