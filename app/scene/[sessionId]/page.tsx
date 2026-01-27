'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function SceneDisplay() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [scene, setScene] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    generateScene();
  }, []);

  const generateScene = async () => {
    try {
      setLoading(true);
      
      // Get session data
      const sessionResponse = await fetch(`/api/store-session?sessionId=${sessionId}`);
      if (!sessionResponse.ok) {
        throw new Error('Session not found');
      }
      
      const sessionData = await sessionResponse.json();
      
      if (!sessionData.dom || !sessionData.sub) {
        throw new Error('Both partners must complete their questionnaires');
      }

      // Generate scene
      const sceneResponse = await fetch('/api/generate-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domData: sessionData.dom,
          subData: sessionData.sub
        })
      });

      if (!sceneResponse.ok) {
        throw new Error('Failed to generate scene');
      }

      const { scene: generatedScene } = await sceneResponse.json();
      setScene(generatedScene);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Crafting your perfect scene...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black flex items-center justify-center p-8">
        <div className="max-w-md bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-red-500/30">
          <h2 className="text-2xl font-bold text-red-400 mb-4">⚠️ Error</h2>
          <p className="text-white">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-black p-8">
      <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-purple-500/30">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            ✨ Your Custom Scene
          </h1>
          <button
            onClick={generateScene}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            🔄 Regenerate
          </button>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-gray-100 leading-relaxed">
            {scene}
          </div>
        </div>

        <div className="mt-8 p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
          <h3 className="text-xl font-bold text-red-400 mb-2">🛡️ Safety Reminder</h3>
          <ul className="text-gray-300 space-y-1">
            <li>• Always use your safeword if needed</li>
            <li>• Check in with your partner regularly</li>
            <li>• Respect all boundaries at all times</li>
            <li>• Aftercare is essential for both partners</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
