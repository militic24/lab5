import { useEffect, useMemo, useState } from "react";
import {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
} from "./services/api";
import "./App.css";

export default function App() {
  const [countries, setCountries] = useState([]);
  const [name, setName] = useState("");
  const [capital, setCapital] = useState("");
  const [currency, setCurrency] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  const loadCountries = async () => {
    setLoading(true);
    try {
      const data = await getCountries();
      setCountries(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCountries();
  }, []);

  const resetForm = () => {
    setName("");
    setCapital("");
    setCurrency("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const country = {
      name: name.trim(),
      capital: capital.trim(),
      currency: currency.trim(),
    };

    if (!country.name || !country.capital || !country.currency) return;

    if (isEditing) {
      await updateCountry(editingId, country);
    } else {
      await createCountry(country);
    }

    resetForm();
    loadCountries();
  };

  const handleEdit = (country) => {
    setEditingId(country.id);
    setName(country.name || "");
    setCapital(country.capital || "");
    setCurrency(country.currency || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Seguro que quieres eliminar este país?");
    if (!ok) return;
    await deleteCountry(id);
    loadCountries();
  };

  return (
    <div className="page">
      <div className="card">
        <div className="header">
          <div>
            <h1 className="title">CRUD Países</h1>
            <p className="subtitle">
              Administra países con MySQL + Express + React
            </p>
          </div>

          <span className={`badge ${isEditing ? "badge-edit" : "badge-create"}`}>
            {isEditing ? "Modo edición" : "Nuevo registro"}
          </span>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="grid">
            <div className="field">
              <label>Nombre</label>
              <input
                placeholder="Ej. México"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Capital</label>
              <input
                placeholder="Ej. Ciudad de México"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Moneda</label>
              <input
                placeholder="Ej. Peso Mexicano"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </div>
          </div>

          <div className="actions">
            <button className={`btn ${isEditing ? "btn-primary" : "btn-success"}`} type="submit">
              {isEditing ? "Actualizar" : "Crear"}
            </button>

            <button className="btn btn-ghost" type="button" onClick={resetForm}>
              Limpiar
            </button>
          </div>
        </form>
      </div>

      <div className="card listCard">
        <div className="listHeader">
          <h2 className="listTitle">Lista de Países</h2>
          <div className="small">
            {loading ? "Cargando..." : `${countries.length} registros`}
          </div>
        </div>

        {loading ? (
          <div className="empty">Cargando países...</div>
        ) : countries.length === 0 ? (
          <div className="empty">No hay países todavía. Agrega uno arriba.</div>
        ) : (
          <div className="list">
            {countries.map((c) => (
              <div className="row" key={c.id}>
                <div className="rowMain">
                  <div className="rowTitle">{c.name}</div>
                  <div className="rowMeta">
                    <span>🏛️ {c.capital}</span>
                    <span>💱 {c.currency}</span>
                  </div>
                </div>

                <div className="rowBtns">
                  <button className="btn btn-warning" onClick={() => handleEdit(c)}>
                    Editar
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>  
        )}
      </div>

      <div className="footer">localhost:3000 · React CRUD</div>
    </div>
  );
}