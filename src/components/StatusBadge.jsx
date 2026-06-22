import React from 'react';

const StatusBadge = ({ status }) => {
  const normalized = status ? status.toLowerCase() : 'pending';
  
  let badgeClass = 'badge-pending';
  if (normalized === 'paid') badgeClass = 'badge-paid';
  if (normalized === 'overdue') badgeClass = 'badge-overdue';

  return (
    <span className={`badge ${badgeClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
