/**
 * Dataset de desafíos de programación mockeados para desarrollo.
 * Reproduce los 9 desafíos visibles en challenges.html del sitio original
 * más 3 adicionales para probar la paginación (página 2).
 * Cuando el backend esté implementado, este archivo ya no se usará.
 */

import type { Challenge } from '@/types';

/** Autor simulado para desafíos del sistema */
const SYSTEM_AUTHOR = {
  authorId: 'sys-1',
  authorName: 'ComplexityLab',
  authorInitials: 'CL',
};

/** Array mutable de desafíos; los servicios operan sobre este array. */
export const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Two Sum',
    description:
      'Dado un arreglo de enteros nums y un entero target, retorna los índices de los dos números cuya suma sea igual a target. Puedes asumir que cada entrada tiene exactamente una solución y no puedes usar el mismo elemento dos veces.',
    difficulty: 'easy',
    category: 'arrays',
    categoryLabel: 'Arreglos',
    tags: ['hash-map', 'arreglos'],
    codeTemplate: 'function twoSum(nums: number[], target: number): number[] {\n  // Tu solución aquí\n}',
    ...SYSTEM_AUTHOR,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    solutionsCount: 1284,
    successRate: 94,
  },
  {
    id: '2',
    title: 'Merge Intervals',
    description:
      'Dado un arreglo de intervalos donde intervalos[i] = [startᵢ, endᵢ], combina todos los intervalos que se superponen y retorna un arreglo de los intervalos combinados no superpuestos que cubran todos los intervalos de la entrada.',
    difficulty: 'medium',
    category: 'arrays',
    categoryLabel: 'Arreglos',
    tags: ['sorting', 'arreglos'],
    ...SYSTEM_AUTHOR,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    solutionsCount: 876,
    successRate: 78,
  },
  {
    id: '3',
    title: 'Longest Palindromic Substring',
    description:
      'Dado un string s, retorna el substring palindrómico más largo en s. Se garantiza que la respuesta existe y es única para las entradas de prueba.',
    difficulty: 'hard',
    category: 'strings',
    categoryLabel: 'Cadenas',
    tags: ['dp', 'cadenas'],
    ...SYSTEM_AUTHOR,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    solutionsCount: 432,
    successRate: 52,
  },
  {
    id: '4',
    title: 'Reverse Linked List',
    description:
      'Dada la cabeza de una lista enlazada, revierte la lista y retorna la nueva cabeza. Implémenta tanto la solución iterativa como la recursiva.',
    difficulty: 'easy',
    category: 'linkedlist',
    categoryLabel: 'Listas Enlazadas',
    tags: ['linked-list', 'recursión'],
    ...SYSTEM_AUTHOR,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    solutionsCount: 2103,
    successRate: 97,
  },
  {
    id: '5',
    title: 'Binary Tree Level Order Traversal',
    description:
      'Dado la raíz de un árbol binario, retorna el recorrido por niveles de los valores de sus nodos (de izquierda a derecha, nivel por nivel).',
    difficulty: 'medium',
    category: 'trees',
    categoryLabel: 'Árboles',
    tags: ['bfs', 'árboles'],
    ...SYSTEM_AUTHOR,
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    solutionsCount: 1567,
    successRate: 85,
  },
  {
    id: '6',
    title: 'Word Ladder',
    description:
      'Dado dos palabras beginWord y endWord y un diccionario wordList, retorna el número de palabras en la secuencia de transformación más corta de beginWord a endWord. Cada palabra transformada debe existir en wordList.',
    difficulty: 'hard',
    category: 'graphs',
    categoryLabel: 'Grafos',
    tags: ['bfs', 'grafos'],
    ...SYSTEM_AUTHOR,
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    solutionsCount: 198,
    successRate: 38,
  },
  {
    id: '7',
    title: 'Valid Parentheses',
    description:
      'Dado un string s que contiene solo los caracteres \'(\', \')\', \'{\', \'}\', \'[\' y \']\', determina si el string de entrada es válido. Un string es válido si los paréntesis abiertos se cierran con el tipo correcto.',
    difficulty: 'easy',
    category: 'stacks',
    categoryLabel: 'Pilas',
    tags: ['pila', 'cadenas'],
    ...SYSTEM_AUTHOR,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    solutionsCount: 3241,
    successRate: 99,
  },
  {
    id: '8',
    title: 'Coin Change',
    description:
      'Se te da un arreglo de monedas que representan denominaciones y un entero amount. Retorna el número mínimo de monedas necesarias para alcanzar esa cantidad. Si no puedes alcanzar la cantidad, retorna -1.',
    difficulty: 'medium',
    category: 'dp',
    categoryLabel: 'Prog. Dinámica',
    tags: ['dp', 'greedy'],
    ...SYSTEM_AUTHOR,
    createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
    solutionsCount: 743,
    successRate: 67,
  },
  {
    id: '9',
    title: 'Median of Two Sorted Arrays',
    description:
      'Dados dos arreglos ordenados nums1 y nums2 de tamaño m y n respectivamente, retorna la mediana de los dos arreglos ordenados. La complejidad de tiempo total del algoritmo debe ser O(log(m+n)).',
    difficulty: 'hard',
    category: 'arrays',
    categoryLabel: 'Arreglos',
    tags: ['búsqueda-binaria', 'arreglos'],
    ...SYSTEM_AUTHOR,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    solutionsCount: 287,
    successRate: 41,
  },
  {
    id: '10',
    title: 'Maximum Subarray',
    description:
      'Dado un arreglo entero nums, encuentra el subarray (que contenga al menos un número) que tenga la suma más grande y retorna su suma.',
    difficulty: 'medium',
    category: 'dp',
    categoryLabel: 'Prog. Dinámica',
    tags: ['dp', 'arreglos'],
    ...SYSTEM_AUTHOR,
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    solutionsCount: 1892,
    successRate: 88,
  },
  {
    id: '11',
    title: 'Climbing Stairs',
    description:
      'Estás subiendo una escalera. Se necesitan n pasos para llegar a la cima. Cada vez puedes subir 1 o 2 escalones. ¿De cuántas formas distintas puedes llegar a la cima?',
    difficulty: 'easy',
    category: 'dp',
    categoryLabel: 'Prog. Dinámica',
    tags: ['dp', 'fibonacci'],
    ...SYSTEM_AUTHOR,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    solutionsCount: 4102,
    successRate: 98,
  },
  {
    id: '12',
    title: 'Graph Valid Tree',
    description:
      'Dado n nodos y una lista de aristas sin dirección, escribe una función para comprobar si estas aristas forman un árbol válido.',
    difficulty: 'medium',
    category: 'graphs',
    categoryLabel: 'Grafos',
    tags: ['grafos', 'union-find'],
    ...SYSTEM_AUTHOR,
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    solutionsCount: 621,
    successRate: 72,
  },
];
