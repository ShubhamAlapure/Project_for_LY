import React from 'react';

export const DocumentHeader = ({ 
  universityName = "MIT Art, Design & Technology University, Pune", 
  schoolName = "School of Computing, Pune"
}) => {
  return (
    <div className="doc-header-block" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '2px solid #111',
      paddingBottom: '8px',
      marginBottom: '14px',
      fontFamily: 'var(--font-doc-sans)'
    }}>
      {/* Left side: University Title & School of Computing with badge */}
      <div style={{ textAlign: 'left' }}>
        <div style={{
          fontSize: '11pt',
          fontWeight: '800',
          color: '#111',
          letterSpacing: '-0.01em',
          lineHeight: '1.2'
        }}>
          {universityName}
        </div>
        <div style={{
          fontSize: '6.5pt',
          color: '#444',
          marginTop: '1px',
          letterSpacing: '0.01em'
        }}>
          (Established by Govt. of Maharashtra by MIT ADT University Act No. XXXIX of 2015)
        </div>

        {/* School of Computing Badge Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '6px'
        }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: '#111',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12pt',
            fontWeight: '900',
            fontFamily: 'serif'
          }}>
            A
          </div>
          <div style={{
            fontSize: '13pt',
            fontWeight: '800',
            color: '#111',
            letterSpacing: '-0.01em'
          }}>
            {schoolName}
          </div>
        </div>
      </div>

      {/* Right side: MIT-ADT University Crest & Title matching Image 1 & 2 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        textAlign: 'left'
      }}>
        {/* Crest */}
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          border: '1.5px solid #2a1668',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ fontSize: '5pt', fontWeight: '800', color: '#2a1668', textAlign: 'center', lineHeight: 1 }}>MIT</div>
          <div style={{ fontSize: '7pt', fontWeight: '900', color: '#7c3aed' }}>★</div>
          <div style={{ fontSize: '4.5pt', fontWeight: '700', color: '#2a1668', textAlign: 'center', lineHeight: 1 }}>PUNE</div>
        </div>

        <div>
          <div style={{
            fontSize: '11pt',
            fontWeight: '900',
            color: '#2a1668',
            lineHeight: '1.1',
            letterSpacing: '0.02em'
          }}>
            MIT-ADT<br />
            <span style={{ fontSize: '8pt', fontWeight: '700', color: '#111' }}>UNIVERSITY</span>
          </div>
          <div style={{ fontSize: '6pt', color: '#666', fontWeight: '600' }}>
            PUNE, INDIA
          </div>
          <div style={{ fontSize: '5pt', color: '#888', fontStyle: 'italic' }}>
            A Leap Towards World Class Education
          </div>
        </div>
      </div>
    </div>
  );
};

export const DocumentFooter = () => {
  return (
    <div className="doc-footer-block" style={{
      marginTop: 'auto',
      paddingTop: '6px',
      borderTop: '1px solid #111',
      textAlign: 'center',
      fontSize: '8pt',
      color: '#222',
      fontFamily: 'var(--font-doc-sans)',
      lineHeight: 1.35
    }}>
      <div style={{ fontWeight: '500' }}>
        Rajbaug, Next to Hadapsar, Loni Kalbhor, Pune 412 201, India.
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '18px',
        marginTop: '2px',
        fontSize: '7.5pt'
      }}>
        <span>Contact :020 67652560</span>
        <span>Email: <strong>dean.mitsoc@mituniversity.edu.in</strong></span>
        <span><strong>www.mituniversity.ac.in</strong></span>
      </div>
    </div>
  );
};
