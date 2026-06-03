# D06 — Diagramas de Secuencia
## ComplexityLab

> **¿Qué es un diagrama de secuencia?**
> Muestra el **orden exacto** en que los diferentes componentes del sistema se comunican cuando ocurre una acción. Es como un guion de una película: quién habla primero, qué dice, quién responde.

---

## D06-A: Flujo de Registro de Usuario

> **¿Qué muestra?** Lo que pasa internamente cuando un usuario nuevo se registra en la plataforma.

```mermaid
sequenceDiagram
    actor Usuario
    participant Frontend as 🌐 Frontend (React)
    participant Backend as ⚙️ Backend (FastAPI)
    participant BD as 🗄️ Base de Datos

    Usuario->>Frontend: Completa el formulario (username, email, contraseña)
    Frontend->>Frontend: Valida campos en el cliente (email válido, contraseña no vacía)

    alt Campos inválidos
        Frontend-->>Usuario: ❌ Muestra errores de validación en el formulario
    else Campos válidos
        Frontend->>Backend: POST /users/register {username, email, password}
        Backend->>Backend: Verifica que el email no esté registrado
        
        alt Email ya existe
            Backend-->>Frontend: 400 Bad Request {"error": "El email ya está registrado"}
            Frontend-->>Usuario: ❌ "Este correo ya tiene una cuenta"
        else Email disponible
            Backend->>Backend: Hashea la contraseña con bcrypt
            Backend->>BD: INSERT INTO users (username, email, password_hash)
            BD-->>Backend: ✅ Usuario creado con id: 1
            Backend-->>Frontend: 201 Created {id, username, email}
            Frontend-->>Usuario: ✅ "¡Registro exitoso! Inicia sesión para continuar"
        end
    end
```

---

## D06-B: Flujo de Creación de un Challenge

> **¿Qué muestra?** Lo que pasa cuando un usuario autenticado crea un nuevo challenge de programación.

```mermaid
sequenceDiagram
    actor Usuario
    participant Frontend as 🌐 Frontend (React)
    participant Backend as ⚙️ Backend (FastAPI)
    participant BD as 🗄️ Base de Datos

    Note over Usuario,BD: El usuario ya inició sesión y tiene un JWT válido

    Usuario->>Frontend: Llena formulario: título y descripción del challenge
    Frontend->>Frontend: Valida que los campos no estén vacíos

    alt Campos vacíos
        Frontend-->>Usuario: ❌ "El título y la descripción son obligatorios"
    else Campos completos
        Frontend->>Backend: POST /challenges/create {title, description} + Header: Authorization Bearer {JWT}
        Backend->>Backend: Verifica que el JWT sea válido y no haya expirado
        
        alt JWT inválido o expirado
            Backend-->>Frontend: 401 Unauthorized {"error": "Token inválido o expirado"}
            Frontend-->>Usuario: ❌ "Tu sesión expiró. Inicia sesión nuevamente"
        else JWT válido
            Backend->>Backend: Extrae el user_id del token JWT
            Backend->>BD: INSERT INTO challenges (title, description, creator_id = user_id)
            BD-->>Backend: ✅ Challenge creado con id: 5
            Backend-->>Frontend: 201 Created {id: 5, title, description, creator_id}
            Frontend->>Frontend: Actualiza el listado de challenges sin recargar la página
            Frontend-->>Usuario: ✅ El nuevo challenge aparece en el listado
        end
    end
```

---

## Resumen: ¿Por qué estos dos flujos?

| Flujo | Por qué es importante |
|-------|--------------------|
| **Registro** | Es el punto de entrada al sistema. Demuestra la validación en frontend, el hasheo de contraseña en backend y la escritura en base de datos. |
| **Creación de Challenge** | Es la operación CRUD principal del sistema. Demuestra la autenticación con JWT, la lógica de negocio en el backend y la actualización dinámica del frontend sin recargar la página. |
