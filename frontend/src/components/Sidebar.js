import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartPie, FaTree, FaTint, FaFlask, FaCut, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { logout } = useAuth();

    const menuItems = [
        { path: '/dashboard', name: 'Dashboard', icon: <FaChartPie /> },
        { path: '/zones', name: 'Zones', icon: <FaTree /> },
        { path: '/watering', name: 'Watering', icon: <FaTint /> },
        { path: '/pesticide', name: 'Pesticide', icon: <FaFlask /> },
        { path: '/trimming', name: 'Trimming', icon: <FaCut /> },
    ];

    return (
        <div style={{
            width: isOpen ? '250px' : '70px',
            backgroundColor: 'white',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            boxShadow: '2px 0 5px rgba(0,0,0,0.05)',
            transition: 'width 0.3s ease',
            zIndex: 1000,
            overflow: 'hidden'
        }}>
            <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #f0f0f0' }}>
                <FaTree size={28} color="var(--primary-color)" />
                {isOpen && <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)', whiteSpace: 'nowrap' }}>EcoPlan</h2>}
            </div>

            <nav style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.5rem',
                            color: isActive ? 'white' : 'var(--text-secondary)',
                            backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                        })}
                    >
                        <div style={{ fontSize: '1.25rem' }}>{item.icon}</div>
                        {isOpen && <span>{item.name}</span>}
                    </NavLink>
                ))}
            </nav>

            <div style={{ position: 'absolute', bottom: '2rem', width: '100%', padding: '0 1rem' }}>
                <button
                    onClick={logout}
                    className="btn"
                    style={{
                        width: '100%',
                        justifyContent: isOpen ? 'flex-start' : 'center',
                        gap: '1rem',
                        color: 'var(--danger-color)',
                        backgroundColor: 'transparent'
                    }}
                >
                    <FaSignOutAlt size={20} />
                    {isOpen && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
