import React from 'react';
import { FaLeaf } from 'react-icons/fa';

const Loader = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            minHeight: '200px',
            color: 'var(--primary-color)'
        }}>
            <FaLeaf className="spin" size={40} style={{ animation: 'spin 2s linear infinite' }} />
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default Loader;
