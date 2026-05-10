/**
 * Hook que actualiza el título del documento (pestaña del navegador).
 * Restaura el título previo al desmontar el componente que lo usó.
 *
 * @param title - Título a mostrar en la pestaña. Si incluye el nombre del sitio
 *                se muestra tal cual; si no, se añade " — ComplexityLab" como sufijo.
 */

import { useEffect } from 'react';

const SITE_NAME = 'ComplexityLab';

export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
    const prev = document.title;
    document.title = fullTitle;
    return () => { document.title = prev; };
  }, [title]);
}
