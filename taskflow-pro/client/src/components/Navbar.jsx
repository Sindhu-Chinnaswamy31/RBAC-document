// client/src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">⚡ TaskFlow Pro</div>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/tasks">Tasks</Link>
        {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
        <span className="role-badge">{user?.role}</span>
        <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{user?.name}</span>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </nav>
    </nav>
  );
};

export default Navbar;
