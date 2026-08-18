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
  Building,
  Database,
  PlusCircle,
  TrendingUp,
  GraduationCap
} from 'lucide-react';

export const HomePage = ({ onNavigate, onSelectDocument, authUser }) => {
  const role = authUser ? authUser.role : 'Admin';
  const name = authUser ? authUser.full_name : 'Shubham Alapure';

  return (
    <div className="animate-fade-in">
      {/* Portal Hero Banner */}
      <div className="portal-hero-banner">
        <div>
          <span className="portal-hero-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>●</span> {role.toUpperCase()} PORTAL DESK • WELCOME, {name.toUpperCase()}
          </span>
          <h1 className="portal-hero-title">
            Student Internship Management Portal
          </h1>
          <p className="portal-hero-subtitle">
            MIT-ADT University • School of Computing (SOC) • Verified Role: <strong>{role}</strong>
          </p>
        </div>

        {/* Right Stat Pills */}
        <div className="portal-stat-pill-group">
          <div className="portal-stat-pill">
            <div className="portal-stat-pill-label">Database Status</div>
            <div className="portal-stat-pill-value" style={{ color: '#86efac', fontSize: '1.05rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }}></span>
              SUPABASE CONNECTED
            </div>
          </div>
          <div className="portal-stat-pill">
            <div className="portal-stat-pill-label">Access Level</div>
            <div className="portal-stat-pill-value" style={{ color: '#ffffff', fontSize: '1.05rem', marginTop: '4px' }}>
              {role} Privileges
            </div>
          </div>
        </div>
      </div>

      {/* 4 Main Action Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Card 1: Student Record Submission (17 Fields) */}
        <div className="card" style={{ padding: '1.75rem', position: 'relative', borderTop: '4px solid var(--purple-600)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'var(--purple-50)',
              color: 'var(--purple-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PlusCircle size={22} />
            </div>

            <span style={{
              backgroundColor: '#dcfce7',
              color: '#15803d',
              fontSize: '0.725rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)'
            }}>
              17 Fields • Uploads
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.4rem' }}>
            Submit Student Internship
          </h3>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Register complete student internship details with automatic duration calculation and offer letter upload.
          </p>

          <button
            onClick={() => onNavigate('student-form')}
            className="btn btn-primary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Open Submission Form
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Card 2: Student Records Database */}
        <div className="card" style={{ padding: '1.75rem', position: 'relative', borderTop: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Database size={22} />
            </div>

            <span style={{
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
              fontSize: '0.725rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)'
            }}>
              Live Database
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.4rem' }}>
            Student Records Database
          </h3>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Browse, search, filter, export to CSV, and auto-generate Undertaking & NOC directly from stored records.
          </p>

          <button
            onClick={() => onNavigate('student-records')}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center', color: '#2563eb', borderColor: '#bfdbfe' }}
          >
            View Student Records
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Card 3: Internship Undertaking */}
        <div className="card" style={{ padding: '1.75rem', position: 'relative', borderTop: '4px solid #d97706' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'var(--amber-50)',
              color: '#d97706',
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
              Doc 01 • Undertaking
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.4rem' }}>
            Internship Undertaking Form
          </h3>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Generate student compliance declaration with academic norms, Points I to IX, and signature format.
          </p>

          <button
            onClick={() => onSelectDocument('undertaking')}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Open Undertaking Form
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Card 4: Internship NOC */}
        <div className="card" style={{ padding: '1.75rem', position: 'relative', borderTop: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Award size={22} />
            </div>

            <span style={{
              backgroundColor: '#ecfdf5',
              color: '#047857',
              fontSize: '0.725rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)'
            }}>
              Doc 02 • Official Stamp
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.4rem' }}>
            No Objection Certificate (NOC)
          </h3>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Generate official NOC letter addressed to company HR with 3 institutional signatories & T&P seal.
          </p>

          <button
            onClick={() => onSelectDocument('noc')}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Open NOC Form
            <ArrowRight size={15} />
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
            MIT-ADT School of Computing Industrial Internship Protocol
          </h4>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
          All 7th & 8th semester students must submit their complete 17-field internship record with a valid Offer Letter. Generated documents (Undertaking and NOC) will automatically reference verified database credentials for administrative evaluation.
        </p>
      </div>
    </div>
  );
};
