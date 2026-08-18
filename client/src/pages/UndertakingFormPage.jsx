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
  School
} from 'lucide-react';
import { FormInput } from '../components/common/FormInput';
import { FormSelect } from '../components/common/FormSelect';
import { StepIndicator } from '../components/common/StepIndicator';
import { validateUndertakingForm } from '../utils/validation';
import { saveFormData, loadFormData, clearFormData } from '../utils/storage';
import { SAMPLE_DATA } from '../data/sampleData';

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

export const UndertakingFormPage = ({ onGeneratePreview, onBack, initialData }) => {
  const [formData, setFormData] = useState(() => {
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

  const handleLoadSample = () => {
    setFormData(SAMPLE_DATA.undertaking);
    setErrors({});
    setSaveStatus('Sample data loaded successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all fields in the Undertaking form?")) {
      setFormData(INITIAL_STATE);
      clearFormData('undertaking');
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
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const el = document.getElementById(firstErrorField);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    onGeneratePreview('undertaking', formData);
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
            <span className="badge badge-primary">Form Entry</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>DOC-MIT-UT-01</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            Internship Undertaking Form
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
              style={{ minWidth: '220px' }}
            >
              <Eye size={18} />
              Preview Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
