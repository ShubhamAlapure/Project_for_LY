import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  FolderLock, 
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
      id: 'vault',
      label: 'Document Vault',
      icon: FolderLock,
      route: 'documents',
      badge: 'Secure'
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
            const isActive = currentRoute === item.route && (
              item.id === 'home' ? currentRoute === 'home' :
              item.id === 'undertaking' ? currentRoute === 'undertaking' :
              item.id === 'noc' ? currentRoute === 'noc' :
              item.id === 'about' ? currentRoute === 'about' :
              currentRoute === 'documents'
            );

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
                        backgroundColor: isActive ? 'var(--purple-600)' : 'var(--purple-100)',
                        color: isActive ? '#ffffff' : 'var(--purple-700)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
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
