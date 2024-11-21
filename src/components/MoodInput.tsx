import React, { useState } from 'react';
import { Heart, Smile, Frown, Zap, Brain, Angry, SmilePlus } from 'lucide-react';

import { Mood } from '../types';

const moods: { type: Mood; icon: React.ReactNode; label: string; color: string }[] = [
  { type: 'happy', icon: <Smile className="w-6 h-6" />, label: 'Happy', color: 'bg-yellow-400' },
  { type: 'sad', icon: <Frown className="w-6 h-6" />, label: 'Sad', color: 'bg-blue-400' },
  { type: 'energetic', icon: <Zap className="w-6 h-6" />, label: 'Energetic', color: 'bg-purple-400' },
  { type: 'stressed', icon: <Brain className="w-6 h-6" />, label: 'Stressed', color: 'bg-red-400' },
  { type: 'loved', icon: <Heart className="w-6 h-6" />, label: 'Loved', color: 'bg-pink-400' },
  { type: 'angry', icon: <Angry className="w-6 h-6" />, label: 'Angry', color: 'bg-orange-400' },
  { type: 'calm', icon: <SmilePlus className="w-6 h-6" />, label: 'Calm', color: 'bg-green-400' },
];

interface MoodInputProps {
  onSubmit: (mood: Mood, intensity: number, note: string) => void;
}

export default function MoodInput({ onSubmit }: MoodInputProps) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMood) {
      onSubmit(selectedMood, intensity, note);
      setSelectedMood(null);
      setIntensity(5);
      setNote('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">How are you feeling today?</h2>
      
      <div className="grid grid-cols-4 gap-4 mb-8">
        {moods.map(({ type, icon, label, color }) => (
          <button
            key={type}
            type="button"
            onClick={() => setSelectedMood(type)}
            className={`flex flex-col items-center p-4 rounded-lg transition-all ${
              selectedMood === type
                ? `${color} text-white scale-105`
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {icon}
            <span className="mt-2 text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      {selectedMood && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intensity (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>1</span>
              <span>{intensity}</span>
              <span>10</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add a note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="How was your day?"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-colors"
          >
            Save Mood
          </button>
        </>
      )}
    </form>
  );
}