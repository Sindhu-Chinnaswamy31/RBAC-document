// client/src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>⚡ TaskFlow Pro</h1>
        <p>Sign in to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              name='email'
              type='email'
              value={form.email}
              onChange={handleChange}
              placeholder='you@example.com'
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              name='password'
              type='password'
              value={form.password}
              onChange={handleChange}
              placeholder='••••••••'
              required
            />
          </div>
          <button type='submit' className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to='/register'>Register</Link>
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.8rem', color: '#64748b' }}>
          <strong>Test accounts:</strong><br />
          admin@test.com / password123<br />
          manager@test.com / password123<br />
          employee@test.com / password123
        </div>
      </div>
    </div>
  );
};

export default Login;
