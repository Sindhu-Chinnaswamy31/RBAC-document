// client/src/pages/Tasks.jsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import Spinner from '../components/Spinner';

const TaskModal = ({ task, users, onClose, onSave }) => {
  const [form, setForm] = useState(task || {
    title: '', description: '', status: 'todo',
    priority: 'medium', assignedTo: '', dueDate: ''
  });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{task?._id ? 'Edit Task' : 'Create Task'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Assign To</label>
            <select name="assignedTo" value={form.assignedTo?._id || form.assignedTo} onChange={handleChange} required>
              <option value="">Select user...</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input type="date" name="dueDate" value={form.dueDate ? form.dueDate.split('T')[0] : ''} onChange={handleChange} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState('');
  const [page, setPage]             = useState(1);
  const [pagination, setPagination] = useState({});
  const [showModal, setShowModal]   = useState(false);
  const [editTask, setEditTask]     = useState(null);
  const [users, setUsers]           = useState([]);

  const canCreate = user?.role === 'admin' || user?.role === 'manager';

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, status: statusFilter, search };
      const res = await api.get('/tasks', { params });
      setTasks(res.data.tasks);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => { fetchTasks(); }, [page, statusFilter]);

  useEffect(() => {
    if (canCreate) {
      api.get('/auth/users').catch(() => {});
      // Fetch all users for assignment dropdown
      api.get('/tasks').then(res => {
        const uniqueUsers = [];
        const seen = new Set();
        res.data.tasks.forEach(t => {
          if (t.assignedTo && !seen.has(t.assignedTo._id)) {
            seen.add(t.assignedTo._id);
            uniqueUsers.push(t.assignedTo);
          }
        });
        setUsers(uniqueUsers);
      }).catch(() => {});
    }
  }, [canCreate]);

  const highPriorityCount = useMemo(() => {
    return tasks.filter(t => t.priority === 'high').length;
  }, [tasks]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setShowModal(true);
  };

  const handleSave = async (form) => {
    try {
      if (editTask?._id) {
        await api.put(`/tasks/${editTask._id}`, form);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', form);
        toast.success('Task created');
      }
      setShowModal(false);
      setEditTask(null);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <div>
            <h1>Tasks</h1>
            {highPriorityCount > 0 && (
              <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                ⚠️ {highPriorityCount} high priority task{highPriorityCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
          {canCreate && (
            <button className="btn-primary" onClick={() => { setEditTask(null); setShowModal(true); }}>
              + New Task
            </button>
          )}
        </div>

        <div className="filters">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchTasks()}
            placeholder='Search tasks... (press Enter)'
          />
          <select value={statusFilter} onChange={e => { setStatus(e.target.value); setPage(1); }}>
            <option value=''>All Status</option>
            <option value='todo'>Todo</option>
            <option value='in-progress'>In Progress</option>
            <option value='done'>Done</option>
          </select>
          <button className="btn-secondary" onClick={fetchTasks}>Search</button>
        </div>

        {loading ? <Spinner /> : tasks.length === 0 ? (
          <div className="empty-state">
            <h3>No tasks found</h3>
            <p>Try adjusting your filters or create a new task</p>
          </div>
        ) : (
          <>
            {tasks.map(task => (
              <TaskCard key={task._id} task={task} onDelete={handleDelete} onEdit={handleEdit} />
            ))}

            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn-secondary"
                  onClick={() => setPage(p => p - 1)}
                  disabled={!pagination.hasPrev}
                >
                  ← Previous
                </button>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  className="btn-secondary"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!pagination.hasNext}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <TaskModal
          task={editTask}
          users={users}
          onClose={() => { setShowModal(false); setEditTask(null); }}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default Tasks;
