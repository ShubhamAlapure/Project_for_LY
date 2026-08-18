import React, { useState } from 'react';
import { 
  Shield, 
  GraduationCap, 
  UserCheck, 
  Building2, 
  Award, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  School,
  FileCheck2,
  Database,
  LogIn,
  Eye,
  EyeOff
} from 'lucide-react';
import { ROLES, ROLE_CONFIG, loginUser, quickDemoLogin, DEFAULT_USERS } from '../utils/auth';
import headerImg from '../assets/letterhead_header.png';

export const LoginPage = ({ onLoginSuccess, onGuestExplore }) => {
  const [selectedRole, setSelectedRole] = useState(ROLES.ADMIN); // Default to Admin as requested
  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // When role tab changes, update default credentials for convenience
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError('');
    const defaultAccount = DEFAULT_USERS.find(u => u.role === role);
    if (defaultAccount) {
      setIdentifier(defaultAccount.username);
      setPassword(defaultAccount.password);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await loginUser(identifier, password, selectedRole);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(`Welcome, ${res.user.full_name} (${res.user.role})!`);
      setTimeout(() => {
        onLoginSuccess(res.user);
      }, 500);
    } else {
      setError(res.error || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleQuickLogin = (role) => {
    setSelectedRole(role);
    const res = quickDemoLogin(role);
    if (res.success) {
      setSuccessMsg(`Logged in as ${res.user.full_name} (${res.user.role})`);
      setTimeout(() => {
        onLoginSuccess(res.user);
      }, 400);
    }
  };

  const activeRoleConfig = ROLE_CONFIG[selectedRole] || ROLE_CONFIG[ROLES.ADMIN];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #31104b 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      color: '#ffffff',
      fontFamily: 'var(--font-sans)',
      padding: '1.5rem 1rem'
    }}>
      {/* Top University Branding Container */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Official MIT-ADT Letterhead Banner at the top */}
        <div style={{ width: '100%', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
          <img 
            src={headerImg} 
            alt="MIT Art, Design & Technology University - School of Computing" 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Login Body Area */}
        <div style={{
          padding: '2.5rem',
          backgroundColor: '#ffffff',
          color: '#1e293b'
        }}>
          {/* Main Title */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--purple-100)', color: 'var(--purple-900)', padding: '0.35rem 0.9rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              <Sparkles size={14} />
              Unified Institutional Portal • 5 Role-Based Gateways
            </div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--purple-950)', margin: 0, letterSpacing: '-0.02em' }}>
              Industrial Internship Management System
            </h1>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem', marginTop: '0.5rem', maxWidth: '700px', margin: '0.5rem auto 0 auto' }}>
              Select your institutional role below to securely access student registration, verified records, or issue official Undertakings and NOC letters.
            </p>
          </div>

          {/* 5 Role Selection Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '0.85rem',
            marginBottom: '2rem'
          }}>
            {/* 1. Student */}
            <RoleCard
              title="1. Student"
              subtitle="Internship & Letters"
              icon={<GraduationCap size={22} />}
              isSelected={selectedRole === ROLES.STUDENT}
              onClick={() => handleRoleSelect(ROLES.STUDENT)}
              themeColor="#059669"
            />

            {/* 2. Faculty / Coordinator */}
            <RoleCard
              title="2. Faculty/Coord."
              subtitle="Review & Verify"
              icon={<UserCheck size={22} />}
              isSelected={selectedRole === ROLES.FACULTY}
              onClick={() => handleRoleSelect(ROLES.FACULTY)}
              themeColor="#2563eb"
            />

            {/* 3. Central T&P */}
            <RoleCard
              title="3. Central T&P"
              subtitle="Corporate & PPO"
              icon={<Building2 size={22} />}
              isSelected={selectedRole === ROLES.CENTRAL_TP}
              onClick={() => handleRoleSelect(ROLES.CENTRAL_TP)}
              themeColor="#d97706"
            />

            {/* 4. HOD */}
            <RoleCard
              title="4. HOD"
              subtitle="NOC Authorization"
              icon={<Award size={22} />}
              isSelected={selectedRole === ROLES.HOD}
              onClick={() => handleRoleSelect(ROLES.HOD)}
              themeColor="#4f46e5"
            />

            {/* 5. Admin (Shubham Alapure) */}
            <RoleCard
              title="5. Admin"
              subtitle="Full System Master"
              icon={<Shield size={22} />}
              isSelected={selectedRole === ROLES.ADMIN}
              onClick={() => handleRoleSelect(ROLES.ADMIN)}
              themeColor="#7e22ce"
              isHighlight
            />
          </div>

          {/* Login Form Container */}
          <div style={{
            maxWidth: '620px',
            margin: '0 auto',
            backgroundColor: '#f8fafc',
            border: '1.5px solid var(--slate-200)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            {/* Active Role Description Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid var(--slate-200)',
              marginBottom: '1.5rem'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--slate-500)', fontWeight: 700, letterSpacing: '0.05em' }}>
                  Selected Portal
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--purple-950)' }}>
                  {activeRoleConfig.label} Login
                </div>
              </div>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: selectedRole === ROLES.ADMIN ? '#f3e8ff' : '#e0e7ff',
                color: selectedRole === ROLES.ADMIN ? '#7e22ce' : '#3730a3'
              }}>
                {selectedRole}
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {activeRoleConfig.description}
            </p>

            {/* Error / Success Notifications */}
            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem'
              }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#166534',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem'
              }}>
                <CheckCircle2 size={18} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                  Username or Institutional Email
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. admin or student@mitadt.edu.in"
                    className="form-input"
                    style={{ paddingLeft: '38px', marginBottom: 0 }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 0 }}>
                    Password
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                    Default: <code>admin123</code> / <code>student123</code>
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="form-input"
                    style={{ paddingLeft: '38px', paddingRight: '40px', marginBottom: 0 }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: 'var(--slate-400)'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 700,
                  padding: '0.85rem'
                }}
              >
                {loading ? (
                  <>Authenticating with Supabase...</>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In to {selectedRole} Portal
                  </>
                )}
              </button>
            </form>

            {/* Quick 1-Click Demo Login Box */}
            <div style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--slate-200)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ⚡ Quick 1-Click Demo Logins:
                </span>
                <span style={{ fontSize: '0.725rem', color: 'var(--purple-700)', fontWeight: 600 }}>
                  (Click any role to test instantly)
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => handleQuickLogin(ROLES.ADMIN)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7e22ce', borderColor: '#d8b4fe', backgroundColor: '#faf5ff' }}
                >
                  👑 Admin (Shubham)
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin(ROLES.STUDENT)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', borderColor: '#a7f3d0', backgroundColor: '#f0fdf4' }}
                >
                  🎓 Student
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin(ROLES.FACULTY)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', borderColor: '#bfdbfe', backgroundColor: '#eff6ff' }}
                >
                  👨‍🏫 Faculty
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin(ROLES.CENTRAL_TP)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d97706', borderColor: '#fde68a', backgroundColor: '#fffbeb' }}
                >
                  🏢 Central T&P
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin(ROLES.HOD)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5', borderColor: '#c7d2fe', backgroundColor: '#eef2ff' }}
                >
                  🏛️ HOD
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Footer Notice */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)' }}>
        <div>MIT Art, Design and Technology University • School of Computing, Pune 412201</div>
        <div style={{ marginTop: '0.25rem' }}>
          Contact: 020 67652560 • Email: dean.mitsoc@mituniversity.edu.in • www.mituniversity.ac.in
        </div>
      </div>
    </div>
  );
};

const RoleCard = ({ title, subtitle, icon, isSelected, onClick, themeColor, isHighlight }) => {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        border: isSelected ? `2.5px solid ${themeColor}` : '1.5px solid var(--slate-200)',
        backgroundColor: isSelected ? '#faf5ff' : '#ffffff',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: isSelected ? 'translateY(-3px)' : 'none',
        boxShadow: isSelected ? `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 0 0 1px ${themeColor}` : 'var(--shadow-xs)',
        position: 'relative'
      }}
    >
      {isHighlight && (
        <span style={{
          position: 'absolute',
          top: '-8px',
          right: '8px',
          fontSize: '0.65rem',
          fontWeight: 800,
          backgroundColor: '#7e22ce',
          color: '#ffffff',
          padding: '0.1rem 0.45rem',
          borderRadius: 'var(--radius-full)',
          letterSpacing: '0.04em'
        }}>
          ADMIN
        </span>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        marginBottom: '0.35rem'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: isSelected ? themeColor : 'var(--slate-100)',
          color: isSelected ? '#ffffff' : themeColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {icon}
        </div>
        <div>
          <div style={{
            fontSize: '0.925rem',
            fontWeight: 800,
            color: isSelected ? themeColor : 'var(--slate-800)'
          }}>
            {title}
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--slate-500)', fontWeight: 500 }}>
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
};
