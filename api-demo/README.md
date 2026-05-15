# TechFlow Pro — API de Inventario de Tecnología

Aplicación web fullstack para gestionar un inventario de productos tecnológicos. Incluye una API REST construida con **Node.js + Express** y un frontend estático servido desde la misma instancia.

---

## Integrantes del equipo

- Juan David Berrio Rivera - [GitHub](https://github.com/DeviDO527)
- Sebastián Betancourt Gonzalez - [GitHub](https://github.com/SebastianBetancourt777)
- Juan José Lopera Londoño - [GitHub](https://github.com/Loperaa-Juan)
- Juan José Zabala Preciado - [GitHub](https://github.com/zabalapreciado-alt)

---

## Requisitos previos

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) v18 o superior
- [Git](https://git-scm.com/)

Verifica las versiones con:

```bash
node -v
git --version
```

---

## Instalación y puesta en marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/Loperaa-Juan/proyecto_prog_web.git
```

### 2. Ingresar a la carpeta del proyecto

```bash
cd proyecto_prog_web/api-demo
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Iniciar el servidor

**Modo producción:**

```bash
npm start
```

**Modo desarrollo** (reinicia automáticamente al guardar cambios):

```bash
npm run dev
```

### 5. Abrir en el navegador

```
http://localhost:3000
```

---

## Estructura del proyecto

```
api-demo/
├── public/                 # Frontend estático
│   ├── index.html          # Interfaz principal
│   ├── app.js              # Lógica del cliente (fetch, DOM)
│   └── assets/
│       └── styles.css      # Estilos personalizados
└── src/
    ├── index.js            # Punto de entrada — levanta el servidor
    ├── app.js              # Configuración de Express (middlewares, rutas)
    ├── routes/
    │   └── productos.js    # Definición de rutas /api/productos
    ├── controllers/
    │   └── productos.js    # Lógica de cada endpoint
    ├── services/
    │   └── productos.js    # Lectura y escritura del JSON
    └── data/
        └── productos.json  # Base de datos (archivo JSON)
```

---

## Endpoints de la API

Base URL: `http://localhost:3000/api/productos`

| Método   | Ruta                   | Descripción                          | Body requerido                        |
|----------|------------------------|--------------------------------------|---------------------------------------|
| `GET`    | `/api/productos`       | Obtiene todos los productos          | —                                     |
| `GET`    | `/api/productos/:id`   | Obtiene un producto por ID           | —                                     |
| `POST`   | `/api/productos`       | Crea un nuevo producto               | `{ "nombre": string, "precio": number }` |
| `PUT`    | `/api/productos/:id`   | Actualiza un producto existente      | `{ "nombre": string, "precio": number, "disponible": boolean }` |
| `DELETE` | `/api/productos/:id`   | Elimina un producto                  | —                                     |

---

## Funcionalidades del frontend

- **Carga automática** de todos los productos al abrir la página
- **Tarjetas de resumen** con el total, disponibles y no disponibles
- **Buscador en tiempo real** por nombre de producto
- **Agregar producto** mediante formulario modal con validación inline
- **Toggle de disponibilidad** por producto con un solo clic
- **Eliminar producto** con confirmación previa
