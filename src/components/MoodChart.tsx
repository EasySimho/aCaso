import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { MoodEntry } from '../types';

interface MoodChartProps {
  userMoods: MoodEntry[];
  partnerMoods: MoodEntry[];
}

const moodToValue = (mood: string): number => {
  const moodValues: Record<string, number> = {
    happy: 8,
    loved: 9,
    energetic: 7,
    calm: 6,
    stressed: 4,
    sad: 3,
    angry: 2,
  };
  return moodValues[mood] || 5;
};

export default function MoodChart({ userMoods, partnerMoods }: MoodChartProps) {
  const combinedData = [...userMoods, ...partnerMoods]
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .map((entry) => ({
      date: format(entry.timestamp, 'MMM dd'),
      [entry.userId === userMoods[0]?.userId ? 'You' : 'Partner']: 
        moodToValue(entry.mood) * (entry.intensity / 10),
    }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-[400px]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mood Trends</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={combinedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="You"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6' }}
          />
          <Line
            type="monotone"
            dataKey="Partner"
            stroke="#EC4899"
            strokeWidth={2}
            dot={{ fill: '#EC4899' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}