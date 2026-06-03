# 📄 SRS — Software Requirements Specification
## ComplexityLab
**Asignatura:** Programación Web — IF2003 | **Grupo:** 603
**Responsable de este documento:** Juan José Zabala Preciado

---

## 1. Introducción

### 1.1 Propósito del documento
Este documento describe los requerimientos del sistema **ComplexityLab**, una plataforma educativa web orientada al aprendizaje de complejidad algorítmica mediante desafíos de programación y retroalimentación asistida por inteligencia artificial.

### 1.2 Alcance del sistema
ComplexityLab permite a los usuarios registrarse, crear y resolver *challenges* de programación, recibir retroalimentación socrática de un modelo de lenguaje (LLM), y visualizar su progreso personal en un dashboard. El sistema está compuesto por:
- Un **frontend** en React + TypeScript + Vite
- Un **backend** en Python + FastAPI
- Una **base de datos** PostgreSQL / SQLite gestionada mediante SQLAlchemy

### 1.3 Público objetivo del documento
- Evaluadores académicos del curso IF2003
- Equipo de desarrollo del proyecto
- Cualquier persona técnica que necesite comprender, mantener o extender el sistema

### 1.4 Definiciones, siglas y abreviaturas

| Término | Definición |
|---------|-----------|
| **API** | Application Programming Interface — interfaz para comunicación entre sistemas |
| **JWT** | JSON Web Token — mecanismo de autenticación basado en tokens firmados |
| **LLM** | Large Language Model — modelo de lenguaje de gran escala (ej. Claude, GPT) |
| **CRUD** | Create, Read, Update, Delete — operaciones básicas sobre datos |
| **ORM** | Object-Relational Mapper — herramienta que traduce objetos Python a SQL (SQLAlchemy) |
| **Challenge** | Ejercicio de programación propuesto por un usuario dentro de la plataforma |
| **Solution** | Código enviado por un usuario como respuesta a un challenge |
| **SRS** | Software Requirements Specification — documento de especificación de requerimientos |
| **REST** | Representational State Transfer — estilo arquitectónico para APIs web |

### 1.5 Referencias
- Especificaciones del Proyecto Final — IF2003, Grupo 603
- Documentación oficial FastAPI: https://fastapi.tiangolo.com
- Documentación oficial React: https://reactjs.org
- Repositorio del proyecto: https://github.com/Loperaa-Juan/proyecto_prog_web

---

## 2. Descripción general

### 2.1 Contexto del problema
Muchos estudiantes y profesionales de programación tienen dificultades para desarrollar un pensamiento algorítmico eficiente. Aprenden a escribir código que funciona, pero no comprenden por qué ciertos algoritmos son más eficientes que otros en términos de complejidad temporal y espacial (notación Big-O).

### 2.2 Oportunidad o necesidad detectada
No existe una plataforma que combine la práctica de retos de programación con retroalimentación socrática impulsada por IA, que guíe al estudiante hacia la optimización sin revelar la solución directamente. Las plataformas existentes (LeetCode, HackerRank) muestran la respuesta sin fomentar el razonamiento propio.

### 2.3 Descripción de la solución propuesta
**ComplexityLab** es una plataforma web full-stack que permite a los usuarios explorar y resolver challenges de programación. Su diferenciador principal es el **Optimizador IA**: un chatbot basado en LLM que analiza el código del usuario y ofrece pistas de mejora sin dar la respuesta completa, fomentando el aprendizaje autónomo mediante la filosofía socrática.

### 2.4 Actores o tipos de usuario

| Actor | Descripción |
|-------|------------|
| **Usuario No Autenticado** | Puede ver la landing page y el listado público de challenges |
| **Usuario Autenticado** | Puede crear, editar y eliminar sus challenges, resolver challenges de otros, usar el optimizador IA y ver su dashboard personal |
| **Creador de Challenge** | Usuario autenticado con permisos para revisar y aprobar/rechazar soluciones enviadas a sus propios challenges |

### 2.5 Supuestos, restricciones y dependencias
- El sistema requiere conexión a internet para consumir la API del LLM externo
- El modelo de IA utilizado debe tener capacidades de análisis y generación de código
- En esta versión no se implementan roles de administrador
- La validación de soluciones es manual: la realiza el creador del challenge, no el sistema automáticamente
- Se asume que los usuarios tienen conocimientos básicos de programación

---

## 3. Requerimientos funcionales

| ID | Requerimiento funcional | Prioridad | Criterios de aceptación |
|----|------------------------|-----------|------------------------|
| RF01 | El sistema debe permitir registrar un nuevo usuario | Alta | Dado un formulario válido con username, email y contraseña únicos, el backend crea el registro y devuelve 201. Si el email ya existe, devuelve 400 con mensaje de error. |
| RF02 | El sistema debe permitir iniciar sesión con email y contraseña | Alta | Dado un email y contraseña válidos, el backend devuelve un token JWT. Si las credenciales son incorrectas, devuelve 401. |
| RF03 | El sistema debe permitir crear un challenge de programación | Alta | Un usuario autenticado puede crear un challenge con título y descripción. El backend lo asocia al usuario creador y devuelve 201. |
| RF04 | El sistema debe permitir listar todos los challenges disponibles | Alta | Al acceder a `/challenges/list`, el sistema devuelve todos los challenges registrados o un estado vacío si no existen. |
| RF05 | El sistema debe permitir editar un challenge propio | Alta | Solo el creador puede editar su challenge. Si otro usuario intenta editarlo, el backend responde 401 Unauthorized. |
| RF06 | El sistema debe permitir eliminar un challenge propio | Alta | Solo el creador puede eliminar su challenge. El frontend pide confirmación antes de eliminar. El registro desaparece del listado tras confirmación. |
| RF07 | El sistema debe permitir enviar una solución a un challenge | Alta | Un usuario autenticado puede enviar código como solución. El backend almacena la solución asociada al usuario y al challenge. |
| RF08 | El sistema debe permitir al creador revisar y aprobar/rechazar soluciones | Media | El creador ve las soluciones enviadas a sus challenges y puede cambiar su estado a "aprobado" o "rechazado". |
| RF09 | El sistema debe ofrecer retroalimentación de IA sobre el código del usuario | Alta | El usuario envía código al optimizador. La IA responde con pistas de mejora, nunca con la solución completa. |
| RF10 | El sistema debe mostrar un dashboard personal al usuario autenticado | Media | El dashboard muestra: challenges creados, challenges resueltos y posición en el ranking del usuario. |
| RF11 | El sistema debe validar los datos en formularios de registro y login | Alta | El frontend muestra mensajes de error si los campos están vacíos, el email tiene formato inválido o la contraseña es muy corta. |
| RF12 | El sistema debe manejar errores de red y mostrarlos al usuario | Media | Si el backend no responde, el frontend muestra un mensaje de error visible. La interfaz no queda en estado de carga indefinido. |

---

## 4. Requerimientos no funcionales

| Categoría | Requerimiento | Criterio verificable |
|-----------|--------------|---------------------|
| **Usabilidad** | La interfaz debe ser comprensible para usuarios no técnicos | El usuario puede registrarse, crear un challenge y enviar una solución sin instrucciones adicionales |
| **Responsividad** | La aplicación debe funcionar en móvil y escritorio | Se prueba correctamente en ancho de 375px (móvil) y 1440px (escritorio) sin pérdida de funcionalidad |
| **Rendimiento** | Las consultas principales deben responder en tiempo razonable | Las operaciones CRUD no deben bloquear la interfaz más de 3 segundos en condiciones normales |
| **Seguridad básica** | No deben exponerse credenciales en el repositorio | El archivo `.env` está en `.gitignore` y existe `.env.example` documentado sin valores secretos |
| **Mantenibilidad** | El código debe estar modularizado según la arquitectura N-Layer | La lógica de negocio vive en `services/`, no en `routers/`. Los componentes de React están separados por responsabilidad |
| **Confiabilidad** | El sistema debe manejar errores de API y validación | El frontend muestra mensajes claros al usuario para errores 400, 401, 404 y 500 |
| **Accesibilidad** | Los formularios deben ser comprensibles | Los campos tienen `<label>`, contraste adecuado y textos de ayuda cuando aplica |

---

## 5. Reglas de negocio

| ID | Regla |
|----|-------|
| **RN01** | Solo el creador de un challenge puede editarlo o eliminarlo. Cualquier otro usuario recibe error 401. |
| **RN02** | Solo el creador de un challenge puede ver y validar (aprobar/rechazar) las soluciones enviadas a ese challenge. |
| **RN03** | Un usuario no puede enviar más de una solución al mismo challenge. Si lo intenta, la nueva solución reemplaza la anterior. |
| **RN04** | El optimizador IA nunca debe revelar la solución completa al código del usuario; solo debe proporcionar pistas y retroalimentación socrática. |
| **RN05** | Para crear, editar, eliminar challenges o enviar soluciones, el usuario debe estar autenticado con un JWT válido y no expirado. |
| **RN06** | Las contraseñas deben almacenarse hasheadas en la base de datos. Nunca se guarda ni se transmite la contraseña en texto plano. |
| **RN07** | El token JWT tiene tiempo de expiración. Una vez expirado, el usuario debe iniciar sesión nuevamente para obtener un nuevo token. |

---

## 6. Modelo de datos

### 6.1 Descripción de entidades

**Tabla: users**

| Atributo | Tipo | Restricción | Descripción |
|----------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Identificador único del usuario |
| username | VARCHAR(100) | UNIQUE, NOT NULL | Nombre de usuario visible en la plataforma |
| email | VARCHAR(150) | UNIQUE, NOT NULL | Correo electrónico del usuario |
| password_hash | VARCHAR(255) | NOT NULL | Contraseña encriptada con hash (bcrypt) |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación de la cuenta |

**Tabla: challenges**

| Atributo | Tipo | Restricción | Descripción |
|----------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Identificador único del challenge |
| title | VARCHAR(200) | NOT NULL | Título del challenge |
| description | TEXT | NOT NULL | Descripción del problema a resolver |
| creator_id | INTEGER | FK → users.id | Usuario que creó el challenge |
| is_solved | BOOLEAN | DEFAULT false | Indica si ya fue aprobada al menos una solución |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

**Tabla: solutions**

| Atributo | Tipo | Restricción | Descripción |
|----------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Identificador único de la solución |
| challenge_id | INTEGER | FK → challenges.id | Challenge al que pertenece la solución |
| user_id | INTEGER | FK → users.id | Usuario que envió la solución |
| code | TEXT | NOT NULL | Código de la solución enviada |
| status | VARCHAR(20) | DEFAULT 'pending' | Estado: pending / approved / rejected |
| submitted_at | TIMESTAMP | DEFAULT NOW() | Fecha de envío |

**Tabla: sessions**

| Atributo | Tipo | Restricción | Descripción |
|----------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | Identificador único de la sesión |
| user_id | INTEGER | FK → users.id | Usuario dueño del token |
| token | TEXT | NOT NULL | Token JWT generado |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación del token |
| expires_at | TIMESTAMP | NOT NULL | Fecha de expiración del token |

### 6.2 Relaciones entre entidades
- Un **User** puede crear muchos **Challenges** (1:N)
- Un **User** puede enviar muchas **Solutions** (1:N)
- Un **Challenge** puede recibir muchas **Solutions** (1:N)
- Un **User** tiene muchas **Sessions** (1:N)

### 6.3 Diagrama entidad-relación
Ver archivo `docs/diagramas/D03-entidad-relacion.md`

---

## 7. Interfaces externas

### 7.1 Interfaz de usuario (Frontend)
Pantallas principales implementadas:
- Landing Page — presentación de la plataforma
- Registro / Login — autenticación de usuarios
- Dashboard — estadísticas personales del usuario
- Explorador de Challenges — listado público de challenges
- Formulario de Challenge — creación y edición
- Vista de Challenge — resolución y envío de solución
- Optimizador IA — chatbot para retroalimentación de código

### 7.2 API Backend (Endpoints)
Ver **Tabla de Endpoints** al final de este documento y archivo `docs/diagramas/D06-secuencia.md`.

Resumen de rutas principales:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /users/register | Registrar nuevo usuario |
| POST | /users/login | Autenticar usuario, recibir JWT |
| GET | /challenges/list | Listar todos los challenges |
| POST | /challenges/create | Crear nuevo challenge |
| PUT | /challenges/edit/{id} | Editar challenge propio |
| DELETE | /challenges/delete/{id} | Eliminar challenge propio |
| POST | /challenges/solve/{id} | Enviar solución a un challenge |
| POST | /optimize | Optimizar código con IA |
| GET | /dashboard | Ver estadísticas del usuario autenticado |

### 7.3 Persistencia
- **Motor:** PostgreSQL (producción) / SQLite (desarrollo local)
- **ORM:** SQLAlchemy — gestiona las consultas SQL desde Python sin escribir SQL manual
- **Tablas:** users, challenges, solutions, sessions
- **Variables de entorno:** La cadena de conexión a la base de datos se configura en `.env` (ver `.env.example`)

### 7.4 Servicios externos
El **Optimizador IA** consume una API externa de LLM (Claude de Anthropic o GPT de OpenAI) mediante HTTP POST. Se requiere una API Key configurada en variables de entorno. El modelo recibe el código del usuario con un system prompt que le indica que debe responder con pistas, nunca con la solución completa.

---

## 8. Criterios de aceptación del proyecto

- [ ] El proyecto se ejecuta siguiendo las instrucciones del README en otro computador
- [ ] El frontend consume el backend real (no datos simulados ni hardcodeados)
- [ ] El CRUD de challenges funciona completo: crear, listar, editar y eliminar
- [ ] Los datos persisten después de reiniciar el servidor backend
- [ ] El optimizador IA responde con retroalimentación socrática ante el código enviado
- [ ] El dashboard muestra datos reales del usuario autenticado
- [ ] La documentación explica arquitectura, endpoints, instalación y decisiones técnicas
- [ ] Todos los integrantes pueden explicar su aporte y responder preguntas técnicas

---

## 9. Matriz de trazabilidad

| RF | Pantalla relacionada | Endpoint relacionado | Cómo se demuestra en la demo |
|----|---------------------|---------------------|-----------------------------|
| RF01 | Formulario de Registro | POST /users/register | Registrar un usuario nuevo y confirmar creación en la BD |
| RF02 | Formulario de Login | POST /users/login | Iniciar sesión y verificar que se recibe el JWT en DevTools |
| RF03 | Formulario de Creación de Challenge | POST /challenges/create | Crear un challenge con título y descripción |
| RF04 | Listado de Challenges | GET /challenges/list | Mostrar la lista cargada desde el backend con datos reales |
| RF05 | Formulario de Edición | PUT /challenges/edit/{id} | Editar el título de un challenge propio y verificar cambio |
| RF06 | Botón Eliminar | DELETE /challenges/delete/{id} | Eliminar un challenge y confirmar que desaparece del listado |
| RF07 | Vista de Challenge | POST /challenges/solve/{id} | Enviar código como solución y confirmar almacenamiento |
| RF08 | Panel del Creador | PUT /challenges/validate/{id} | Aprobar o rechazar una solución recibida |
| RF09 | Optimizador IA | POST /optimize | Enviar código y mostrar la retroalimentación socrática de la IA |
| RF10 | Dashboard | GET /dashboard | Mostrar estadísticas reales del usuario autenticado |
| RF11 | Formularios de Registro y Login | POST /users/register, POST /users/login | Intentar enviar campos vacíos y verificar mensajes de error |
| RF12 | Cualquier pantalla con llamada al backend | Todos los endpoints | Simular error de red y verificar mensaje visible al usuario |

---

## 📋 Tabla completa de Endpoints

| Método | Endpoint | Descripción | Entrada (Body/Header) | Respuesta exitosa | Error posible |
|--------|----------|-------------|----------------------|-------------------|--------------|
| POST | /users/register | Registrar nuevo usuario | `{username, email, password}` | 201 + `{id, username, email}` | 400 si email ya existe |
| POST | /users/login | Autenticar usuario | `{email, password}` | 200 + `{access_token, token_type}` | 401 si credenciales incorrectas |
| GET | /challenges/list | Listar todos los challenges | — (público) | 200 + `[{id, title, description, creator_id}]` | 500 error del servidor |
| POST | /challenges/create | Crear nuevo challenge | Header JWT + `{title, description}` | 201 + `{id, title, description}` | 401 si no autenticado |
| PUT | /challenges/edit/{id} | Editar challenge propio | Header JWT + `{title, description}` | 200 + challenge actualizado | 401 si no es el creador, 404 si no existe |
| DELETE | /challenges/delete/{id} | Eliminar challenge propio | Header JWT + `id` en URL | 200 + `{message: "eliminado"}` | 401 si no es el creador, 404 si no existe |
| POST | /challenges/solve/{id} | Enviar solución a un challenge | Header JWT + `{code}` | 201 + `{challenge_id, solution, status: "pending"}` | 401 si no autenticado |
| PUT | /challenges/validate/{id} | Aprobar o rechazar solución | Header JWT + `{status: "approved"/"rejected"}` | 200 + solución actualizada | 401 si no es el creador del challenge |
| POST | /optimize | Optimizar código con IA | Header JWT + `{code, description}` | 200 + `{suggestions: [...]}` | 401 si no autenticado, 503 si IA no disponible |
| GET | /dashboard | Ver estadísticas del usuario | Header JWT | 200 + `{created_challenges, solved_challenges}` | 401 si no autenticado |
