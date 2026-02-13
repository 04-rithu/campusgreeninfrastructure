import React from 'react';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user } = useAuth();

  return (
    <header style={{
      height: '70px',
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      position: 'sticky',
      top: 0,
      zIndex: 900,
      marginLeft: isSidebarOpen ? '250px' : '70px',
      transition: 'margin-left 0.3s ease'
    }}>
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-secondary)' }}>
          <FaBars />
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Campus Green Infrastructure Planner</h1>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray">{user?.email}</span>
        <FaUserCircle size={24} color="var(--primary-color)" />
      </div>
    </header>
  );
};

export default Navbar;
