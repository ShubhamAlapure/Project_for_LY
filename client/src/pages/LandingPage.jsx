import React, { useState, useRef } from 'react';
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
  FileCheck2,
  Database,
  LogIn,
  Eye,
  ChevronLeft,
  ChevronRight,
  Users,
  Sparkles,
  Globe
} from 'lucide-react';
import { ROLES, ROLE_CONFIG, loginUser, DEFAULT_USERS } from '../utils/auth';
import campusDomeImg from '../assets/campus_dome.jpg';
import drRajeshImg from '../assets/leadership/dr_rajesh_s.png';
import drRamachandraImg from '../assets/leadership/dr_ramachandra_pujeri.png';
import drGaneshImg from '../assets/leadership/dr_ganesh_pathak.png';
import drShraddhaImg from '../assets/leadership/dr_shraddha_phansalkar.png';
import drJayshreeImg from '../assets/leadership/dr_jayshree_prasad.png';

const LEADERSHIP_MEMBERS = [
  {
    name: "Dr. Rajesh S",
    role: "Vice Chancellor",
    image: drRajeshImg
  },
  {
    name: "Dr. Ramachandra Pujeri",
    role: "Pro Vice Chancellor",
    image: drRamachandraImg
  },
  {
    name: "Dr. Ganesh Pathak",
    role: "Dean — MIT School of Computing",
    image: drGaneshImg
  },
  {
    name: "Dr. Shraddha Phansalkar",
    role: "Associate Dean — Academics",
    image: drShraddhaImg
  },
  {
    name: "Dr. Jayshree Prasad",
    role: "Associate Dean — R&D • Head AIA CSE",
    image: drJayshreeImg
  }
];

export const LandingPage = ({ onLoginSuccess, onExplore }) => {
  const [selectedRole, setSelectedRole] = useState(ROLES.ADMIN);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const leadershipRef = useRef(null);

  const scrollLeadership = (direction) => {
    if (leadershipRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      leadershipRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleLeadershipScroll = () => {
    if (leadershipRef.current) {
      const scrollLeft = leadershipRef.current.scrollLeft;
      const maxScroll = leadershipRef.current.scrollWidth - leadershipRef.current.clientWidth;
      if (maxScroll > 0) {
        const ratio = scrollLeft / maxScroll;
        setActiveSlide(ratio > 0.4 ? 1 : 0);
      }
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError('');
    setIdentifier('');
    setPassword('');
  };

  const handleOpenLoginForRole = (role) => {
    setSelectedRole(role);
    setError('');
    setIdentifier('');
    setPassword('');
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
      }, 350);
    } else {
      setError(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#1e293b', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column' }}>
      {/* ==================================================================== */}
      {/* 1. TOP WHITE INSTITUTIONAL NAVBAR */}
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
      {/* 2. HERO SECTION WITH CAMPUS DOME PHOTO BACKGROUND */}
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
        {/* Rich Purple Gradient Overlay */}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fbbf24' }}>
                  Institutional Gateways
                </div>
                <span style={{ fontSize: '0.725rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 700 }}>
                  5 Roles Active
                </span>
              </div>

              {/* 5 Role Selection Chips */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
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
                    title="👑 Master Admin" 
                    desc="Full Database Control & User Management" 
                    isMaster
                    onClick={() => handleOpenLoginForRole(ROLES.ADMIN)} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. PURPLE STEP INDICATOR STRIP */}
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
      {/* 6. LEADERSHIP & ADMINISTRATION (OUR PEOPLE) */}
      {/* ==================================================================== */}
      <section id="leadership" style={{
        padding: '5rem 2rem 4.5rem 2rem',
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: '#f3e8ff',
              color: '#7e22ce',
              fontWeight: 800,
              fontSize: '0.725rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '0.35rem 1rem',
              borderRadius: '9999px',
              marginBottom: '0.75rem'
            }}>
              OUR PEOPLE
            </span>
            <h2 style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              margin: '0 0 0.65rem 0'
            }}>
              Leadership & Administration
            </h2>
            <p style={{
              fontSize: '0.975rem',
              color: '#64748b',
              maxWidth: '650px',
              margin: '0 auto',
              lineHeight: 1.5
            }}>
              Meet the academic leaders driving innovation, excellence, and research at MIT ADT University — School of Computing.
            </p>
          </div>

          {/* Carousel Container with Side Navigation Arrows */}
          <div style={{ position: 'relative' }}>
            {/* Left Chevron Button */}
            <button
              onClick={() => scrollLeadership('left')}
              aria-label="Scroll Left"
              style={{
                position: 'absolute',
                left: '-16px',
                top: '40%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#7e22ce';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.borderColor = '#7e22ce';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#475569';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Cards Slider / Grid */}
            <div
              ref={leadershipRef}
              onScroll={handleLeadershipScroll}
              style={{
                display: 'grid',
                gridAutoFlow: 'column',
                gridAutoColumns: 'minmax(210px, 1fr)',
                gap: '1.25rem',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                padding: '0.5rem 0.5rem 1.5rem 0.5rem',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {LEADERSHIP_MEMBERS.map((member, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    scrollSnapAlign: 'start',
                    minWidth: '210px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 16px 32px -4px rgba(126, 34, 206, 0.15)';
                    e.currentTarget.style.borderColor = '#d8b4fe';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.04)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  {/* Photo Container */}
                  <div style={{
                    width: '100%',
                    height: '240px',
                    backgroundColor: '#f1f5f9',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={member.image}
                      alt={member.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top center',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.04)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  </div>

                  {/* Card Content */}
                  <div style={{
                    padding: '1.25rem 1rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    flexGrow: 1
                  }}>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      margin: '0 0 0.35rem 0',
                      lineHeight: 1.3
                    }}>
                      {member.name}
                    </h3>
                    <p style={{
                      fontSize: '0.775rem',
                      fontWeight: 700,
                      color: '#6366f1',
                      margin: 0,
                      lineHeight: 1.35
                    }}>
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Chevron Button */}
            <button
              onClick={() => scrollLeadership('right')}
              aria-label="Scroll Right"
              style={{
                position: 'absolute',
                right: '-16px',
                top: '40%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#7e22ce';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.borderColor = '#7e22ce';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#475569';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Slider Pagination Indicator Dots */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '1.25rem'
          }}>
            <button
              onClick={() => {
                if (leadershipRef.current) leadershipRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                setActiveSlide(0);
              }}
              style={{
                width: activeSlide === 0 ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: activeSlide === 0 ? '#7e22ce' : '#cbd5e1',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            />
            <button
              onClick={() => {
                if (leadershipRef.current) leadershipRef.current.scrollTo({ left: 400, behavior: 'smooth' });
                setActiveSlide(1);
              }}
              style={{
                width: activeSlide === 1 ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: activeSlide === 1 ? '#7e22ce' : '#cbd5e1',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            />
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 7. VIBRANT INSTITUTIONAL & DEVELOPMENT TEAM FOOTER */}
      {/* ==================================================================== */}
      <footer style={{
        marginTop: 'auto',
        background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 45%, #5b21b6 100%)',
        color: '#ffffff',
        padding: '4rem 2rem 2rem 2rem',
        fontSize: '0.875rem'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          {/* Main Footer Columns Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start'
          }}>
            {/* Column 1: MIT ADT Logo & Tagline */}
            <div style={{ minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  overflow: 'hidden',
                  padding: '3px'
                }}>
                  <img src="/mit_logo.png" alt="MIT ADT" onError={(e) => { e.target.style.display = 'none'; }} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  <span style={{ fontSize: '1.25rem' }}>🏛️</span>
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.15rem', color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                    MIT-ADT
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.85)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
                    University Pune
                  </div>
                </div>
              </div>

              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.875rem',
                margin: '0 0 1.25rem 0',
                fontWeight: 500
              }}>
                Ideas. Action. Impact. Together
              </p>

              {/* Social Media Links */}
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <a
                  href="https://www.facebook.com/MITADTUniversityPune/"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#7c3aed';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a
                  href="https://twitter.com/mitadtpune"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#7c3aed';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                >
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a
                  href="https://www.instagram.com/mitadtpune/"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#7c3aed';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a
                  href="https://www.linkedin.com/school/mitadtuniversity/"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#7c3aed';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                >
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </div>

            {/* Column 2: About */}
            <div>
              <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff', marginBottom: '1rem', letterSpacing: '0.02em' }}>
                About
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {['How it works', 'Featured', 'Partnership', 'Business Relation'].map((item, idx) => (
                  <li key={idx}>
                    <a href="#features" style={{ color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.15s ease' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.85)'}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Community */}
            <div>
              <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff', marginBottom: '1rem', letterSpacing: '0.02em' }}>
                Community
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {['Events', 'Blog', 'Podcast', 'Invite a friend'].map((item, idx) => (
                  <li key={idx}>
                    <a href="#documents" style={{ color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.15s ease' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.85)'}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Socials */}
            <div>
              <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff', marginBottom: '1rem', letterSpacing: '0.02em' }}>
                Socials
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {['Discord', 'Instagram', 'Twitter', 'Facebook'].map((item, idx) => (
                  <li key={idx}>
                    <a href="https://www.mituniversity.ac.in" target="_blank" rel="noreferrer" style={{ color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.15s ease' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.85)'}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5: EliteVibeCoders & CodeCrush Credits */}
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.12)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(6px)',
              minWidth: '240px'
            }}>
              {/* Brand Graphic & Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.85rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                  👒
                </span>
                <span style={{
                  fontSize: '1.55rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1
                }}>
                  EliteVibeCoders
                </span>
              </div>

              {/* Team Credits */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.825rem' }}>
                <div style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                  Development Team: <strong style={{ color: '#fef08a', fontWeight: 800 }}>CodeCrush</strong>
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                  Lead Developer: <strong style={{ color: '#ffffff', fontWeight: 800 }}>Shubham Alapure</strong>
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                  Contact: <a href="tel:9322610932" style={{ color: '#ffffff', fontWeight: 800, textDecoration: 'none' }}>9322610932</a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar Separator */}
          <div style={{
            marginTop: '3.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            <div>
              © {new Date().getFullYear()} MIT ADT University. All rights reserved.
            </div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="#features" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>
                Privacy Policy
              </a>
              <a href="#features" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ==================================================================== */}
      {/* 7. SECURE ROLE LOGIN MODAL (No defaults, clean inputs) */}
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
            maxWidth: '480px',
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
                marginBottom: '1.5rem',
                borderBottom: '1px solid #e2e8f0'
              }}>
                {Object.values(ROLES).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleSelect(r)}
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      backgroundColor: selectedRole === r ? '#7e22ce' : '#f1f5f9',
                      color: selectedRole === r ? '#ffffff' : '#475569',
                      transition: 'all 0.15s ease'
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
                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Institutional Email ID
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. name@mituniversity.edu.in"
                    className="form-input"
                    style={{ marginBottom: 0 }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
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
                    padding: '0.85rem',
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
      padding: '0.85rem',
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
    <div style={{ fontSize: '0.875rem', fontWeight: 800 }}>{title}</div>
    <div style={{ fontSize: '0.725rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: '0.15rem' }}>{desc}</div>
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
