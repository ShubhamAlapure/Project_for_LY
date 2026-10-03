import React, { useState, useEffect } from 'react';
import { 
  User, 
  Briefcase, 
  Award, 
  Building, 
  Calendar, 
  FileText, 
  RotateCcw, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft,
  School,
  FileCheck,
  Download,
  Printer,
  Edit3,
  RefreshCw,
  Layers,
  FileCheck2,
  Clock,
  CheckCircle
} from 'lucide-react';
import { FormInput } from '../components/common/FormInput';
import { FormSelect } from '../components/common/FormSelect';
import { FormTextarea } from '../components/common/FormTextarea';
import { StepIndicator } from '../components/common/StepIndicator';
import { validateNOCForm } from '../utils/validation';
import { 
  saveFormData, 
  loadFormData, 
  clearFormData, 
  getStudentStorageKey, 
  saveGeneratedDocument, 
  loadGeneratedDocument, 
  clearGeneratedDocument 
} from '../utils/storage';
import { calculateInternshipDuration } from '../utils/supabaseClient';
import { downloadDocumentPDF } from '../utils/pdfGenerator';
import { NOCTemplate } from '../templates/NOCTemplate';
import { Toast } from '../components/common/Toast';
import { ROLES } from '../utils/auth';

const INITIAL_STATE = {
  // Document Reference
  referenceNumber: 'MITADT/SOC/T&P/2026/NOC-0842',
  documentDate: new Date().toISOString().split('T')[0],

  // Student Info
  studentName: '',
  salutation: 'Mr.',
  rollNumber: '',
  enrollmentNumber: '',
  department: 'Department of Computer Science & Engineering',
  course: 'B.Tech in Computer Science and Engineering',
  className: 'Final Year (VIII Semester)',

  // Company Info
  companyName: '',
  companyLocation: '',
  internshipRole: 'Software Engineering Intern',

  // Internship Info
  startDate: '',
  endDate: '',
  duration: '6 Months (Full-Time)',

  // University Info
  universityName: 'MIT Art, Design and Technology University',
  schoolName: 'School of Computing',
  universityAddress: 'Rajbaug, Next to Hadapsar, Loni Kalbhor, Pune - 412201, Maharashtra, India',

  // Signatories
  internshipHeadName: 'Prof. Aniket Verma',
  internshipHeadDesignation: 'Head - Industry Internship Cell',
  hodName: 'Dr. Sneha Deshmukh',
  hodDesignation: 'Head of Department (CSE)',
  directorName: 'Dr. Milind S. Kulkarni',
  directorDesignation: 'Director, Corporate Relations & Placement Cell'
};

export const NOCFormPage = ({ 
  onGeneratePreview, 
  onBack, 
  initialData,
  authUser,
  hasSubmittedApp,
  isApproved,
  onNavigate
}) => {
  const isStudent = authUser?.role === ROLES.STUDENT;
  const studentKey = getStudentStorageKey(authUser);

  const [generatedDoc, setGeneratedDoc] = useState(() => loadGeneratedDocument('noc', studentKey));
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState(() => {
    const savedGen = loadGeneratedDocument('noc', studentKey);
    if (savedGen?.data) {
      return initialData ? { ...savedGen.data, ...initialData } : savedGen.data;
    }
    const saved = loadFormData('noc', INITIAL_STATE);
    return initialData ? { ...saved, ...initialData } : saved;
  });
  const [errors, setErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
      setSaveStatus('Prefilled from student record!');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  }, [initialData]);

  // Recalculate duration automatically whenever startDate or endDate changes
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const computedDuration = calculateInternshipDuration(formData.startDate, formData.endDate);
      if (computedDuration) {
        setFormData(prev => ({ ...prev, duration: computedDuration }));
      }
    }
  }, [formData.startDate, formData.endDate]);

  // Autosave to localStorage on change
  useEffect(() => {
    saveFormData('noc', formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear field error
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all fields in the NOC form?")) {
      setFormData(INITIAL_STATE);
      clearFormData('noc');
      clearGeneratedDocument('noc', studentKey);
      setGeneratedDoc(null);
      setIsEditing(false);
      setErrors({});
      setSaveStatus('Form reset.');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateNOCForm(formData);

    if (!isValid) {
      setErrors(validationErrors);
      const firstErrorField = Object.keys(validationErrors)[0];
      const el = document.getElementById(firstErrorField);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const saved = saveGeneratedDocument('noc', studentKey, formData);
    setGeneratedDoc(saved);
    setIsEditing(false);
    onGeneratePreview('noc', formData);
  };

  const handleDirectDownload = async () => {
    setIsDownloading(true);
    try {
      const targetElement = document.getElementById('noc-hidden-download-element');
      if (!targetElement) {
        throw new Error("Target template element not found");
      }
      const studentNameClean = ((generatedDoc?.data || formData).studentName || 'Student').replace(/\s+/g, '_');
      const filename = `Internship_NOC_${studentNameClean}`;
      await downloadDocumentPDF(targetElement, filename);
      setToast({
        type: 'success',
        message: 'No Objection Certificate (NOC) PDF downloaded successfully!'
      });
    } catch (err) {
      console.error("PDF download failed:", err);
      setToast({
        type: 'error',
        message: 'Direct PDF download failed. Please click "Preview & Print" to download or print.'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isStudent && !isApproved) {
    return (
      <div className="animate-fade-in" style={{ padding: '3rem 0 5rem 0' }}>
        <div className="container container-narrow">
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#fffbeb',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <Award size={30} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.75rem' }}>
              🔒 NOC Letter Generation Locked
            </h2>
            <p style={{ color: 'var(--slate-600)', maxWidth: '500px', margin: '0 auto 1.75rem auto', lineHeight: 1.6 }}>
              {hasSubmittedApp 
                ? 'Your internship application is currently under review with your assigned Faculty Coordinator. The official No Objection Certificate (NOC) will unlock once approved.'
                : 'You must submit your Internship Application (Step 1) and receive Faculty Coordinator approval before generating the official NOC letter.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate(hasSubmittedApp ? 'student-records' : 'student-form')}
                className="btn btn-primary"
              >
                {hasSubmittedApp ? 'Track Application Status' : 'Go to Step 1 Application'}
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="btn btn-secondary"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2nd Time Onwards View: If NOC is already generated and student is not in edit mode
  if (generatedDoc && !isEditing) {
    const docData = generatedDoc.data || formData;
    const formattedDate = generatedDoc.generatedAt 
      ? new Date(generatedDoc.generatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
      : 'Previously Generated';

    return (
      <div className="animate-fade-in" style={{ padding: '2rem 0 5rem 0' }}>
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        {/* Hidden single-page A4 element for direct PDF downloads */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '794px' }}>
          <div id="noc-hidden-download-element">
            <NOCTemplate data={docData} />
          </div>
        </div>

        <div className="container container-narrow">
          {/* Top Bar Navigation */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              onClick={onBack}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <ArrowLeft size={16} />
              Back to Documents Hub
            </button>

            <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#15803d', backgroundColor: '#dcfce7', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', border: '1px solid #86efac', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={13} /> Saved in Student Profile
            </span>
          </div>

          {/* Main Success Hero Card */}
          <div className="card" style={{
            padding: '2rem 2.25rem',
            backgroundColor: '#ffffff',
            border: '2px solid #86efac',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.08)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#16a34a',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 8px rgba(22, 163, 74, 0.3)'
              }}>
                <Award size={30} />
              </div>

              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                  <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#15803d', fontWeight: 800, fontSize: '0.75rem' }}>
                    DOC-MIT-NOC-02 • OFFICIAL
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                    🕒 Generated: {formattedDate}
                  </span>
                </div>

                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--purple-950)', margin: '0 0 0.4rem 0' }}>
                  No Objection Certificate (NOC) Generated
                </h1>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem', margin: 0, lineHeight: 1.5 }}>
                  Your official <strong>No Objection Certificate (NOC)</strong> has been generated and saved. You can download the high-resolution printable PDF, preview with full zoom & print options, or edit fields if any details need updating.
                </p>
              </div>
            </div>
          </div>

          {/* Document Summary Overview Card */}
          <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem', border: '1px solid var(--sidebar-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--purple-950)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={18} color="var(--purple-600)" />
                Generated Certificate Summary
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                Reference: {docData.referenceNumber || 'MITADT/SOC/T&P/2026/NOC-0842'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 700, textTransform: 'uppercase' }}>Student Name</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--purple-950)', marginTop: '0.2rem' }}>
                  {docData.salutation} {docData.studentName}
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)', marginTop: '0.1rem' }}>
                  Roll: {docData.rollNumber} • Enrol: {docData.enrollmentNumber}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 700, textTransform: 'uppercase' }}>Host Company & Location</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--purple-950)', marginTop: '0.2rem' }}>
                  {docData.companyName}
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)', marginTop: '0.1rem' }}>
                  📍 {docData.companyLocation || 'Maharashtra, India'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 700, textTransform: 'uppercase' }}>Role & Duration</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--purple-950)', marginTop: '0.2rem' }}>
                  {docData.internshipRole || 'Software Engineering Intern'}
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)', marginTop: '0.1rem' }}>
                  ⏱️ {docData.duration || '6 Months (Full-Time)'} ({docData.startDate} → {docData.endDate})
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 700, textTransform: 'uppercase' }}>Course & Department</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--purple-950)', marginTop: '0.2rem' }}>
                  {docData.course || 'B.Tech in CSE'}
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)', marginTop: '0.1rem' }}>
                  {docData.className} • {docData.department}
                </div>
              </div>
            </div>
          </div>

          {/* 3 Prominent Action Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {/* Option 1: Direct PDF Download */}
            <div className="card" style={{
              padding: '1.5rem',
              borderTop: '4px solid #16a34a',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Download size={22} />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#15803d', backgroundColor: '#dcfce7', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                    Instant PDF
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--purple-950)', margin: '0 0 0.35rem 0' }}>
                  1. Download NOC
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--slate-600)', margin: '0 0 1.25rem 0', lineHeight: 1.4 }}>
                  Export the official No Objection Certificate as an exact single-page A4 PDF ready for submission to your employer.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDirectDownload}
                disabled={isDownloading}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', backgroundColor: '#15803d', borderColor: '#16a34a', fontWeight: 700 }}
              >
                {isDownloading ? (
                  <><RefreshCw size={15} className="animate-spin" /> Generating PDF...</>
                ) : (
                  <><Download size={16} /> Download PDF</>
                )}
              </button>
            </div>

            {/* Option 2: Full Document Preview */}
            <div className="card" style={{
              padding: '1.5rem',
              borderTop: '4px solid #2563eb',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Eye size={22} />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1d4ed8', backgroundColor: '#eff6ff', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                    Print & Zoom
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--purple-950)', margin: '0 0 0.35rem 0' }}>
                  2. Preview & Print
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--slate-600)', margin: '0 0 1.25rem 0', lineHeight: 1.4 }}>
                  Open the full interactive A4 view with browser print dialog, signatories inspection, and zoom tools.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onGeneratePreview('noc', docData)}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', fontWeight: 700 }}
              >
                <Eye size={16} />
                Preview Document
              </button>
            </div>

            {/* Option 3: Edit NOC */}
            <div className="card" style={{
              padding: '1.5rem',
              borderTop: '4px solid var(--purple-600)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--purple-50)', color: 'var(--purple-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Edit3 size={22} />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--purple-700)', backgroundColor: 'var(--purple-50)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                    Modify Fields
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--purple-950)', margin: '0 0 0.35rem 0' }}>
                  3. Edit NOC Details
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--slate-600)', margin: '0 0 1.25rem 0', lineHeight: 1.4 }}>
                  Need to change company address, dates, reference number, or signatories? Open the form to update.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center', fontWeight: 700, borderColor: 'var(--purple-300)', color: 'var(--purple-800)' }}
              >
                <Edit3 size={16} />
                Edit Form Details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0 5rem 0' }}>
      <div className="container container-narrow">
        {/* Step Indicator */}
        <StepIndicator 
          currentStep={2}
          steps={[
            { title: "Select Document" },
            { title: "Enter Details" },
            { title: "Preview & Print" }
          ]}
        />

        {/* Back Button & Toolbar */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <button
            onClick={onBack}
            className="btn btn-secondary btn-sm"
          >
            <ArrowLeft size={16} />
            Back to Documents
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary btn-sm"
              title="Reset all form fields"
            >
              <RotateCcw size={15} />
              Reset
            </button>
          </div>
        </div>

        {/* Editing Banner (If editing previously generated document) */}
        {generatedDoc && isEditing && (
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1.5px solid #93c5fd',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Edit3 size={20} color="#2563eb" />
              <div>
                <div style={{ fontWeight: 800, color: '#1e40af', fontSize: '0.95rem' }}>
                  Editing Previously Generated NOC Certificate
                </div>
                <div style={{ fontSize: '0.8rem', color: '#3b82f6' }}>
                  Modify any field below. Clicking "Update & Re-generate Preview" will update your saved document.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <ArrowLeft size={14} />
              Cancel & Return to Generated View
            </button>
          </div>
        )}

        {/* Header Title */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-neutral">Certificate Entry</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>DOC-MIT-NOC-02</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            {generatedDoc && isEditing ? 'Edit No Objection Certificate (NOC) Form' : 'No Objection Certificate (NOC) Form'}
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem' }}>
            Generate the official institutional No Objection Certificate for submitting to your host internship company.
          </p>

          {saveStatus && (
            <div style={{
              marginTop: '0.75rem',
              padding: '0.5rem 0.85rem',
              backgroundColor: 'var(--success-50)',
              color: 'var(--success-700)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <CheckCircle2 size={16} />
              {saveStatus}
            </div>
          )}
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit}>
          {/* Section 1: Document Reference */}
          <div className="form-section-card">
            <div className="form-section-header">
              <div className="form-section-icon">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="form-section-title">Section 1: Reference & Document Meta</h3>
                <p className="form-section-desc">Institutional reference identifier and issue date</p>
              </div>
            </div>

            <div className="form-grid-2">
              <FormInput
                label="Reference Number"
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={handleChange}
                placeholder="e.g. MITADT/SOC/T&P/2026/NOC-0842"
                required
                error={errors.referenceNumber}
                helperText="Official university dispatch number"
              />

              <FormInput
                label="Document Date"
                name="documentDate"
                type="date"
                value={formData.documentDate}
                onChange={handleChange}
                required
                error={errors.documentDate}
                icon={Calendar}
              />
            </div>
          </div>

          {/* Section 2: Student Information */}
          <div className="form-section-card">
            <div className="form-section-header">
              <div className="form-section-icon">
                <User size={20} />
              </div>
              <div>
                <h3 className="form-section-title">Section 2: Student Information</h3>
                <p className="form-section-desc">Student academic credentials to be certified</p>
              </div>
            </div>

            <div className="form-grid-3">
              <div style={{ gridColumn: 'span 1' }}>
                <FormSelect
                  label="Salutation / Honorific"
                  name="salutation"
                  value={formData.salutation}
                  onChange={handleChange}
                  required
                  options={[
                    { value: 'Mr.', label: 'Mr. (Male)' },
                    { value: 'Ms.', label: 'Ms. (Female)' },
                    { value: 'Mrs.', label: 'Mrs.' }
                  ]}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <FormInput
                  label="Student Full Name"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="e.g. Shubham Santosh Alapure"
                  required
                  error={errors.studentName}
                  icon={User}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <FormInput
                label="Roll Number"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="e.g. CS2022-084"
                required
                error={errors.rollNumber}
              />

              <FormInput
                label="Enrollment / PRN Number"
                name="enrollmentNumber"
                value={formData.enrollmentNumber}
                onChange={handleChange}
                placeholder="e.g. MITADT2022CS084"
                required
                error={errors.enrollmentNumber}
              />
            </div>

            <div className="form-grid-3">
              <FormInput
                label="Course / Degree Program"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="e.g. B.Tech in Computer Science and Engineering"
                required
                error={errors.course}
              />

              <FormInput
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Department of Computer Science & Engineering"
                required
                error={errors.department}
              />

              <FormInput
                label="Class / Semester"
                name="className"
                value={formData.className}
                onChange={handleChange}
                placeholder="e.g. Final Year (VIII Semester)"
                required
                error={errors.className}
              />
            </div>
          </div>

          {/* Section 3: Company Information */}
          <div className="form-section-card">
            <div className="form-section-header">
              <div className="form-section-icon">
                <Building size={20} />
              </div>
              <div>
                <h3 className="form-section-title">Section 3: Recipient Company Information</h3>
                <p className="form-section-desc">Host organization and office location</p>
              </div>
            </div>

            <div className="form-grid-2">
              <FormInput
                label="Company / Host Organization Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. Google India Private Limited"
                required
                error={errors.companyName}
                icon={Building}
              />

              <FormInput
                label="Internship Role / Title"
                name="internshipRole"
                value={formData.internshipRole}
                onChange={handleChange}
                placeholder="e.g. Software Engineering Intern"
                required
                error={errors.internshipRole}
              />
            </div>

            <FormInput
              label="Company Location / Address"
              name="companyLocation"
              value={formData.companyLocation}
              onChange={handleChange}
              placeholder="e.g. Prestige Cyber Earth, Whitefield, Bangalore - 560066"
              required
              error={errors.companyLocation}
            />
          </div>

          {/* Section 4: Internship Duration */}
          <div className="form-section-card">
            <div className="form-section-header">
              <div className="form-section-icon">
                <Briefcase size={20} />
              </div>
              <div>
                <h3 className="form-section-title">Section 4: Internship Duration</h3>
                <p className="form-section-desc">Approved dates and duration for industrial training</p>
              </div>
            </div>

            <div className="form-grid-3">
              <FormInput
                label="Internship Duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 6 Months (Full-Time)"
                required
                error={errors.duration}
              />

              <FormInput
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
                error={errors.startDate}
                icon={Calendar}
              />

              <FormInput
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                required
                error={errors.endDate}
                icon={Calendar}
              />
            </div>
          </div>

          {/* Section 5: University Information */}
          <div className="form-section-card">
            <div className="form-section-header">
              <div className="form-section-icon">
                <School size={20} />
              </div>
              <div>
                <h3 className="form-section-title">Section 5: University Information</h3>
                <p className="form-section-desc">Institutional letterhead and campus details</p>
              </div>
            </div>

            <div className="form-grid-2">
              <FormInput
                label="University Name"
                name="universityName"
                value={formData.universityName}
                onChange={handleChange}
                placeholder="e.g. MIT Art, Design and Technology University"
                required
                error={errors.universityName}
              />

              <FormInput
                label="School / Faculty Name"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                placeholder="e.g. School of Computing"
                required
                error={errors.schoolName}
              />
            </div>

            <FormInput
              label="University Address"
              name="universityAddress"
              value={formData.universityAddress}
              onChange={handleChange}
              placeholder="e.g. Rajbaug, Next to Hadapsar, Loni Kalbhor, Pune - 412201"
              required
              error={errors.universityAddress}
            />
          </div>

          {/* Section 6: Authorized Signatories */}
          <div className="form-section-card">
            <div className="form-section-header">
              <div className="form-section-icon">
                <Award size={20} />
              </div>
              <div>
                <h3 className="form-section-title">Section 6: Authorized Institutional Signatories</h3>
                <p className="form-section-desc">Names of the three official approving authorities</p>
              </div>
            </div>

            <div className="form-grid-3">
              <FormInput
                label="Internship Head Name"
                name="internshipHeadName"
                value={formData.internshipHeadName}
                onChange={handleChange}
                placeholder="e.g. Prof. Aniket Verma"
                required
                error={errors.internshipHeadName}
                helperText="Head - Internship Cell"
              />

              <FormInput
                label="Head of Department Name"
                name="hodName"
                value={formData.hodName}
                onChange={handleChange}
                placeholder="e.g. Dr. Sneha Deshmukh"
                required
                error={errors.hodName}
                helperText="HOD (Department)"
              />

              <FormInput
                label="Director / Placement Cell Name"
                name="directorName"
                value={formData.directorName}
                onChange={handleChange}
                placeholder="e.g. Dr. Milind S. Kulkarni"
                required
                error={errors.directorName}
                helperText="Director Corporate Relations"
              />
            </div>
          </div>

          {/* Form Action Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '2rem'
          }}>
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary"
            >
              <RotateCcw size={16} />
              Reset Form
            </button>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ minWidth: '240px', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <Eye size={18} />
              {generatedDoc ? 'Update & Re-generate Preview' : 'Generate & Preview NOC Letter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
