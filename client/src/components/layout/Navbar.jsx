import React from 'react';
import { 
  Sparkles, 
  FileText, 
  Layers, 
  Database, 
  PlusCircle, 
  User, 
  LogOut, 
  Shield, 
  GraduationCap, 
  UserCheck, 
  Building2, 
  Award,
  ChevronDown
} from 'lucide-react';
import { ROLES, ROLE_CONFIG } from '../../utils/auth';

export const Navbar = ({ currentRoute, onNavigate, authUser, onLogout }) => {
  const roleConfig = authUser ? (ROLE_CONFIG[authUser.role] || ROLE_CONFIG[ROLES.ADMIN]) : null;

  return (
    <header className="portal-topbar non-printable" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 'var(--topbar-height)',
      padding: '0 1.75rem',
      background: 'linear-gradient(90deg, #1e0d3f 0%, #31135e 50%, #451a7a 100%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      zIndex: 50
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
            height: '44px',
            width: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.25))'
          }} 
        />
      </div>

      {/* Center / Right: Navigation Actions & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {/* Navigation Quick Links */}
        {authUser?.role !== ROLES.STUDENT && (
          <button
            onClick={() => onNavigate('student-records')}
            className="btn btn-sm"
            style={{
              backgroundColor: currentRoute === 'student-records' ? 'rgba(255, 255, 255, 0.24)' : 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <Database size={15} />
            <span>Records DB</span>
          </button>
        )}

        <button
          onClick={() => onNavigate('student-form')}
          className="btn btn-sm"
          style={{
            backgroundColor: currentRoute === 'student-form' ? 'rgba(255, 255, 255, 0.24)' : 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <PlusCircle size={15} />
          <span>{authUser?.role === ROLES.STUDENT ? 'My Internship Form' : 'Submit Record'}</span>
        </button>

        <button
          onClick={() => onNavigate('documents')}
          className="btn btn-sm"
          style={{
            backgroundColor: currentRoute === 'documents' ? 'rgba(255, 255, 255, 0.24)' : 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <Layers size={15} />
          <span>Documents</span>
        </button>

        {/* User Account Profile Pill */}
        {authUser ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            backgroundColor: 'rgba(255, 255, 255, 0.14)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '0.3rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            color: '#ffffff',
            marginLeft: '0.5rem'
          }}>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: authUser.role === ROLES.ADMIN ? '#a855f7' : '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 800
            }}>
              {authUser.role === ROLES.ADMIN ? <Shield size={14} /> : <User size={14} />}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                {authUser.full_name || authUser.username}
              </div>
              <div style={{ fontSize: '0.675rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>
                {authUser.role}
              </div>
            </div>

            <button
              onClick={onLogout}
              style={{
                background: 'rgba(239, 68, 68, 0.25)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: 'var(--radius-full)',
                padding: '0.25rem 0.55rem',
                color: '#fca5a5',
                fontSize: '0.725rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                marginLeft: '0.25rem',
                transition: 'all 0.15s ease'
              }}
              title="Logout session"
            >
              <LogOut size={12} />
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('login')}
            className="btn btn-sm btn-primary"
            style={{
              background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.35)',
              marginLeft: '0.5rem'
            }}
          >
            <User size={14} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
