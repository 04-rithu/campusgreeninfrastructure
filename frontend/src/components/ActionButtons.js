import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ActionButtons = ({ onEdit, onDelete }) => {
    return (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button
                onClick={onEdit}
                style={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.4rem 0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1565c0'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1976d2'}
            >
                <FaEdit size={14} /> Edit
            </button>
            <button
                onClick={onDelete}
                style={{
                    backgroundColor: '#d32f2f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.4rem 0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b71c1c'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
            >
                <FaTrash size={14} /> Delete
            </button>
        </div>
    );
};

export default ActionButtons;
