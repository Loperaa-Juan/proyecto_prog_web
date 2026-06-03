# Enlace al Prototipo Figma

## ComplexityLab — Prototipo Navegable

**Enlace al prototipo:**
> _[Pendiente de publicar en Figma Community — agregar enlace aquí antes de la sustentación]_

---

## Páginas del Prototipo

| Vista | Archivo HTML | Descripción |
|---|---|---|
| Landing Page | `landing_page/index.html` | Página principal con hero, features, challenges y CTA |
| Login | `landing_page/login.html` | Formulario de inicio de sesión con validación |
| Challenges | `landing_page/challenges.html` | Listado con filtros, búsqueda y paginación |
| Dashboard | `landing_page/dashboard.html` | Perfil de usuario, stats, mis challenges |
| Crear/Editar Challenge | `landing_page/challenge-form.html` | Formulario con validación y feedback |

## Flujos de Navegación

```
Landing → Login → Dashboard → Challenges
                ↓
         Crear Challenge (challenge-form.html)
                ↓
         Dashboard (confirmación)
```

## Principios UI/UX Aplicados

1. **Jerarquía visual** — Tipografía escalada (títulos 4.5rem → subtítulos 1.125rem → meta 0.875rem), color con propósito (primary para acciones, accent para éxito, red para error)
2. **Consistencia** — Navbar idéntico en todas las páginas, mismo sistema de botones, badges y cards en todos los archivos
3. **Retroalimentación al usuario** — Validación en tiempo real en formularios, toasts de éxito/error, estados de loading en botones, confirmación modal antes de eliminar
4. **Diseño responsivo** — Breakpoints en 768px y 1024px, menú hamburguesa en móvil, grid de 1 columna en pantallas pequeñas
5. **Accesibilidad básica** — Atributos `aria-label`, contraste adecuado, áreas de toque ≥44px, semántica HTML correcta (nav, main, section, article, footer)
