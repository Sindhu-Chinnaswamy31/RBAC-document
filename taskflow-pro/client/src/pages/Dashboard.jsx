// client/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';

const COLORS = ['#2563eb', '#f59e0b', '#22c55e', '#ef4444', '#8b5cf6'];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tasks/dashboard')
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalTasks = stats?.statusStats?.reduce((sum, s) => sum + s.count, 0) || 0;
  const doneTasks = stats?.statusStats?.find(s => s._id === 'done')?.count || 0;
  const inProgressTasks = stats?.statusStats?.find(s => s._id === 'in-progress')?.count || 0;
  const todoTasks = stats?.statusStats?.find(s => s._id === 'todo')?.count || 0;

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1>Dashboard</h1>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Welcome back, <strong>{user?.name}</strong>
          </span>
        </div>

        {loading ? <Spinner /> : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{totalTasks}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#22c55e' }}>{doneTasks}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#f59e0b' }}>{inProgressTasks}</div>
                <div className="stat-label">In Progress</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#64748b' }}>{todoTasks}</div>
                <div className="stat-label">To Do</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Tasks by Status</h3>
                {stats?.statusStats?.length > 0 ? (
                  <ResponsiveContainer width='100%' height={250}>
                    <BarChart data={stats.statusStats}>
                      <XAxis dataKey='_id' />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey='count' fill='#2563eb' radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>No data yet</p>}
              </div>

              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Tasks by Priority</h3>
                {stats?.priorityStats?.length > 0 ? (
                  <ResponsiveContainer width='100%' height={250}>
                    <PieChart>
                      <Pie
                        data={stats.priorityStats}
                        dataKey='count'
                        nameKey='_id'
                        cx='50%'
                        cy='50%'
                        outerRadius={90}
                        label={({ _id, count }) => `${_id}: ${count}`}
                      >
                        {stats.priorityStats.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>No data yet</p>}
              </div>
            </div>

            {user?.role === 'admin' && (
              <div className="card" style={{ marginTop: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
                <h3>Admin Quick Links</h3>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <a href='/admin'>
                    <button className="btn-primary">Manage Users</button>
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
