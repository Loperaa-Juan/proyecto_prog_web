// En este caso, como configuramos el package.json con "type": "module", podemos usar import/export en lugar de require/module.exports
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ruta = path.join(__dirname, "../data/productos.json");

// Función para leer los productos registrados
export const leer = () => {
  const contenido = fs.readFileSync(ruta, "utf-8");
  return JSON.parse(contenido);
};

export const guardar = (productos) => {
  fs.writeFileSync(ruta, JSON.stringify(productos, null, 2));
};
