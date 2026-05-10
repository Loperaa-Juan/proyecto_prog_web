/**
 * Servicio del dashboard (mock).
 * Simula el endpoint GET /dashboard del backend.
 * Para migrar a la API real, reemplaza cada función por `http.get(...)`.
 */

import { randomDelay } from '@/lib/delay';
import type { DashboardStats, ProgressItem, Notification } from '@/types';
import type { Challenge } from '@/types';
import { getMyChallenges } from './challenges';
import { getCurrentUser } from './auth';

/**
 * Obtiene las estadísticas generales del dashboard del usuario actual.
 * Simula GET /dashboard → { data: { created_challenges, solved_challenges } }.
 *
 * @returns Promesa con las estadísticas del dashboard.
 */
export async function getStats(): Promise<DashboardStats> {
  await randomDelay(400, 700);
  return {
    challengesCreated: 5,
    solved: 18,
    currentStreak: 7,
    interactions: 234,
  };
}

/**
 * Obtiene los desafíos creados por el usuario actual desde el servicio de challenges.
 * @returns Promesa con el array de desafíos propios del usuario.
 */
export async function getDashboardChallenges(): Promise<Challenge[]> {
  const user = getCurrentUser();
  if (!user) return [];
  return getMyChallenges();
}

/**
 * Retorna una lista simulada de desafíos resueltos por el usuario.
 * @returns Promesa con array de desafíos marcados como resueltos.
 */
export async function getSolvedChallenges(): Promise<Challenge[]> {
  await randomDelay(300, 600);
  // Simulamos que el usuario resolvió los primeros 2 desafíos del sistema
  return [
    {
      id: '1',
      title: 'Two Sum',
      description: 'Retorna índices de dos números que suman target.',
      difficulty: 'easy',
      category: 'arrays',
      categoryLabel: 'Arreglos',
      tags: ['hash-map'],
      authorId: 'sys-1',
      authorName: 'ComplexityLab',
      authorInitials: 'CL',
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      solutionsCount: 1284,
      successRate: 94,
    },
    {
      id: '4',
      title: 'Reverse Linked List',
      description: 'Revierte una lista enlazada y retorna la nueva cabeza.',
      difficulty: 'easy',
      category: 'linkedlist',
      categoryLabel: 'Listas Enlazadas',
      tags: ['linked-list'],
      authorId: 'sys-1',
      authorName: 'ComplexityLab',
      authorInitials: 'CL',
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      solutionsCount: 2103,
      successRate: 97,
    },
  ];
}

/**
 * Retorna los ítems de progreso por categoría para la barra lateral.
 * @returns Promesa con array de ProgressItem.
 */
export async function getProgress(): Promise<ProgressItem[]> {
  await randomDelay(300, 500);
  return [
    { category: 'Arreglos', solved: 12, total: 32, color: 'primary' },
    { category: 'Árboles',  solved: 8,  total: 20, color: 'accent'  },
    { category: 'Grafos',   solved: 3,  total: 15, color: 'violet'  },
    { category: 'Prog. Dinámica', solved: 5, total: 18, color: 'amber' },
  ];
}

/**
 * Retorna las notificaciones del usuario.
 * @returns Promesa con array de Notification.
 */
export async function getNotifications(): Promise<Notification[]> {
  await randomDelay(300, 500);
  return [
    { id: 'n-1', kind: 'success', message: 'Tu solución de "Two Sum" fue aprobada', createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: 'n-2', kind: 'info',    message: 'Nuevo desafío en la categoría Grafos', createdAt: new Date(Date.now() - 86400000).toISOString()   },
    { id: 'n-3', kind: 'info',    message: '¡Llevas 7 días consecutivos activo!',  createdAt: new Date(Date.now() - 3600000).toISOString()    },
  ];
}
