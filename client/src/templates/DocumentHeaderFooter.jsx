import React from 'react';
import headerImg from '../assets/letterhead_header.png';
import footerImg from '../assets/letterhead_footer.png';

/**
 * Exact Official MIT-ADT Letterhead Header Image
 */
export const DocumentHeader = () => {
  return (
    <div className="doc-header-block" style={{ width: '100%', marginBottom: '14px' }}>
      <img 
        src={headerImg} 
        alt="MIT Art, Design & Technology University - School of Computing, Pune" 
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

/**
 * Exact Official MIT-ADT Letterhead Footer Image
 */
export const DocumentFooter = () => {
  return (
    <div className="doc-footer-block" style={{ width: '100%', marginTop: 'auto', paddingTop: '10px' }}>
      <img 
        src={footerImg} 
        alt="Rajbaug, Loni Kalbhor, Pune 412 201 | Contact: 020 67652560 | www.mituniversity.ac.in" 
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};
