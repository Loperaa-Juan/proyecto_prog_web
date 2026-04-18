# Arquitectura del Sistema - ComplexityLab

## 1. Diagrama de Arquitectura (Plano Completo)

En el siguiente diagrama se muestra la estructura técnica planteada para interactuar entre el usuario y la persistencia de datos, cumpliendo con las tres capas obligatorias y las rutas de operaciones HTTP principales.

```mermaid
graph TD
    %% ----- CAPA DE CLIENTE -----
    A["CLIENTE (Navegador)<br/>Stack: HTML + CSS + JS (React, TypeScript, Vite)<br/><br/>Vistas Integradas:<br/>- Landing Page<br/>- Register & Login (Auth)<br/>- Dashboard<br/>- Explore Challenges<br/>- Chatbot / Optimizer"]

    %% ----- CAPA DE SERVIDOR -----
    B["SERVIDOR (Backend)<br/>Stack: Python + FastAPI<br/><br/>Lógica de Negocio y Estructura Principal:<br/>Servicios (services), Rutas (routers), y Modelos (models/schemas)"]

    %% ----- CAPA DE BASE DE DATOS -----
    C[("BASE DE DATOS / PERSISTENCIA<br/>Motor: PostgreSQL o SQLite<br/><br/>Tablas Principales:<br/>1. Users (Usuarios)<br/>2. Challenges (Desafíos)<br/>3. Sessions (Autenticación JWT)")]

    %% ----- FLUJO HTTP DE RUTAS (CLIENTE -> SERVIDOR) -----
    A -->|HTTP POST /users/register<br/>HTTP POST /users/login| B
    A -->|HTTP GET /challenges/list<br/>HTTP GET /dashboard| B
    A -->|HTTP POST /challenges/create<br/>HTTP POST /challenges/solve/id| B
    A -->|HTTP PUT /challenges/edit/id<br/>HTTP DELETE /challenges/delete/id| B

    %% ----- FLUJO SQL (SERVIDOR -> BD) -----
    B -->|Queries CRUD / SQL| C
    C -->|Data devuelta / ORM Models| B

    %% ----- FLUJO DE RESPUESTA (SERVIDOR -> CLIENTE) -----
    B -.->|JSON response (JWT token, mensajes, data)| A
```

---

## 2. Patrón Arquitectónico Elegido

**Patrón elegido:** Arquitectura en Capas (N-Layer Architecture)

**Justificación técnica:** En API REST modernas construidas con FastAPI, la Arquitectura en Capas permite un flujo vertical bidireccional muy claro para procesar peticiones web. Esta separación garantiza que cada objeto de código tenga una sola responsabilidad, desacoplando las rutas en sí de las lógicas complejas y del acceso a la base de datos de manera directa, creando validaciones intermedias.

### Estructura de carpetas reflejando el patrón:

A nivel físico, en el repositorio el backend implementa esta arquitectura dividiéndose explícitamente en:

```mermaid
text
    backend/
    ├── main.py         <- Módulo de entrada de la aplicación FastAPI.
    ├── routers/        <- Capa de Presentación (Controladores). Define endpoints HTTP.
    ├── schemas/        <- Capa de Transferencia (DTOs). Validación estricta Pydantic (entrada/salida).
    ├── services/       <- Capa de Lógica de Negocio. Ejecuta las reglas, validaciones avanzadas e integraciones.
    └── models/         <- Capa de Acceso a Datos / Persistencia. Define los esquemas SQL usando Object-Relational Mapping (ORM).
```

### Análisis de patrones

**1. ¿Cómo se divide el sistema con este patrón?**
El código del servidor se encuentra rígidamente fragmentado de manera jerárquica: de arriba hacia abajo, una petición viaja por la capa de `routers` (comunicación con HTTP) la cual recibe y transfiere datos limpios usando `schemas`. Esa información validada es inyectada a la capa de `services` (la cual aplica la lógica), y los `services` utilizan finalmente la capa profunda de `models` que interactúa directamente con los motores persistentes de la base de datos para extraer y/o mutar datos estructurados.

**2. ¿Dónde vive la lógica de negocio?**
Se sitúa única y netamente en la carpeta y capa de `services/`. Los controladores en `routers` no contienen ninguna lógica algorítmica ni de mutación del mundo real; los routers simplemente llaman a funciones asíncronas almacenadas en "servicios" los cuales dictan en qué condiciones un challenge puede ser resuelto o quién lo puede eliminar.

**3. ¿Qué tan fácil es cambiar la base de datos si se necesita?**
Extremadamente sencillo. Gracias a que usamos `models` (usualmente mediante herramientas de ORM como SQLAlchemy o un equivalente adaptado) acoplados únicamente a la base y la estructura de N-Capas, aislar la mutación SQL no es algo tan importante. Si decidiéramos cambiar de SQLite a PostgreSQL, solo modificamos la cadena de conexión del motor en un entorno y el mapeo sintáctico dentro de `models`, pero toda nuestra lógica de validación de negocio en `services` se mantendría idéntica y sin tocarse ya que nunca manipulan SQL de frente

**4. ¿Qué pasa si necesito agregar una nueva funcionalidad? (Ej. Un sistema de reportes)**
Si se requiere agregar una funcionalidad nueva se escalaría de la misma manera estratificada: se define un modelo (`models/reporte.py`), luego una validación (`schemas/reporte.py`), se codifica la regla de negocios de qué puede y no puede hacer (`services/reporte.py`) y al final, un enrutador web público e indiscreto (`routers/reporte.py`). No alteramos controladores viejos haciendo el código robusto y evitando integraciones espaguetis.

**5. ¿Cómo se comunican las capas/componentes entre sí?**
La comunicación sigue una regla de dependencia hacia abajo, lo que indica que la capa de arriba no sabe quién usa a la de abajo pero depende de ella. 
El Front-End hace una petición HTTP `GET` > `Router` captura la solicitud y lo empareja al protocolo API > Llama internamente al método en `Service` > `Service` inyecta valores en el manejador ORM de los `Models` > `Models` responde enviando diccionarios de datos o rows a `Service` > `Service` lo comprime pasando por la validación de un `Schema` > `Router` devuelve un JSON serializado.

**6. ¿Qué ventajas tiene este patrón para mi proyecto?**
Para _ComplexityLab_, que planea invocar a una IA externa, el N-Layer nos regala una separación idonea: Un `service` interactuará con las URIs de los LLM (como la API de OpenAI), pero el `router` no sabrá nunca qué IA utilizamos ni el `model` conocerá un JSON de un Prompt. Nos aísla la complejidad, facilita los tests unitarios y mantiene al estudiante centrado en la estructura.

**7. ¿Qué desventajas o limitaciones tiene?**
El gran problema de la Arquitectura en Capas frente a proyectos pequeños es su verbosidad de configuración y la generación de "arquitectura de barril", también conocida como el problema de la cebolla. Existe el nivel de sobreingeniería de que un simple "Leer un registro" obliga a crear por lo menos un método de router inútil que lo único que hace es llamar a un service inútil que llama a un solo método de model trivial, lo que cuesta bastantes líneas de boilerplate frente a un estilo sencillo ad-hoc o monolito sin capas.
