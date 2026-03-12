const pool = require("../db");

// GET /api/countries
exports.getAllCountries = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM country ORDER BY name");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener países:", error);
    res.status(500).json({ error: "Error al obtener los países" });
  }
};

// GET /api/countries/:id
exports.getCountryById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM country WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) return res.status(404).json({ error: "País no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener país:", error);
    res.status(500).json({ error: "Error al obtener el país" });
  }
};

// POST /api/countries
exports.createCountry = async (req, res) => {
  const { name, capital, currency } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "El nombre del país es obligatorio" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO country (name, capital, currency) VALUES (?, ?, ?)",
      [name.trim(), capital || null, currency || null]
    );

    const [rows] = await pool.query("SELECT * FROM country WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error al crear país:", error);
    res.status(500).json({ error: "Error al crear el país" });
  }
};

// PUT /api/countries/:id
exports.updateCountry = async (req, res) => {
  const { name, capital, currency } = req.body;
  const id = req.params.id;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "El nombre del país es obligatorio" });
  }

  try {
    const [check] = await pool.query("SELECT * FROM country WHERE id = ?", [id]);
    if (check.length === 0) return res.status(404).json({ error: "País no encontrado" });

    await pool.query(
      "UPDATE country SET name = ?, capital = ?, currency = ? WHERE id = ?",
      [name.trim(), capital || null, currency || null, id]
    );

    const [rows] = await pool.query("SELECT * FROM country WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al actualizar país:", error);
    res.status(500).json({ error: "Error al actualizar el país" });
  }
};

// DELETE /api/countries/:id
exports.deleteCountry = async (req, res) => {
  const id = req.params.id;

  try {
    const [check] = await pool.query("SELECT * FROM country WHERE id = ?", [id]);
    if (check.length === 0) return res.status(404).json({ error: "País no encontrado" });

    await pool.query("DELETE FROM country WHERE id = ?", [id]);
    res.json({ message: "País eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar país:", error);
    res.status(500).json({ error: "Error al eliminar el país" });
  }
};