import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Database,
  PlusCircle, 
  FileCheck2, 
  Award, 
  Layers, 
  Shield, 
  GraduationCap, 
  UserCheck, 
  Building2, 
  Users, 
  KeyRound,
  Lock,
  CheckCircle2,
  X
} from 'lucide-react';
import { ROLES, ROLE_CONFIG } from '../../utils/auth';

export const Sidebar = ({ 
  currentRoute, 
  onNavigate, 
  authUser, 
  hasSubmittedApp, 
  isApproved, 
  studentStatus,
  isMobileMenuOpen,
  onCloseMobileMenu 
}) => {
  const userRole = authUser ? authUser.role : ROLES.ADMIN;
  const isStudent = userRole === ROLES.STUDENT;

  // Define dynamic menu items tailored to user role and student submission progress
  const getMenuItems = () => {
    if (isStudent) {
      return [
        {
          id: 'home',
          label: 'Portal Overview',
          icon: LayoutDashboard,
          route: 'home',
          isLocked: false
        },
        {
          id: 'student-form',
          label: '1. My Application',
          icon: isApproved ? Lock : hasSubmittedApp ? CheckCircle2 : PlusCircle,
          route: 'student-form',
          badge: isApproved 
            ? '🔒 Approved & Freezed' 
            : (studentStatus?.toLowerCase() === 'rejected') 
            ? '⚠️ Rejected (Edit & Resubmit)' 
            : hasSubmittedApp 
            ? '✓ Submitted' 
            : 'Step 1 • Required',
          badgeColor: isApproved 
            ? '#dcfce7' 
            : (studentStatus?.toLowerCase() === 'rejected') 
            ? '#fee2e2' 
            : hasSubmittedApp 
            ? '#eff6ff' 
            : '#fef08a',
          badgeTextColor: isApproved 
            ? '#15803d' 
            : (studentStatus?.toLowerCase() === 'rejected') 
            ? '#b91c1c' 
            : hasSubmittedApp 
            ? '#1d4ed8' 
            : '#854d0e',
          isLocked: false
        },
        {
          id: 'student-records',
          label: '2. Application Status',
          icon: Database,
          route: 'student-records',
          badge: !hasSubmittedApp ? '🔒 Locked' : (studentStatus ? `Status: ${studentStatus}` : 'Track Status'),
          badgeColor: !hasSubmittedApp ? '#f1f5f9' : (isApproved ? '#dcfce7' : '#e0f2fe'),
          badgeTextColor: !hasSubmittedApp ? '#64748b' : (isApproved ? '#15803d' : '#0369a1'),
          isLocked: !hasSubmittedApp,
          lockReason: 'Complete Step 1 (Internship Application) to unlock status tracking.'
        },
        {
          id: 'documents',
          label: 'Document Hub',
          icon: Layers,
          route: 'documents',
          badge: !hasSubmittedApp ? '🔒 Locked' : (!isApproved ? '🔒 Awaiting Approval' : '2 Letters'),
          badgeColor: !hasSubmittedApp ? '#f1f5f9' : (!isApproved ? '#fef3c7' : '#f3e8ff'),
          badgeTextColor: !hasSubmittedApp ? '#64748b' : (!isApproved ? '#b45309' : '#7e22ce'),
          isLocked: !isApproved,
          lockReason: !hasSubmittedApp 
            ? 'Complete Step 1 (Internship Application) to unlock official letters.' 
            : 'Your application is awaiting Faculty Coordinator approval before document generation unlocks.'
        },
        {
          id: 'undertaking',
          label: 'Internship Undertaking',
          icon: FileCheck2,
          route: 'undertaking',
          badge: !hasSubmittedApp ? '🔒 Locked' : (!isApproved ? '🔒 Locked' : '✓ Ready'),
          badgeColor: !isApproved ? '#f1f5f9' : '#ecfdf5',
          badgeTextColor: !isApproved ? '#64748b' : '#059669',
          isLocked: !isApproved,
          lockReason: !hasSubmittedApp 
            ? 'Submit internship application in Step 1 first.' 
            : 'Awaiting Faculty Coordinator approval before generating Undertaking.'
        },
        {
          id: 'noc',
          label: 'No Objection Certificate',
          icon: Award,
          route: 'noc',
          badge: !hasSubmittedApp ? '🔒 Locked' : (!isApproved ? '🔒 Locked' : '✓ Ready'),
          badgeColor: !isApproved ? '#f1f5f9' : '#fffbeb',
          badgeTextColor: !isApproved ? '#64748b' : '#d97706',
          isLocked: !isApproved,
          lockReason: !hasSubmittedApp 
            ? 'Submit internship application in Step 1 first.' 
            : 'Awaiting Faculty Coordinator approval before generating NOC.'
        },
        {
          id: 'change-password',
          label: 'Change Password',
          icon: KeyRound,
          route: 'change-password',
          badge: 'Security',
          isLocked: false
        },
        {
          id: 'about',
          label: 'Institutional Norms',
          icon: FileText,
          route: 'about',
          isLocked: false
        }
      ];
    }

    // Menu for Faculty, HOD, Central T&P, Admin
    const baseItems = [
      {
        id: 'home',
        label: 'Portal Overview',
        icon: LayoutDashboard,
        route: 'home'
      },
      {
        id: 'student-records',
        label: userRole === ROLES.FACULTY 
          ? 'Review & Approve Applications' 
          : userRole === ROLES.HOD 
          ? 'Department Approval Desk' 
          : userRole === ROLES.CENTRAL_TP
          ? 'Applications & Corporate T&P'
          : 'Manage Applications & DB',
        icon: UserCheck,
        route: 'student-records',
        badge: userRole === ROLES.FACULTY ? 'Approval Desk' : 'Review & DB',
        badgeColor: '#dcfce7',
        badgeTextColor: '#15803d'
      }
    ];

    // Only Admin can register/create records on behalf of any student
    if (userRole === ROLES.ADMIN) {
      baseItems.push({
        id: 'student-form',
        label: 'Register Record',
        icon: PlusCircle,
        route: 'student-form',
        badge: '18 Fields'
      });
    }

    baseItems.push(
      {
        id: 'documents',
        label: 'Document Hub',
        icon: Layers,
        route: 'documents',
        badge: userRole === ROLES.ADMIN ? 'Templates' : 'Student Docs'
      },
      {
        id: 'undertaking',
        label: 'Internship Undertaking',
        icon: FileCheck2,
        route: 'undertaking',
        badge: userRole === ROLES.ADMIN ? null : 'Generated Docs'
      },
      {
        id: 'noc',
        label: 'No Objection Certificate',
        icon: Award,
        route: 'noc',
        badge: userRole === ROLES.ADMIN ? null : 'Generated Docs'
      },
      {
        id: 'change-password',
        label: 'Change Password',
        icon: KeyRound,
        route: 'change-password',
        badge: 'Security'
      },
      {
        id: 'about',
        label: 'Institutional Norms',
        icon: FileText,
        route: 'about'
      }
    );

    return baseItems;
  };

  const menuItems = getMenuItems();

  const handleItemClick = (item) => {
    if (item.isLocked) {
      alert(item.lockReason || 'Please complete Step 1: Submit My Internship Application first.');
      onNavigate('student-form');
      if (onCloseMobileMenu) onCloseMobileMenu();
      return;
    }
    if (onCloseMobileMenu) onCloseMobileMenu();
    onNavigate(item.route);
  };

  return (
    <aside className={`portal-sidebar non-printable ${isMobileMenuOpen ? 'is-open' : ''}`}>
      <div>
        {/* Mobile Header in Drawer */}
        <div style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', margin: '0 0.75rem 0.5rem 0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--slate-100)' }} className="sidebar-mobile-header">
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--purple-950)' }}>Menu Navigation</span>
          {onCloseMobileMenu && (
            <button 
              onClick={onCloseMobileMenu}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-500)', padding: '0.25rem' }}
              aria-label="Close menu drawer"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Role Badge Indicator Card */}
        {authUser && (
          <div style={{
            margin: '0.5rem 0.75rem 1.25rem 0.75rem',
            padding: '0.85rem',
            backgroundColor: userRole === ROLES.ADMIN ? '#faf5ff' : userRole === ROLES.FACULTY ? '#eff6ff' : '#f8fafc',
            border: `1.5px solid ${userRole === ROLES.ADMIN ? '#d8b4fe' : userRole === ROLES.FACULTY ? '#bfdbfe' : '#e2e8f0'}`,
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <span>ACTIVE ROLE:</span>
            </div>
            <div style={{ fontSize: '0.925rem', fontWeight: 800, color: userRole === ROLES.ADMIN ? '#7e22ce' : userRole === ROLES.FACULTY ? '#1e40af' : '#1e293b', marginTop: '0.2rem' }}>
              {authUser.role}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-600)', marginTop: '0.15rem' }}>
              {authUser.full_name}
            </div>
          </div>
        )}

        <div style={{
          padding: '0.25rem 0.95rem 0.75rem 0.95rem',
          fontSize: '0.725rem',
          fontWeight: 700,
          color: 'var(--slate-400)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em'
        }}>
          {isStudent ? 'Application Steps' : 'Portal Modules'}
        </div>

        <ul className="sidebar-nav-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;
            const isItemLocked = item.isLocked;

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  style={{
                    opacity: isItemLocked ? 0.6 : 1,
                    cursor: isItemLocked ? 'not-allowed' : 'pointer'
                  }}
                  title={isItemLocked ? item.lockReason : item.label}
                >
                  <div className="sidebar-nav-item-left">
                    {isItemLocked ? <Lock size={16} color="var(--slate-400)" /> : <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />}
                    <span style={{ color: isItemLocked ? 'var(--slate-400)' : 'inherit' }}>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span 
                      style={{
                        backgroundColor: isActive ? 'var(--purple-600)' : (item.badgeColor || 'var(--purple-100)'),
                        color: isActive ? '#ffffff' : (item.badgeTextColor || 'var(--purple-700)'),
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.45rem',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* University Identity Box in Sidebar Footer */}
      <div className="sidebar-footer-box" style={{ padding: '0.85rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--purple-950)' }}>
          MIT-ADT University
        </div>
        <div style={{ fontSize: '0.675rem', color: 'var(--purple-700)', marginTop: '0.15rem' }}>
          School of Computing, Pune
        </div>
      </div>
    </aside>
  );
};
