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
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { ROLES, ROLE_CONFIG } from '../../utils/auth';

export const Navbar = ({ 
  currentRoute, 
  onNavigate, 
  authUser, 
  onLogout, 
  hasSubmittedApp, 
  isApproved, 
  studentStatus,
  isMobileMenuOpen,
  onToggleMobileMenu
}) => {
  const isStudent = authUser?.role === ROLES.STUDENT;

  const handleDocumentsNav = () => {
    if (isStudent && !isApproved) {
      if (!hasSubmittedApp) {
        alert('Please complete Step 1: Submit your Internship Application first.');
        onNavigate('student-form');
      } else {
        alert(`Your application is currently "${studentStatus || 'Under Review'}". Official documents unlock once your Faculty Coordinator approves your application.`);
        onNavigate('student-records');
      }
      return;
    }
    onNavigate('documents');
  };

  return (
    <header className="portal-topbar non-printable" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 'var(--topbar-height)',
      padding: '0 clamp(1rem, 2.5vw, 1.75rem)',
      background: 'linear-gradient(90deg, #1e0d3f 0%, #31135e 50%, #451a7a 100%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      zIndex: 50
    }}>
      {/* Left side: Mobile Toggle + Official MIT-ADT University Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Mobile Hamburger Button */}
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            aria-label="Toggle Portal Navigation Menu"
            style={{
              display: 'none',
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            className="mobile-nav-toggle-btn"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}

        <div 
          onClick={() => onNavigate('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <img 
            src="/mit_adt_logo.png" 
            alt="MIT-ADT University Pune Logo" 
            style={{
              height: '40px',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.25))'
            }} 
          />
        </div>
      </div>

      {/* Center / Right: Navigation Actions & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'nowrap' }}>
        {/* Navigation Quick Links (PC Only) */}
        <div className="portal-nav-desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {!isStudent && (
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
              <UserCheck size={15} />
              <span>{authUser?.role === ROLES.FACULTY ? 'Review & Approve Applications' : 'Applications & Records'}</span>
            </button>
          )}

          {(isStudent || authUser?.role === ROLES.ADMIN) && (
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
              <span>{isStudent ? (hasSubmittedApp ? 'My Application' : '1. My Application') : 'Submit Record'}</span>
            </button>
          )}

          <button
            onClick={handleDocumentsNav}
            className="btn btn-sm"
            style={{
              backgroundColor: currentRoute === 'documents' ? 'rgba(255, 255, 255, 0.24)' : 'rgba(255, 255, 255, 0.1)',
              color: (isStudent && !isApproved) ? 'rgba(255, 255, 255, 0.6)' : '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 'var(--radius-md)',
              cursor: (isStudent && !isApproved) ? 'not-allowed' : 'pointer'
            }}
            title={isStudent && !isApproved ? 'Locked until Faculty Coordinator approval' : 'Document Hub'}
          >
            {isStudent && !isApproved ? <span style={{ fontSize: '0.8rem' }}>🔒</span> : <Layers size={15} />}
            <span>Documents</span>
          </button>
        </div>

        {/* User Account Profile Pill */}
        {authUser ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.14)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            color: '#ffffff'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: authUser.role === ROLES.ADMIN ? '#a855f7' : '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 800
            }}>
              {authUser.role === ROLES.ADMIN ? <Shield size={13} /> : <User size={13} />}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.15 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {authUser.full_name || authUser.username}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>
                {authUser.role}
              </div>
            </div>

            <button
              onClick={onLogout}
              style={{
                background: 'rgba(239, 68, 68, 0.25)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: 'var(--radius-full)',
                padding: '0.2rem 0.5rem',
                color: '#fca5a5',
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                marginLeft: '0.15rem',
                transition: 'all 0.15s ease'
              }}
              title="Logout session"
            >
              <LogOut size={11} />
              <span className="logout-text-desktop">Logout</span>
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
