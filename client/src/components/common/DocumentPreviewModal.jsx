import React from 'react';
import { X, Download, ExternalLink, FileText, AlertCircle } from 'lucide-react';

export const DocumentPreviewModal = ({ isOpen, onClose, documentUrl, documentTitle, studentName }) => {
  if (!isOpen || !documentUrl) return null;

  const isPdf = documentUrl.startsWith('data:application/pdf') || documentUrl.toLowerCase().includes('.pdf');
  const isImage = documentUrl.startsWith('data:image') || /\.(jpg|jpeg|png|webp|gif)$/i.test(documentUrl);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = (documentTitle || 'Student_Document').replace(/[^a-zA-Z0-9_-]/g, '_') + (isPdf ? '.pdf' : '.png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      boxSizing: 'border-box'
    }}>
      <div className="card animate-fade-in" style={{
        width: '100%',
        maxWidth: '900px',
        maxHeight: '92vh',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        padding: 0
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--slate-200)',
          backgroundColor: 'var(--slate-50)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: 'var(--purple-100)',
              color: 'var(--purple-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--purple-950)', margin: 0 }}>
                {documentTitle || 'Document Preview'}
              </h3>
              {studentName && (
                <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)' }}>
                  Student: {studentName}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleDownload}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}
            >
              <Download size={14} />
              Download PDF
            </button>

            <a
              href={documentUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}
            >
              <ExternalLink size={14} />
              Open In Tab
            </a>

            <button
              type="button"
              onClick={onClose}
              style={{
                border: 'none',
                background: 'var(--slate-200)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--slate-700)',
                marginLeft: '0.5rem'
              }}
              title="Close Preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body: Document Display Frame */}
        <div style={{
          flex: 1,
          minHeight: '65vh',
          maxHeight: '75vh',
          backgroundColor: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'auto',
          padding: '1rem'
        }}>
          {isPdf ? (
            <iframe
              src={documentUrl}
              title={documentTitle || 'PDF Document Preview'}
              style={{
                width: '100%',
                height: '100%',
                minHeight: '65vh',
                border: '1px solid var(--slate-300)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#ffffff'
              }}
            />
          ) : isImage ? (
            <img
              src={documentUrl}
              alt={documentTitle || 'Document Attachment'}
              style={{
                maxWidth: '100%',
                maxHeight: '68vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)'
              }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <iframe
                src={documentUrl}
                title={documentTitle}
                style={{ width: '100%', minHeight: '60vh', border: 'none' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
