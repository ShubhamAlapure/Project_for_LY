import React, { useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, FileText, Printer, Download, Sparkles } from 'lucide-react';
import { A4Container } from '../components/preview/A4Container';
import { PreviewControls } from '../components/preview/PreviewControls';
import { UndertakingTemplate } from '../templates/UndertakingTemplate';
import { NOCTemplate } from '../templates/NOCTemplate';
import { StepIndicator } from '../components/common/StepIndicator';
import { Toast } from '../components/common/Toast';
import { downloadDocumentPDF } from '../utils/pdfGenerator';

export const DocumentPreviewPage = ({ 
  docType = 'undertaking', 
  formData = {}, 
  onEdit, 
  onStartNew 
}) => {
  const documentRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [toast, setToast] = useState(null);

  const docTitle = docType === 'undertaking' 
    ? "Internship Undertaking Form" 
    : "No Objection Certificate for Internship";

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    setPdfError(null);

    const filename = docType === 'undertaking'
      ? `Internship_Undertaking_${(formData.studentName || 'Student').replace(/\s+/g, '_')}`
      : `Internship_NOC_${(formData.studentName || 'Student').replace(/\s+/g, '_')}`;

    try {
      // Find the document root element
      const targetElement = document.getElementById(
        docType === 'undertaking' ? 'undertaking-document' : 'noc-document'
      );

      if (!targetElement) {
        throw new Error("Document DOM element not found");
      }

      await downloadDocumentPDF(targetElement, filename);

      setToast({
        type: 'success',
        message: 'PDF downloaded successfully! Check your downloads folder.'
      });
    } catch (err) {
      console.error("PDF download failed:", err);
      setPdfError("Unable to generate PDF. Please try printing the document instead.");
      setToast({
        type: 'error',
        message: 'Unable to generate PDF. Please try printing the document instead.'
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem 0 4rem 0' }}>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="container" style={{ maxWidth: '1360px' }}>
        {/* Step Indicator (Non-printable) */}
        <div className="non-printable">
          <StepIndicator 
            currentStep={3}
            steps={[
              { title: "Select Document" },
              { title: "Enter Details" },
              { title: "Preview & Print" }
            ]}
          />

          {/* Quick Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <button
              onClick={onEdit}
              className="btn btn-secondary btn-sm"
            >
              <ArrowLeft size={16} />
              Edit Form Details
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-success">
                <CheckCircle2 size={13} />
                Ready for Print & PDF
              </span>
            </div>
          </div>
        </div>

        {/* Split Layout: Left Preview, Right Control Panel */}
        <div 
          className="preview-split-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 340px',
            gap: '2rem',
            alignItems: 'flex-start'
          }}
        >
          {/* Left Column: A4 Document Container */}
          <div style={{ minWidth: 0 }}>
            <A4Container documentRef={documentRef}>
              {docType === 'undertaking' ? (
                <UndertakingTemplate data={formData} />
              ) : (
                <NOCTemplate data={formData} />
              )}
            </A4Container>
          </div>

          {/* Right Column: Controls Panel */}
          <div className="non-printable">
            <PreviewControls
              docName={docTitle}
              onEdit={onEdit}
              onPrint={handlePrint}
              onDownloadPDF={handleDownloadPDF}
              onStartNew={onStartNew}
              isGeneratingPDF={isGeneratingPDF}
              pdfError={pdfError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
