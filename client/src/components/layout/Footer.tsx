/**
 * Footer completo de la aplicación con 4 columnas de contenido.
 * Aparece en la LandingPage y ChallengesPage.
 * Incluye logo, descripción del sitio, enlaces de navegación,
 * recursos adicionales y redes sociales.
 *
 * Props: ninguna.
 */

import { Link } from 'react-router-dom';
import { Github, Twitter, MessageCircle } from 'lucide-react';
import { Logo } from '@/components/branding/Logo';

const NAV_LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Desafíos', to: '/challenges' },
  { label: 'Dashboard', to: '/dashboard' },
];

const RESOURCE_LINKS = [
  { label: 'Documentación', href: '#' },
  { label: 'Guía de inicio', href: '#' },
  { label: 'FAQ', href: '#' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 dark:border-dark-600 bg-white dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Columna 1: Marca */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Logo size="md" className="mb-3" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
              Plataforma colaborativa de desafíos de programación para desarrollar habilidades algorítmicas.
            </p>
            {/* Redes sociales */}
            <div className="flex gap-3 mt-4">
              {[
                { Icon: Github,        href: '#', label: 'GitHub'   },
                { Icon: Twitter,       href: '#', label: 'Twitter'  },
                { Icon: MessageCircle, href: '#', label: 'Discord'  },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Navegación</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-primary-500 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Recursos */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Recursos</h4>
            <ul className="space-y-2">
              {RESOURCE_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-primary-500 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Comunidad */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Comunidad</h4>
            <ul className="space-y-2">
              {['Discord', 'GitHub', 'Blog', 'Newsletter'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-primary-500 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-dark-700 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            © {year} ComplexityLab. Todos los derechos reservados.
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Hecho con ❤️ para la comunidad de desarrolladores.
          </p>
        </div>
      </div>
    </footer>
  );
}
