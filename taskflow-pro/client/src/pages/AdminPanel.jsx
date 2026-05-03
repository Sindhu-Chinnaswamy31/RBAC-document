// client/src/pages/AdminPanel.jsx
import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';

const AdminPanel = () => {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get user info from tasks (since we don't have a dedicated users endpoint)
    api.get('/tasks')
      .then(res => {
        const map = {};
        res.data.tasks.forEach(t => {
          if (t.assignedTo) map[t.assignedTo._id] = t.assignedTo;
          if (t.createdBy) map[t.createdBy._id] = t.createdBy;
        });
        setUsers(Object.values(map));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1>Admin Panel</h1>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Manage users and system settings</span>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>Users Overview</h2>
          {loading ? <Spinner /> : users.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No user data found. Create some tasks first.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#64748b', fontWeight: 600 }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#64748b', fontWeight: 600 }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#64748b', fontWeight: 600 }}>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem' }}>{u.name}</td>
                    <td style={{ padding: '0.75rem', color: '#64748b' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge badge-${u.role === 'admin' ? 'high' : u.role === 'manager' ? 'medium' : 'low'}`} style={{ textTransform: 'capitalize' }}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>API Endpoints Reference</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>All endpoints require JWT authentication via httpOnly cookie</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem', color: '#64748b' }}>Method</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', color: '#64748b' }}>Endpoint</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', color: '#64748b' }}>Access</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['POST', '/api/auth/register', 'Public'],
                ['POST', '/api/auth/login', 'Public'],
                ['POST', '/api/auth/logout', 'Authenticated'],
                ['GET', '/api/auth/me', 'Authenticated'],
                ['GET', '/api/tasks', 'All roles'],
                ['GET', '/api/tasks/dashboard', 'All roles'],
                ['POST', '/api/tasks', 'Admin, Manager'],
                ['PUT', '/api/tasks/:id', 'All roles'],
                ['DELETE', '/api/tasks/:id', 'Admin, Manager'],
              ].map(([method, path, access]) => (
                <tr key={path} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.5rem' }}>
                    <span style={{
                      background: method === 'GET' ? '#dbeafe' : method === 'POST' ? '#dcfce7' : method === 'PUT' ? '#fef3c7' : '#fee2e2',
                      color: method === 'GET' ? '#1d4ed8' : method === 'POST' ? '#16a34a' : method === 'PUT' ? '#d97706' : '#dc2626',
                      padding: '0.1rem 0.5rem',
                      borderRadius: '4px',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}>{method}</span>
                  </td>
                  <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>{path}</td>
                  <td style={{ padding: '0.5rem', color: '#64748b' }}>{access}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
