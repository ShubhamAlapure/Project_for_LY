import React, { useState, useEffect } from 'react';
import { X, Download, ExternalLink, FileText, AlertCircle, Award, CheckCircle2, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

export const DocumentPreviewModal = ({ isOpen, onClose, documentUrl, documentTitle, studentName }) => {
  const [blobUrl, setBlobUrl] = useState('');
  const [hasRenderError, setHasRenderError] = useState(false);

  useEffect(() => {
    if (!documentUrl) {
      setBlobUrl('');
      return;
    }

    setHasRenderError(false);

    // If it's a base64 Data URL, convert to Blob URL so Chrome/Safari/Firefox can render it directly
    if (documentUrl.startsWith('data:')) {
      try {
        const parts = documentUrl.split(',');
        const mimeMatch = parts[0].match(/:(.*?);/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'application/pdf';
        const byteCharacters = atob(parts[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const createdBlobUrl = URL.createObjectURL(blob);
        setBlobUrl(createdBlobUrl);

        return () => {
          URL.revokeObjectURL(createdBlobUrl);
        };
      } catch (err) {
        console.warn('Could not convert data URL to Blob:', err);
        setBlobUrl(documentUrl);
      }
    } else {
      setBlobUrl(documentUrl);
    }
  }, [documentUrl]);

  if (!isOpen || !documentUrl) return null;

  const isPdf = documentUrl.startsWith('data:application/pdf') || 
                documentUrl.toLowerCase().includes('.pdf') || 
                documentUrl.includes('application/pdf');
  
  const isImage = documentUrl.startsWith('data:image') || 
                  /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(documentUrl);

  const activeRenderUrl = blobUrl || documentUrl;

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = (documentTitle || 'Internship_Document')
        .replace(/[^a-zA-Z0-9_-]/g, '_') + (isPdf ? '.pdf' : isImage ? '.png' : '');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.warn('Download error, opening in new tab instead:', err);
      window.open(documentUrl, '_blank');
    }
  };

  const handleOpenInNewTab = () => {
    if (documentUrl.startsWith('data:')) {
      // Create blob window for data URL if needed
      try {
        const byteCharacters = atob(documentUrl.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const mimeType = documentUrl.split(';')[0].split(':')[1];
        const blob = new Blob([byteArray], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
        return;
      } catch (err) {
        // Fallback standard open
      }
    }
    window.open(documentUrl, '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(15, 23, 42, 0.82)',
      backdropFilter: 'blur(8px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      boxSizing: 'border-box'
    }}>
      <div className="card animate-fade-in" style={{
        width: '100%',
        maxWidth: '960px',
        maxHeight: '94vh',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        padding: 0,
        border: '1px solid var(--purple-200)'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--slate-200)',
          backgroundColor: '#faf5ff',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--purple-100)',
              color: 'var(--purple-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {documentTitle?.toLowerCase().includes('completion') ? <Award size={20} /> : <FileText size={20} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--purple-950)', margin: 0 }}>
                  {documentTitle || 'Document Preview'}
                </h3>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  backgroundColor: isPdf ? '#dcfce7' : '#e0f2fe',
                  color: isPdf ? '#15803d' : '#0369a1',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)'
                }}>
                  {isPdf ? 'PDF Document' : isImage ? 'Image Document' : 'Attachment'}
                </span>
              </div>
              {studentName && (
                <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)', marginTop: '0.15rem' }}>
                  Student: <strong>{studentName}</strong> • Verified Institutional Attachment
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleDownload}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', backgroundColor: '#ffffff' }}
              title="Download Document"
            >
              <Download size={14} />
              Download
            </button>

            <button
              type="button"
              onClick={handleOpenInNewTab}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', backgroundColor: '#ffffff' }}
              title="Open document in a new tab"
            >
              <ExternalLink size={14} />
              Open In Tab
            </button>

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
                marginLeft: '0.25rem',
                transition: 'background-color 0.15s ease'
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
          backgroundColor: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {isPdf && !hasRenderError ? (
            <div style={{ width: '100%', height: '100%', minHeight: '65vh', backgroundColor: '#ffffff' }}>
              <object
                data={activeRenderUrl}
                type="application/pdf"
                width="100%"
                height="100%"
                style={{ minHeight: '65vh', width: '100%', border: 'none' }}
                onError={() => setHasRenderError(true)}
              >
                <iframe
                  src={activeRenderUrl}
                  title={documentTitle || 'PDF Preview'}
                  width="100%"
                  height="100%"
                  style={{ minHeight: '65vh', width: '100%', border: 'none' }}
                  onError={() => setHasRenderError(true)}
                >
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>PDF preview could not be displayed directly.</p>
                    <button onClick={handleDownload} className="btn btn-primary btn-sm">
                      Download PDF to View
                    </button>
                  </div>
                </iframe>
              </object>
            </div>
          ) : isImage ? (
            <div style={{
              width: '100%',
              height: '100%',
              minHeight: '65vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              backgroundColor: '#1e293b'
            }}>
              <img
                src={activeRenderUrl}
                alt={documentTitle || 'Document Attachment'}
                style={{
                  maxWidth: '100%',
                  maxHeight: '68vh',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                }}
              />
            </div>
          ) : (
            <div style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              margin: '2rem',
              maxWidth: '500px',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--purple-100)',
                color: 'var(--purple-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                <FileText size={28} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.5rem' }}>
                {documentTitle || 'Document File'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1.5rem' }}>
                This document is safely attached and ready for viewing or printing.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Download size={15} />
                  Download Document
                </button>
                <button
                  type="button"
                  onClick={handleOpenInNewTab}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <ExternalLink size={15} />
                  Open in Browser
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid var(--slate-200)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: 'var(--slate-500)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={13} color="#16a34a" />
            <span>MIT-ADT School of Computing • Document Verification Portal</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

