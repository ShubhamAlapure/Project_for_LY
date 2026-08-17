import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';

export const Navbar = ({ currentRoute, onNavigate, userRole = "Student" }) => {
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

      {/* Right side: Notifications & User Persona Header (Matching Image 3) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Notification Bell */}
        <button
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative'
          }}
          title="Notifications"
        >
          <Bell size={18} />
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '8px',
            height: '8px',
            backgroundColor: '#a855f7',
            borderRadius: '50%',
            border: '1.5px solid #240d4f'
          }} />
        </button>

        {/* User Persona Pill (from Image 3) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.35rem 0.65rem 0.35rem 0.95rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          cursor: 'pointer'
        }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              {userRole === "Dean" ? "DR. RAJESH KUMAR" : "SHRAWAN MOKALE"}
            </div>
            <div style={{
              fontSize: '0.675rem',
              color: '#c4b5fd',
              fontWeight: 500
            }}>
              {userRole === "Dean" ? "MIT-DEAN-2012-0056 • School Dean" : "ADT23SOCA1062 • AIA-3 Final Year"}
            </div>
          </div>

          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.825rem',
            color: 'white',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
          }}>
            {userRole === "Dean" ? "DR" : "SM"}
          </div>

          <ChevronDown size={14} color="#c4b5fd" />
        </div>
      </div>
    </header>
  );
};
