import React from 'react';
import { FileText, ShieldCheck, Printer, Heart, ExternalLink } from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="app-footer" style={{
      backgroundColor: 'var(--navy-950)',
      color: 'var(--slate-400)',
      paddingTop: '3.5rem',
      paddingBottom: '2rem',
      borderTop: '1px solid var(--navy-800)',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <FileText size={20} />
              </div>
              <span style={{
                fontSize: '1.2rem',
                fontWeight: '800',
                color: 'white',
                letterSpacing: '-0.02em'
              }}>
                Intern<span style={{ color: 'var(--primary-400)' }}>Docs</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--slate-400)', marginBottom: '1.25rem' }}>
              Student internship document generation platform. Generate institutional undertaking letters and No Objection Certificates formatted for print & PDF.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--slate-400)' }}>
              <ShieldCheck size={16} color="var(--success-500)" />
              <span>100% Privacy-friendly • Client-side local processing</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Documents
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li>
                <button 
                  onClick={() => onNavigate('undertaking')} 
                  style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', padding: 0, textAlign: 'left', font: 'inherit' }}
                >
                  Internship Undertaking
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('noc')} 
                  style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', padding: 0, textAlign: 'left', font: 'inherit' }}
                >
                  No Objection Certificate (NOC)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('documents')} 
                  style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', padding: 0, textAlign: 'left', font: 'inherit' }}
                >
                  All Templates Catalog
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Institutions */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Compliance & Formats
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-400)' }}></span>
                MIT-ADT University Format
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-400)' }}></span>
                School of Computing (SOC)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-400)' }}></span>
                Standard A4 Print Dimensions
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-400)' }}></span>
                Official Signatory Layout
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--navy-800)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.8rem'
        }}>
          <div>
            © {new Date().getFullYear()} InternDocs. Built with React, Vite & Express.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Tagline: <strong>Generate. Preview. Print.</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
