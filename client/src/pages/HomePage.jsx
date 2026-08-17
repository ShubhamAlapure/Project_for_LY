import React from 'react';
import { 
  FileCheck2, 
  Award, 
  Layers, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  FileText,
  ShieldCheck,
  Building
} from 'lucide-react';

export const HomePage = ({ onNavigate, onSelectDocument, userRole = "Student" }) => {
  return (
    <div className="animate-fade-in">
      {/* Portal Hero Banner (Matching Image 3) */}
      <div className="portal-hero-banner">
        <div>
          <span className="portal-hero-tag">
            {userRole === "Dean" ? "HOD & DEAN APPROVAL DESK" : "STUDENT INTERNSHIP DOCUMENTATION DESK"}
          </span>
          <h1 className="portal-hero-title">
            {userRole === "Dean" ? "Dr. Rajesh Kumar" : "Internship Document Portal"}
          </h1>
          <p className="portal-hero-subtitle">
            MIT-ADT University • School of Computing (SOC) • Rajbaug Campus, Pune
          </p>
        </div>

        {/* Right Stat Pills (from Image 3) */}
        <div className="portal-stat-pill-group">
          <div className="portal-stat-pill">
            <div className="portal-stat-pill-label">Active Templates</div>
            <div className="portal-stat-pill-value">2</div>
          </div>
          <div className="portal-stat-pill">
            <div className="portal-stat-pill-label">Institutional Status</div>
            <div className="portal-stat-pill-value" style={{ color: '#86efac', fontSize: '1.15rem', marginTop: '4px' }}>
              VERIFIED
            </div>
          </div>
        </div>
      </div>

      {/* 3 Main Action Cards (Matching Image 3 Layout) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Card 1: Internship Undertaking */}
        <div className="card" style={{ padding: '1.75rem', position: 'relative' }}>
          {/* Top Pill Badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'var(--purple-50)',
              color: 'var(--purple-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileCheck2 size={22} />
            </div>

            <span style={{
              backgroundColor: 'var(--amber-100)',
              color: 'var(--amber-800)',
              fontSize: '0.725rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)'
            }}>
              Form 01 • Active
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.4rem' }}>
            Internship Undertaking
          </h3>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Generate student compliance declaration with academic norms, Points I to IX, and candidate signature.
          </p>

          <button
            onClick={() => onSelectDocument('undertaking')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--purple-600)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: 0
            }}
          >
            Open Undertaking Form
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Card 2: Internship NOC */}
        <div className="card" style={{ padding: '1.75rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Award size={22} />
            </div>

            <span style={{
              backgroundColor: 'var(--purple-100)',
              color: 'var(--purple-700)',
              fontSize: '0.725rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)'
            }}>
              Form 02 • Official Stamp
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.4rem' }}>
            No Objection Certificate (NOC)
          </h3>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Generate official NOC letter addressed to company HR with 3 institutional signatories and Central T&P stamp.
          </p>

          <button
            onClick={() => onSelectDocument('noc')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--purple-600)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: 0
            }}
          >
            Open NOC Form
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Card 3: Document Repository */}
        <div className="card" style={{ padding: '1.75rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Layers size={22} />
            </div>

            <span style={{
              backgroundColor: '#ecfdf5',
              color: '#047857',
              fontSize: '0.725rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)'
            }}>
              Catalog
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.4rem' }}>
            Template Repository
          </h3>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Browse complete catalog of university internship templates including Bonafide, LOR, and Completion letters.
          </p>

          <button
            onClick={() => onNavigate('documents')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--purple-600)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: 0
            }}
          >
            Browse All Templates
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Institutional Guidelines Notice Card */}
      <div className="card" style={{
        padding: '1.5rem 1.75rem',
        backgroundColor: '#ffffff',
        borderLeft: '5px solid var(--purple-600)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <ShieldCheck size={20} color="var(--purple-600)" />
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--purple-950)' }}>
            MIT-ADT School of Computing Documentation Guidelines
          </h4>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
          All students undertaking corporate internships must submit both the <strong>Internship Undertaking</strong> (signed by candidate) and <strong>No Objection Certificate</strong> (endorsed by Internship Head, HOD, and Placement Cell) to the department records.
        </p>
      </div>
    </div>
  );
};
