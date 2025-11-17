// src/App.js
import React, { useEffect, useState } from "react";

// 🔗 URL del backend en Render
const API_URL = "https://umb-web-taller.onrender.com";

function App() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [loading, setLoading] = useState(false);

  // Obtener tareas del backend
  const fetchTareas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/index.php`);
      const data = await res.json();
      setTareas(data);
    } catch (err) {
      console.error("Error cargando tareas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTareas();
  }, []);

  // Crear tarea
  const crear = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    await fetch(`${API_URL}/index.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo }),
    });

    setTitulo("");
    fetchTareas();
  };

  // Marcar completada
  const toggleCompleta = async (t) => {
    await fetch(`${API_URL}/index.php?id=${t.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completada: !t.completada }),
    });

    fetchTareas();
  };

  // Eliminar tarea
  const eliminar = async (id) => {
    await fetch(`${API_URL}/index.php?id=${id}`, {
      method: "DELETE",
    });

    fetchTareas();
  };

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "2rem auto",
        padding: 20,
        fontFamily: "Arial",
      }}
    >
      <h1>Lista de Tareas</h1>

      <form onSubmit={crear} style={{ marginBottom: 20 }}>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Nueva tarea..."
          style={{ padding: 8, width: "70%" }}
        />
        <button style={{ padding: 8, marginLeft: 8 }}>Agregar</button>
      </form>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tareas.map((t) => (
            <li
              key={t.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <input
                type="checkbox"
                checked={!!t.completada}
                onChange={() => toggleCompleta(t)}
              />

              <span
                style={{
                  marginLeft: 8,
                  textDecoration: t.completada ? "line-through" : "none",
                }}
              >
                {t.titulo}
              </span>

              <button
                onClick={() => eliminar(t.id)}
                style={{ marginLeft: "auto" }}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
