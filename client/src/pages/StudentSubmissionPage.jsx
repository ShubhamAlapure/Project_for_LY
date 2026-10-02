import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Building, 
  Calendar, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  ShieldCheck, 
  Briefcase, 
  Award,
  AlertCircle,
  FileCheck2,
  Clock,
  ExternalLink,
  Eye,
  Trash2,
  Database,
  UserCheck,
  Lock
} from 'lucide-react';
import { calculateInternshipDuration, insertStudentRecord, uploadStudentDocument, fetchStudentRecords } from '../utils/supabaseClient';
import { DocumentPreviewModal } from '../components/common/DocumentPreviewModal';
import { getFacultyCoordinators } from '../utils/auth';

// Sample Valid Base64 PDF Data for demo testing
const SAMPLE_OFFER_LETTER_PDF = "data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwgL0xlbmd0aCA1IDAgUiAvRmlsdGVyIC9GbGF0ZURlY29kZSA+PgpzdHJlYW0KeJwrVAgwsjI1MTcw1TMBcQwNzCwsTS0M9IwNDM0sgEw9Awv9gILk1FwFfQWwZGBgAABWkgmXCgplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKNzgKZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAzIDAgUiAvUmVzb3VyY2VzIDYgMCBSIC9Db250ZW50cyA0IDAgUiAvTWVkaWFCb3ggWzAgMCA1OTUgODQyXSA+PgplbmRvYmoKNiAwIG9iago8PCAvUHJvY1NldCBbIC9QREYgL1RleHQgXSA+PgplbmRvYmoKMyAwIG9iago8PCAvVHlwZSAvUGFnZXMgL0tpZHMgWyAyIDAgUiBdIC9Db3VudCAxID4+CmVuZG9iagoxIDAgb2JqCjw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAzIDAgUiA+PgplbmRvYmoKMAp0cmFpbGVyCjw8IC9Sb290IDEgMCBSID4+CiUlRU9G";

const INITIAL_FORM = {
  // 1. Date of entry/submission
  submission_date: new Date().toISOString().split('T')[0],
  // 2. Email ID
  email: '',
  // 3. Contact No.
  contact_no: '',
  // 4. Enrolment No.
  enrolment_no: '',
  // 5. Full Name
  full_name: '',
  // 6. Gender
  gender: 'Male',
  // 7. Specialization
  specialization: 'CSE-CORE',
  // 8. Class / Division
  class_division: '',
  // 9. Semester
  semester: 'Semester VIII (Final Year)',
  // 9. Source of Internship
  source_of_internship: 'College Placement Cell / Central T&P',
  // 10. Start Date
  start_date: '',
  // 11. End Date
  end_date: '',
  // Duration (calculated automatically)
  duration: '',
  // 12. Name of Company + City
  company_name_and_city: '',
  // 13. Mode of Internship
  mode_of_internship: 'Offline',
  // 14. Domain of Company
  domain_of_company: 'Information Technology (IT) / Software',
  // 15. Whether this is an Offer/PPO
  is_ppo_offer: 'Yes (PPO Possibility)',
  // 16. Upload Valid Offer Letter
  offer_letter_url: '',
  // 17. Internship Completion Letter
  completion_letter_url: '',
  // 18. Assigned Faculty Coordinator
  assigned_coordinator: 'Prof. Vaibhav Sawalkar',
  assigned_faculty_email: 'vaibhav.sawalkar@mituniversity.edu.in',
  notes: ''
};

const SAMPLE_STUDENT_RECORD = {
  submission_date: new Date().toISOString().split('T')[0],
  email: 'shubham.alapure@mitadt.edu.in',
  contact_no: '9876543210',
  enrolment_no: 'MITADT2022CS084',
  full_name: 'Shubham Santosh Alapure',
  gender: 'Male',
  specialization: 'Computer Science & Engineering (CSE)',
  semester: 'Semester VIII (Final Year)',
  source_of_internship: 'College Placement Cell / Central T&P',
  start_date: '2026-01-05',
  end_date: '2026-06-30',
  duration: '6 Months (176 Days)',
  company_name_and_city: 'Google Cloud Platform, Bangalore',
  mode_of_internship: 'Hybrid',
  domain_of_company: 'Cloud Computing & Artificial Intelligence',
  is_ppo_offer: 'Yes (PPO Possibility)',
  offer_letter_url: SAMPLE_OFFER_LETTER_PDF,
  completion_letter_url: '',
  assigned_coordinator: 'Prof. Vaibhav Sawalkar',
  assigned_faculty_email: 'vaibhav.sawalkar@mituniversity.edu.in',
  notes: 'Eligible for 8th semester credits after completion evaluation.'
};

export const StudentSubmissionPage = ({ onNavigate, onPrefillDocument, authUser, onApplicationSubmitted }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [facultyList, setFacultyList] = useState([]);
  const [offerFile, setOfferFile] = useState(null);
  const [completionFile, setCompletionFile] = useState(null);
  const [offerFileName, setOfferFileName] = useState('');
  const [completionFileName, setCompletionFileName] = useState('');
  const [uploadingOffer, setUploadingOffer] = useState(false);
  const [uploadingCompletion, setUploadingCompletion] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState(null);
  const [notification, setNotification] = useState(null);

  // PDF Preview Modal State
  const [previewingDoc, setPreviewingDoc] = useState({
    isOpen: false,
    url: '',
    title: '',
    studentName: ''
  });

  // Automatically load existing record for logged in student
  useEffect(() => {
    const loadStudentExistingData = async () => {
      if (!authUser) return;
      
      const userEmail = authUser.email?.toLowerCase();
      const userEnroll = authUser.enrolment_no?.toLowerCase();
      const userName = authUser.full_name?.toLowerCase();
      
      const { data: recordsList } = await fetchStudentRecords();
      
      if (recordsList && recordsList.length > 0) {
        const found = recordsList.find(r => 
          (r.email && userEmail && r.email.toLowerCase() === userEmail) ||
          (r.enrolment_no && userEnroll && r.enrolment_no.toLowerCase() === userEnroll) ||
          (r.full_name && userName && r.full_name.toLowerCase().includes(userName))
        );

        if (found) {
          setFormData(prev => ({
            ...INITIAL_FORM,
            ...found
          }));
          setIsEditingExisting(true);
          if (found.offer_letter_url) setOfferFileName('Verified_Offer_Letter.pdf');
          if (found.completion_letter_url) setCompletionFileName('Verified_Completion_Certificate.pdf');
          return;
        }
      }

      // Pre-fill student profile details if new
      if (authUser.role === 'Student') {
        let detectedClass = '';
        if (authUser.designation && authUser.designation.includes('(') && authUser.designation.includes(')')) {
          detectedClass = authUser.designation.split('(')[1].split(')')[0].trim();
        }
        setFormData(prev => ({
          ...prev,
          full_name: authUser.full_name || '',
          email: authUser.email || '',
          contact_no: authUser.phone || '',
          enrolment_no: authUser.enrolment_no || '',
          class_division: prev.class_division || detectedClass || ''
        }));
      }
    };

    loadStudentExistingData();
  }, [authUser]);

  // Load faculty coordinators list on component mount
  useEffect(() => {
    const loadFaculty = async () => {
      const list = await getFacultyCoordinators();
      if (list && list.length > 0) {
        setFacultyList(list);
        setFormData(prev => ({
          ...prev,
          assigned_coordinator: prev.assigned_coordinator || list[0].full_name,
          assigned_faculty_email: prev.assigned_faculty_email || list[0].email
        }));
      }
    };
    loadFaculty();
  }, []);

  // Recalculate duration automatically whenever start_date or end_date changes
  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const computedDuration = calculateInternshipDuration(formData.start_date, formData.end_date);
      setFormData(prev => ({ ...prev, duration: computedDuration }));
    }
  }, [formData.start_date, formData.end_date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleOfferFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setOfferFile(file);
    setOfferFileName(file.name);
    
    // Automatically upload to Supabase Storage or persistent Data URL
    setUploadingOffer(true);
    const uploadRes = await uploadStudentDocument(file, 'offer-letters');
    setUploadingOffer(false);

    if (uploadRes.success) {
      setFormData(prev => ({ ...prev, offer_letter_url: uploadRes.publicUrl }));
      setNotification({ type: 'success', message: 'Offer Letter uploaded & PDF preview ready!' });
      setTimeout(() => setNotification(null), 3000);
    } else {
      setNotification({ type: 'error', message: 'Upload failed: ' + (uploadRes.error || 'Please try again') });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleCompletionFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCompletionFile(file);
    setCompletionFileName(file.name);

    // Automatically upload to Supabase Storage or persistent Data URL
    setUploadingCompletion(true);
    const uploadRes = await uploadStudentDocument(file, 'completion-letters');
    setUploadingCompletion(false);

    if (uploadRes.success) {
      setFormData(prev => ({ 
        ...prev, 
        completion_letter_url: uploadRes.publicUrl,
        status: 'Completed'
      }));
      setNotification({ type: 'success', message: 'Completion Letter attached & PDF preview ready!' });
      setTimeout(() => setNotification(null), 3000);
    } else {
      setNotification({ type: 'error', message: 'Upload failed: ' + (uploadRes.error || 'Please try again') });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleLoadSample = () => {
    setFormData(SAMPLE_STUDENT_RECORD);
    setOfferFileName('Google_Offer_Letter_2026.pdf');
    setErrors({});
    setNotification({ type: 'success', message: 'Sample student record loaded with Offer Letter PDF!' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleReset = () => {
    if (window.confirm("Reset all fields in the Student Internship form?")) {
      setFormData(INITIAL_FORM);
      setOfferFile(null);
      setOfferFileName('');
      setCompletionFile(null);
      setCompletionFileName('');
      setIsEditingExisting(false);
      setErrors({});
      setSubmittedRecord(null);
      setNotification({ type: 'info', message: 'Form reset.' });
      setTimeout(() => setNotification(null), 2500);
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.full_name?.trim()) errs.full_name = "Full Name is required.";
    if (!formData.email?.trim()) {
      errs.email = "Email ID is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (!formData.contact_no?.trim()) {
      errs.contact_no = "Contact Number is required.";
    } else if (!/^[0-9+\-\s]{8,15}$/.test(formData.contact_no.trim())) {
      errs.contact_no = "Please enter a valid phone number (10 digits).";
    }
    if (!formData.enrolment_no?.trim()) errs.enrolment_no = "Enrollment Number is required.";
    if (!formData.specialization?.trim()) errs.specialization = "Specialization is required.";
    if (!formData.semester?.trim()) errs.semester = "Semester is required.";
    if (!formData.company_name_and_city?.trim()) errs.company_name_and_city = "Company Name + City is required.";
    if (!formData.start_date) errs.start_date = "Internship Start Date is required.";
    if (!formData.end_date) errs.end_date = "Internship End Date is required.";
    if (formData.start_date && formData.end_date && new Date(formData.end_date) < new Date(formData.start_date)) {
      errs.end_date = "End date cannot be earlier than start date.";
    }
    if (!formData.assigned_coordinator?.trim()) {
      errs.assigned_coordinator = "Please select a Faculty Coordinator to review your application.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstField = Object.keys(errors)[0] || 'full_name';
      const el = document.getElementById(firstField);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setNotification({ type: 'error', message: 'Please fill in all mandatory fields correctly.' });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    setIsSubmitting(true);
    const res = await insertStudentRecord(formData);
    setIsSubmitting(false);

    if (res.success) {
      const created = res.data && res.data[0] ? res.data[0] : formData;
      setSubmittedRecord(created);
      setIsEditingExisting(true);
      if (onApplicationSubmitted) {
        onApplicationSubmitted(created);
      }
      setNotification({ 
        type: 'success', 
        message: `Application submitted & routed to ${formData.assigned_coordinator || 'your Faculty Coordinator'}!` 
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setNotification({ type: 'error', message: 'Database notice: ' + (res.error || 'Saved locally') });
    }
  };

  // Quick document generators using this student record
  const handleGenerateUndertaking = () => {
    const data = submittedRecord || formData;
    if (onPrefillDocument) {
      onPrefillDocument('undertaking', {
        studentName: data.full_name,
        className: data.class_division || data.className || data.semester || 'Semester VIII (Final Year)',
        rollNumber: data.enrolment_no?.slice(-7) || 'CS2022-084',
        enrollmentNumber: data.enrolment_no,
        contactNumber: data.contact_no,
        email: data.email,
        companyName: data.company_name_and_city,
        internshipRole: `Intern - ${data.domain_of_company || 'Engineering'}`,
        startDate: data.start_date,
        endDate: data.end_date,
        duration: data.duration || '6 Months',
        location: data.company_name_and_city,
        department: `Department of ${data.specialization || 'Computer Science & Engineering'}`,
        universityName: 'MIT Art, Design and Technology University, Pune',
        schoolName: 'School of Computing'
      });
    }
  };

  const handleGenerateNOC = () => {
    const data = submittedRecord || formData;
    if (onPrefillDocument) {
      onPrefillDocument('noc', {
        studentName: data.full_name,
        rollNumber: data.enrolment_no?.slice(-7) || 'CS2022-084',
        enrollmentNumber: data.enrolment_no,
        course: `B.Tech in ${data.specialization || 'Computer Science & Engineering'}`,
        department: data.specialization || 'Computer Science & Engineering',
        className: data.class_division || data.className || data.semester || 'Semester VIII (Final Year)',
        companyName: data.company_name_and_city.split(',')[0] || data.company_name_and_city,
        companyLocation: data.company_name_and_city.split(',')[1]?.trim() || data.company_name_and_city,
        internshipRole: `Intern - ${data.domain_of_company || 'Engineering'}`,
        startDate: data.start_date,
        endDate: data.end_date,
        duration: data.duration || '6 Months'
      });
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem 0 4rem 0', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: notification.type === 'error' ? '#ef4444' : '#10b981',
          color: 'white',
          fontWeight: 600,
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          {notification.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* PDF Document Preview Modal */}
      <DocumentPreviewModal 
        isOpen={previewingDoc.isOpen}
        onClose={() => setPreviewingDoc(prev => ({ ...prev, isOpen: false }))}
        documentUrl={previewingDoc.url}
        documentTitle={previewingDoc.title}
        studentName={previewingDoc.studentName}
      />

      {/* Header Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.75rem 2rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--sidebar-border)',
        boxShadow: 'var(--shadow-xs)',
        marginBottom: '1.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Database size={12} />
              Supabase Connected
            </span>
            {isEditingExisting && (
              <span style={{ fontSize: '0.75rem', color: '#15803d', backgroundColor: '#dcfce7', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                ● Editing Registered Record
              </span>
            )}
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 600 }}>
              Table: student_internships (17 Fields)
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--purple-950)', margin: 0 }}>
            {isEditingExisting ? 'Update Internship Application & Documents' : 'Student Internship Registration'}
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            {isEditingExisting 
              ? 'Update your industrial training details, attach completion certificate, or replace your offer letter.' 
              : 'Submit and store complete student industrial training records with offer verification in Supabase.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleLoadSample}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Sparkles size={15} color="var(--purple-600)" />
            Load Sample Record
          </button>
          <button
            type="button"
            onClick={() => onNavigate('student-records')}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Database size={15} />
            View All DB Records
          </button>
        </div>
      </div>

      {/* Submission Success Box */}
      {submittedRecord && (
        <div className="card animate-fade-in" style={{
          padding: '1.75rem',
          backgroundColor: '#f0fdf4',
          border: '1.5px solid #86efac',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: '#16a34a',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <CheckCircle2 size={26} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#166534', margin: 0 }}>
                  Application Submitted & Routed to Faculty Coordinator!
                </h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#dcfce7', color: '#15803d', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                  Status: Submitted (Pending Verification)
                </span>
              </div>
              
              <p style={{ fontSize: '0.9rem', color: '#166534', marginTop: '0.4rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                Your internship details for <strong>{submittedRecord.company_name_and_city}</strong> have been saved to Supabase and forwarded to <strong>{submittedRecord.assigned_coordinator || 'your assigned Faculty Coordinator'}</strong> for review, approval, or rejection. Other portal modules (Submission Status, Undertaking, NOC) are now unlocked for you!
              </p>

              {/* Quick Action Buttons to Generate Documents */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => onNavigate('student-records')}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#15803d' }}
                >
                  <Database size={15} />
                  View My Application Status
                </button>

                <button
                  type="button"
                  onClick={handleGenerateUndertaking}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <FileCheck2 size={16} />
                  Auto-fill Undertaking
                </button>

                <button
                  type="button"
                  onClick={handleGenerateNOC}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Award size={16} />
                  Auto-fill NOC Letter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main 17 Fields Form */}
      <form onSubmit={handleSubmit}>
        {/* ==================================================================== */}
        {/* SECTION 1: Student Academic & Contact Details (Fields 1 to 8) */}
        {/* ==================================================================== */}
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.75rem' }}>
            <User size={20} color="var(--purple-600)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', margin: 0 }}>
              1. Student Academic & Contact Details
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Field 1: Date of Entry / Submission */}
            <div>
              <label className="form-label" htmlFor="submission_date">
                1. Date of Entry / Submission <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                id="submission_date"
                name="submission_date"
                value={formData.submission_date}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {/* Field 5: Full Name */}
            <div>
              <label className="form-label" htmlFor="full_name">
                5. Student Full Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                placeholder="e.g. Shubham Santosh Alapure"
                value={formData.full_name}
                onChange={handleChange}
                className={`form-input ${errors.full_name ? 'is-invalid' : ''}`}
                required
              />
              {errors.full_name && <span className="form-error">{errors.full_name}</span>}
            </div>

            {/* Field 4: Enrolment No. */}
            <div>
              <label className="form-label" htmlFor="enrolment_no">
                4. Enrolment No. <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="enrolment_no"
                name="enrolment_no"
                placeholder="e.g. MITADT2022CS084"
                value={formData.enrolment_no}
                onChange={handleChange}
                className={`form-input ${errors.enrolment_no ? 'is-invalid' : ''}`}
                required
              />
              {errors.enrolment_no && <span className="form-error">{errors.enrolment_no}</span>}
            </div>

            {/* Field 2: Email ID */}
            <div>
              <label className="form-label" htmlFor="email">
                2. Email ID (College / Personal) <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="student@mitadt.edu.in"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'is-invalid' : ''}`}
                required
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {/* Field 3: Contact No. */}
            <div>
              <label className="form-label" htmlFor="contact_no">
                3. Contact No. <span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                id="contact_no"
                name="contact_no"
                placeholder="e.g. 9876543210"
                value={formData.contact_no}
                onChange={handleChange}
                className={`form-input ${errors.contact_no ? 'is-invalid' : ''}`}
                required
              />
              {errors.contact_no && <span className="form-error">{errors.contact_no}</span>}
            </div>

            {/* Field 6: Gender */}
            <div>
              <label className="form-label" htmlFor="gender">
                6. Gender <span className="text-danger">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other / Prefer not to say</option>
              </select>
            </div>

            {/* Field 7: Specialization / Branch */}
            <div>
              <label className="form-label" htmlFor="specialization">
                7. Specialization / Branch <span className="text-danger">*</span>
              </label>
              <select
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="CSE-CORE">CSE-CORE</option>
                <option value="CSE-BLOCKCHAIN">CSE-BLOCKCHAIN</option>
                <option value="CSE-AIA">CSE-AIA</option>
                <option value="CSE-AIEC">CSE-AIEC</option>
                <option value="CSE-CC">CSE-CC</option>
                <option value="CSE-BDCE">CSE-BDCE</option>
                <option value="CSE-CSF">CSE-CSF</option>
                <option value="IT-CORE">IT-CORE</option>
                <option value="IT-DATA ANALYTICS">IT-DATA ANALYTICS</option>
                <option value="IT-SOFTWARE & MOBILE APP">IT-SOFTWARE & MOBILE APP</option>
              </select>
            </div>

            {/* Field 8: Class / Division */}
            <div>
              <label className="form-label" htmlFor="class_division">
                8. Class / Division <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="class_division"
                name="class_division"
                placeholder="e.g. LY-AIA-1, TY-CSE-2"
                value={formData.class_division || ''}
                onChange={handleChange}
                className={`form-input ${errors.class_division ? 'is-invalid' : ''}`}
                required
              />
              {errors.class_division && <span className="form-error">{errors.class_division}</span>}
            </div>

            {/* Field 9: Current Semester */}
            <div>
              <label className="form-label" htmlFor="semester">
                9. Current Semester <span className="text-danger">*</span>
              </label>
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="Semester VIII (Final Year)">Semester VIII (Final Year)</option>
                <option value="Semester VII (Final Year)">Semester VII (Final Year)</option>
                <option value="Semester VI (Third Year)">Semester VI (Third Year)</option>
                <option value="Semester V (Third Year)">Semester V (Third Year)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SECTION 2: Internship & Company Information (Fields 9, 12, 13, 14, 15) */}
        {/* ==================================================================== */}
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.75rem' }}>
            <Building size={20} color="var(--purple-600)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', margin: 0 }}>
              2. Internship & Organization Profile
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Field 12: Name of Company + City */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label" htmlFor="company_name_and_city">
                12. Name of Company + City <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="company_name_and_city"
                name="company_name_and_city"
                placeholder="e.g. Google India Private Limited, Bangalore OR TCS, Pune"
                value={formData.company_name_and_city}
                onChange={handleChange}
                className={`form-input ${errors.company_name_and_city ? 'is-invalid' : ''}`}
                required
              />
              {errors.company_name_and_city && <span className="form-error">{errors.company_name_and_city}</span>}
            </div>

            {/* Field 14: Domain of Company */}
            <div>
              <label className="form-label" htmlFor="domain_of_company">
                14. Domain of Company <span className="text-danger">*</span>
              </label>
              <select
                id="domain_of_company"
                name="domain_of_company"
                value={formData.domain_of_company}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Information Technology (IT) / Software">Information Technology (IT) / Software</option>
                <option value="Cloud Computing & Artificial Intelligence">Cloud Computing & Artificial Intelligence</option>
                <option value="FinTech & Banking">FinTech & Banking</option>
                <option value="Healthcare & BioTech">Healthcare & BioTech</option>
                <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                <option value="Manufacturing & Automotive">Manufacturing & Automotive</option>
                <option value="Cybersecurity & Defense">Cybersecurity & Defense</option>
                <option value="EdTech & Education">EdTech & Education</option>
                <option value="Consulting & Strategy">Consulting & Strategy</option>
              </select>
            </div>

            {/* Field 9: Source of Internship */}
            <div>
              <label className="form-label" htmlFor="source_of_internship">
                9. Source of Internship <span className="text-danger">*</span>
              </label>
              <select
                id="source_of_internship"
                name="source_of_internship"
                value={formData.source_of_internship}
                onChange={handleChange}
                className="form-select"
              >
                <option value="College Placement Cell / Central T&P">College Placement Cell / Central T&P</option>
                <option value="LinkedIn Job / InMail">LinkedIn Job / InMail</option>
                <option value="Company Official Career Portal">Company Official Career Portal</option>
                <option value="Alumni / Employee Referral">Alumni / Employee Referral</option>
                <option value="Hackathon / Competition Winner">Hackathon / Competition Winner</option>
                <option value="Off-Campus Drive">Off-Campus Drive</option>
                <option value="Direct Outreach / Cold Email">Direct Outreach / Cold Email</option>
              </select>
            </div>

            {/* Field 13: Mode of Internship */}
            <div>
              <label className="form-label" htmlFor="mode_of_internship">
                13. Mode of Internship <span className="text-danger">*</span>
              </label>
              <select
                id="mode_of_internship"
                name="mode_of_internship"
                value={formData.mode_of_internship}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Offline">Offline (On-Site / Office)</option>
                <option value="Hybrid">Hybrid (Office + Remote)</option>
                <option value="Online">Online (Virtual / WFH)</option>
              </select>
            </div>

            {/* Field 15: Whether this is an Offer/PPO */}
            <div>
              <label className="form-label" htmlFor="is_ppo_offer">
                15. Whether this is an Offer / PPO <span className="text-danger">*</span>
              </label>
              <select
                id="is_ppo_offer"
                name="is_ppo_offer"
                value={formData.is_ppo_offer}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Yes (PPO Possibility)">Yes (Comes with Pre-Placement Offer possibility)</option>
                <option value="Performance-Based PPO">Performance-Based PPO Conversion</option>
                <option value="Direct Full-Time + Internship">Direct Full-Time + Internship Offer</option>
                <option value="No (Internship Only)">No (Internship Tenure Only)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SECTION 3: Tenure & Automatic Duration (Fields 10, 11 + Duration) */}
        {/* ==================================================================== */}
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.75rem' }}>
            <Calendar size={20} color="var(--purple-600)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', margin: 0 }}>
              3. Internship Tenure & Duration Calculation
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', alignItems: 'flex-start' }}>
            {/* Field 10: Start Date */}
            <div>
              <label className="form-label" htmlFor="start_date">
                10. Internship Start Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className={`form-input ${errors.start_date ? 'is-invalid' : ''}`}
                required
              />
              {errors.start_date && <span className="form-error">{errors.start_date}</span>}
            </div>

            {/* Field 11: End Date */}
            <div>
              <label className="form-label" htmlFor="end_date">
                11. Internship End Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className={`form-input ${errors.end_date ? 'is-invalid' : ''}`}
                required
              />
              {errors.end_date && <span className="form-error">{errors.end_date}</span>}
            </div>

            {/* Automatic Calculated Duration Display */}
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} color="var(--purple-600)" />
                Calculated Duration (Automatic)
              </label>
              <div style={{
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 1rem',
                backgroundColor: formData.duration ? 'var(--purple-50)' : 'var(--slate-100)',
                border: '1px solid',
                borderColor: formData.duration ? 'var(--purple-300)' : 'var(--slate-200)',
                borderRadius: 'var(--radius-md)',
                color: formData.duration ? 'var(--purple-950)' : 'var(--slate-400)',
                fontWeight: 700,
                fontSize: '0.925rem'
              }}>
                {formData.duration || 'Pick Start & End Date to Calculate'}
              </div>
              <p style={{ fontSize: '0.725rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                ⚡ Automatically computed in months & days from start/end dates.
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SECTION 4: Document Uploads & Verification (Fields 16 & 17) */}
        {/* ==================================================================== */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.75rem' }}>
            <UploadCloud size={20} color="var(--purple-600)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', margin: 0 }}>
              4. Document Uploads & Storage Verification
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Field 16: Upload Valid Offer Letter */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className="form-label" style={{ fontWeight: 700, margin: 0 }}>
                  16. Valid Offer Letter (PDF / Document) <span className="text-danger">*</span>
                </label>
                {formData.offer_letter_url && (
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#15803d', backgroundColor: '#dcfce7', padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-full)' }}>
                    ✓ Attached
                  </span>
                )}
              </div>

              <div style={{
                border: '2px dashed var(--purple-300)',
                backgroundColor: formData.offer_letter_url ? '#f0fdf4' : 'var(--purple-50)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                textAlign: 'center',
                position: 'relative'
              }}>
                <UploadCloud size={32} color={formData.offer_letter_url ? '#16a34a' : 'var(--purple-600)'} style={{ margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--purple-950)' }}>
                  {offerFileName ? offerFileName : formData.offer_letter_url ? 'Offer Letter File Attached' : 'Select or drop Offer Letter PDF / Image'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.25rem', marginBottom: '0.75rem' }}>
                  {formData.offer_letter_url ? 'Click below to preview or select a new file to replace' : 'Supported formats: PDF, PNG, JPG (Stored in Supabase)'}
                </div>

                <input
                  type="file"
                  id="offer_file"
                  accept=".pdf,image/*"
                  onChange={handleOfferFileChange}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />

                {uploadingOffer && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--purple-700)', fontWeight: 600 }}>
                    Uploading & Preparing PDF Preview...
                  </div>
                )}

                {formData.offer_letter_url && !uploadingOffer && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginTop: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => setPreviewingDoc({
                        isOpen: true,
                        url: formData.offer_letter_url,
                        title: offerFileName || `${formData.full_name} - Offer Letter PDF`,
                        studentName: formData.full_name
                      })}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#15803d', borderColor: '#86efac', backgroundColor: '#dcfce7', fontSize: '0.775rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Eye size={13} />
                      Preview Offer Letter PDF
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Field 17: Internship Completion Letter (Locked during initial application) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className="form-label" style={{ fontWeight: 700, margin: 0 }}>
                  17. Internship Completion Letter (Certificate)
                </label>
                {formData.completion_letter_url ? (
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0369a1', backgroundColor: '#e0f2fe', padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-full)' }}>
                    ✓ Attached & Synced
                  </span>
                ) : (
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--slate-500)', backgroundColor: 'var(--slate-100)', padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-full)' }}>
                    🔒 Post-Internship Only
                  </span>
                )}
              </div>

              {/* If existing record has completion letter, show active preview/update. Otherwise show LOCKED card for initial application */}
              {isEditingExisting && formData.completion_letter_url ? (
                <div style={{
                  border: '2px dashed #7dd3fc',
                  backgroundColor: '#f0f9ff',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  position: 'relative'
                }}>
                  <Award size={32} color="#0284c7" style={{ margin: '0 auto 0.5rem auto' }} />
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0369a1' }}>
                    {completionFileName ? completionFileName : 'Completion Certificate Attached'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.25rem', marginBottom: '0.75rem' }}>
                    Click below to preview or select a new file to update
                  </div>

                  <input
                    type="file"
                    id="completion_file"
                    accept=".pdf,image/*"
                    onChange={handleCompletionFileChange}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />

                  {uploadingCompletion && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--purple-700)', fontWeight: 600 }}>
                      Uploading & Preparing PDF Preview...
                    </div>
                  )}

                  {!uploadingCompletion && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginTop: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={() => setPreviewingDoc({
                          isOpen: true,
                          url: formData.completion_letter_url,
                          title: completionFileName || `${formData.full_name} - Completion Certificate PDF`,
                          studentName: formData.full_name
                        })}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#0369a1', borderColor: '#7dd3fc', backgroundColor: '#e0f2fe', fontSize: '0.775rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Award size={13} />
                        Preview Completion Letter PDF
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  border: '2px dashed var(--slate-300)',
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--slate-200)',
                    color: 'var(--slate-500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.5rem auto'
                  }}>
                    <Lock size={20} />
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-700)' }}>
                    Locked During Initial Application
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.35rem', lineHeight: 1.4 }}>
                    Completion certificate can only be submitted post-internship upon concluding your 6-month tenure. Only the <strong>Offer Letter</strong> is required right now.
                  </div>
                  <div style={{ marginTop: '0.65rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: 'var(--slate-200)', color: 'var(--slate-600)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)' }}>
                      🔒 Unlocks After Internship Period
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SECTION 5: Select Faculty Coordinator / Reviewer */}
        {/* ==================================================================== */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', border: '1.5px solid var(--purple-200)', backgroundColor: '#faf5ff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--purple-100)', paddingBottom: '0.75rem' }}>
            <UserCheck size={22} color="var(--purple-700)" />
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', margin: 0 }}>
                5. Select Faculty Coordinator / Reviewer
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', margin: '0.2rem 0 0 0' }}>
                Assigned faculty coordinator will receive this application to review, approve, or reject.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', alignItems: 'start' }}>
            <div>
              <label className="form-label" htmlFor="assigned_coordinator" style={{ fontWeight: 700 }}>
                Faculty Coordinator <span className="text-danger">*</span>
              </label>
              <select
                id="assigned_coordinator"
                name="assigned_coordinator"
                value={formData.assigned_coordinator}
                onChange={(e) => {
                  const selectedName = e.target.value;
                  const matched = facultyList.find(f => f.full_name === selectedName);
                  setFormData(prev => ({
                    ...prev,
                    assigned_coordinator: selectedName,
                    assigned_faculty_email: matched ? matched.email : prev.assigned_faculty_email
                  }));
                  if (errors.assigned_coordinator) {
                    setErrors(prev => {
                      const next = { ...prev };
                      delete next.assigned_coordinator;
                      return next;
                    });
                  }
                }}
                className={`form-select ${errors.assigned_coordinator ? 'is-invalid' : ''}`}
                style={{ fontSize: '0.95rem', fontWeight: 600, padding: '0.65rem 0.85rem' }}
                required
              >
                {facultyList && facultyList.length > 0 ? (
                  facultyList.map(f => (
                    <option key={f.id || f.email} value={f.full_name}>
                      {f.full_name} — {f.designation || f.role} ({f.department || 'School of Computing'})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Prof. Vaibhav Sawalkar">Prof. Vaibhav Sawalkar — Internship Coordinator & Assistant Professor</option>
                    <option value="Prof. Aniket Verma">Prof. Aniket Verma — Head - Industry Internship Cell</option>
                    <option value="Dr. Sneha Deshmukh">Dr. Sneha Deshmukh — Head of Department (CSE)</option>
                    <option value="Prof. Dr. Jayashree Prasad">Prof. Dr. Jayashree Prasad — Head of Department (CSE-AIA)</option>
                    <option value="Prof. Dr. Swati More">Prof. Dr. Swati More — Director, Central T&P</option>
                  </>
                )}
              </select>
              {errors.assigned_coordinator && <span className="form-error">{errors.assigned_coordinator}</span>}
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.35rem' }}>
                📌 Your verification status (Under Review / Approved / Rejected) will be managed by this coordinator.
              </p>
            </div>

            {/* Selected Faculty Details Card */}
            {formData.assigned_coordinator && (
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--purple-200)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                boxShadow: 'var(--shadow-xs)'
              }}>
                <div style={{ fontSize: '0.725rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--purple-700)', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Assigned Reviewer Details
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--purple-950)' }}>
                  {formData.assigned_coordinator}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginTop: '0.2rem' }}>
                  {facultyList.find(f => f.full_name === formData.assigned_coordinator)?.designation || 'Internship Coordinator / Faculty Reviewer'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
                  📧 {formData.assigned_faculty_email || 'coordinator@mitadt.edu.in'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit & Reset Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: 'white',
          padding: '1.25rem 2rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--sidebar-border)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RotateCcw size={16} />
            Reset Form
          </button>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-lg"
              style={{ minWidth: '220px', justifyContent: 'center' }}
            >
              {isSubmitting ? (
                <>Saving to Supabase...</>
              ) : (
                <>
                  <Database size={18} />
                  Submit Record to Supabase
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
