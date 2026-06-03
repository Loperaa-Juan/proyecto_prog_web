# Arquitectura del Sistema — ComplexityLab

## Patrón arquitectónico

- **Estilo:** Cliente-Servidor  
- **Patrón:** N-Layer (routers / models / schemas / services)

---

## Mapeo de vistas a rutas

| Vista (prototipo) | Ruta frontend | Método HTTP | Endpoint backend | Descripción | Auth requerida |
|---|---|---|---|---|---|
| Landing Page | `/` | GET | `/` | Página pública de presentación de la plataforma | No |
| Registro | `/register` | POST | `/users/register` | Crea una nueva cuenta de usuario | No |
| Login | `/login` | POST | `/users/login` | Autentica al usuario y retorna un JWT | No |
| Listado de challenges | `/challenges` | GET | `/challenges/list` | Obtiene todos los challenges disponibles | Opcional |
| Crear challenge | `/challenges/new` | POST | `/challenges/create` | Crea un nuevo challenge asociado al usuario autenticado | Sí (JWT) |
| Editar challenge | `/challenges/:id/edit` | PUT | `/challenges/edit/{id}` | Actualiza título y descripción de un challenge propio | Sí (JWT + propietario) |
| Eliminar challenge | `/challenges/:id` | DELETE | `/challenges/delete/{id}` | Elimina el challenge si el usuario es el propietario | Sí (JWT + propietario) |
| Resolver challenge | `/challenges/:id/solve` | POST | `/challenges/solve/{id}` | Envía la solución del usuario para un challenge | Sí (JWT) |
| Optimizador (chatbot) | `/optimizer` | POST | `/optimize` | Envía código al LLM y recibe sugerencias de optimización | Sí (JWT) |
| Dashboard | `/dashboard` | GET | `/dashboard` | Obtiene estadísticas y progreso del usuario autenticado | Sí (JWT) |

---

## Tabla de entidades y atributos

### Usuario (User)

| Atributo | Tipo | Obligatorio | Validaciones / Notas |
|---|---|---|---|
| `id` | entero (auto) | Sí | Clave primaria, autoincremental |
| `username` | texto | Sí | Mínimo 3 caracteres, único en el sistema |
| `email` | texto | Sí | Formato email válido, único |
| `password` | texto (hash) | Sí | Mínimo 8 caracteres, almacenado como hash bcrypt |
| `created_at` | fecha/hora | Sí | Generado automáticamente al crear el registro |

### Challenge

| Atributo | Tipo | Obligatorio | Validaciones / Notas |
|---|---|---|---|
| `id` | entero (auto) | Sí | Clave primaria, autoincremental |
| `title` | texto | Sí | Mínimo 5 caracteres, máximo 150 |
| `description` | texto largo | Sí | Mínimo 20 caracteres, máximo 2000 |
| `creator_id` | entero | Sí | Clave foránea → User.id. Define el propietario |
| `is_solved` | booleano | Sí | Default: false. Cambia a true cuando el creador aprueba una solución |
| `created_at` | fecha/hora | Sí | Generado automáticamente |

### Solución (Solution)

| Atributo | Tipo | Obligatorio | Validaciones / Notas |
|---|---|---|---|
| `id` | entero (auto) | Sí | Clave primaria, autoincremental |
| `challenge_id` | entero | Sí | Clave foránea → Challenge.id |
| `solver_id` | entero | Sí | Clave foránea → User.id. Usuario que envió la solución |
| `code` | texto largo | Sí | Código fuente enviado. No puede estar vacío |
| `is_approved` | booleano | No | Default: null (pendiente). El creador la aprueba o rechaza |
| `submitted_at` | fecha/hora | Sí | Generado automáticamente |

### Sesión (Session)

| Atributo | Tipo | Obligatorio | Validaciones / Notas |
|---|---|---|---|
| `id` | entero (auto) | Sí | Clave primaria |
| `user_id` | entero | Sí | Clave foránea → User.id |
| `token` | texto | Sí | JWT generado al hacer login. Único por sesión |
| `expires_at` | fecha/hora | Sí | Fecha de expiración del token JWT |
