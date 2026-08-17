import React, { useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';

export const A4Container = ({ children, documentRef }) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 1.4));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.6));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const handleFitWidth = () => {
    setZoomLevel(0.85);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Zoom / Viewport Toolbar (Hidden during print) */}
      <div 
        className="preview-toolbar non-printable"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          backgroundColor: 'var(--navy-900)',
          color: 'white',
          borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
          borderBottom: '1px solid var(--navy-800)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <span style={{
            display: 'inline-block',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'var(--success-500)'
          }}></span>
          <span style={{ fontWeight: 600 }}>A4 Document Viewport (210mm × 297mm)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={handleZoomOut}
            className="btn btn-sm btn-icon-only"
            title="Zoom Out"
            style={{ backgroundColor: 'var(--navy-800)', color: 'white', border: 'none' }}
          >
            <ZoomOut size={16} />
          </button>

          <span style={{ fontSize: '0.8rem', fontWeight: 600, minWidth: '45px', textAlign: 'center' }}>
            {Math.round(zoomLevel * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            className="btn btn-sm btn-icon-only"
            title="Zoom In"
            style={{ backgroundColor: 'var(--navy-800)', color: 'white', border: 'none' }}
          >
            <ZoomIn size={16} />
          </button>

          <button
            onClick={handleFitWidth}
            className="btn btn-sm btn-icon-only"
            title="Fit Width"
            style={{ backgroundColor: 'var(--navy-800)', color: 'white', border: 'none', marginLeft: '0.25rem' }}
          >
            <Maximize2 size={15} />
          </button>

          <button
            onClick={handleResetZoom}
            className="btn btn-sm btn-icon-only"
            title="Reset 100%"
            style={{ backgroundColor: 'var(--navy-800)', color: 'white', border: 'none' }}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* A4 Sheet Viewport Canvas */}
      <div 
        className="preview-stage-wrapper"
        style={{
          borderRadius: '0 0 var(--radius-md) var(--radius-md)',
          boxShadow: 'var(--shadow-xl)'
        }}
      >
        <div 
          ref={documentRef}
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
