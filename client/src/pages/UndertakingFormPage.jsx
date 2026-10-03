import React, { useState, useEffect } from 'react';
import { 
  User, 
  Briefcase, 
  Phone, 
  FileText, 
  RotateCcw, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft,
  Calendar,
  Building,
  Mail,
  School,
  Download,
  Printer,
  Edit3,
  Layers,
  Award,
  Clock,
  CheckCircle,
  FileCheck2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { FormInput } from '../components/common/FormInput';
import { FormSelect } from '../components/common/FormSelect';
import { StepIndicator } from '../components/common/StepIndicator';
import { validateUndertakingForm } from '../utils/validation';
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
import { UndertakingTemplate } from '../templates/UndertakingTemplate';
import { Toast } from '../components/common/Toast';
import { ROLES } from '../utils/auth';

const INITIAL_STATE = {
  studentName: '',
  salutation: 'Mr.',
  className: '',
  rollNumber: '',
  enrollmentNumber: '',
  department: 'Department of Computer Science & Engineering',
  universityName: 'MIT Art, Design and Technology University, Pune',
  schoolName: 'School of Computing',
  
  companyName: '',
  internshipRole: '',
  duration: '6 Months',
  startDate: '',
  endDate: '',
  location: '',
  
  contactNumber: '',
  email: '',
  
  documentDate: new Date().toISOString().split('T')[0],
  mentorName: ''
};

export const UndertakingFormPage = ({ 
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

  const [generatedDoc, setGeneratedDoc] = useState(() => loadGeneratedDocument('undertaking', studentKey));
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState(() => {
    const savedGen = loadGeneratedDocument('undertaking', studentKey);
    if (savedGen?.data) {
      return initialData ? { ...savedGen.data, ...initialData } : savedGen.data;
    }
    const saved = loadFormData('undertaking', INITIAL_STATE);
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
    saveFormData('undertaking', formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all fields in the Undertaking form?")) {
      setFormData(INITIAL_STATE);
      clearFormData('undertaking');
      clearGeneratedDocument('undertaking', studentKey);
      setGeneratedDoc(null);
      setIsEditing(false);
      setErrors({});
      setSaveStatus('Form reset.');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateUndertakingForm(formData);
    
    if (!isValid) {
      setErrors(validationErrors);
      const firstErrorField = Object.keys(validationErrors)[0];
      const el = document.getElementById(firstErrorField);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const saved = saveGeneratedDocument('undertaking', studentKey, formData);
    setGeneratedDoc(saved);
    setIsEditing(false);
    onGeneratePreview('undertaking', formData);
  };

  const handleDirectDownload = async () => {
    setIsDownloading(true);
    try {
      const targetElement = document.getElementById('undertaking-hidden-download-element');
      if (!targetElement) {
        throw new Error("Target template element not found");
      }
      const studentNameClean = ((generatedDoc?.data || formData).studentName || 'Student').replace(/\s+/g, '_');
      const filename = `Internship_Undertaking_${studentNameClean}`;
      await downloadDocumentPDF(targetElement, filename);
      setToast({
        type: 'success',
        message: 'Internship Undertaking PDF downloaded successfully!'
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
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <FileText size={30} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.75rem' }}>
              🔒 Undertaking Generation Locked
            </h2>
            <p style={{ color: 'var(--slate-600)', maxWidth: '500px', margin: '0 auto 1.75rem auto', lineHeight: 1.6 }}>
              {hasSubmittedApp 
                ? 'Your internship application is currently under review with your assigned Faculty Coordinator. Official Undertaking letters can be generated once approved.'
                : 'You must submit your Internship Application (Step 1) and receive Faculty Coordinator approval before generating the official Undertaking.'}
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

  // 2nd Time Onwards View: If Undertaking is already generated and student is not in edit mode
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
          <div id="undertaking-hidden-download-element">
            <UndertakingTemplate data={docData} />
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
                <FileCheck2 size={30} />
              </div>

              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                  <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#15803d', fontWeight: 800, fontSize: '0.75rem' }}>
                    DOC-MIT-UT-01 • OFFICIAL
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                    🕒 Generated: {formattedDate}
                  </span>
                </div>

                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--purple-950)', margin: '0 0 0.4rem 0' }}>
                  Internship Undertaking Generated
                </h1>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem', margin: 0, lineHeight: 1.5 }}>
                  Your official <strong>Internship Undertaking Document</strong> has been generated and saved. You can download the high-resolution printable PDF, preview with full zoom & print options, or edit fields if any details need updating.
                </p>
              </div>
            </div>
          </div>

          {/* Document Summary Overview Card */}
          <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem', border: '1px solid var(--sidebar-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--purple-950)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={18} color="var(--purple-600)" />
                Generated Document Summary
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                Single Page A4 Format
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
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 700, textTransform: 'uppercase' }}>Company & Location</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--purple-950)', marginTop: '0.2rem' }}>
                  {docData.companyName}
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)', marginTop: '0.1rem' }}>
                  📍 {docData.location || 'Maharashtra, India'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 700, textTransform: 'uppercase' }}>Role & Duration</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--purple-950)', marginTop: '0.2rem' }}>
                  {docData.internshipRole || 'Engineering Intern'}
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)', marginTop: '0.1rem' }}>
                  ⏱️ {docData.duration || '6 Months'} ({docData.startDate} → {docData.endDate})
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 700, textTransform: 'uppercase' }}>Academic Unit</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--purple-950)', marginTop: '0.2rem' }}>
                  {docData.className || 'Semester VIII (Final Year)'}
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)', marginTop: '0.1rem' }}>
                  {docData.department}
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
                  1. Download Undertaking
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--slate-600)', margin: '0 0 1.25rem 0', lineHeight: 1.4 }}>
                  Export the official Undertaking as an exact single-page A4 PDF file ready for physical submission.
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
                  Open the full interactive A4 view with browser print dialog, watermark adjustments, and zoom tools.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onGeneratePreview('undertaking', docData)}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', fontWeight: 700 }}
              >
                <Eye size={16} />
                Preview Document
              </button>
            </div>

            {/* Option 3: Edit Undertaking */}
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
                  3. Edit Undertaking
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--slate-600)', margin: '0 0 1.25rem 0', lineHeight: 1.4 }}>
                  Need to modify company name, dates, or contact details? Open the full form to update and re-generate.
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

        {/* Back Button & Header */}
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
                  Editing Previously Generated Undertaking
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
            <span className="badge badge-primary">Form Entry</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>DOC-MIT-UT-01</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            {generatedDoc && isEditing ? 'Edit Internship Undertaking Form' : 'Internship Undertaking Form'}
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem' }}>
            Fill in your personal, academic, company, and internship details to generate the official undertaking letter.
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
          {/* Section 1: Student Information */}
          <div className="form-section-card">
            <div className="form-section-header">
              <div className="form-section-icon">
                <User size={20} />
              </div>
              <div>
                <h3 className="form-section-title">Section 1: Student Information</h3>
                <p className="form-section-desc">Personal and academic identification credentials</p>
              </div>
            </div>

            <div className="form-grid-3">
              <div style={{ gridColumn: 'span 1' }}>
                <FormSelect
                  label="Salutation / Gender"
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
                label="Class / Year & Specialization"
                name="className"
                value={formData.className}
                onChange={handleChange}
                placeholder="e.g. B.Tech Final Year (CSE)"
                required
                error={errors.className}
                icon={School}
              />

              <FormInput
                label="Roll Number"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="e.g. CS2022-084"
                required
                error={errors.rollNumber}
              />
            </div>

            <div className="form-grid-2">
              <FormInput
                label="Enrollment / PRN Number"
                name="enrollmentNumber"
                value={formData.enrollmentNumber}
                onChange={handleChange}
                placeholder="e.g. MITADT2022CS084"
                required
                error={errors.enrollmentNumber}
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
            </div>

            <FormInput
              label="University Name"
              name="universityName"
              value={formData.universityName}
              onChange={handleChange}
              placeholder="e.g. MIT Art, Design and Technology University, Pune"
              required
              error={errors.universityName}
            />
          </div>

          {/* Section 2: Internship Information */}
          <div className="form-section-card">
            <div className="form-section-header">
              <div className="form-section-icon">
                <Briefcase size={20} />
              </div>
              <div>
                <h3 className="form-section-title">Section 2: Internship Information</h3>
                <p className="form-section-desc">Host organization, role, duration, and dates</p>
              </div>
            </div>

            <div className="form-grid-2">
              <FormInput
                label="Company / Organization Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. Google India Private Limited"
                required
                error={errors.companyName}
                icon={Building}
              />

              <FormInput
                label="Internship Role / Designation"
                name="internshipRole"
                value={formData.internshipRole}
                onChange={handleChange}
                placeholder="e.g. Software Engineering Intern"
                required
                error={errors.internshipRole}
              />
            </div>

            <div className="form-grid-3">
              <FormInput
                label="Internship Duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 6 Months"
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

            <FormInput
              label="Internship Location / Mode"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bangalore / Hybrid / Remote"
              required
              error={errors.location}
            />
          </div>

          {/* Section 3: Contact Information */}
          <div className="form-section-card">
            <div className="form-section-header">
              <div className="form-section-icon">
                <Phone size={20} />
              </div>
              <div>
                <h3 className="form-section-title">Section 3: Contact Information</h3>
                <p className="form-section-desc">Student contact details for university records</p>
              </div>
            </div>

            <div className="form-grid-2">
              <FormInput
                label="Student Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                required
                error={errors.contactNumber}
                icon={Phone}
                helperText="10-digit mobile number"
              />

              <FormInput
                label="Student Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. shubham.alapure@mitadt.edu.in"
                required
                error={errors.email}
                icon={Mail}
                helperText="Official university or personal email"
              />
            </div>
          </div>

          {/* Section 4: Document Information */}
          <div className="form-section-card">
            <div className="form-section-header">
              <div className="form-section-icon">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="form-section-title">Section 4: Document & Mentor Information</h3>
                <p className="form-section-desc">Date of undertaking and designated faculty mentor</p>
              </div>
            </div>

            <div className="form-grid-2">
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

              <FormInput
                label="Academic Mentor Name"
                name="mentorName"
                value={formData.mentorName}
                onChange={handleChange}
                placeholder="e.g. Dr. Rajesh K. Sharma"
                required
                error={errors.mentorName}
                icon={User}
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
              {generatedDoc ? 'Update & Re-generate Preview' : 'Generate & Preview Undertaking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
