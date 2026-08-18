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
  Users
} from 'lucide-react';
import { ROLES, ROLE_CONFIG } from '../../utils/auth';

export const Sidebar = ({ currentRoute, onNavigate, authUser }) => {
  const userRole = authUser ? authUser.role : ROLES.ADMIN;
  const roleConfig = ROLE_CONFIG[userRole] || ROLE_CONFIG[ROLES.ADMIN];

  const allMenuItems = [
    {
      id: 'home',
      label: 'Portal Overview',
      icon: LayoutDashboard,
      route: 'home',
      roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.CENTRAL_TP, ROLES.HOD, ROLES.STUDENT]
    },
    {
      id: 'student-form',
      label: userRole === ROLES.STUDENT ? 'My Internship Application' : 'Submit Student Record',
      icon: PlusCircle,
      route: 'student-form',
      badge: '17 Fields',
      roles: [ROLES.ADMIN, ROLES.STUDENT, ROLES.FACULTY]
    },
    {
      id: 'student-records',
      label: userRole === ROLES.STUDENT ? 'My Submission Status' : 'Student Records DB',
      icon: Database,
      route: 'student-records',
      badge: 'Live Supabase',
      roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.CENTRAL_TP, ROLES.HOD, ROLES.STUDENT]
    },
    {
      id: 'documents',
      label: 'Document Hub',
      icon: Layers,
      route: 'documents',
      badge: '2 Letters',
      roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.CENTRAL_TP, ROLES.HOD, ROLES.STUDENT]
    },
    {
      id: 'undertaking',
      label: 'Internship Undertaking',
      icon: FileCheck2,
      route: 'undertaking',
      roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT]
    },
    {
      id: 'noc',
      label: 'No Objection Certificate',
      icon: Award,
      route: 'noc',
      roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.HOD, ROLES.CENTRAL_TP, ROLES.STUDENT]
    },
    {
      id: 'about',
      label: 'Institutional Norms',
      icon: FileText,
      route: 'about',
      roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.CENTRAL_TP, ROLES.HOD, ROLES.STUDENT]
    }
  ];

  const visibleMenuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="portal-sidebar non-printable">
      <div>
        {/* Role Badge Indicator Card */}
        {authUser && (
          <div style={{
            margin: '0.5rem 0.75rem 1.25rem 0.75rem',
            padding: '0.85rem',
            backgroundColor: userRole === ROLES.ADMIN ? '#faf5ff' : '#f8fafc',
            border: `1.5px solid ${userRole === ROLES.ADMIN ? '#d8b4fe' : '#e2e8f0'}`,
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <span>ACTIVE ROLE:</span>
            </div>
            <div style={{ fontSize: '0.925rem', fontWeight: 800, color: userRole === ROLES.ADMIN ? '#7e22ce' : '#1e293b', marginTop: '0.2rem' }}>
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
          Portal Modules
        </div>

        <ul className="sidebar-nav-list">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.route)}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                >
                  <div className="sidebar-nav-item-left">
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span 
                      style={{
                        backgroundColor: isActive ? 'var(--purple-600)' : item.id === 'student-records' ? '#dcfce7' : 'var(--purple-100)',
                        color: isActive ? '#ffffff' : item.id === 'student-records' ? '#15803d' : 'var(--purple-700)',
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
