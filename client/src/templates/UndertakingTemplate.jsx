import React from 'react';
import { DocumentHeader, DocumentFooter } from './DocumentHeaderFooter';
import { formatDateForDoc, formatDateShort } from '../utils/validation';

export const UndertakingTemplate = ({ data = {} }) => {
  const studentName = data.studentName || data.full_name || "Shubham Santosh Alapure";
  const className = data.className || data.semester || "Semester VIII (Final Year)";
  const rollNumber = data.rollNumber || (data.enrolment_no ? data.enrolment_no.slice(-7) : "CS2022-084");
  const enrollmentNumber = data.enrollmentNumber || data.enrolment_no || "MITADT2022CS084";
  const department = data.department || data.specialization || "Computer Science & Engineering";
  
  const companyName = data.companyName || data.company_name_and_city || "Google India Private Limited, Bangalore";
  const duration = data.duration || "6 Months";
  const startDate = data.startDate || data.start_date || "2026-01-05";
  const endDate = data.endDate || data.end_date || "2026-06-30";
  
  const contactNumber = data.contactNumber || data.contact_no || "9876543210";
  const documentDate = data.documentDate || data.submission_date || new Date().toISOString().split('T')[0];
  const displayDate = data.documentDateDisplay || formatDateShort(documentDate);

  const displayStart = data.startDateDisplay || formatDateForDoc(startDate);
  const displayEnd = data.endDateDisplay || formatDateForDoc(endDate);

  return (
    <div 
      className="a4-document-paper" 
      id="undertaking-document" 
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
        {/* Institutional Header Image */}
        <DocumentHeader />

        {/* Date Row (Aligned Right) */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          fontSize: '9.5pt',
          fontFamily: 'var(--font-doc-serif)',
          fontWeight: '700',
          marginTop: '4px',
          marginBottom: '8px'
        }}>
          <div>
            Date: <span className="doc-dynamic-text">{displayDate}</span>
          </div>
        </div>

        {/* Centered Document Title */}
        <div style={{ textAlign: 'center', margin: '4px 0 10px 0' }}>
          <span style={{
            fontSize: '12pt',
            fontWeight: '800',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            fontFamily: 'var(--font-doc-serif)'
          }}>
            Undertaking
          </span>
        </div>

        {/* Salutation */}
        <div style={{
          fontSize: '9.5pt',
          fontFamily: 'var(--font-doc-serif)',
          marginBottom: '8px'
        }}>
          Dear Sir / Madam,
        </div>

        {/* Student Identification Paragraph with exact underlines */}
        <div style={{
          fontSize: '9.5pt',
          lineHeight: '1.75',
          fontFamily: 'var(--font-doc-serif)',
          textAlign: 'justify',
          marginBottom: '10px'
        }}>
          I, <span className="doc-dynamic-text">{studentName}</span>, 
          Class <span className="doc-dynamic-text">{className}</span>, 
          Roll. No. <span className="doc-dynamic-text">{rollNumber}</span>, 
          Enrolment no. <span className="doc-dynamic-text">{enrollmentNumber}</span>, 
          student of MIT ADT University, School of Computing, <span className="doc-dynamic-text">{department}</span> Department.
          <br />
          I am selected in <span className="doc-dynamic-text">{companyName}</span>
          <br />
          Duration of this program is <span className="doc-dynamic-text">{duration}</span>
          <br />
          I wish to pursue an internship at <span className="doc-dynamic-text">{companyName}</span>, 
          from <span className="doc-dynamic-text">{displayStart}</span> to <span className="doc-dynamic-text">{displayEnd}</span>
        </div>

        {/* Preamble Statement */}
        <div style={{
          fontSize: '9pt',
          lineHeight: '1.35',
          fontFamily: 'var(--font-doc-serif)',
          marginBottom: '8px',
          fontWeight: '600'
        }}>
          I hereby undertake to fully abide by all the Policies / Norms / Instructions of the Institute given from time to time, including the following:
        </div>

        {/* Points I to IX */}
        <div style={{
          fontSize: '8.8pt',
          lineHeight: '1.38',
          fontFamily: 'var(--font-doc-serif)',
          textAlign: 'justify'
        }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
            <span style={{ minWidth: '22px', fontWeight: '700' }}>I.</span>
            <span>I will remain responsible for attendance in lectures and practical.</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
            <span style={{ minWidth: '22px', fontWeight: '700' }}>II.</span>
            <span>I will complete all the necessary assignments and lab experiments.</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
            <span style={{ minWidth: '22px', fontWeight: '700' }}>III.</span>
            <span>I will be available for university examination including Term Assessments, Practical Assessments and Project presentations in the VII and VIII semesters.</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
            <span style={{ minWidth: '22px', fontWeight: '700' }}>IV.</span>
            <span>I will keep updating progress of internship to my designated academic mentor as and when asked by him.</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
            <span style={{ minWidth: '22px', fontWeight: '700' }}>V.</span>
            <span>I will be responsible for cancellation of my internship at any stage if found fake or irrelevant.</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
            <span style={{ minWidth: '22px', fontWeight: '700' }}>VI.</span>
            <span>I understand that maintaining a minimum of 75% attendance, as per university norms, is my responsibility.</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
            <span style={{ minWidth: '22px', fontWeight: '700' }}>VII.</span>
            <span>I will ensure that my internship commitments do not affect my academic schedule and will be carried out beyond regular college hours.</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
            <span style={{ minWidth: '22px', fontWeight: '700' }}>VIII.</span>
            <span>If the Summer Internship dates clash with Campus to Corporate Training (Summer Training), I will coordinate with CRTP by keeping DTPO in loop.</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
            <span style={{ minWidth: '22px', fontWeight: '700' }}>IX.</span>
            <span>After completion of the internship, I will submit the <strong>Internship Completion Letter</strong> to the Internship Incharge; otherwise, I am fully aware that my internship will not be approved.</span>
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION: SIGNATURE + FOOTER ── */}
      <div style={{ marginTop: 'auto', width: '100%' }}>
        {/* Candidate Signature Block */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '12px'
        }}>
          <div style={{
            minWidth: '260px',
            fontSize: '9pt',
            fontFamily: 'var(--font-doc-serif)',
            lineHeight: '1.6'
          }}>
            <div style={{ marginBottom: '6px' }}>
              <span style={{ fontWeight: '700' }}>Candidate's Signature:</span>
              <div style={{ height: '30px', width: '180px', borderBottom: '1px dashed #64748b', marginTop: '3px' }}></div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontWeight: '700' }}>Candidate's Name:</span>
              <span className="doc-dynamic-text">{studentName}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontWeight: '700' }}>Contact No.:</span>
              <span className="doc-dynamic-text">{contactNumber}</span>
            </div>
          </div>
        </div>

        {/* Institutional Footer Image */}
        <DocumentFooter />
      </div>
    </div>
  );
};
