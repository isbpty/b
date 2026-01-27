'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function SubQuestionnaire() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [formData, setFormData] = useState({
    intensity: 5,
    experience: 'intermediate',
    activities: [] as string[],
    boundaries: '',
    aftercare: ''
  });

  const activities = [
    'Impact Play', 'Bondage', 'Roleplay', 'Sensory Play',
    'Power Exchange', 'Discipline', 'Edging', 'Worship'
  ];

  const toggleActivity = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch('/api/store-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, role: 'sub', data: formData })
    });

    if (response.ok) {
      router.push(`/scene/${sessionId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-gray-900 to-black p-8">
      <div className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-pink-500/30">
        <h1 className="text-4xl font-bold text-pink-400 mb-8 text-center">
          💖 Submissive Questionnaire
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-pink-300 mb-2 font-semibold">
              Intensity Level: {formData.intensity}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.intensity}
              onChange={(e) => setFormData({...formData, intensity: Number(e.target.value)})}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          <div>
            <label className="block text-pink-300 mb-2 font-semibold">Experience Level</label>
            <select
              value={formData.experience}
              onChange={(e) => setFormData({...formData, experience: e.target.value})}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-pink-500/30 focus:border-pink-500 focus:outline-none"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-pink-300 mb-2 font-semibold">Activities (Select Multiple)</label>
            <div className="grid grid-cols-2 gap-3">
              {activities.map(activity => (
                <button
                  key={activity}
                  type="button"
                  onClick={() => toggleActivity(activity)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.activities.includes(activity)
                      ? 'bg-pink-600 border-pink-400 text-white'
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-pink-500'
                  }`}
                >
                  {activity}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-pink-300 mb-2 font-semibold">Hard Boundaries</label>
            <textarea
              value={formData.boundaries}
              onChange={(e) => setFormData({...formData, boundaries: e.target.value})}
              placeholder="Things that are absolutely off-limits..."
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-pink-500/30 focus:border-pink-500 focus:outline-none min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-pink-300 mb-2 font-semibold">Aftercare Needs</label>
            <textarea
              value={formData.aftercare}
              onChange={(e) => setFormData({...formData, aftercare: e.target.value})}
              placeholder="What you need after the scene..."
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-pink-500/30 focus:border-pink-500 focus:outline-none min-h-[100px]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-lg transition-colors shadow-lg"
          >
            Generate Scene
          </button>
        </form>
      </div>
    </div>
  );
}
