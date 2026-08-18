import React from 'react';
import { DocumentHeader, DocumentFooter } from './DocumentHeaderFooter';
import { formatDateForDoc, formatDateShort } from '../utils/validation';

export const NOCTemplate = ({ data = {} }) => {
  const referenceNumber = data.referenceNumber || `MIT-SOC/${(data.specialization || 'CSE').slice(0, 3)}/2026-27/NOC-${data.enrolment_no ? data.enrolment_no.slice(-4) : '0842'}`;
  const documentDate = data.documentDate || data.submission_date || new Date().toISOString().split('T')[0];
  const displayDate = data.documentDateDisplay || formatDateShort(documentDate);

  const universityName = data.universityName || "MIT Art, Design & Technology University, Pune";
  const schoolName = data.schoolName || "School of Computing, Pune";
  const department = data.department || data.specialization || "Computer Science & Engineering";
  
  // Recipient Company & Location
  const companyName = data.companyName || (data.company_name_and_city ? data.company_name_and_city.split(',')[0] : "Google India Private Limited");
  const companyLocation = data.companyLocation || (data.company_name_and_city && data.company_name_and_city.includes(',') ? data.company_name_and_city.split(',').slice(1).join(',').trim() : "Bangalore, India");
  
  // Student Details
  const studentName = data.studentName || data.full_name || "Shubham Santosh Alapure";
  const rollNumber = data.rollNumber || (data.enrolment_no ? data.enrolment_no.slice(-7) : "CS2022-084");
  const enrollmentNumber = data.enrollmentNumber || data.enrolment_no || "MITADT2022CS084";
  
  // Duration & Dates
  const startDate = data.startDate || data.start_date || "2026-01-05";
  const endDate = data.endDate || data.end_date || "2026-06-30";
  const displayStart = data.startDateDisplay || formatDateForDoc(startDate);
  const displayEnd = data.endDateDisplay || formatDateForDoc(endDate);

  // Signatories
  const internshipHeadName = data.internshipHeadName || "Prof. Vaibhav Sawalkar";
  const internshipHeadDesignation = data.internshipHeadDesignation || "Internship Head";
  const internshipHeadDepartment = data.internshipHeadDepartment || "Assistant Professor – CSE";
  
  const hodName = data.hodName || "Prof. Dr. Jayashree Prasad";
  const hodDesignation = data.hodDesignation || "Head of Department";
  const hodDepartment = data.hodDepartment || `Department of ${department}`;
  
  const directorName = data.directorName || "Prof. Dr. Swati More";
  const directorDesignation = data.directorDesignation || "Director";
  const directorDepartment = data.directorDepartment || "Corporate Relations and Placement Cell";

  return (
    <div className="a4-document-paper" id="noc-document" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '297mm',
      boxSizing: 'border-box'
    }}>
      <div>
        {/* Institutional Header (Matching PDF Letterhead Template) */}
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
          marginBottom: '12px'
        }}>
          <div>
            Ref. No-{referenceNumber}
          </div>
          <div>
            Date: <span className="doc-dynamic-text" style={{ fontStyle: 'italic' }}>{displayDate}</span>
          </div>
        </div>

        {/* Centered Document Title */}
        <div style={{ textAlign: 'center', margin: '4px 0 14px 0' }}>
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
          fontSize: '10pt',
          lineHeight: '1.45',
          fontFamily: 'var(--font-doc-serif)',
          marginBottom: '12px'
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
          <div style={{ marginTop: '3px' }}>
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
          fontSize: '9.5pt',
          lineHeight: '1.45',
          fontFamily: 'var(--font-doc-serif)',
          textAlign: 'justify',
          marginBottom: '20px'
        }}>
          He/She must maintain academic attendance as per the Rules and Regulations of the MIT ADT University, failing which leads to shortage of attendance for the academic outcomes.
        </div>

        {/* 3 Authorized Signatures Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginTop: '22px',
          fontFamily: 'var(--font-doc-sans)',
          fontSize: '8pt',
          textAlign: 'center'
        }}>
          {/* Signatory 1: Internship Head */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
            <div style={{
              fontFamily: 'cursive',
              fontSize: '11pt',
              color: '#1d4ed8',
              fontStyle: 'italic',
              marginBottom: '2px',
              height: '28px',
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
              height: '28px',
              display: 'flex',
              alignItems: 'center'
            }}>
              Jayashree Prasad
            </div>
            <div style={{ fontWeight: '700', color: '#111' }}>{hodName}</div>
            <div style={{ color: '#444' }}>{hodDesignation}</div>
            <div style={{ color: '#555', fontSize: '7.5pt' }}>{hodDepartment}</div>
          </div>

          {/* Signatory 3: Director CRTP */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
            <div style={{
              fontFamily: 'cursive',
              fontSize: '11pt',
              color: '#1d4ed8',
              fontStyle: 'italic',
              marginBottom: '2px',
              height: '28px',
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
          marginTop: '14px',
          marginBottom: '8px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
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
            userSelect: 'none'
          }}>
            <div style={{ fontSize: '5.5pt', fontWeight: '800', letterSpacing: '0.05em' }}>
              MIT-ADT UNIVERSITY
            </div>
            <div style={{ fontSize: '6.5pt', fontWeight: '900', margin: '1px 0', borderTop: '1px solid #1d4ed8', borderBottom: '1px solid #1d4ed8', padding: '1px 3px' }}>
              CENTRAL T & P
            </div>
            <div style={{ fontSize: '5.5pt', fontWeight: '700' }}>
              PUNE
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Footer (Matching PDF Letterhead Template) */}
      <DocumentFooter />
    </div>
  );
};
