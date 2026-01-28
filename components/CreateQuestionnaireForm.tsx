'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface CreateQuestionnaireFormProps {
  domId: string;
  onQuestionnaireCreated: (domId: string) => void;
}

const CreateQuestionnaireForm: React.FC<CreateQuestionnaireFormProps> = ({ domId, onQuestionnaireCreated }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('questionnaires')
      .insert([{ dom_id: domId, title }]);

    if (error) {
      alert('Error creating questionnaire: ' + error.message);
    } else {
      alert('Questionnaire created!');
      setTitle('');
      onQuestionnaireCreated(domId);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-700/50 rounded-lg p-6 mb-8 border border-purple-500/30">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">Create New Questionnaire</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Questionnaire Title..."
        className="w-full p-4 bg-gray-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none mb-4"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-4 rounded-lg transition-colors"
      >
        {loading ? 'Creating...' : 'Create Questionnaire'}
      </button>
    </form>
  );
};

export default CreateQuestionnaireForm;
