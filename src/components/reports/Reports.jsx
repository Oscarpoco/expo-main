import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiBarChart2, FiFolder, FiTrendingUp, FiPieChart } from 'react-icons/fi';
import { useTasks, useProjects } from '../../hooks/useFirestore';
import { TASK_STATUSES, getStatusLabel } from '../../constants';
import LoadingSpinner from '../common/LoadingSpinner';
import './Reports.css';

export default function Reports() {
  const { tasks, loading: tasksLoading } = useTasks();
  const { projects, loading: projectsLoading } = useProjects();

  const reportData = useMemo(() => {
    const byStatus = TASK_STATUSES.map((status) => ({
      status: status.label,
      count: tasks.filter((t) => t.status === status.id).length,
      color: status.color,
    }));

    const byPriority = ['high', 'medium', 'low'].map((priority) => ({
      priority,
      count: tasks.filter((t) => (t.priority || 'medium') === priority).length,
    }));

    const completionRate = tasks.length > 0
      ? Math.round((tasks.filter((t) => t.status === 'completed').length / tasks.length) * 100)
      : 0;

    return { byStatus, byPriority, completionRate, totalTasks: tasks.length, totalProjects: projects.length };
  }, [tasks, projects]);

  function exportCSV() {
    const headers = ['Title', 'Status', 'Priority', 'Created', 'Due Date'];
    const rows = tasks.map((t) => [
      t.title,
      getStatusLabel(t.status),
      t.priority || '',
      t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '',
      t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '',
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (tasksLoading || projectsLoading) return <LoadingSpinner />;

  return (
    <div className="reports-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>Reports</h1>
          <p>Analytics and export for your personal tasks</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={exportCSV}>
          <FiDownload />
          Export CSV
        </button>
      </motion.div>

      <div className="report-summary">
        <motion.div className="summary-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="icon-circle icon-circle-md summary-icon-wrap"><FiBarChart2 /></span>
          <span className="summary-value">{reportData.totalTasks}</span>
          <span className="summary-label">Total Tasks</span>
        </motion.div>
        <motion.div className="summary-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <span className="icon-circle icon-circle-md summary-icon-wrap"><FiFolder /></span>
          <span className="summary-value">{reportData.totalProjects}</span>
          <span className="summary-label">Total Projects</span>
        </motion.div>
        <motion.div className="summary-card highlight" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <span className="icon-circle icon-circle-md summary-icon-wrap summary-icon-light"><FiTrendingUp /></span>
          <span className="summary-value">{reportData.completionRate}%</span>
          <span className="summary-label">Completion Rate</span>
        </motion.div>
      </div>

      <div className="report-grid">
        <motion.section
          className="report-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2><FiPieChart /> Tasks by Status</h2>
          <div className="status-bars">
            {reportData.byStatus.map((item) => (
              <div key={item.status} className="status-bar-item">
                <div className="status-bar-header">
                  <span>{item.status}</span>
                  <span>{item.count}</span>
                </div>
                <div className="status-bar-track">
                  <motion.div
                    className="status-bar-fill"
                    style={{ background: item.color }}
                    initial={{ width: 0 }}
                    animate={{
                      width: reportData.totalTasks > 0
                        ? `${(item.count / reportData.totalTasks) * 100}%`
                        : '0%',
                    }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="report-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2><FiBarChart2 /> Tasks by Priority</h2>
          <div className="report-table-wrap">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {reportData.byPriority.map((row) => (
                  <tr key={row.priority}>
                    <td style={{ textTransform: 'capitalize' }}>{row.priority}</td>
                    <td>{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
