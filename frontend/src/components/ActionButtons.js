import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ActionButtons = ({ onEdit, onDelete }) => {
    return (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {onEdit && (
                <button
                    onClick={onEdit}
                    title="Edit"
                    style={{
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1565c0'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1976d2'}
                >
                    <FaEdit size={16} />
                </button>
            )}
            {onDelete && (
                <button
                    onClick={onDelete}
                    title="Delete"
                    style={{
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b71c1c'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
                >
                    <FaTrash size={16} />
                </button>
            )}
        </div>
    );
};

export default ActionButtons;
