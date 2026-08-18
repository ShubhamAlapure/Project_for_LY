import React, { useState } from 'react';
import { 
  Shield, 
  GraduationCap, 
  UserCheck, 
  Building2, 
  Award, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  FileCheck2,
  Database,
  LogIn,
  Eye,
  EyeOff,
  ChevronDown,
  Layers,
  FileText,
  Clock,
  ArrowUpRight,
  School,
  Check
} from 'lucide-react';
import { ROLES, ROLE_CONFIG, loginUser, quickDemoLogin, DEFAULT_USERS } from '../utils/auth';
import campusDomeImg from '../assets/campus_dome.jpg';

export const LandingPage = ({ onLoginSuccess, onExplore }) => {
  const [selectedRole, setSelectedRole] = useState(ROLES.ADMIN);
  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError('');
    const defaultAccount = DEFAULT_USERS.find(u => u.role === role);
    if (defaultAccount) {
      setIdentifier(defaultAccount.username);
      setPassword(defaultAccount.password);
    }
  };

  const handleOpenLoginForRole = (role) => {
    handleRoleSelect(role);
    setIsLoginModalOpen(true);
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
        setIsLoginModalOpen(false);
        onLoginSuccess(res.user);
      }, 400);
    } else {
      setError(res.error || 'Authentication failed. Please check credentials.');
    }
  };

  const handleQuickLogin = (role) => {
    setSelectedRole(role);
    const res = quickDemoLogin(role);
    if (res.success) {
      setSuccessMsg(`Logging in as ${res.user.full_name}...`);
      setTimeout(() => {
        setIsLoginModalOpen(false);
        onLoginSuccess(res.user);
      }, 350);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#1e293b', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column' }}>
      {/* ==================================================================== */}
      {/* 1. TOP WHITE INSTITUTIONAL NAVBAR (Matching Reference Screenshot) */}
      {/* ==================================================================== */}
      <header style={{
        height: '74px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Left: MIT-ADT University Logo Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <div style={{
            backgroundColor: '#260e4a',
            borderRadius: '8px',
            padding: '4px 12px',
            display: 'flex',
            alignItems: 'center',
            height: '46px'
          }}>
            <img 
              src="/mit_adt_logo.png" 
              alt="MIT-ADT University Pune Logo" 
              style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '0.925rem', fontWeight: 600, color: '#334155' }}>
          <a href="#hero" style={{ color: '#6b21a8', textDecoration: 'none', fontWeight: 700 }}>Home</a>
          <a href="#about" style={{ color: '#475569', textDecoration: 'none' }}>About SOC</a>
          <a href="#process" style={{ color: '#475569', textDecoration: 'none' }}>Process Flow</a>
          <a href="#documents" style={{ color: '#475569', textDecoration: 'none' }}>Downloads & Templates</a>
        </nav>

        {/* Right: Login Buttons (Student/Faculty & Master Admin) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => handleOpenLoginForRole(ROLES.STUDENT)}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '9999px',
              border: '1.5px solid #7e22ce',
              backgroundColor: '#ffffff',
              color: '#7e22ce',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#faf5ff'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
          >
            Student / Faculty Login
          </button>

          <button
            onClick={() => handleOpenLoginForRole(ROLES.ADMIN)}
            style={{
              padding: '0.55rem 1.35rem',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: '#7e22ce',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 14px rgba(126, 34, 206, 0.35)',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#6b21a8'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#7e22ce'; }}
          >
            <Shield size={16} />
            Master Admin Login
          </button>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* 2. HERO SECTION WITH CAMPUS DOME PHOTO BACKGROUND (Image 3) */}
      {/* ==================================================================== */}
      <section id="hero" style={{
        position: 'relative',
        minHeight: '560px',
        display: 'flex',
        alignItems: 'center',
        backgroundImage: `url(${campusDomeImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        backgroundRepeat: 'no-repeat',
        color: '#ffffff',
        padding: '3.5rem 2.5rem',
        overflow: 'hidden'
      }}>
        {/* Rich Purple Gradient Overlay (Matching 1st reference screenshot) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(105deg, rgba(38, 14, 74, 0.92) 0%, rgba(53, 19, 94, 0.86) 48%, rgba(88, 28, 135, 0.72) 100%)',
          zIndex: 1
        }} />

        {/* Hero Content Container */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          {/* Left Column: Headline, Subtitle, and Action Buttons */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.775rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              MIT-ADT UNIVERSITY • SCHOOL OF COMPUTING
            </div>

            <h1 style={{
              fontSize: '2.9rem',
              fontWeight: 900,
              lineHeight: 1.15,
              margin: '0 0 1.25rem 0',
              letterSpacing: '-0.02em'
            }}>
              Where Every Student Builds a{' '}
              <span style={{ color: '#fbbf24' }}>
                Legacy of Innovation
              </span>
            </h1>

            <p style={{
              fontSize: '1.05rem',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.88)',
              marginBottom: '2rem',
              maxWidth: '560px'
            }}>
              A cloud-enabled industrial training platform that digitizes the complete internship lifecycle — from registration and offer verification to Undertaking & NOC generation, evaluation, and completion approvals.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleOpenLoginForRole(ROLES.STUDENT)}
                style={{
                  padding: '0.85rem 2rem',
                  borderRadius: '9999px',
                  backgroundColor: '#ffffff',
                  color: '#4c1d95',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; }}
              >
                GET STARTED
              </button>

              <button
                onClick={() => handleOpenLoginForRole(ROLES.ADMIN)}
                style={{
                  padding: '0.85rem 1.75rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: '1.5px solid rgba(255, 255, 255, 0.35)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backdropFilter: 'blur(6px)',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.22)'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'; }}
              >
                ADMIN ACCESS <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Role Gateway Glass Card */}
          <div>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255, 255, 255, 0.22)',
              borderRadius: '24px',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fbbf24' }}>
                  Institutional Gateways
                </div>
                <span style={{ fontSize: '0.725rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 700 }}>
                  5 Roles Active
                </span>
              </div>

              {/* 5 Role Selection Chips */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <RoleQuickButton 
                  title="🎓 Student" 
                  desc="Internship & Letters" 
                  onClick={() => handleOpenLoginForRole(ROLES.STUDENT)} 
                />
                <RoleQuickButton 
                  title="👨‍🏫 Faculty / Coord." 
                  desc="Review & Endorse" 
                  onClick={() => handleOpenLoginForRole(ROLES.FACULTY)} 
                />
                <RoleQuickButton 
                  title="🏢 Central T&P" 
                  desc="Corporate & PPO" 
                  onClick={() => handleOpenLoginForRole(ROLES.CENTRAL_TP)} 
                />
                <RoleQuickButton 
                  title="🏛️ HOD" 
                  desc="NOC Authorization" 
                  onClick={() => handleOpenLoginForRole(ROLES.HOD)} 
                />
                <div style={{ gridColumn: 'span 2' }}>
                  <RoleQuickButton 
                    title="👑 Master Admin (Shubham Alapure)" 
                    desc="Full Database Control & User Management" 
                    isMaster
                    onClick={() => handleOpenLoginForRole(ROLES.ADMIN)} 
                  />
                </div>
              </div>

              {/* Quick Demo Sign In Bar */}
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem'
              }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600 }}>
                  Instant 1-Click Access:
                </span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => handleQuickLogin(ROLES.ADMIN)}
                    style={{
                      border: 'none',
                      backgroundColor: '#a855f7',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.725rem',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Admin
                  </button>
                  <button
                    onClick={() => handleQuickLogin(ROLES.STUDENT)}
                    style={{
                      border: 'none',
                      backgroundColor: '#10b981',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.725rem',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Student
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. PURPLE STEP INDICATOR STRIP (Matching Reference Screenshot) */}
      {/* ==================================================================== */}
      <section id="process" style={{
        backgroundColor: '#4c1d95',
        padding: '1.75rem 2rem',
        color: '#ffffff',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          alignItems: 'center'
        }}>
          <ProcessStep number="1" label="Student Registration" sub="17 Verified Fields" />
          <ProcessStep number="2" label="Offer Letter Verification" sub="Supabase Storage Sync" />
          <ProcessStep number="3" label="Undertaking & NOC" sub="1-Click PDF Generation" />
          <ProcessStep number="4" label="Completion Letter Approval" sub="Evaluation & Credits" />
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. CORE INSTITUTIONAL CAPABILITIES SECTION */}
      {/* ==================================================================== */}
      <section id="about" style={{ padding: '4.5rem 2rem', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#7e22ce', letterSpacing: '0.08em', backgroundColor: '#f3e8ff', padding: '0.35rem 0.85rem', borderRadius: '9999px' }}>
              Standard Operating Procedure
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1e1b4b', marginTop: '0.75rem', letterSpacing: '-0.02em' }}>
              Unified Industrial Training Management
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '680px', margin: '0.5rem auto 0 auto' }}>
              Engineered exclusively for MIT-ADT University School of Computing to streamline internship records and ensure compliance with academic norms.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <FeatureCard
              icon={<Database size={24} color="#7e22ce" />}
              title="17 Verified Database Fields"
              desc="Captures complete student details, company credentials, domain, automatic duration, and PPO status."
            />
            <FeatureCard
              icon={<FileCheck2 size={24} color="#2563eb" />}
              title="Official Letterhead Generation"
              desc="Generates pristine Undertaking and NOC documents on the official MIT-ADT letterhead with manual signature lines."
            />
            <FeatureCard
              icon={<Shield size={24} color="#059669" />}
              title="5 Role-Based Gateways"
              desc="Dedicated dashboards for Students, Faculty Coordinators, Central T&P, HODs, and Master Admin."
            />
            <FeatureCard
              icon={<Eye size={24} color="#d97706" />}
              title="In-App Document Previewer"
              desc="Directly preview, zoom, and download uploaded Offer Letters and Completion Certificates without broken links."
            />
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. DOWNLOADS & TEMPLATES PREVIEW SECTION */}
      {/* ==================================================================== */}
      <section id="documents" style={{ padding: '3.5rem 2rem', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>
              Need to generate an Undertaking or NOC certificate?
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.925rem', marginTop: '0.35rem' }}>
              Log in to your student or faculty account to prefill documents automatically from your database records.
            </p>
          </div>

          <button
            onClick={() => handleOpenLoginForRole(ROLES.STUDENT)}
            style={{
              padding: '0.85rem 1.85rem',
              borderRadius: '9999px',
              backgroundColor: '#7e22ce',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.925rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(126, 34, 206, 0.35)'
            }}
          >
            Access Document Hub <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 6. INSTITUTIONAL FOOTER */}
      {/* ==================================================================== */}
      <footer style={{
        marginTop: 'auto',
        backgroundColor: '#1e1b4b',
        color: 'rgba(255, 255, 255, 0.75)',
        padding: '2.5rem 2rem 1.5rem 2rem',
        fontSize: '0.825rem'
      }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.05rem' }}>
              MIT Art, Design & Technology University • School of Computing
            </div>
            <div style={{ marginTop: '0.25rem', color: 'rgba(255, 255, 255, 0.65)' }}>
              Rajbaug, Next to Hadapsar, Loni Kalbhor, Pune 412 201, Maharashtra, India.
            </div>
          </div>

          <div>
            <div>Contact: <strong>020 67652560</strong> • Email: <strong>dean.mitsoc@mituniversity.edu.in</strong></div>
            <div style={{ marginTop: '0.2rem' }}>Website: <a href="https://www.mituniversity.ac.in" target="_blank" rel="noreferrer" style={{ color: '#a855f7' }}>www.mituniversity.ac.in</a></div>
          </div>
        </div>

        <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.75rem' }}>
          © {new Date().getFullYear()} MIT-ADT University School of Computing. All Rights Reserved. Master Admin: Shubham Alapure.
        </div>
      </footer>

      {/* ==================================================================== */}
      {/* 7. ROLE LOGIN MODAL (Triggered from Navbar & Hero Buttons) */}
      {/* ==================================================================== */}
      {isLoginModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="card animate-fade-in" style={{
            width: '100%',
            maxWidth: '520px',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden',
            padding: 0
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #260e4a 0%, #4c1d95 100%)',
              color: '#ffffff',
              padding: '1.5rem 1.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#fbbf24', letterSpacing: '0.08em' }}>
                  Institutional Authentication
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0.2rem 0 0 0' }}>
                  {selectedRole} Portal Login
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsLoginModalOpen(false)}
                style={{
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.75rem' }}>
              {/* Role Selection Tabs */}
              <div style={{
                display: 'flex',
                gap: '0.35rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
                marginBottom: '1.25rem',
                borderBottom: '1px solid #e2e8f0'
              }}>
                {Object.values(ROLES).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleSelect(r)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      backgroundColor: selectedRole === r ? '#7e22ce' : '#f1f5f9',
                      color: selectedRole === r ? '#ffffff' : '#475569'
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Error or Success notification */}
              {error && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#991b1b',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.825rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#166534',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.825rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <CheckCircle2 size={16} />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.1rem' }}>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.825rem' }}>
                    Username or Institutional Email
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter username"
                    className="form-input"
                    style={{ marginBottom: 0 }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.825rem', marginBottom: 0 }}>
                      Password
                    </label>
                    <span style={{ fontSize: '0.725rem', color: '#64748b' }}>
                      Default: <code>admin123</code> / <code>student123</code>
                    </span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="form-input"
                      style={{ paddingRight: '38px', marginBottom: 0 }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: '#94a3b8'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    backgroundColor: '#7e22ce',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 12px rgba(126, 34, 206, 0.3)'
                  }}
                >
                  {loading ? 'Authenticating...' : `Sign In as ${selectedRole}`}
                </button>
              </form>

              {/* Quick Demo Access buttons inside modal */}
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                <span style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 600 }}>
                  Or click for instant testing:
                </span>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin(ROLES.ADMIN)}
                    style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem', borderRadius: '4px', border: '1px solid #d8b4fe', backgroundColor: '#faf5ff', color: '#7e22ce', fontWeight: 700, cursor: 'pointer' }}
                  >
                    👑 Admin (Shubham)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin(ROLES.STUDENT)}
                    style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem', borderRadius: '4px', border: '1px solid #a7f3d0', backgroundColor: '#f0fdf4', color: '#059669', fontWeight: 700, cursor: 'pointer' }}
                  >
                    🎓 Student
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin(ROLES.FACULTY)}
                    style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem', borderRadius: '4px', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}
                  >
                    👨‍🏫 Faculty
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RoleQuickButton = ({ title, desc, onClick, isMaster }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      width: '100%',
      padding: '0.75rem',
      backgroundColor: isMaster ? 'rgba(168, 85, 247, 0.28)' : 'rgba(255, 255, 255, 0.08)',
      border: isMaster ? '1.5px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '12px',
      color: '#ffffff',
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'all 0.15s ease'
    }}
    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = isMaster ? 'rgba(168, 85, 247, 0.4)' : 'rgba(255, 255, 255, 0.18)'; }}
    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = isMaster ? 'rgba(168, 85, 247, 0.28)' : 'rgba(255, 255, 255, 0.08)'; }}
  >
    <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{title}</div>
    <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: '0.15rem' }}>{desc}</div>
  </button>
);

const ProcessStep = ({ number, label, sub }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
    <div style={{
      width: '38px',
      height: '38px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      border: '2px solid rgba(255, 255, 255, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.95rem',
      fontWeight: 900,
      color: '#fbbf24',
      flexShrink: 0
    }}>
      {number}
    </div>
    <div>
      <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#ffffff' }}>{label}</div>
      <div style={{ fontSize: '0.725rem', color: 'rgba(255, 255, 255, 0.75)' }}>{sub}</div>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div style={{
    backgroundColor: '#ffffff',
    padding: '1.75rem',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  }}>
    <div style={{
      width: '44px',
      height: '44px',
      borderRadius: '10px',
      backgroundColor: '#f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1rem'
    }}>
      {icon}
    </div>
    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '0.4rem' }}>{title}</h3>
    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>{desc}</p>
  </div>
);
