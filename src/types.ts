export type Mood = 'happy' | 'sad' | 'stressed' | 'energetic' | 'calm' | 'angry' | 'loved';

export interface MoodEntry {
  id: string;
  userId: string;
  mood: Mood;
  intensity: number;
  note?: string;
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  partnerId: string;
}