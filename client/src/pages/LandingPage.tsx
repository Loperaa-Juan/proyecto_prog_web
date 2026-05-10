/**
 * Página de inicio (landing) de ComplexityLab.
 * Compuesta por 4 secciones principales:
 * 1. Hero — titular principal, CTAs, estadísticas.
 * 2. Features — 3 tarjetas de características de la plataforma.
 * 3. Featured Challenges — 3 desafíos destacados cargados desde el servicio.
 * 4. CTA — llamado a la acción para registrarse.
 *
 * No recibe props; consume el estado global de auth para personalizar CTAs.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Code2, Users, Trophy,
  Zap, BookOpen, Star,
  ChevronRight,
} from 'lucide-react';
import { ChallengeCard } from '@/components/domain/ChallengeCard';
import { DecorativeBlobs } from '@/components/branding/DecorativeBlobs';
import { GridPattern } from '@/components/branding/GridPattern';
import { Spinner } from '@/components/feedback/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import * as challengeService from '@/services/challenges';
import type { Challenge } from '@/types';

export default function LandingPage() {
  useDocumentTitle('ComplexityLab — Desafíos de Programación');
  const { isAuthenticated } = useAuth();
  const [featured, setFeatured] = useState<Challenge[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  // Carga los 3 desafíos más populares para la sección de destacados
  useEffect(() => {
    challengeService
      .list({ sort: 'popular', pageSize: 3 })
      .then((res) => setFeatured(res.items))
      .finally(() => setLoadingFeatured(false));
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* ===== SECCIÓN HERO ===== */}
      <section
        id="inicio"
        className="relative min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-20 overflow-hidden"
      >
        <DecorativeBlobs variant="hero" />
        <GridPattern />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge animado */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse-soft" />
            Plataforma en desarrollo activo
          </div>

          {/* Titular */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Domina los{' '}
            <span className="text-gradient-primary">algoritmos</span>
            {' '}con desafíos reales
          </h1>

          <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Crea, comparte y resuelve desafíos de programación colaborativamente.
            Mejora tus habilidades algorítmicas junto a la comunidad.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/challenges"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold bg-gradient-primary hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-[0_4px_14px_rgba(99,102,241,0.35)]"
            >
              Explorar Desafíos <ArrowRight size={18} />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold border-2 border-zinc-300 dark:border-dark-500 text-zinc-700 dark:text-zinc-300 hover:border-primary-500 hover:text-primary-500 transition-all"
              >
                Empezar Gratis <ChevronRight size={18} />
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
            {[
              { value: '500+', label: 'Desafíos disponibles' },
              { value: '2K+',  label: 'Desarrolladores activos' },
              { value: '98%',  label: 'Tasa de satisfacción' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">{value}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECCIÓN FEATURES ===== */}
      <section className="py-20 px-4 bg-zinc-50/80 dark:bg-dark-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
              Todo lo que necesitas para crecer
            </h2>
            <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              Una plataforma completa diseñada para desarrolladores que quieren mejorar sus habilidades.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Code2 size={24} />,
                color: 'text-primary-400 bg-primary-500/10',
                title: 'Desafíos de código',
                desc: 'Resuelve problemas reales de algoritmia y estructuras de datos con soluciones verificadas por la comunidad.',
              },
              {
                icon: <Users size={24} />,
                color: 'text-accent-500 bg-accent-500/10',
                title: 'Aprendizaje colaborativo',
                desc: 'Crea tus propios desafíos, compártelos con la comunidad y aprende de las soluciones de otros desarrolladores.',
              },
              {
                icon: <Trophy size={24} />,
                color: 'text-violet-500 bg-violet-500/10',
                title: 'Seguimiento de progreso',
                desc: 'Rastrea tu avance por categorías, visualiza tu racha de días activos y comparte tus logros.',
              },
              {
                icon: <Zap size={24} />,
                color: 'text-amber-500 bg-amber-500/10',
                title: 'Retroalimentación inmediata',
                desc: 'Recibe sugerencias de optimización y comentarios detallados sobre tu código para mejorar continuamente.',
              },
              {
                icon: <BookOpen size={24} />,
                color: 'text-primary-400 bg-primary-500/10',
                title: 'Recursos de aprendizaje',
                desc: 'Accede a explicaciones teóricas, complejidad algorítmica y casos de borde para cada desafío.',
              },
              {
                icon: <Star size={24} />,
                color: 'text-accent-500 bg-accent-500/10',
                title: 'Sistema de niveles',
                desc: 'Avanza de Principiante a Avanzado según tu actividad y la calidad de tus soluciones.',
              },
            ].map(({ icon, color, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-zinc-200 dark:border-dark-600 bg-white dark:bg-dark-800 p-6 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-4 ${color}`}>
                  {icon}
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECCIÓN DESAFÍOS DESTACADOS ===== */}
      <section id="desafios" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Desafíos destacados
              </h2>
              <p className="text-base text-zinc-500 dark:text-zinc-400 mt-2">
                Los más populares de la comunidad esta semana.
              </p>
            </div>
            <Link
              to="/challenges"
              className="flex items-center gap-1.5 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors whitespace-nowrap"
            >
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="flex justify-center py-12">
              <Spinner size={28} className="border-primary-500 border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== SECCIÓN CTA ===== */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-cta rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
            <GridPattern className="opacity-10" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                ¿Listo para mejorar?
              </h2>
              <p className="text-base text-white/80 mb-8 max-w-md mx-auto">
                Únete a miles de desarrolladores que ya están mejorando sus habilidades algorítmicas con ComplexityLab.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-primary-600 bg-white hover:bg-zinc-50 transition-colors shadow-lg"
              >
                Crear Cuenta Gratis <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
