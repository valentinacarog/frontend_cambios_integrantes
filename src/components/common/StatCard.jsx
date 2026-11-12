import React from 'react';
export const StatCard = ({ label, value, icon, iconBgColor = 'var(--primary)', change, changeType = 'neutral' }) => {
    return (<div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: iconBgColor }}>
        {icon}
      </div>
      <div className="stat-details">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
        {change && (<span style={{
                fontSize: '0.75rem',
                marginTop: '0.2rem',
                color: changeType === 'positive'
                    ? 'var(--success)'
                    : changeType === 'negative'
                        ? 'var(--danger)'
                        : 'var(--text-muted)'
            }}>
            {change}
          </span>)}
      </div>
    </div>);
};
export default StatCard;
