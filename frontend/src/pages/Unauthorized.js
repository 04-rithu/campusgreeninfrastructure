import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserShield, FaUser } from 'react-icons/fa';

const Unauthorized = () => {
    return (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
            <h1>403 - Unauthorized Access</h1>
            <p>You do not have permission to view this page.</p>
            <div style={{ marginTop: '2rem' }}>
                <Link to="/admin/login" className="btn btn-primary" style={{ margin: '0 10px' }}>
                    <FaUserShield /> Admin Login
                </Link>
                <Link to="/user/login" className="btn btn-secondary" style={{ margin: '0 10px' }}>
                    <FaUser /> User Login
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;
