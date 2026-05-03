// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position='top-right' />
        <Routes>
          <Route path='/' element={<Navigate to='/dashboard' replace />} />
          <Route path='/login'    element={<Login />} />
          <Route path='/register' element={<Register />} />

          <Route path='/dashboard' element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path='/tasks' element={
            <ProtectedRoute><Tasks /></ProtectedRoute>
          } />
          <Route path='/admin' element={
            <ProtectedRoute requiredRole='admin'>
              <AdminPanel />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
