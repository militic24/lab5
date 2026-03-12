const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const countryRoutes = require("./routes/countryRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/countries", countryRoutes);

app.get("/", (req, res) => {
  res.send("API de Países funcionando correctamente con MySQL");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});