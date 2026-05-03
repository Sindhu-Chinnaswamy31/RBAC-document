// client/src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' });
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      setUser(res.data);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>⚡ TaskFlow Pro</h1>
        <p>Create your account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input name='name' value={form.name} onChange={handleChange} placeholder='Your name' required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name='email' type='email' value={form.email} onChange={handleChange} placeholder='you@example.com' required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name='password' type='password' value={form.password} onChange={handleChange} placeholder='Min 6 characters' required minLength={6} />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select name='role' value={form.role} onChange={handleChange}>
              <option value='employee'>Employee</option>
              <option value='manager'>Manager</option>
              <option value='admin'>Admin</option>
            </select>
          </div>
          <button type='submit' className="btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to='/login'>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
