# Análisis del Proyecto - ComplexityLab

En este markdown nos centramos en plantearnos y, acto seguido, respondernos preguntas que nos ayuden a entender el proyecto y a tomar decisiones sobre él.

---
## ¿Quién usa el sistema?

Cómo ya lo habiamos planteado en el README.md, los usuarios de nuestra plataforma son estudiantes y profesionales de la informática que buscan mejorar sus habilidades de programación. Si quisieramos ser mas especificos, podriamos categorizarlos de esta manera:

* **Estudiantes de informática:** Principiantes en el area de la informatica que buscan mejorar sus habilidades de programación y entender de mejor manera la complejidad temporal que tiene sus soluciones.

* **Profesionales de la informática:** Profesionales de la informática que buscan mejorar sus habilidades de programación y optimizar sus soluciones en la industria actual.

* **Docentes de informática:** Docentes de informática que buscan mejorar sus habilidades de programación y ofrecer a sus estudiantes una herramienta para aprender sobre complejidad temporal.

---
## ¿Qué necesita hacer el sistema?

El sistema debe permitir a los usuarios registrarse, iniciar sesión, crear challenges, resolver challenges y obtener retroalimentación sobre sus soluciones. Más especificamente, el sistema debe tener las siguientes funcionalidades:

- Registro de usuarios nuevos en la plataforma.
- Inicio de sesión en cuentas existentes.
- Permitir la creación de challenges y poder publicarlos a la comunidad (otros usuarios de la aplicación).
- Permitir la edición de challenges.
- Permitir la eliminación de challenges.
- Permitir la visualización de soluciones de challenges.
- Registrar las soluciones de los usuarios a los challenges disponibles en la plataforma.
- Dar retroalimentación a los usuarios sobre sus soluciones.
- Permitir la interacción con un chatbot que permita optimizar el código del usuario.

---
## ¿Qué datos maneja el sistema?

En este caso, podemos dividri los datos que maneja el programa en dos grandes grupos:

- Datos de los usuarios: 

* Nombre de usuario
* Correo electrónico
* Contraseña
* Challenges creados
* Challenges resueltos

- Datos de los challenges:

* Nombre del challenge
* Descripción del challenge
* Código del challenge (identificador unico universal de cada challenge)
* Soluciones del challenge

Dentro de las soluciones del challenge, se almacena la siguiente información:

* Código de la solución
* Contenido específico de la solución
* Usuario que resolvió el challenge
* Fecha de la solución
* Retroalimentación del challenge

---
## ¿Qué restricciones existen?

### **Restricciones de los usuarios:**

* Los usuarios deben estar autenticados para poder crear challenges, editar, eliminar y publicar challenges.
* Los usuarios deben estar autenticados para poder resolver challenges de otros usuarios.
* Los usuarios deben estar autenticados para poder interactuar con el chatbot.

### **En cuanto a los challenges:**

* Los challenges deben tener un nombre y una descripción.
* Las soluciones deben tener un código, contenido específico, usuario que resolvió el challenge, fecha de la solución y retroalimentación del challenge.
* Tanto las soluciones como los challenges deben estar asociados a un usuario (en el caso de las soluciones debe estar asociado a dos usuarios, el que creó el challenge y el que lo resolvió).

---