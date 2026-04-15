# Análisis del Sistema - ComplexityLab

## 1. ¿Quién usa el sistema?
El sistema está dirigido a la comunidad de aprendizaje en informática, dividido en tres tipos de usuarios con necesidades específicas:
* **Estudiantes de informática (Principiantes):** Entran a la plataforma para registrarse, buscar "challenges" (desafíos algorítmicos), y consumir el analizador de complejidad temporal para mejorar sus bases de programación.
* **Profesionales de informática:** Utilizan la plataforma para resolver challenges más complejos, enviando sus soluciones para interactuar con la IA de optimización y medir la eficiencia de sus algoritmos en un entorno de práctica avanzada.
* **Docentes de informática:** Tienen la capacidad de crear y publicar "challenges", revisar soluciones de sus alumnos a través de la funcionalidad de retroalimentación de la plataforma e incorporar el uso del chatbot interactivo en su metodología de clase.
*No se contemplan roles intermedios o administradores en esta versión del avance, todos son un rol base de "Usuario" pero con las interacciones listadas.*

## 2. ¿Qué necesita hacer?
Las funcionalidades principales (acciones) que los usuarios ejecutan dentro de ComplexityLab son:
* **Registrar** una cuenta nueva e **Iniciar sesión** (Autenticación).
* **Crear**, **Editar**, y **Eliminar** challenges de programación propios.
* **Listar** y explorar challenges publicados por la comunidad en el catálogo.
* **Resolver** challenges de otros usuarios enviando una solución de código en la plataforma.
* **Evaluar y Validar** (como creador) las soluciones enviadas por otros usuarios a los challenges planteados.
* **Consultar** un Dashboard para visualizar estadísticas propias (número de challenges creados vs. resueltos).
* **Interactuar** vía chat / **Optimizar** código enviando fragmentos propios al analizador de IA (LLM, ej. Codex) para obtener una respuesta con sugerencias de optimización.

## 3. ¿Qué datos maneja?
Las entidades principales almacenadas en la base de datos están fuertemente tipificadas:
* **Usuarios:** Atributos como nombre de usuario (string), correo electrónico (string), contraseña encriptada (string, manejado por sesión/JWT), y un historial/contador de estadísticas de su actividad (relación con desafíos elaborados y terminados).
* **Challenges:** Almacenan título (string), descripción (texto largo/markdown), un identificador único (UUID/int), bandera de estado o estatus (booleano, para verificar si fue resuelto o no), y la asociación directa de pertenencia a un Usuario Creador (Foreing Key).
* **Soluciones:** Conservan el código fuente enviado (cadena de texto largo), usuario que lo envió (Foreign Key), challenge relacionado (Foreign Key), una estampa o fecha de envío (timestamp/datetime) y una retroalimentación del creador o generada posteriormente (string/texto).
* **Sesiones:** Identificación activa del usuario mediante manejo de JSON Web Tokens (JWT) devueltos en las interacciones de _Authentication_.

## 4. ¿Qué restricciones existen?
Las reglas de negocio que restringen o validan los procesos son:
* **Autenticación Estricta:** Un usuario *debe* tener una sesión activa con un `bearer token` (JWT) válido para poder ejecutar *cualquier* acción que involucre crear, editar o eliminar un challenge, así como resolver challenges o consultar al chatbot iterativo de IA. La ruta pública únicamente habilita el listado visual (/challenges/list).
* **Propiedad de los Datos:** Solo el usuario creador original (a través de matching de UUID/id de usuario) puede realizar un PUT o DELETE de un challenge.
* **Formato Estático de Problemas:** Todo challenge requiere estrictamente un nombre no nulo y una descripción clara, mientras que las soluciones necesitan forzosamente contener un bloque de código asociado al autor y un vínculo bidireccional (creador - resolutor).
* **Interacción Guiada por IA:** El Chatbot IA tiene una política de sistema *(System Prompt)* restrictiva que le prohíbe entregar la respuesta final (código completamente resuelto en su versión final) para evitar saltarse el proceso de aprendizaje, limitándose estrictamente a dar sugerencias u optimizaciones espaciales/temporales (`optimized_code` con feedback).
