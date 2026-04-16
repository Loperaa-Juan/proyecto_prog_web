# Diagramas de Flujo - Complexity Lab

A continuación, se presentan los diagramas de flujo modelados específicamente para cumplir con los requerimientos lógicos de **Complexity Lab** y alineados con los **criterios de evaluación del prototipo navegable** (como los estados de interfaz y la retroalimentación al usuario).

## Registro de Usuario (Vista Formulario)

Este flujo aborda la creación de cuenta, mostrando escenarios de validación y **feedback al usuario** antes de conceder acceso.

```mermaid
flowchart TD
    classDef Sistema fill:#E0F2FE,stroke:#0284C7,stroke-width:2px,color:#000;
    classDef Usuario fill:#DCFCE7,stroke:#16A34A,stroke-width:2px,color:#000;

    A([Inicio]) --> B[Usuario: Accede a Vista de Registro]:::Usuario
    B --> C[Usuario: Ingresa sus datos en el formulario]:::Usuario
    C --> D[Usuario: Hace clic en 'Crear Cuenta']:::Usuario
    D --> E{Sistema: ¿La información es válida?}:::Sistema
    E -- No --> F[Sistema: Muestra estado de Error y solicita corrección]:::Sistema
    F --> C
    E -- Sí --> G[Sistema: Crea la cuenta en la Base de Datos]:::Sistema
    G --> H[Sistema: Muestra Confirmación visual 'Cuenta Creada']:::Sistema
    H --> I[Sistema: Redirige a pantalla de Inicio de Sesión]:::Sistema
    I --> J([Fin: Registro completado])
```

## Inicio de Sesión (Página Principal / Home)

Representa la entrada a la plataforma y la validación de credenciales.

```mermaid
flowchart TD
    classDef Sistema fill:#E0F2FE,stroke:#0284C7,stroke-width:2px,color:#000;
    classDef Usuario fill:#DCFCE7,stroke:#16A34A,stroke-width:2px,color:#000;

    A([Inicio]) --> B[Usuario: Accede a Página Principal / Home]:::Usuario
    B --> C[Usuario: Ingresa sus credenciales de acceso]:::Usuario
    C --> D[Usuario: Hace clic en 'Iniciar Sesión']:::Usuario
    D --> E{Sistema: ¿Usuario y contraseña correctos?}:::Sistema
    E -- No --> F[Sistema: Muestra estado de Error 'Credenciales inválidas']:::Sistema
    F --> C
    E -- Sí --> G[Sistema: Acceso concedido]:::Sistema
    G --> H[Sistema: Redirige a la Vista de Listado de Challenges]:::Sistema
    H --> I([Fin: Sesión iniciada])
```

## Consulta del Dashboard (Estadísticas del Usuario)

Este flujo representa cómo un usuario consulta su progreso en la plataforma, visualizando sus challenges creados contra los resueltos. Contempla de nuevo el estado de *Vista vacía*.

```mermaid
flowchart TD
    classDef Sistema fill:#E0F2FE,stroke:#0284C7,stroke-width:2px,color:#000;
    classDef Usuario fill:#DCFCE7,stroke:#16A34A,stroke-width:2px,color:#000;

    A([Inicio]) --> B[Usuario: Accede a la Vista del 'Dashboard/Perfil']:::Usuario
    B --> C[Sistema: Solicita historial de estadísticas a la Base de Datos]:::Sistema
    C --> D{Sistema: ¿El usuario tiene actividad previa?}:::Sistema
    D -- No --> E[Sistema: Muestra Vista Vacía 'Aún no tienes estadísticas']:::Sistema
    D -- Sí --> F[Sistema: Muestra Vista con Gráficos/Indicadores numéricos]:::Sistema
    E --> G[Usuario: Visualiza el estado actual de su perfil]:::Usuario
    F --> G
    G --> H([Fin: Consulta completada])
```

## Creación y Edición de un Challenge (Gestión del Docente)

Este proceso muestra cómo un Docente o Creador añade un nuevo challenge al sistema o modifica uno existente (CRUD).

```mermaid
flowchart TD
    classDef Sistema fill:#E0F2FE,stroke:#0284C7,stroke-width:2px,color:#000;
    classDef Creador fill:#FFEDD5,stroke:#EA580C,stroke-width:2px,color:#000;

    A([Inicio]) --> B[Creador: Accede a 'Gestión de Challenges']:::Creador
    B --> C{Creador: ¿Acción a realizar?}:::Creador
    C -- Crear --> D[Creador: Llena formulario con título y descripción]:::Creador
    C -- Editar --> E[Creador: Selecciona challenge y modifica sus datos]:::Creador
    D --> F[Creador: Hace clic en 'Guardar']:::Creador
    E --> F
    F --> G{Sistema: ¿Los campos son válidos?}:::Sistema
    G -- No --> H[Sistema: Muestra Error 'Campos incompletos' y pide corrección]:::Sistema
    H --> B
    G -- Sí --> I[Sistema: Guarda cambios en la Base de Datos]:::Sistema
    I --> J[Sistema: Muestra Confirmación visual 'Challenge guardado con éxito']:::Sistema
    J --> K([Fin: Challenge gestionado])
```

## Resolución de un Challenge (Vistas de Listado y Formulario)

Este proceso es vital ya que recorre la **Vista de Listado** y la **Vista de Formulario** (detalle del reto). Muestra cómo se contemplan los **estados vacíos** y **con datos cargados** que pide la rúbrica.

```mermaid
flowchart TD
    classDef Sistema fill:#E0F2FE,stroke:#0284C7,stroke-width:2px,color:#000;
    classDef Usuario fill:#DCFCE7,stroke:#16A34A,stroke-width:2px,color:#000;

    A([Inicio]) --> B[Usuario: Entra a la Vista de Listado]:::Usuario
    B --> C{Sistema: ¿Existen challenges disponibles?}:::Sistema
    C -- No --> D[Sistema: Muestra 'Vista Vacía' sin datos]:::Sistema
    C -- Sí --> E[Sistema: Muestra Vista con datos cargados Lista/Grilla]:::Sistema
    E --> F[Usuario: Navega y toma un challenge específico ej: Fibonacci]:::Usuario
    F --> G[Usuario: Accede a la Vista del Challenge Formulario de envío]:::Usuario
    G --> H[Usuario: Desarrolla la solución en JavaScript/Rust/Go]:::Usuario
    H --> I[Usuario: Envía 'Submit' de su solución propuesta]:::Usuario
    I --> J[Sistema: Registra el envío en estado pendiente]:::Sistema
    J --> K[Sistema: Da Feedback visual de 'Solución enviada']:::Sistema
    K --> L([Fin: Challenge enviado])
```

## Validación del Challenge (Vista del Creador)

Este ciclo manual no involucra IA y hace partícipe al **Creador del challenge**, encargado de evaluar la solución antes de cambiar el estado oficial del progreso del estudiante.

```mermaid
flowchart TD
    classDef Sistema fill:#E0F2FE,stroke:#0284C7,stroke-width:2px,color:#000;
    classDef Creador fill:#FFEDD5,stroke:#EA580C,stroke-width:2px,color:#000;

    A([Inicio]) --> B[Creador: Accede a panel de Soluciones Pendientes]:::Creador
    B --> C[Sistema: Despliega la solución enviada por el Usuario]:::Sistema
    C --> D[Creador: Revisa y prueba la solución manualmente]:::Creador
    D --> E{Creador: ¿La solución es correcta?}:::Creador
    E -- Sí --> F[Creador: Selecciona Aprobar]:::Creador
    E -- No --> G[Creador: Selecciona Rechazar]:::Creador
    F --> H[Sistema: Registra el challenge como 'Resuelto' para el usuario]:::Sistema
    G --> I[Sistema: Descarta la solución no cuenta como resuelto]:::Sistema
    H --> J[Sistema: Envía Feedback de éxito al Usuario]:::Sistema
    I --> K[Sistema: Envía Feedback de rechazo al Usuario]:::Sistema
    J --> L([Fin: Validación completada])
    K --> L
```

## Interacción con el Analizador IA (Chatbot de Optimización)

Muestra los pasos donde el usuario interactúa con la IA enviando código para obtener feedback guiado. Note cómo la IA se restringe de dar la respuesta final y provee el feedback requerido.

```mermaid
flowchart TD
    classDef Sistema fill:#E0F2FE,stroke:#0284C7,stroke-width:2px,color:#000;
    classDef Usuario fill:#DCFCE7,stroke:#16A34A,stroke-width:2px,color:#000;

    A([Inicio]) --> B[Usuario: Abre el Chatbot o ventana de Asistencia IA]:::Usuario
    B --> C[Usuario: Ingresa fragmento de código actual solicitando ayuda]:::Usuario
    C --> D[Usuario: Hace clic en 'Enviar consulta']:::Usuario
    D --> E[Sistema: Envía consulta y 'System Prompt' restrictivo al LLM]:::Sistema
    E --> F[Sistema/IA: Evalúa el código frente a la solicitud]:::Sistema
    F --> G{Sistema/IA: ¿Existen mejoras espacio-temporales posibles?}:::Sistema
    G -- No --> H[Sistema/IA: Responde 'Tu código está óptimo' ofreciendo motivación]:::Sistema
    G -- Sí --> I[Sistema/IA: Genera sugerencias de mejora NO entrega respuesta final]:::Sistema
    H --> J[Sistema: Muestra el mensaje de la IA como Feedback visual en el chat]:::Sistema
    I --> J
    J --> K([Fin: Interacción con IA completada])
```


