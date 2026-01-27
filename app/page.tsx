'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface SubLink {
  id: string;
  sub_name: string;
  link_code: string;
  story: string;
  responded: boolean;
  response_text?: string;
  created_at: string;
  responded_at?: string;
}

export default function Dashboard() {
  const [domName, setDomName] = useState('');
  const [domId, setDomId] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [links, setLinks] = useState<SubLink[]>([]);
  const [loading, setLoading] = useState(false);

  // New Link Form
  const [subName, setSubName] = useState('');
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

  // Initialize Dom User
  useEffect(() => {
    const initDom = async () => {
      const savedDomId = localStorage.getItem('domId');
      if (savedDomId) {
        setDomId(savedDomId);
        loadLinks(savedDomId);
      }
    };
    initDom();
  }, []);

  // Create Dom User
  const handleCreateDom = async () => {
    if (!domName.trim()) return;
    
    const { data, error } = await supabase
      .from('doms')
      .insert([{ name: domName }])
      .select()
      .single();

    if (error) {
      alert('Error creating user: ' + error.message);
      return;
    }

    setDomId(data.id);
    localStorage.setItem('domId', data.id);
    loadLinks(data.id);
  };

  // Load all links
  const loadLinks = async (domIdToLoad: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sub_links')
      .select('*')
      .eq('dom_id', domIdToLoad)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLinks(data);
    }
    setLoading(false);
  };

  // Toggle activity
  const toggleActivity = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity]
    }));
  };

  // Generate Story with AI
  const generateStory = async () => {
    const prompt = `Create a personalized, intimate story for ${subName}. 
    Preferences: ${formData.activities.join(', ')}
    Intensity: ${formData.intensity}/10
    Dynamic: ${formData.dynamic}
    Keep it sensual, respectful, and engaging. Make it 200-300 words.`;

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      const data = await response.json();
      return data.story;
    } catch (error) {
      return `A personalized story for ${subName}...`; // Fallback
    }
  };

  // Create New Link
  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) {
      alert('Please enter the sub\'s name!');
      return;
    }

    setLoading(true);
    const linkCode = Math.random().toString(36).substring(2, 10);
    const story = await generateStory();

    const { data, error } = await supabase
      .from('sub_links')
      .insert([{
        dom_id: domId,
        sub_name: subName,
        link_code: linkCode,
        story: story
      }])
      .select()
      .single();

    if (error) {
      alert('Error creating link: ' + error.message);
      setLoading(false);
      return;
    }

    // Show link to copy
    const fullLink = `${window.location.origin}/sub/${linkCode}`;
    alert(`✨ Link created for ${subName}!\n\nSend this:\n${fullLink}`);
    
    // Reset form
    setSubName('');
    setFormData({
      intensity: 5,
      dynamic: 'equal',
      activities: [],
      boundaries: '',
      aftercare: '',
      safeword: 'red'
    });
    setShowCreateForm(false);
    
    // Reload links
    loadLinks(domId);
  };

  // Copy link to clipboard
  const copyLink = (linkCode: string) => {
    const fullLink = `${window.location.origin}/sub/${linkCode}`;
    navigator.clipboard.writeText(fullLink);
    alert('Link copied to clipboard!');
  };

  // If no dom user, show setup
  if (!domId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-purple-500/30">
          <h1 className="text-4xl font-bold text-purple-400 mb-6 text-center">
            🔥 Welcome Dom
          </h1>
          <p className="text-gray-300 mb-6 text-center">
            Enter your name to create your dashboard
          </p>
          <input
            type="text"
            value={domName}
            onChange={(e) => setDomName(e.target.value)}
            placeholder="Your name..."
            className="w-full p-4 bg-gray-700 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none mb-4"
            onKeyPress={(e) => e.key === 'Enter' && handleCreateDom()}
          />
          <button
            onClick={handleCreateDom}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-lg transition-colors"
          >
            Create Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-purple-500/30 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-purple-400">
              🎯 Dashboard
            </h1>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              ➕ New Link
            </button>
          </div>
        </div>

        {/* Create Link Form */}
        {showCreateForm && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-purple-500/30 mb-8">
            <h2 className="text-2xl font-bold text-purple-400 mb-6">
              Create New Link
            </h2>
            
            <form onSubmit={handleCreateLink} className="space-y-6">
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">
                  Sub's Name (for personalization) *
                </label>
                <input
                  type="text"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="Enter their name..."
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

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

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-4 rounded-lg transition-colors"
                >
                  {loading ? 'Creating...' : '✨ Generate Link'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Links List */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-purple-400 mb-6">
            📋 Your Links ({links.length})
          </h2>

          {loading ? (
            <p className="text-gray-400 text-center py-8">Loading...</p>
          ) : links.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No links yet. Create your first one!
            </p>
          ) : (
            <div className="space-y-4">
              {links.map(link => (
                <div
                  key={link.id}
                  className="bg-gray-700/50 rounded-lg p-6 border border-gray-600 hover:border-purple-500/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-purple-300">
                        👤 {link.sub_name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Created: {new Date(link.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {link.responded ? (
                        <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold">
                          ✅ Responded
                        </span>
                      ) : (
                        <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-semibold">
                          ⏳ Waiting
                        </span>
                      )}
                    </div>
                  </div>

                  {link.responded && link.response_text && (
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                      <p className="text-gray-300">
                        <strong className="text-purple-400">Response:</strong> {link.response_text}
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        Responded: {new Date(link.responded_at!).toLocaleString()}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => copyLink(link.link_code)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      📋 Copy Link
                    </button>
                    <button
                      onClick={() => window.open(`/sub/${link.link_code}`, '_blank')}
                      className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      👁️ Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
