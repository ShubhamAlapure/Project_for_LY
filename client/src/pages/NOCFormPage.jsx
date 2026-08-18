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
  FileCheck
} from 'lucide-react';
import { FormInput } from '../components/common/FormInput';
import { FormSelect } from '../components/common/FormSelect';
import { FormTextarea } from '../components/common/FormTextarea';
import { StepIndicator } from '../components/common/StepIndicator';
import { validateNOCForm } from '../utils/validation';
import { saveFormData, loadFormData, clearFormData } from '../utils/storage';
import { SAMPLE_DATA } from '../data/sampleData';
import { calculateInternshipDuration } from '../utils/supabaseClient';

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

export const NOCFormPage = ({ onGeneratePreview, onBack, initialData }) => {
  const [formData, setFormData] = useState(() => {
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

  const handleLoadSample = () => {
    setFormData(SAMPLE_DATA.noc);
    setErrors({});
    setSaveStatus('NOC sample data loaded successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all fields in the NOC form?")) {
      setFormData(INITIAL_STATE);
      clearFormData('noc');
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

    onGeneratePreview('noc', formData);
  };

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
              onClick={handleLoadSample}
              className="btn btn-secondary btn-sm"
              style={{
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-700)',
                borderColor: 'var(--primary-200)'
              }}
            >
              <Sparkles size={15} />
              Load Sample Data
            </button>

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

        {/* Header Title */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-neutral">Certificate Entry</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>DOC-MIT-NOC-02</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            No Objection Certificate (NOC) Form
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
              className="btn btn-dark btn-lg"
              style={{ minWidth: '220px' }}
            >
              <Eye size={18} />
              Preview NOC Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
