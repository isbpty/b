'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import CreateQuestionnaireForm from '@/components/CreateQuestionnaireForm';

interface Questionnaire {
  id: string;
  dom_id: string;
  title: string;
  created_at: string;
  responded: boolean;
}

export async function getServerSideProps({ res }) {
  // Set no-cache headers
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  return {
    props: {}, // Return any props you might need here
  };
}

export default function Dashboard() {
  const [domId, setDomId] = useState('');
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const initDom = async () => {
      const savedDomId = localStorage.getItem('domId');
      console.log('Saved Dom ID:', savedDomId); // Debugging line
      if (savedDomId) {
        setDomId(savedDomId);
        loadQuestionnaires(savedDomId);
      } else {
        alert('No Dom user found. Please create one.');
      }
    };
    initDom();
  }, []);

  const loadQuestionnaires = async (domIdToLoad: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('questionnaires')
      .select('*')
      .eq('dom_id', domIdToLoad)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading questionnaires:', error);
    } else {
      setQuestionnaires(data || []);
    }
    setLoading(false);
  };

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-purple-500/30 mb-8">
          <h1 className="text-3xl font-bold text-purple-400">🎯 Dashboard</h1>
          <button
            onClick={toggleCreateForm}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            {showCreateForm ? '✖️ Cancel' : '➕ Create Questionnaire'}
          </button>
        </div>

        {showCreateForm && (
          <CreateQuestionnaireForm domId={domId} onQuestionnaireCreated={loadQuestionnaires} />
        )}

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-purple-400 mb-6">
            📋 Your Questionnaires ({questionnaires.length})
          </h2>

          {loading ? (
            <p className="text-gray-400 text-center py-8">Loading...</p>
          ) : questionnaires.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No questionnaires yet. Create your first one!</p>
          ) : (
            <div className="space-y-4">
              {questionnaires.map((questionnaire) => (
                <div key={questionnaire.id} className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                  <h3 className="text-xl font-bold text-purple-300">{questionnaire.title}</h3>
                  <p className="text-gray-400 text-sm">Created: {new Date(questionnaire.created_at).toLocaleString()}</p>
                  <p className={`text-sm mt-2 ${questionnaire.responded ? 'text-green-400' : 'text-yellow-400'}`}>
                    {questionnaire.responded ? '✅ Responded' : '⏳ Waiting for response'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
