import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  FolderLock, 
  GraduationCap, 
  FileCheck2, 
  Award, 
  History, 
  BarChart3, 
  Lock, 
  LogOut,
  Sparkles,
  Layers
} from 'lucide-react';

export const Sidebar = ({ currentRoute, onNavigate, userRole, onToggleRole }) => {
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

      {/* Bottom Section: Role-Based Access Callout & Persona Switcher (from Image 3) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        {/* Role Access Box */}
        <div style={{
          backgroundColor: 'var(--amber-50)',
          border: '1px solid var(--amber-200)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          fontSize: '0.775rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontWeight: 800,
            color: 'var(--amber-800)',
            marginBottom: '0.25rem'
          }}>
            <Lock size={13} />
            Role-Based Access
          </div>
          <p style={{ color: '#78350f', lineHeight: 1.4, margin: 0 }}>
            {userRole === "Dean" 
              ? "Dean / HOD approval & endorsement active."
              : "Student self-service document generation active."}
          </p>
        </div>

        {/* Change Persona Button (from Image 3) */}
        <button
          onClick={onToggleRole}
          className="btn btn-persona"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <LogOut size={15} />
          <span>Switch Persona ({userRole === "Dean" ? "Dean" : "Student"})</span>
        </button>
      </div>
    </aside>
  );
};
