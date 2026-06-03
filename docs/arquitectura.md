# Arquitectura del Sistema — ComplexityLab

Este documento proporciona una descripción detallada de la arquitectura de **ComplexityLab**, una plataforma educativa impulsada por IA para explorar, resolver y analizar la complejidad algorítmica. Aquí se definen el estilo arquitectónico, el patrón de diseño estructurado en capas (N-Layer), la separación de responsabilidades, el flujo de datos, las decisiones técnicas clave, los trade-offs y los diagramas del sistema.

---

## 1. Estilo Arquitectónico General

ComplexityLab se basa en el estilo arquitectónico **Cliente-Servidor (Client-Server)** y se implementa bajo principios de **API RESTful**.

### Características principales:
* **Desacoplamiento total (Decoupling):** El cliente (Frontend SPA) y el servidor (Backend API) son independientes. Se comunican exclusivamente a través del protocolo seguro HTTPS mediante peticiones REST utilizando el formato estructurado JSON. Esto permite el desarrollo paralelo de ambas capas y facilita futuras migraciones o rediseños de la interfaz sin alterar la lógica de negocio.
* **Sin estado (Statelessness):** Cada solicitud HTTP enviada desde el cliente al servidor contiene toda la información necesaria para comprender y procesar la petición. La autenticación se realiza a través de tokens JSON Web Tokens (JWT) enviados en la cabecera `Authorization` como un esquema `Bearer`, eliminando la necesidad de almacenar sesiones de usuario en la memoria del servidor de aplicaciones.
* **Interfaz uniforme:** Se establecen contratos de endpoints claros y semánticos basados en métodos HTTP estándar (`GET`, `POST`, `PUT`, `DELETE`), respondiendo con códigos de estado HTTP estandarizados (ej: `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`).

---

## 2. Patrón Arquitectónico Elegido

El sistema implementa una **Arquitectura en Capas (N-Layer Architecture)** para estructurar de manera jerárquica y ordenada el flujo de control y dependencias del backend. En el frontend se adopta el patrón de **Arquitectura basada en Componentes de React**.

### Estructura de Capas del Backend (FastAPI):
1. **Capa de Presentación (Routers / Controladores):** Define los puntos de entrada (endpoints) de la API REST. Se encarga de recibir las peticiones HTTP directas, extraer los parámetros y delegar la ejecución a la capa de servicios.
2. **Capa de Validación (Schemas / DTOs):** Define las estructuras de datos de entrada y salida mediante modelos de **Pydantic**. Realiza la validación estricta y tipado de los datos antes de que entren a la lógica de negocio o sean retornados al usuario.
3. **Capa de Lógica de Negocio (Services / Servicios):** Es el corazón algorítmico del sistema. Contiene las reglas del negocio, las integraciones con servicios externos (como la API de OpenAI para el chatbot/optimizador) y coordina la persistencia llamando a la capa de datos.
4. **Capa de Acceso a Datos (Models / Persistencia):** Define la estructura de las entidades de la base de datos utilizando un mapeador objeto-relacional (ORM) como **SQLAlchemy**. Gestiona las conexiones y las mutaciones de estado directo en la persistencia.

---

## 3. Separación de Responsabilidades

Para asegurar una arquitectura mantenible y escalable, cada capa tiene un rol bien delimitado. La siguiente tabla resume la separación de responsabilidades:

| Capa | Responsabilidad Principal | Lo que NO debe hacer |
| :--- | :--- | :--- |
| **Routers (Presentación)** | Mapear URLs a funciones, extraer tokens JWT, gestionar códigos de estado HTTP y responder al cliente. | Realizar consultas SQL directamente, procesar lógica algorítmica pesada o comunicarse con la API de OpenAI. |
| **Schemas (Validación)** | Definir tipos de datos y restricciones de entrada/salida (e.g. longitud de string, correos válidos). | Escribir en la base de datos o verificar contraseñas. |
| **Services (Lógica)** | Ejecutar reglas de negocio (ej: validar si un usuario es dueño del reto antes de borrarlo), procesar Prompts de IA. | Conocer rutas HTTP, interpretar parámetros de URL directos o formatear respuestas HTTP personalizadas. |
| **Models (Persistencia)** | Definir tablas, relaciones (Foreign Keys) y mapear objetos Python a registros de la base de datos. | Conocer las reglas de negocio globales o realizar llamadas HTTP externas. |
| **Frontend (React)** | Renderizar la interfaz de usuario, mantener el estado visual local y consumir los endpoints de la API. | Conectarse directamente a la base de datos o almacenar secretos del lado del servidor (como API Keys de OpenAI). |

---

## 4. Flujo de Datos

El flujo de información en ComplexityLab varía según el tipo de operación. A continuación se detallan los dos flujos principales del sistema:

### Flujo A: Operación CRUD Estándar (Ejemplo: Registrar una Solución)
1. **Acción del Usuario:** El usuario envía su solución en la interfaz de un desafío.
2. **Cliente (React):** Envía una petición `POST /challenges/solve/{id}` con el código de la solución en el cuerpo del JSON y el token JWT en las cabeceras.
3. **Controlador (Routers):** Valida la presencia de la cabecera `Authorization` y el token JWT. Delega el cuerpo JSON recibido a la validación de Pydantic.
4. **Validación (Schemas):** Verifica que el formato del código sea válido y no nulo.
5. **Negocio (Services):** Recibe los datos validados del usuario y realiza comprobaciones de negocio (por ejemplo, validar si el desafío `{id}` existe en la base de datos y si el usuario autenticado tiene permitido resolverlo).
6. **Persistencia (Models):** Crea una nueva instancia del modelo de solución, abre una transacción con SQLAlchemy y la inserta en la base de datos.
7. **Retorno de Respuesta:** La base de datos confirma el insert, la capa de persistencia retorna el registro creado a la capa de servicios, esta lo transfiere al router, el cual lo serializa a través de un esquema de salida y responde al navegador con un estado `201 Created`.
8. **UI (React):** Recibe la confirmación en formato JSON y actualiza el estado local de la interfaz de usuario, mostrando un mensaje de éxito.

### Flujo B: Operación con Inteligencia Artificial (Ejemplo: Chatbot / Optimizador de Código)
1. **Petición del Usuario:** El usuario selecciona su código de solución y solicita una optimización socrática a través del Chatbot.
2. **Cliente (React):** Envía una petición `POST /optimize` al backend.
3. **Controlador (Routers):** Captura la petición y extrae el cuerpo JSON que contiene el fragmento de código y el contexto del problema.
4. **Validación (Schemas):** Valida la tipicidad del código y descripción del desafío enviado.
5. **Servicio de IA (Services):** 
   - Genera el *System Prompt* diseñado especialmente con enfoque socrático (donde se prohíbe entregar el código completamente resuelto, instruyendo al modelo a guiar al estudiante mediante pistas sobre complejidad temporal $O(n)$ y espacial).
   - Genera el *User Prompt* con el código enviado por el usuario.
   - Realiza una llamada asíncrona a la API de OpenAI (`openai.ChatCompletion.create`) utilizando la API Key configurada de forma segura del lado del servidor.
6. **API de OpenAI:** Procesa la solicitud y retorna una respuesta con la sugerencia de optimización y preguntas socráticas.
7. **Servicio (Services):** Estructura la respuesta de la IA.
8. **Controlador & Cliente:** El router responde con un `200 OK` enviando el JSON estructurado con las sugerencias. El Frontend React renderiza la retroalimentación en un panel interactivo del chat en tiempo real.

---

## 5. Decisiones Técnicas Clave

* **FastAPI (Python):** Se selecciona debido a su alto rendimiento (comparable a NodeJS y Go gracias a `asyncio`), su generación automática de documentación interactiva OpenAPI (Swagger/ReDoc) y su integración nativa con Pydantic para tipado estático y validación.
* **React con TypeScript (Frontend):** TypeScript proporciona seguridad de tipos en tiempo de desarrollo, reduciendo errores en producción. React permite el diseño modular y responsivo requerido, optimizando el rendimiento mediante el uso del Virtual DOM.
* **SQLAlchemy (ORM):** Permite aislar al equipo de desarrollo de la sintaxis SQL específica de cada motor. Esto facilita escribir código orientado a objetos de Python mientras SQLAlchemy se encarga de la generación eficiente de queries y el mapeo relacional.
* **Validación mediante Pydantic:** Al estar integrado con FastAPI, permite definir la estructura de entrada y salida con tipado nativo de Python, logrando una sanitización automática de datos que previene ataques de inyección y datos corruptos.
* **Autenticación JWT:** Garantiza una arquitectura sin estado (stateless) óptima para escalar en la nube. Los datos de sesión (ID, Username, Rol) se transportan de forma segura en un token firmado criptográficamente por el servidor, eliminando la necesidad de consultas recurrentes a una tabla de sesiones persistente.
* **API de OpenAI (Codex / GPT):** Permite incorporar el procesamiento del analizador algorítmico y chatbot de soporte interactivo sin requerir un costoso hardware local (GPUs) para entrenar o alojar modelos de lenguaje grandes (LLMs).

---

## 6. Trade-offs (Compromisos Técnicos)

### N-Capas (N-Layer) vs. Estructura Plana / Monolito Simple
* **Ventajas (Elegida):** Excelente separación de conceptos, alta testabilidad (es posible hacer mock de modelos y servicios por separado) y facilidad para que múltiples desarrolladores trabajen en distintas partes del código sin conflictos.
* **Desventajas:** Mayor cantidad de archivos y código repetitivo (boilerplate) para operaciones simples. Por ejemplo, leer un solo registro requiere tocar Router, Schema, Service y Model. En aplicaciones muy pequeñas, esto puede percibirse como sobreingeniería. Sin embargo, para ComplexityLab se justifica para facilitar la escalabilidad del sistema educativo.

### Consumo de LLM vía API Externa (OpenAI) vs. Servidor de Inferencia Local
* **Ventajas (Elegida):** Acceso inmediato a modelos de vanguardia (state-of-the-art), sin costo de infraestructura fija inicial, fácil de implementar y configurar, y sin necesidad de administrar clústeres de GPUs.
* **Desventajas:** Dependencia de la disponibilidad y tiempos de respuesta de un tercero, costo variable por volumen de tokens consumidos, y envío de fragmentos de código del usuario fuera del servidor propio (privacidad de datos).

### ORM (SQLAlchemy) vs. Queries SQL Nativas
* **Ventajas (Elegida):** Portabilidad de la base de datos (el mismo código funciona en SQLite y PostgreSQL), seguridad nativa contra inyecciones SQL y mayor rapidez de desarrollo inicial.
* **Desventajas:** Ligera sobrecarga de rendimiento debido a la traducción a SQL que realiza el ORM y dificultad añadida al intentar escribir consultas analíticas sumamente complejas que serían más directas y optimizadas en SQL nativo.

### SQLite (Desarrollo) vs. PostgreSQL (Producción)
* **Ventajas (Elegida):** SQLite no requiere instalación de servicios de servidor locales, lo que simplifica y agiliza el entorno de desarrollo para nuevos programadores. PostgreSQL ofrece alta concurrencia, soporte de tipos avanzados (como JSONB) y confiabilidad en producción.
* **Desventajas:** Puede haber discrepancias menores de sintaxis SQL o compatibilidad de tipos entre desarrollo y producción. Sin embargo, el uso de SQLAlchemy como ORM mitiga en gran medida este riesgo.

---

## 7. Tabla de Justificación del Stack

| Tecnología | Rol en el Proyecto | Ventajas Clave | Alternativas Evaluadas | Razones de Selección |
| :--- | :--- | :--- | :--- | :--- |
| **FastAPI** | Framework del Backend | Velocidad asíncrona, Pydantic nativo, auto-documentación OpenAPI. | Django, Flask, Express.js | Django es muy pesado para APIs REST puras; Flask carece de validación asíncrona nativa; Express requiere JavaScript en backend, mientras que Python es mejor para integraciones de IA. |
| **React + TS** | Framework del Cliente | Arquitectura de componentes interactiva, modularidad, tipado estático seguro. | Vue, Angular, Vanilla JS | TypeScript previene errores en tiempo de compilación. React cuenta con el ecosistema de componentes de UI y editores de código más maduro. |
| **PostgreSQL** | Base de Datos (Producción) | Soporte ACID robusto, manejo excelente de concurrencia y relaciones complejas. | MySQL, MongoDB | MongoDB (NoSQL) no garantiza las relaciones rígidas que requieren nuestros modelos relacionales de Soluciones-Challenges-Usuarios de forma nativa. |
| **SQLite** | Base de Datos (Desarrollo) | Cero configuración, base de datos local basada en un solo archivo. | Postgres Local, Docker Postgres | Evita la fricción de instalar motores de bases de datos complejos en los equipos locales de los desarrolladores nuevos. |
| **SQLAlchemy** | ORM del Backend | Mapeo relacional, protección de inyección SQL, portabilidad de motores DB. | SQL Puro, Tortoise ORM | Proporciona la biblioteca de ORM más madura, probada y flexible de la comunidad de Python. |
| **Pydantic** | Validación y Schemas | Validación estructurada de tipos de datos, velocidad en C, interoperabilidad. | Marshmallow | Viene integrado por defecto en FastAPI, ofreciendo una velocidad de ejecución muy superior y validación nativa basada en anotaciones de tipo estándar. |
| **OpenAI API** | Motor de Optimización IA | Respuestas altamente coherentes de código, soporte socrático por Prompting. | Llama 2 Local, Hugging Face | El alojamiento de modelos Open Source locales requiere hardware de GPUs especializado que aumentaría drásticamente los costos de alojamiento iniciales. |

---

## 8. Diagramas Técnicos de Arquitectura

A continuación se presentan los cuatro diagramas técnicos clave que representan la arquitectura del sistema ComplexityLab.

### D04. Diagrama de Arquitectura o Contenedores
Este diagrama de nivel 2 (C4 Model) muestra los límites lógicos del sistema y los contenedores de software que interactúan entre sí.

![D04. Diagrama de Arquitectura o Contenedores](../Images/D04_arquitectura.png)

```mermaid
graph TB
    %% Definición de Nodos principales
    User["Usuario<br/>(Estudiante, Docente, Profesional)"]
    
    subgraph ClientContainer["Contenedor Cliente (Navegador)"]
        SPA["Cliente Web SPA<br/>(React / TypeScript / Vite)<br/><br/>Renderiza la interfaz de retos, editor de código, dashboard y chat del optimizador."]
    end

    subgraph CloudInfra["Contenedores de Backend y Servicios"]
        subgraph BackendAPI["Backend de Aplicaciones"]
            FastAPI["Servidor de API REST<br/>(FastAPI / Python)<br/><br/>Procesa solicitudes, valida tokens, aplica lógica y consume servicios de IA."]
        end

        subgraph DataStore["Capa de Almacenamiento"]
            DB[("Base de Datos Relacional<br/>(PostgreSQL / SQLite)<br/><br/>Persiste información de usuarios, desafíos, soluciones e historial.")]
        end

        subgraph ExternalAPIs["Capa de Servicios Externos"]
            OpenAI["OpenAI API Cloud<br/>(Modelos GPT / Codex)<br/><br/>Proporciona análisis de código bajo un enfoque socrático estructurado."]
        end
    end

    %% Relaciones de flujo
    User -->|1. Interactúa con UI| SPA
    SPA -->|2. Peticiones HTTPS (JSON + JWT)| FastAPI
    FastAPI -->|3. Queries / Transacciones SQL (SQLAlchemy)| DB
    DB -->|4. Retorna filas / Resultados| FastAPI
    FastAPI -->|5. Envía fragmento de código + Prompt Socrático| OpenAI
    OpenAI -->|6. Retorna análisis de complejidad y sugerencias| FastAPI
    FastAPI -->|7. Responde JSON estructurado| SPA
    SPA -->|8. Renderiza retroalimentación de la IA en la UI| User

    %% Estilos de los contenedores
    style SPA fill:#003366,stroke:#fff,stroke-width:2px,color:#fff
    style FastAPI fill:#006666,stroke:#fff,stroke-width:2px,color:#fff
    style DB fill:#333333,stroke:#fff,stroke-width:2px,color:#fff
    style OpenAI fill:#660066,stroke:#fff,stroke-width:2px,color:#fff
```

### D05. Diagrama de Componentes o Capas
Este diagrama detalla la estructura lógica interna tanto del Cliente React como del Servidor FastAPI, mostrando cómo se comunican las capas.

![D05. Diagrama de Componentes o Capas](../Images/D05_componentes.png)

```mermaid
graph TD
    subgraph FrontendSPA["FRONTEND: Aplicación de Una Sola Página (React)"]
        Pages["Capa de Vistas y Páginas<br/>(LandingPage, Login, Dashboard, Challenges)"]
        Components["Componentes Comunes Reutilizables<br/>(ThemeToggle, CodeEditor, ChatBox)"]
        APIClient["Servicios de Cliente API (Fetch/Axios)<br/>(auth_api, challenge_api, ai_api)"]

        Pages -->|Usa| Components
        Pages -->|Consume datos de| APIClient
        Components -->|Llama endpoints mediante| APIClient
    end

    subgraph BackendAPI["BACKEND: API REST en Capas (FastAPI)"]
        Routers["1. Capa de Presentación / Routers<br/>(auth_router.py, challenge_router.py, ai_router.py)"]
        Schemas["2. Capa de Validación / Schemas Pydantic<br/>(user_schemas, challenge_schemas, ai_schemas)"]
        Services["3. Capa de Negocio / Services<br/>(auth_service, challenge_service, ai_service)"]
        Models["4. Capa de Acceso a Datos / Models ORM<br/>(user_model, challenge_model, solution_model)"]

        Routers -->|Valida peticiones con| Schemas
        Routers -->|Invoca lógica en| Services
        Services -->|Realiza transacciones con| Models
    end

    subgraph DBStore["PERSISTENCIA"]
        SQLDB[("Motor SQL de base de datos<br/>(PostgreSQL / SQLite)")]
    end

    %% Conexiones cruzadas
    APIClient -->|1. Request HTTP (JSON + JWT)| Routers
    Routers -.->|2. Response HTTP (JSON)| APIClient
    Models -->|3. SQL Queries| SQLDB
    SQLDB -->|4. Registro de Datos| Models

    %% Estilizado
    style Pages fill:#1f4e79,stroke:#fff,color:#fff
    style Components fill:#2f75b5,stroke:#fff,color:#fff
    style APIClient fill:#bdd7ee,stroke:#333,color:#000
    
    style Routers fill:#70ad47,stroke:#fff,color:#fff
    style Schemas fill:#a9d18e,stroke:#333,color:#000
    style Services fill:#e2f0d9,stroke:#333,color:#000
    style Models fill:#548235,stroke:#fff,color:#fff
```

### D07. Diagrama de Despliegue
Este diagrama describe la distribución física de los componentes de software en los nodos de hardware e infraestructura en la nube de producción.

![D07. Diagrama de Despliegue](../Images/D07_despliegue.png)

```mermaid
graph TB
    subgraph ClientNode["Dispositivo del Usuario Final"]
        Browser["Navegador Web<br/>(Chrome, Safari, Firefox, Edge)"]
    end

    subgraph CloudVercel["Nube de Hosting Estático (Vercel / Netlify CDN)"]
        FEStatic["Artefactos Compilados Frontend<br/>(HTML5, CSS3, JS optimizado)"]
    end

    subgraph CloudRender["Nube de Servidor Web (Render / Railway)"]
        subgraph BEVM["Entorno Virtual Linux"]
            FastAPIApp["Aplicación FastAPI en Ejecución<br/>(Gunicorn / Uvicorn Server)<br/>Hospedado en Python 3.10+"]
        end
    end

    subgraph CloudSupabase["Servicio DBaaS Relacional (Supabase / AWS RDS)"]
        DBInstance[("Instancia de Producción PostgreSQL<br/>(Acceso seguro por SSL y contraseña criptográfica)")]
    end

    subgraph CloudOpenAI["Infraestructura de OpenAI"]
        OpenAIEndpoints["Puntos de Enlace de API de OpenAI<br/>(Modelos GPT / Codex)"]
    end

    %% Flujo físico de conexiones
    Browser -->|1. Descarga recursos estáticos (HTTPS)| FEStatic
    Browser -->|2. Interactúa con API REST (HTTPS + JWT)| FastAPIApp
    FastAPIApp -->|3. Consultas a la base de datos (Protocolo Postgres SSL / Port 5432)| DBInstance
    FastAPIApp -->|4. Llamadas a servicios de inferencia IA (HTTPS + API Key)| OpenAIEndpoints

    %% Estilos de los nodos
    style Browser fill:#f5f5f5,stroke:#333,color:#000
    style FEStatic fill:#000000,stroke:#fff,color:#fff
    style FastAPIApp fill:#00a3a3,stroke:#fff,color:#fff
    style DBInstance fill:#336699,stroke:#fff,color:#fff
    style OpenAIEndpoints fill:#74aa9c,stroke:#fff,color:#fff
```

### D08. Estructura de Carpetas del Proyecto
La estructura del repositorio refleja el desacoplamiento de la plataforma, separando los recursos de diseño del Frontend de las especificaciones y flujos arquitectónicos.

![D08. Estructura de Carpetas del Proyecto](../Images/D08_estructura.png)

```text
proyecto_prog_web/                   # Raíz del repositorio de ComplexityLab
│
├── README.md                        # Documentación principal y guía de inicio rápido del proyecto
├── Analisis_Proyecto.md             # Respuestas exhaustivas a las 4 preguntas de negocio
├── DECISIONES.md                    # Registro de decisiones de diseño y UI tomadas
├── Diagrama-Estructura-Proyecto...  # Diagrama estructural inicial en formato drawio
│
├── docs/                            # Documentación técnica general del sistema
│   ├── analisis.md                  # Análisis de actores, requerimientos, datos y restricciones
│   └── arquitectura.md              # Este archivo (Arquitectura detallada, trade-offs y diagramas)
│
├── Images/                          # Activos de documentación técnica
│   └── RepresentaciónGráficaEsquemaDBComplexityLab.png  # Esquema físico del modelo de base de datos
│
├── landing_page/                    # Frontend: Prototipo actual de interfaz responsiva
│   ├── logo.svg                     # Identidad gráfica corporativa en formato vectorial
│   ├── index.html                   # Página principal (Inicio, Características, Desafíos Destacados)
│   ├── login.html                   # Vista de autenticación integrada (Ingreso / Registro)
│   ├── challenges.html              # Vista de exploración de retos interactivos
│   ├── styles.css                   # Hoja de estilos global, paleta oscura y diseño responsivo
│   ├── auth.css                     # Estilos dedicados de la interfaz de login/registro
│   └── challenges.css               # Estilos dedicados de la interfaz de catálogo de retos
│
└── backend/                         # Estructura del Backend (FastAPI - Implementación Planificada)
    ├── main.py                      # Punto de entrada de la aplicación FastAPI y registro de routers
    ├── requirements.txt             # Dependencias del backend (FastAPI, SQLAlchemy, Pydantic, Uvicorn)
    │
    ├── routers/                     # Capa de Presentación (Controladores / Endpoints HTTP)
    │   ├── __init__.py
    │   ├── auth_router.py           # Rutas para el registro y autenticación (/users/register, /users/login)
    │   ├── challenge_router.py      # Rutas para CRUD y resolución de retos (/challenges/list, /challenges/create...)
    │   └── ai_router.py             # Rutas para el chatbot y optimización de código (/optimize)
    │
    ├── schemas/                     # Capa de Validación y Transferencia de Datos (DTOs de Pydantic)
    │   ├── __init__.py
    │   ├── user_schemas.py          # Esquemas de entrada y salida para usuarios y tokens
    │   ├── challenge_schemas.py     # Esquemas de validación de desafíos y soluciones de código
    │   └── ai_schemas.py            # Esquemas de entrada y salida para peticiones al chatbot
    │
    ├── services/                    # Capa de Lógica de Negocio y Reglas de Aplicación
    │   ├── __init__.py
    │   ├── auth_service.py          # Lógica de encriptación de claves, generación y validación de tokens JWT
    │   ├── challenge_service.py     # Reglas para resolver, crear, validar y eliminar desafíos
    │   └── ai_service.py            # Integración con la API de OpenAI y construcción de prompts socráticos
    │
    └── models/                      # Capa de Datos / Modelos de Persistencia (SQLAlchemy ORM)
        ├── __init__.py
        ├── database.py              # Configuración de la conexión del motor de base de datos (Engine, Session)
        ├── user_model.py            # Definición física de la tabla de Usuarios (ID, Username, Email, PasswordHash)
        ├── challenge_model.py       # Definición física de la tabla de Desafíos (ID, Title, Description, CreadorID)
        └── solution_model.py        # Definición física de la tabla de Soluciones (ID, Code, AutorID, ChallengeID)
```
