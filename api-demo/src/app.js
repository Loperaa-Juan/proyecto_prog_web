// Definimos nuestra app de express
import express from "express";
import { router as productosRoutes } from './routes/productos.js';

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

// Rutas
app.use("/api/productos", productosRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.json({
    mensaje: "API funcionando",
    version: "1.0.0",
    endpoints: { productos: "/api/productos" },
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada", ruta: req.originalUrl });
});
