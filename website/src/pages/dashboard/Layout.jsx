import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const NAV = [
  { to: 'faculties', label: 'Faculties', icon: '👥' },
  { to: 'classes',   label: 'Classes',   icon: '🏫' },
  { to: 'subjects',  label: 'Subjects',  icon: '📚' },
  { to: 'timetable', label: 'Timetable', icon: '🗓️' },
  { to: 'about',     label: 'About',     icon: 'ℹ️' },
];

export default function DashboardLayout() {
  const { institute, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dash-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-brand">SAM</div>
          <p className="sidebar-tagline">Let's manage attendance!</p>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={`/dashboard/${to}`}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">
              {institute?.representativeName?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="user-info">
              <span className="user-name">{institute?.representativeName || 'Admin'}</span>
              <span className="user-id">{institute?.instId}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="dash-main">
        <div className="dash-topbar">
          <p className="dash-motto">SAM · Let's manage attendance!</p>
          <span className="dash-inst-name">{institute?.name}</span>
        </div>
        <div className="dash-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
