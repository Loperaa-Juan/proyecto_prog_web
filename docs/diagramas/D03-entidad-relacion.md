# D03 — Diagrama Entidad-Relación
## ComplexityLab

> **¿Qué es un diagrama entidad-relación?**
> Muestra cómo están organizados los **datos** que guarda el sistema. Cada caja es una tabla de la base de datos, y las líneas muestran cómo se relacionan entre sí.

```mermaid
erDiagram
    USERS {
        int id PK "Identificador único"
        varchar username "Nombre de usuario (único)"
        varchar email "Correo electrónico (único)"
        varchar password_hash "Contraseña encriptada"
        timestamp created_at "Fecha de registro"
    }

    CHALLENGES {
        int id PK "Identificador único"
        varchar title "Título del challenge"
        text description "Descripción del problema"
        int creator_id FK "Usuario que lo creó"
        boolean is_solved "¿Tiene solución aprobada?"
        timestamp created_at "Fecha de creación"
    }

    SOLUTIONS {
        int id PK "Identificador único"
        int challenge_id FK "Challenge al que pertenece"
        int user_id FK "Usuario que envió la solución"
        text code "Código de la solución"
        varchar status "Estado: pending/approved/rejected"
        timestamp submitted_at "Fecha de envío"
    }

    SESSIONS {
        int id PK "Identificador único"
        int user_id FK "Usuario dueño del token"
        text token "Token JWT"
        timestamp created_at "Fecha de creación"
        timestamp expires_at "Fecha de expiración"
    }

    USERS ||--o{ CHALLENGES : "crea (1 user → muchos challenges)"
    USERS ||--o{ SOLUTIONS : "envía (1 user → muchas solutions)"
    USERS ||--o{ SESSIONS : "tiene (1 user → muchas sessions)"
    CHALLENGES ||--o{ SOLUTIONS : "recibe (1 challenge → muchas solutions)"
```

## Explicación de las relaciones

| Relación | Tipo | Descripción |
|----------|------|-------------|
| USERS → CHALLENGES | 1 a muchos | Un usuario puede crear múltiples challenges, pero cada challenge tiene un único creador |
| USERS → SOLUTIONS | 1 a muchos | Un usuario puede enviar múltiples soluciones (a distintos challenges), pero cada solución fue enviada por un único usuario |
| USERS → SESSIONS | 1 a muchos | Un usuario puede tener múltiples tokens JWT (sesiones), por ejemplo si inicia sesión desde distintos dispositivos |
| CHALLENGES → SOLUTIONS | 1 a muchos | Un challenge puede recibir soluciones de múltiples usuarios distintos |

## Estados del atributo `status` en SOLUTIONS

```
pending   →   aprobado por el creador   →   approved
pending   →   rechazado por el creador  →   rejected
```

- **pending**: La solución fue enviada y está esperando revisión del creador
- **approved**: El creador revisó y aprobó la solución. El challenge se marca como `is_solved = true`
- **rejected**: El creador revisó y rechazó la solución. El usuario puede intentar enviar una nueva
