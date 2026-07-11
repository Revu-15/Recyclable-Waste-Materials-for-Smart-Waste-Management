import React from 'react';

const GlassCard = ({ children, className = '', onClick, heavy = false }) => {
  return (
    <div 
      onClick={onClick}
      className={`rounded-2xl border transition-all duration-300 ${
        heavy ? 'glass-panel-heavy' : 'glass-panel'
      } ${onClick ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
