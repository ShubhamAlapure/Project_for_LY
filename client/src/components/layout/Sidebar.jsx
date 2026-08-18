import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Database,
  PlusCircle,
  FileCheck2, 
  Award, 
  Layers
} from 'lucide-react';

export const Sidebar = ({ currentRoute, onNavigate }) => {
  const menuItems = [
    {
      id: 'home',
      label: 'Dashboard',
      icon: LayoutDashboard,
      route: 'home'
    },
    {
      id: 'student-form',
      label: 'Submit Internship Record',
      icon: PlusCircle,
      route: 'student-form',
      badge: '17 Fields'
    },
    {
      id: 'student-records',
      label: 'Student Records DB',
      icon: Database,
      route: 'student-records',
      badge: 'Supabase'
    },
    {
      id: 'documents',
      label: 'Document Repository',
      icon: Layers,
      route: 'documents',
      badge: '2 Ready'
    },
    {
      id: 'undertaking',
      label: 'Internship Undertaking',
      icon: FileCheck2,
      route: 'undertaking'
    },
    {
      id: 'noc',
      label: 'No Objection Certificate',
      icon: Award,
      route: 'noc'
    },
    {
      id: 'about',
      label: 'Guidelines & Policies',
      icon: FileText,
      route: 'about'
    }
  ];

  return (
    <aside className="portal-sidebar non-printable">
      <div>
        <div style={{
          padding: '0.5rem 0.95rem 1rem 0.95rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--slate-400)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em'
        }}>
          Navigation Menu
        </div>

        <ul className="sidebar-nav-list">
          {menuItems.map((item) => {
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
                        fontSize: '0.675rem',
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
    </aside>
  );
};
