import React from 'react';
import { Sparkles, FileText, Layers } from 'lucide-react';

export const Navbar = ({ currentRoute, onNavigate }) => {
  return (
    <header className="portal-topbar non-printable" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 'var(--topbar-height)',
      padding: '0 2rem',
      background: 'linear-gradient(90deg, #240d4f 0%, #351670 100%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      {/* Left side: Official MIT-ADT University Logo */}
      <div 
        onClick={() => onNavigate('home')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <img 
          src="/mit_adt_logo.png" 
          alt="MIT-ADT University Pune Logo" 
          style={{
            height: '46px',
            width: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.25))'
          }} 
        />
      </div>

      {/* Right side: Quick Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <button
          onClick={() => onNavigate('documents')}
          className="btn btn-sm"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <Layers size={15} />
          <span>All Templates</span>
        </button>

        <button
          onClick={() => onNavigate('undertaking')}
          className="btn btn-sm btn-primary"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.35)'
          }}
        >
          <Sparkles size={15} />
          <span>Generate Document</span>
        </button>
      </div>
    </header>
  );
};
