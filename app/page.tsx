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

export default function Dashboard() {
  const [domId, setDomId] = useState('');
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Initialize Dom User
  useEffect(() => {
    const initDom = async () => {
      const savedDomId = localStorage.getItem('domId');
      if (savedDomId) {
        setDomId(savedDomId);
        loadQuestionnaires(savedDomId);
      } else {
        // Redirect to create a new Dom user if none exists
        alert('No Dom user found. Please create one.');
        // Handle redirect logic based on your requirements
      }
    };
    initDom();
  }, []);

  // Load all questionnaires
  const loadQuestionnaires = async (domIdToLoad: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('questionnaires')
      .select('*')
      .eq('dom_id', domIdToLoad)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setQuestionnaires(data);
    }
    setLoading(false);
  };

  // Toggle Create Form
  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };*
