'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SubPage() {
  const params = useParams();
  const linkCode = params.linkCode as string;
  
  const [loading, setLoading] = useState(true);
  const [linkData, setLinkData] = useState<any>(null);
  const [response, setResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadLink();
  }, [linkCode]);

  const loadLink = async () => {
    const { data, error } = await supabase
      .from('sub_links')
      .select('*')
      .eq('link_code', linkCode)
      .single();

    if (error || !data) {
      alert('Invalid link!');
      setLoading(false);
      return;
    }

    setLinkData(data);
    setSubmitted(data.responded);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('sub_links')
      .update({
        responded: true,
        response_text: response,
        responded_at: new Date().toISOString()
      })
      .eq('link_code', linkCode);

    if (error) {
      alert('Error submitting response!');
      return;
    }

    setSubmitted(true);
    alert('Response submitted! 💜');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center">
        <p className="text-purple-400 text-xl">Loading...</p>
      </div>
    );
  }

  if (!linkData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-400 text-2xl mb-4">❌ Invalid Link</p>
          <p className="text-gray-400">This link doesn't exist or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black p-8">
      <div className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-purple-500/30">
        <h1 className="text-4xl font-bold text-purple-400 mb-4 text-center">
          💌 For {linkData.sub_name}
        </h1>

        <div className="bg-gray-700/50 rounded-lg p-6 mb-8 border border-purple-500/20">
          <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
            {linkData.story}
          </p>
        </div>

        {submitted ? (
          <div className="text-center">
            <p className="text-green-400 text-2xl mb-4">✅ Response Submitted!</p>
            <p className="text-gray-400">Your dom has been notified.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-purple-300 mb-2 font-semibold">
                Your Response
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full p-4 bg-gray-700 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none min-h-[150px]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-lg transition-colors"
            >
              Send Response 💜
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
