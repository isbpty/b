'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]); // Adjust type as necessary

  useEffect(() => {
    // Simulating data fetching
    const fetchData = async () => {
      try {
        // Here, you can fetch data from Supabase or any API endpoint
        const response = await fetch('/api/questionnaires'); // Example API endpoint
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Your Questionnaires</h2>
        {data.length === 0 ? (
          <p>No questionnaires available.</p>
        ) : (
          <ul>
            {data.map((item) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
