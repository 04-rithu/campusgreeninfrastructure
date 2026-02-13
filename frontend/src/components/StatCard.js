import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
    return (
        <div className="card flex items-center justify-between" style={{ borderLeft: `4px solid ${color}` }}>
            <div>
                <h3 className="text-gray text-sm mb-4">{title}</h3>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{value}</p>
            </div>
            <div style={{
                backgroundColor: `${color}20`,
                padding: '1rem',
                borderRadius: '50%',
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {icon}
            </div>
        </div>
    );
};

export default StatCard;
