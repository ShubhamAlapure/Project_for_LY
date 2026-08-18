import React from 'react';

/**
 * NAAC 'A' Grade Sunburst Badge (Vector SVG Component)
 */
export const NaacBadge = () => (
  <svg width="68" height="68" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    {/* Sunburst Star Gold Rays */}
    <path 
      d="M50 0 L58 18 L78 10 L75 30 L95 33 L83 50 L95 67 L75 70 L78 90 L58 82 L50 100 L42 82 L22 90 L25 70 L5 67 L17 50 L5 33 L25 30 L22 10 L42 18 Z" 
      fill="url(#goldGradient)" 
      stroke="#b45309" 
      strokeWidth="1.5"
    />
    
    {/* Inner Gold Ring */}
    <circle cx="50" cy="50" r="34" fill="#d97706" stroke="#fef3c7" strokeWidth="2" />
    <circle cx="50" cy="50" r="30" fill="#991b1b" />

    {/* Top Curved Text Arc */}
    <path id="curve" d="M 27 50 A 23 23 0 0 1 73 50" fill="transparent" />
    <text fontSize="5.5" fontWeight="800" fill="#ffffff" letterSpacing="0.4">
      <textPath href="#curve" startOffset="50%" textAnchor="middle">
        ACCREDITED WITH 'A' GRADE
      </textPath>
    </text>

    {/* Big Bold 'A' Letter */}
    <text x="50" y="55" fontSize="22" fontWeight="900" fontFamily="serif" fill="#ffffff" textAnchor="middle">
      A
    </text>

    {/* Bottom Ribbon Banner: NAAC */}
    <path d="M 22 66 L 78 66 L 72 80 L 50 76 L 28 80 Z" fill="#7f1d1d" stroke="#f59e0b" strokeWidth="1" />
    <text x="50" y="74.5" fontSize="7.5" fontWeight="900" fill="#ffffff" textAnchor="middle" letterSpacing="1">
      NAAC
    </text>

    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * MIT-ADT University Pune Crest & Typography
 */
export const MitAdtLogo = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textAlign: 'left',
    flexShrink: 0
  }}>
    {/* Circular Emblem Crest */}
    <svg width="52" height="52" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#2e1263" strokeWidth="3" />
      <circle cx="50" cy="50" r="43" fill="#ffffff" stroke="#2e1263" strokeWidth="1" strokeDasharray="2,2" />
      
      {/* Sun Rays & Dome Illustration */}
      <path d="M 50 18 L 50 25 M 34 22 L 39 28 M 66 22 L 61 28" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
      <path d="M 32 44 C 32 32, 68 32, 68 44 Z" fill="#2e1263" />
      <rect x="36" y="44" width="28" height="24" fill="#381878" rx="2" />
      <rect x="40" y="48" width="5" height="20" fill="#ffffff" />
      <rect x="47.5" y="48" width="5" height="20" fill="#ffffff" />
      <rect x="55" y="48" width="5" height="20" fill="#ffffff" />
      
      {/* Base Pedestal */}
      <rect x="28" y="68" width="44" height="4" fill="#2e1263" rx="1" />
      <rect x="24" y="72" width="52" height="4" fill="#b91c1c" rx="1" />

      {/* Top Banner Text */}
      <path id="topCrestCurve" d="M 20 40 A 38 38 0 0 1 80 40" fill="transparent" />
      <text fontSize="6" fontWeight="900" fill="#2e1263">
        <textPath href="#topCrestCurve" startOffset="50%" textAnchor="middle">
          MIT UNIVERSITY
        </textPath>
      </text>

      {/* Bottom Banner Text */}
      <path id="bottomCrestCurve" d="M 16 65 A 38 38 0 0 0 84 65" fill="transparent" />
      <text fontSize="4.5" fontWeight="800" fill="#2e1263">
        <textPath href="#bottomCrestCurve" startOffset="50%" textAnchor="middle">
          ART, DESIGN & TECHNOLOGY
        </textPath>
      </text>
    </svg>

    {/* Right Typography */}
    <div>
      <div style={{
        fontSize: '11.5pt',
        fontWeight: '900',
        color: '#1e1b4b',
        lineHeight: '1.05',
        letterSpacing: '0.01em',
        fontFamily: 'var(--font-sans)'
      }}>
        MIT-ADT<br />
        <span style={{ fontSize: '9pt', fontWeight: '800', color: '#1e1b4b' }}>UNIVERSITY</span>
      </div>
      <div style={{
        fontSize: '6.75pt',
        fontWeight: '800',
        color: '#b91c1c',
        letterSpacing: '0.05em',
        marginTop: '1px'
      }}>
        PUNE, INDIA
      </div>
      <div style={{
        fontSize: '4.75pt',
        color: '#64748b',
        fontStyle: 'italic',
        borderTop: '0.75px solid #cbd5e1',
        marginTop: '1px',
        paddingTop: '1px',
        whiteSpace: 'nowrap'
      }}>
        A Leap Towards World Class Education
      </div>
    </div>
  </div>
);

/**
 * Official MIT-ADT School of Computing Letterhead Header
 */
export const DocumentHeader = ({ 
  universityName = "MIT Art, Design & Technology University, Pune", 
  schoolName = "School of Computing, Pune"
}) => {
  return (
    <div className="doc-header-block" style={{ marginBottom: '14px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        fontFamily: 'var(--font-sans)'
      }}>
        {/* Left: NAAC 'A' Grade Sunburst Emblem */}
        <NaacBadge />

        {/* Center: University & School Titles */}
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            fontSize: '12pt',
            fontWeight: '800',
            color: '#0f172a',
            letterSpacing: '-0.01em',
            lineHeight: '1.2',
            fontFamily: 'var(--font-sans)'
          }}>
            {universityName}
          </div>
          
          <div style={{
            fontSize: '6.5pt',
            color: '#475569',
            marginTop: '2px',
            letterSpacing: '0.01em'
          }}>
            (Established by Govt. of Maharashtra by MIT ADT University ACT No. XXXIX of 2015)
          </div>

          <div style={{ marginTop: '4px' }}>
            <div style={{
              fontSize: '14pt',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.01em',
              display: 'inline-block',
              borderBottom: '2.5px solid #dc2626',
              paddingBottom: '2px'
            }}>
              {schoolName}
            </div>
          </div>
        </div>

        {/* Right: MIT-ADT University Crest & Title */}
        <MitAdtLogo />
      </div>

      {/* Multi-Color Gradient Separator Bar */}
      <div style={{
        height: '3px',
        background: 'linear-gradient(90deg, #dc2626 0%, #ea580c 50%, #f59e0b 100%)',
        marginTop: '10px'
      }} />
    </div>
  );
};

/**
 * Official MIT-ADT School of Computing Letterhead Footer
 */
export const DocumentFooter = () => {
  return (
    <div className="doc-footer-block" style={{
      marginTop: 'auto',
      fontFamily: 'var(--font-sans)',
      textAlign: 'center'
    }}>
      {/* Top Multi-Color Gradient Separator Bar */}
      <div style={{
        height: '2px',
        background: 'linear-gradient(90deg, #dc2626 0%, #ea580c 50%, #f59e0b 100%)',
        marginBottom: '6px'
      }} />

      {/* Address */}
      <div style={{
        fontSize: '8.25pt',
        color: '#1e293b',
        fontWeight: '500',
        lineHeight: '1.3'
      }}>
        Rajbaug, Next to Hadapsar, Loni Kalbhor, Pune 412 201, India.
      </div>

      {/* Contact Details */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginTop: '2px',
        fontSize: '7.75pt',
        color: '#334155'
      }}>
        <span>Contact :020 67652560</span>
        <span>Email: <strong>dean.mitsoc@mituniversity.edu.in</strong></span>
        <span><strong>www.mituniversity.ac.in</strong></span>
      </div>

      {/* Bottom Cyan Accent Bar (Matching PDF template) */}
      <div style={{
        height: '7px',
        background: 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)',
        marginTop: '6px',
        borderRadius: '1px'
      }} />
    </div>
  );
};
