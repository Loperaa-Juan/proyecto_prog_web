// Definimos nuestra app de express
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { router as productosRoutes } from './routes/productos.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const app = express();

//  Middleware: parsear cuerpo JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware: logger de peticiones
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Middleware: CORS simplificado
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Archivos estáticos (frontend)
app.use(express.static(join(__dirname, "../public")));

// Rutas
app.use("/api/productos", productosRoutes);

// Ruta raíz → sirve el index.html
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../public/index.html"));
});

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada", ruta: req.originalUrl });
});
