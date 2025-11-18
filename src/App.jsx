import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("tareas");
    if (saved) setTareas(JSON.parse(saved));
  }, []);

  const guardar = (lista) => {
    setTareas(lista);
    localStorage.setItem("tareas", JSON.stringify(lista));
  };

  const agregar = () => {
    if (!titulo.trim()) return;

    const nueva = {
      id: Date.now(),
      titulo,
      completada: false,
    };

    guardar([...tareas, nueva]);
    setTitulo("");
  };

  const toggle = (id) => {
    const nuevas = tareas.map(t =>
      t.id === id ? { ...t, completada: !t.completada } : t
    );
    guardar(nuevas);
  };

  const eliminar = (id) => {
    const nuevas = tareas.filter(t => t.id !== id);
    guardar(nuevas);
  };

  const completadas = tareas.filter(t => t.completada).length;
  const progreso = tareas.length > 0 ? (completadas / tareas.length) * 100 : 0;

  return (
    <div className="app-wrapper">
      <div className="container">
        <h1 className="title">Gestor de Tareas</h1>

        {/* Progreso */}
        <div className="progress-box">
          <p>
            {completadas} completadas / {tareas.length} totales
          </p>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progreso}%` }}></div>
          </div>
        </div>

        {/* Formulario */}
        <div className="form">
          <input
            type="text"
            placeholder="Escribe una nueva tarea..."
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && agregar()}
          />
          <button onClick={agregar}>Agregar</button>
        </div>

        {/* Lista */}
        <ul className="lista">
          {tareas.map(t => (
            <li key={t.id} className={t.completada ? "done tarea" : "tarea"}>
              <span onClick={() => toggle(t.id)}>{t.titulo}</span>
              <button className="delete" onClick={() => eliminar(t.id)}>✕</button>
            </li>
          ))}
        </ul>

        {/* Si no hay tareas */}
        {tareas.length === 0 && <p className="no-tasks">No hay tareas aún 😄</p>}
      </div>
    </div>
  );
}
