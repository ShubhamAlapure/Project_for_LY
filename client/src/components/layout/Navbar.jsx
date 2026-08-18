import React from 'react';
import { Sparkles, FileText, Layers, Database, PlusCircle } from 'lucide-react';

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

      {/* Right side: Navigation & Quick Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => onNavigate('student-records')}
          className="btn btn-sm"
          style={{
            backgroundColor: currentRoute === 'student-records' ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <Database size={15} />
          <span>Records DB</span>
        </button>

        <button
          onClick={() => onNavigate('student-form')}
          className="btn btn-sm"
          style={{
            backgroundColor: currentRoute === 'student-form' ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <PlusCircle size={15} />
          <span>Submit Record</span>
        </button>

        <button
          onClick={() => onNavigate('documents')}
          className="btn btn-sm"
          style={{
            backgroundColor: currentRoute === 'documents' ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <Layers size={15} />
          <span>Templates</span>
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
