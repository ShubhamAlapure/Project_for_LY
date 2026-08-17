import React from 'react';
import { 
  Download, 
  Printer, 
  Edit3, 
  PlusCircle, 
  CheckCircle2, 
  ShieldCheck, 
  FileText,
  Loader2,
  Sparkles,
  Info
} from 'lucide-react';

export const PreviewControls = ({
  docName = "Internship Document",
  onEdit,
  onPrint,
  onDownloadPDF,
  onStartNew,
  isGeneratingPDF = false,
  pdfError = null
}) => {
  return (
    <div 
      className="preview-control-panel non-printable"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        position: 'sticky',
        top: '90px'
      }}
    >
      {/* Action Card */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--slate-100)',
          marginBottom: '1.25rem'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary-50)',
            color: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-900)' }}>
              Document Ready
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              {docName}
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Download PDF Button */}
          <button
            onClick={onDownloadPDF}
            disabled={isGeneratingPDF}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating Crisp PDF...
              </>
            ) : (
              <>
                <Download size={18} />
                Download PDF
              </>
            )}
          </button>

          {/* Print Button */}
          <button
            onClick={onPrint}
            disabled={isGeneratingPDF}
            className="btn btn-dark btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Printer size={18} />
            Print Document
          </button>

          {/* Edit Details Button */}
          <button
            onClick={onEdit}
            disabled={isGeneratingPDF}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Edit3 size={16} />
            Edit Details
          </button>
        </div>

        {/* PDF Error Fallback Message */}
        {pdfError && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--warning-50)',
            border: '1px solid var(--warning-500)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.825rem',
            color: 'var(--warning-600)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem'
          }}>
            <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Notice:</strong> Unable to generate PDF. Please try printing the document instead.
            </div>
          </div>
        )}

        <hr style={{ margin: '1.5rem 0', borderColor: 'var(--slate-100)' }} />

        {/* Start New Document */}
        <button
          onClick={onStartNew}
          className="btn btn-outline-primary"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <PlusCircle size={16} />
          Start New Document
        </button>
      </div>

      {/* Printing Guidance Card */}
      <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--slate-50)' }}>
        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={16} color="var(--primary-600)" />
          Print Settings Recommendation
        </h4>
        <ul style={{ fontSize: '0.8rem', color: 'var(--slate-600)', paddingLeft: '1.25rem', lineHeight: 1.6 }}>
          <li>Paper size: <strong>A4 (210 × 297 mm)</strong></li>
          <li>Margins: <strong>Default / None</strong></li>
          <li>Scale: <strong>100% (or Fit to page)</strong></li>
          <li>Options: <strong>Check "Background graphics"</strong></li>
        </ul>
      </div>
    </div>
  );
};
