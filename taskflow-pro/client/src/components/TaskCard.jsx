// client/src/components/TaskCard.jsx
import { useAuth } from '../context/AuthContext';

const TaskCard = ({ task, onDelete, onEdit }) => {
  const { user } = useAuth();
  const canDelete = user?.role === 'admin' || user?.role === 'manager';

  return (
    <div className={`task-card priority-${task.priority}`}>
      <div className="task-info">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <div className="task-meta">
          <span className={`badge badge-${task.status}`}>{task.status}</span>
          <span className={`badge badge-${task.priority}`}>{task.priority}</span>
          {task.assignedTo && (
            <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>
              👤 {task.assignedTo.name}
            </span>
          )}
          {task.dueDate && (
            <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>
              📅 {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      <div className="task-actions">
        <button className="btn-secondary" onClick={() => onEdit(task)} style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
          Edit
        </button>
        {canDelete && (
          <button className="btn-danger" onClick={() => onDelete(task._id)} style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
