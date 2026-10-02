import React from 'react';
import { DocumentHeader, DocumentFooter } from './DocumentHeaderFooter';
import { formatDateForDoc, formatDateShort } from '../utils/validation';

export const NOCTemplate = ({ data = {} }) => {
  const referenceNumber = data.referenceNumber || `MITADT/SOC/T&P/2026/NOC-${data.enrolment_no ? data.enrolment_no.slice(-4) : (data.enrollmentNumber ? data.enrollmentNumber.slice(-4) : '0842')}`;
  const documentDate = data.documentDate || data.submission_date || new Date().toISOString().split('T')[0];
  const displayDate = data.documentDateDisplay || formatDateShort(documentDate);

  // Department Sanitization to avoid "Department of Department of"
  let rawDept = data.department || data.specialization || "Computer Science & Engineering";
  const cleanDeptName = rawDept.replace(/^Department\s+of\s+/i, '').replace(/^School\s+of\s+/i, '').trim() || "Computer Science & Engineering";
  const departmentFormatted = cleanDeptName.toLowerCase().includes('engineering') || cleanDeptName.toLowerCase().includes('computing')
    ? cleanDeptName
    : `${cleanDeptName} Engineering`;

  // Recipient Company & Location
  let companyName = data.companyName || "";
  let companyLocation = data.companyLocation || "";

  if (!companyName && data.company_name_and_city) {
    if (data.company_name_and_city.includes(',')) {
      const parts = data.company_name_and_city.split(',');
      companyName = parts[0].trim();
      companyLocation = parts.slice(1).join(',').trim();
    } else {
      companyName = data.company_name_and_city.trim();
    }
  }

  if (!companyName) {
    companyName = "Esteemed Organization";
  }

  // Student Details
  const studentName = data.studentName || data.full_name || "Student Name";
  const rollNumber = data.rollNumber || (data.enrolment_no ? data.enrolment_no.slice(-7) : (data.enrollmentNumber ? data.enrollmentNumber.slice(-7) : "65"));
  const enrollmentNumber = data.enrollmentNumber || data.enrolment_no || "ADT23SOCB0000";
  
  // Duration & Dates
  const startDate = data.startDate || data.start_date || "2026-08-01";
  const endDate = data.endDate || data.end_date || "2026-10-01";
  const displayStart = data.startDateDisplay || formatDateForDoc(startDate);
  const displayEnd = data.endDateDisplay || formatDateForDoc(endDate);

  // Signatories (Default to institutional authorities shown in official format)
  const internshipHeadName = data.internshipHeadName || "Prof. Aniket Verma";
  const internshipHeadDesignation = data.internshipHeadDesignation || "Head - Industry Internship Cell";
  const internshipHeadDepartment = data.internshipHeadDepartment || "Assistant Professor – CSE";
  
  const hodName = data.hodName || "Dr. Sneha Deshmukh";
  const hodDesignation = data.hodDesignation || "Head of Department (CSE)";
  const hodDepartment = data.hodDepartment || `Department of ${departmentFormatted}`;
  
  const directorName = data.directorName || "Dr. Milind S. Kulkarni";
  const directorDesignation = data.directorDesignation || "Director, Corporate Relations & Placement Cell";
  const directorDepartment = data.directorDepartment || "Corporate Relations and Placement Cell";

  return (
    <div 
      className="a4-document-paper" 
      id="noc-document" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '210mm',
        height: '297mm',
        maxHeight: '297mm',
        boxSizing: 'border-box',
        padding: '12mm 16mm 10mm 16mm',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        color: '#111111',
        fontFamily: 'var(--font-doc-serif)',
        position: 'relative'
      }}
    >
      {/* ── TOP SECTION ── */}
      <div>
        {/* Institutional Header */}
        <DocumentHeader />

        {/* Ref No & Date Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '9.5pt',
          fontFamily: 'var(--font-doc-serif)',
          fontWeight: '700',
          marginTop: '6px',
          marginBottom: '12px'
        }}>
          <div>
            Ref. No-{referenceNumber}
          </div>
          <div>
            Date: <span className="doc-dynamic-text">{displayDate}</span>
          </div>
        </div>

        {/* Centered Document Title */}
        <div style={{ textAlign: 'center', margin: '6px 0 16px 0' }}>
          <span style={{
            fontSize: '12pt',
            fontWeight: '800',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            fontFamily: 'var(--font-doc-serif)'
          }}>
            No Objection Certificate for Internship
          </span>
        </div>

        {/* Recipient Address */}
        <div style={{
          fontSize: '9.5pt',
          lineHeight: '1.4',
          fontFamily: 'var(--font-doc-serif)',
          marginBottom: '12px'
        }}>
          <div>To,</div>
          <div style={{ fontWeight: '700' }}>The HR</div>
          <div className="doc-dynamic-text" style={{ fontWeight: '700' }}>{companyName}</div>
          {companyLocation && companyLocation.toLowerCase() !== companyName.toLowerCase() && (
            <div className="doc-dynamic-text">{companyLocation}</div>
          )}
        </div>

        {/* Salutation & Greetings */}
        <div style={{
          fontSize: '9.5pt',
          fontFamily: 'var(--font-doc-serif)',
          marginBottom: '10px'
        }}>
          <div>Dear Sir / Madam,</div>
          <div style={{ marginTop: '3px' }}>
            Greetings from MIT Art, Design and Technology University, School of Computing, Loni Kalbhor, Pune.
          </div>
        </div>

        {/* Certification Paragraph */}
        <div style={{
          fontSize: '9.5pt',
          lineHeight: '1.85',
          fontFamily: 'var(--font-doc-serif)',
          textAlign: 'justify',
          marginBottom: '12px'
        }}>
          This is to certify that <span className="doc-dynamic-text">{studentName}</span>, 
          Roll. No. <span className="doc-dynamic-text">{rollNumber}</span>, 
          Enrolment No. <span className="doc-dynamic-text">{enrollmentNumber}</span>, 
          is a Bonafide student of MITADT University, School of Computing, <span className="doc-dynamic-text">Department of {departmentFormatted}</span>.
          <br />
          He/She wishes to pursue an internship at <span className="doc-dynamic-text">{companyName}</span>
          <br />
          The <span className="doc-dynamic-text">Department of {departmentFormatted}</span> has no objection in his/her undergoing an internship program at your Esteemed Organization during the period <span className="doc-dynamic-text">{displayStart}</span> to <span className="doc-dynamic-text">{displayEnd}</span>.
        </div>

        {/* Attendance Regulation Paragraph */}
        <div style={{
          fontSize: '9pt',
          lineHeight: '1.45',
          fontFamily: 'var(--font-doc-serif)',
          textAlign: 'justify',
          marginBottom: '12px'
        }}>
          He/She must maintain academic attendance as per the Rules and Regulations of the MIT ADT University, failing which leads to shortage of attendance for the academic outcomes.
        </div>
      </div>

      {/* ── BOTTOM SECTION: SIGNATURES PINNED AT BOTTOM + FOOTER ── */}
      <div style={{ marginTop: 'auto', width: '100%' }}>
        {/* 3 Authorized Signatures Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '14px',
          fontFamily: 'var(--font-doc-sans)',
          fontSize: '8.5pt',
          textAlign: 'center'
        }}>
          {/* Signatory 1: Internship Head */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
            <div style={{ width: '85%', borderBottom: '1px dashed #64748b', marginBottom: '8px' }}></div>
            <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '9pt' }}>{internshipHeadName}</div>
            <div style={{ color: '#334155', fontSize: '8pt', marginTop: '2px' }}>{internshipHeadDesignation}</div>
            <div style={{ color: '#64748b', fontSize: '7.5pt', marginTop: '1px' }}>{internshipHeadDepartment}</div>
          </div>

          {/* Signatory 2: HOD */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
            <div style={{ width: '85%', borderBottom: '1px dashed #64748b', marginBottom: '8px' }}></div>
            <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '9pt' }}>{hodName}</div>
            <div style={{ color: '#334155', fontSize: '8pt', marginTop: '2px' }}>{hodDesignation}</div>
            <div style={{ color: '#64748b', fontSize: '7.5pt', marginTop: '1px' }}>{hodDepartment}</div>
          </div>

          {/* Signatory 3: Director CRTP */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
            <div style={{ width: '85%', borderBottom: '1px dashed #64748b', marginBottom: '8px' }}></div>
            <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '9pt' }}>{directorName}</div>
            <div style={{ color: '#334155', fontSize: '8pt', marginTop: '2px' }}>{directorDesignation}</div>
            <div style={{ color: '#64748b', fontSize: '7.5pt', marginTop: '1px' }}>{directorDepartment}</div>
          </div>
        </div>

        {/* Institutional Footer Image */}
        <DocumentFooter />
      </div>
    </div>
  );
};
