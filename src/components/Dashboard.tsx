import React from 'react';
import { Heart, Calendar, MessageCircle } from 'lucide-react';
import MoodInput from './MoodInput';
import MoodChart from './MoodChart';
import { MoodEntry, User, Mood } from '../types';

interface DashboardProps {
  currentUser: User;
  partner: User | null;
  userMoods: MoodEntry[];
  partnerMoods: MoodEntry[];
  onMoodSubmit: (mood: Mood, intensity: number, note: string) => void;
}

export default function Dashboard({ currentUser, partner, userMoods, partnerMoods, onMoodSubmit }: DashboardProps) {
  const getLatestMood = (moods: MoodEntry[]) => 
    moods.length > 0 ? moods[0] : null;

  const userLatestMood = getLatestMood(userMoods);
  const partnerLatestMood = getLatestMood(partnerMoods);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Heart className="w-8 h-8 text-pink-500" />
              <h1 className="text-2xl font-bold text-gray-900">Mood Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full"
              />
              <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Your Status</h2>
              <Calendar className="w-5 h-5 text-gray-500" />
            </div>
            {userLatestMood ? (
              <div className="space-y-4">
                <p className="text-lg font-medium">
                  You're feeling <span className="text-blue-500">{userLatestMood.mood}</span>
                </p>
                <p className="text-gray-600">{userLatestMood.note}</p>
              </div>
            ) : (
              <p className="text-gray-500">No mood recorded today</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {partner ? `${partner.name}'s Status` : 'Partner Status'}
              </h2>
              <MessageCircle className="w-5 h-5 text-gray-500" />
            </div>
            {partnerLatestMood ? (
              <div className="space-y-4">
                <p className="text-lg font-medium">
                  Feeling <span className="text-pink-500">{partnerLatestMood.mood}</span>
                </p>
                <p className="text-gray-600">{partnerLatestMood.note}</p>
              </div>
            ) : (
              <p className="text-gray-500">No mood recorded today</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MoodInput onSubmit={onMoodSubmit} />
          <MoodChart userMoods={userMoods} partnerMoods={partnerMoods} />
        </div>
      </main>
    </div>
  );
}