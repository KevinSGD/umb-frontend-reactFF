import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");

  // Cargar desde LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem("tareas");
    if (stored) setTareas(JSON.parse(stored));
  }, []);

  // Guardar en LocalStorage
  const guardarTareas = (nuevas) => {
    setTareas(nuevas);
    localStorage.setItem("tareas", JSON.stringify(nuevas));
  };

  // Agregar tarea
  const agregarTarea = () => {
    if (!titulo.trim()) return;
    const nueva = {
      id: Date.now(),
      titulo,
      completada: false,
    };
    guardarTareas([...tareas, nueva]);
    setTitulo("");
  };

  // Marcar como completada
  const toggleTarea = (id) => {
    const nuevas = tareas.map(t =>
      t.id === id ? { ...t, completada: !t.completada } : t
    );
    guardarTareas(nuevas);
  };

  // Eliminar
  const eliminarTarea = (id) => {
    const nuevas = tareas.filter(t => t.id !== id);
    guardarTareas(nuevas);
  };

  return (
    <div className="container">
      <h1>Gestor de Tareas</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Escribe una tarea..."
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
        />
        <button onClick={agregarTarea}>Agregar</button>
      </div>

      <ul className="lista">
        {tareas.map(t => (
          <li key={t.id} className={t.completada ? "done" : ""}>
            <span onClick={() => toggleTarea(t.id)}>{t.titulo}</span>
            <button className="delete" onClick={() => eliminarTarea(t.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
