import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const config = {
    success: {
      bg: 'var(--success-50)',
      border: 'var(--success-500)',
      color: 'var(--success-700)',
      icon: CheckCircle2
    },
    error: {
      bg: 'var(--danger-50)',
      border: 'var(--danger-500)',
      color: 'var(--danger-600)',
      icon: AlertCircle
    },
    warning: {
      bg: 'var(--warning-50)',
      border: 'var(--warning-500)',
      color: 'var(--warning-600)',
      icon: AlertTriangle
    },
    info: {
      bg: 'var(--primary-50)',
      border: 'var(--primary-500)',
      color: 'var(--primary-700)',
      icon: Info
    }
  }[type] || {
    bg: 'var(--slate-100)',
    border: 'var(--slate-400)',
    color: 'var(--slate-700)',
    icon: Info
  };

  const Icon = config.icon;

  return (
    <div 
      className="animate-fade-in toast-container"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.85rem 1.25rem',
        backgroundColor: 'white',
        borderLeft: `5px solid ${config.border}`,
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-xl)',
        maxWidth: '420px'
      }}
    >
      <Icon size={20} color={config.border} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: '0.875rem', color: 'var(--slate-800)', fontWeight: 500, flex: 1 }}>
        {message}
      </span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--slate-400)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
