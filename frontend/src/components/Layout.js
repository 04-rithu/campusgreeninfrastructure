import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
            <Sidebar isOpen={isSidebarOpen} />
            <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            <main style={{
                marginLeft: isSidebarOpen ? '250px' : '70px',
                padding: '2rem',
                transition: 'margin-left 0.3s ease'
            }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
