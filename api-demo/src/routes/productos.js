import express from "express";
import {
  ObtenerTodos,
  actualizar,
  crear,
  eliminar,
  obtenerPorId,
} from "../controllers/productos.js";

export const router = express.Router();

// Definimos las rutas
router.get("/", ObtenerTodos);
router.get("/:id", obtenerPorId);
router.post("/", crear);
router.put("/:id", actualizar);
router.delete("/:id", eliminar);
