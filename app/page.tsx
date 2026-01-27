'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DomQuestionnaire() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    intensity: 5,
    dynamic: 'equal',
    activities: [] as string[],
    boundaries: '',
    aftercare: '',
    safeword: 'red'
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
    const sessionId = Math.random().toString(36).substring(7);
    
    const response = await fetch('/api/store-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, role: 'dom', data: formData })
    });

    if (response.ok) {
      const subLink = `${window.location.origin}/sub/${sessionId}`;
      alert(`Send this link to your partner:\n${subLink}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black p-8">
      <div className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-purple-500/30">
        <h1 className="text-4xl font-bold text-purple-400 mb-8 text-center">
          🔥 Dominant Questionnaire
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-purple-300 mb-2 font-semibold">
              Intensity Level: {formData.intensity}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.intensity}
              onChange={(e) => setFormData({...formData, intensity: Number(e.target.value)})}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <div>
            <label className="block text-purple-300 mb-2 font-semibold">Power Dynamic</label>
            <select
              value={formData.dynamic}
              onChange={(e) => setFormData({...formData, dynamic: e.target.value})}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none"
            >
              <option value="dom-led">Dominant-Led</option>
              <option value="equal">Equal Partnership</option>
              <option value="sub-guided">Submissive-Guided</option>
            </select>
          </div>

          <div>
            <label className="block text-purple-300 mb-2 font-semibold">Activities (Select Multiple)</label>
            <div className="grid grid-cols-2 gap-3">
              {activities.map(activity => (
                <button
                  key={activity}
                  type="button"
                  onClick={() => toggleActivity(activity)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.activities.includes(activity)
                      ? 'bg-purple-600 border-purple-400 text-white'
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-purple-500'
                  }`}
                >
                  {activity}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-purple-300 mb-2 font-semibold">Hard Boundaries</label>
            <textarea
              value={formData.boundaries}
              onChange={(e) => setFormData({...formData, boundaries: e.target.value})}
              placeholder="Things that are absolutely off-limits..."
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-purple-300 mb-2 font-semibold">Aftercare Preferences</label>
            <textarea
              value={formData.aftercare}
              onChange={(e) => setFormData({...formData, aftercare: e.target.value})}
              placeholder="How you'd like to provide aftercare..."
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-purple-300 mb-2 font-semibold">Safeword</label>
            <input
              type="text"
              value={formData.safeword}
              onChange={(e) => setFormData({...formData, safeword: e.target.value})}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-lg transition-colors shadow-lg"
          >
            Generate Partner Link
          </button>
        </form>
      </div>
    </div>
  );
}
