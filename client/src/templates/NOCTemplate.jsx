import React from 'react';
import { DocumentHeader, DocumentFooter } from './DocumentHeaderFooter';
import { formatDateForDoc, formatDateShort } from '../utils/validation';

export const NOCTemplate = ({ data = {} }) => {
  const {
    referenceNumber = "MIT-SOC/CSE/2026-27/",
    documentDate = "2026-08-03",
    documentDateDisplay = "3/08/26",
    universityName = "MIT Art, Design & Technology University, Pune",
    schoolName = "School of Computing, Pune",
    department = "CSE / AIA",
    
    // Recipient Company
    companyName = "Assisto AI Technologies",
    companyLocation = "Noida, UP",
    
    // Student Details
    studentName = "Shrawan Mokale",
    rollNumber = "47",
    enrollmentNumber = "ADT23SOCA1062",
    
    // Duration
    startDate = "2026-07-30",
    endDate = "2026-12-30",
    startDateDisplay = "30th July",
    endDateDisplay = "30th December",
    
    // Signatories from Image 2
    internshipHeadName = "Prof. Vaibhav Sawalkar",
    internshipHeadDesignation = "Internship Head",
    internshipHeadDepartment = "Assistant Professor – CSE",
    
    hodName = "Prof. Dr. Jayashree Prasad",
    hodDesignation = "Head of Department",
    hodDepartment = "Department of CSE-AIA",
    
    directorName = "Prof. Dr. Swati More",
    directorDesignation = "Director",
    directorDepartment = "Corporate Relations and Placement Cell"
  } = data;

  const displayDate = documentDateDisplay || formatDateShort(documentDate) || "3/08/26";
  const displayStart = startDateDisplay || formatDateForDoc(startDate) || "30th July";
  const displayEnd = endDateDisplay || formatDateForDoc(endDate) || "30th December";

  return (
    <div className="a4-document-paper" id="noc-document" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '297mm',
      boxSizing: 'border-box'
    }}>
      <div>
        {/* Institutional Header */}
        <DocumentHeader 
          universityName={universityName}
          schoolName={schoolName}
        />

        {/* Ref No & Date Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '9.5pt',
          fontFamily: 'var(--font-doc-serif)',
          fontWeight: '700',
          marginBottom: '14px'
        }}>
          <div>
            Ref. No-{referenceNumber}
          </div>
          <div>
            Date: <span className="doc-dynamic-text" style={{ fontStyle: 'italic' }}>{displayDate}</span>
          </div>
        </div>

        {/* Centered Document Title */}
        <div style={{ textAlign: 'center', margin: '6px 0 16px 0' }}>
          <span style={{
            fontSize: '11.5pt',
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
          fontSize: '10pt',
          lineHeight: '1.45',
          fontFamily: 'var(--font-doc-serif)',
          marginBottom: '14px'
        }}>
          <div>To,</div>
          <div style={{ fontWeight: '700' }}>The HR</div>
          <div className="doc-dynamic-text" style={{ fontWeight: '700' }}>{companyName}</div>
          <div className="doc-dynamic-text">{companyLocation}</div>
        </div>

        {/* Salutation & Greetings */}
        <div style={{
          fontSize: '10pt',
          fontFamily: 'var(--font-doc-serif)',
          marginBottom: '8px'
        }}>
          <div>Dear Sir / Madam,</div>
          <div style={{ marginTop: '4px' }}>
            Greetings from MIT Art, Design and Technology University, School of Computing, Loni Kalbhor, Pune.
          </div>
        </div>

        {/* Certification Paragraph */}
        <div style={{
          fontSize: '10pt',
          lineHeight: '1.9',
          fontFamily: 'var(--font-doc-serif)',
          textAlign: 'justify',
          marginBottom: '12px'
        }}>
          This is to certify that <span className="doc-dynamic-text">{studentName}</span>, 
          Roll. No. <span className="doc-dynamic-text">{rollNumber}</span>, 
          Enrolment No. <span className="doc-dynamic-text">{enrollmentNumber}</span>, 
          is a Bonafide student of MITADT University, School of Computing, <span className="doc-dynamic-text">{department}</span> Department.
          <br />
          He/She wishes to pursue an internship at <span className="doc-dynamic-text">{companyName}</span>
          <br />
          The <span className="doc-dynamic-text">{department}</span> Department has no objection in his undergoing an internship program at your Esteemed Organization during the period <span className="doc-dynamic-text">{displayStart}</span> to <span className="doc-dynamic-text">{displayEnd}</span>.
        </div>

        {/* Attendance Regulation Paragraph */}
        <div style={{
          fontSize: '9.75pt',
          lineHeight: '1.5',
          fontFamily: 'var(--font-doc-serif)',
          textAlign: 'justify',
          marginBottom: '24px'
        }}>
          He/She must maintain academic attendance as per the Rules and Regulations of the MIT ADT University, failing which leads to shortage of attendance for the academic outcomes.
        </div>

        {/* 3 Authorized Signatures Grid (from Image 2) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '14px',
          marginTop: '28px',
          fontFamily: 'var(--font-doc-sans)',
          fontSize: '8pt',
          textAlign: 'center'
        }}>
          {/* Signatory 1: Internship Head */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
            {/* Signature Stroke Simulation */}
            <div style={{
              fontFamily: 'cursive',
              fontSize: '11pt',
              color: '#1d4ed8',
              fontStyle: 'italic',
              marginBottom: '2px',
              height: '32px',
              display: 'flex',
              alignItems: 'center'
            }}>
              Sawalkar 03/08/2026
            </div>
            <div style={{ fontWeight: '700', color: '#111' }}>{internshipHeadName}</div>
            <div style={{ color: '#444' }}>{internshipHeadDesignation}</div>
            <div style={{ color: '#555', fontSize: '7.5pt' }}>{internshipHeadDepartment}</div>
          </div>

          {/* Signatory 2: HOD */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
            <div style={{
              fontFamily: 'cursive',
              fontSize: '11pt',
              color: '#1d4ed8',
              fontStyle: 'italic',
              marginBottom: '2px',
              height: '32px',
              display: 'flex',
              alignItems: 'center'
            }}>
              Jayashree Prasad
            </div>
            <div style={{ fontWeight: '700', color: '#111' }}>{hodName}</div>
            <div style={{ color: '#444' }}>{hodDesignation}</div>
            <div style={{ color: '#555', fontSize: '7.5pt' }}>{hodDepartment || `Department of ${department}`}</div>
          </div>

          {/* Signatory 3: Director CRTP */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
            <div style={{
              fontFamily: 'cursive',
              fontSize: '11pt',
              color: '#1d4ed8',
              fontStyle: 'italic',
              marginBottom: '2px',
              height: '32px',
              display: 'flex',
              alignItems: 'center'
            }}>
              Swati More
            </div>
            <div style={{ fontWeight: '700', color: '#111' }}>{directorName}</div>
            <div style={{ color: '#444' }}>{directorDesignation}</div>
            <div style={{ color: '#555', fontSize: '7.5pt' }}>{directorDepartment}</div>
          </div>
        </div>

        {/* Circular Official University Stamp (Central T&P) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '16px',
          marginBottom: '10px'
        }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            border: '2px solid #1d4ed8',
            outline: '1px dashed #1d4ed8',
            outlineOffset: '2px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1d4ed8',
            textAlign: 'center',
            transform: 'rotate(-8deg)',
            userSelect: 'none',
            boxShadow: '0 0 0 1px rgba(29, 78, 216, 0.1)'
          }}>
            <div style={{ fontSize: '5.5pt', fontWeight: '800', letterSpacing: '0.05em' }}>
              MIT-ADT UNIVERSITY
            </div>
            <div style={{ fontSize: '7pt', fontWeight: '900', margin: '1px 0', borderTop: '1px solid #1d4ed8', borderBottom: '1px solid #1d4ed8', padding: '1px 4px' }}>
              CENTRAL T & P
            </div>
            <div style={{ fontSize: '5.5pt', fontWeight: '700' }}>
              PUNE
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Footer */}
      <DocumentFooter />
    </div>
  );
};
