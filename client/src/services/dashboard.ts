import type { DashboardStats, ProgressItem, Notification } from '@/types';
import type { Challenge } from '@/types';
import { getMyChallenges } from './challenges';
import { getCurrentUser } from './auth';

export async function getStats(): Promise<DashboardStats> {
  const user = getCurrentUser();
  return {
    challengesCreated: 0,
    solved: 0,
    currentStreak: user?.streak ?? 0,
    interactions: 0,
  };
}

export async function getDashboardChallenges(): Promise<Challenge[]> {
  const user = getCurrentUser();
  if (!user) return [];
  return getMyChallenges();
}

export async function getSolvedChallenges(): Promise<Challenge[]> {
  return [];
}

export async function getProgress(): Promise<ProgressItem[]> {
  return [];
}

export async function getNotifications(): Promise<Notification[]> {
  return [];
}
