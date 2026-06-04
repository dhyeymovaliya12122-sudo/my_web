import { useState } from 'react';
import callApi from './api';

// Loads and shows student list from dummyjson API
function StudentData() {
  const [students, setStudents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleStudents = async () => {
    // If already loaded, hide them
    if (students && students.length) {
      setStudents(null);
      setError('');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // 🔗 EXTERNAL API URL - fetches sample user data for demo
      const json = await callApi('https://dummyjson.com/users?limit=5');
      setStudents(json.users || []);
    } catch (err) {
      setError('Could not load students. Check internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '8px', marginTop: '8px' }}>
      <button onClick={toggleStudents} disabled={loading}>
        {loading ? 'Loading...' : students && students.length ? 'Hide Students' : 'Load Students'}
      </button>

      {error && <div style={{ color: '#f66', marginTop: '6px' }}>{error}</div>}

      {students && students.length > 0 && (
        <div style={{ marginTop: '8px' }}>
          <strong>Students:</strong>
          <ul>
            {students.map(s => (
              <li key={s.id}>{s.firstName} {s.lastName} — {s.email}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StudentData;
