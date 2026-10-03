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
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Users,
  UserCheck
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
import { calculateInternshipDuration, fetchStudentRecords, subscribeToStudentRecords } from '../utils/supabaseClient';
import { downloadDocumentPDF } from '../utils/pdfGenerator';
import { NOCTemplate } from '../templates/NOCTemplate';
import { Toast } from '../components/common/Toast';
import { ROLES } from '../utils/auth';

const INITIAL_STATE = {
  // Document Reference
  referenceNumber: 'MIT-ADT/SOC/CRPC/NOC/2026/0842',
  documentDate: new Date().toISOString().split('T')[0],

  // Student Info
  studentName: '',
  salutation: 'Mr.',
  rollNumber: '',
  enrollmentNumber: '',
  departmentName: 'Department of Computer Science & Engineering',
  className: 'LY-BTech-IT-A',
  academicYear: '2025-2026',
  semester: 'Semester VIII (Final Year)',

  // Company Info
  company_name_and_city: '',
  recipientSalutation: 'The HR Manager / Hiring Team',
  internshipRole: 'Software Engineering Intern',

  // Internship Info
  startDate: '',
  endDate: '',
  duration: '6 Months (182 Days)',

  // Signatories
  mentorName: 'Prof. Vaibhav Sawalkar',
  mentorDesignation: 'Assistant Professor & Faculty Coordinator',
  hodName: 'Dr. Shraddha Phansalkar',
  hodDesignation: 'Professor & Head of Department',
  directorName: 'Dr. Rajesh S',
  directorDesignation: 'Director, Corporate Relations & Placement Cell'
};

export const formatRecordToNOC = (r) => {
  if (!r) return INITIAL_STATE;
  const enrolLast4 = (r.enrolment_no || '001').slice(-4);
  return {
    referenceNumber: `MIT-ADT/SOC/CRPC/NOC/2026/${enrolLast4}`,
    documentDate: r.submission_date || new Date().toISOString().split('T')[0],
    recipientSalutation: 'The HR Manager / Hiring Team',
    company_name_and_city: r.company_name_and_city || 'Google India Pvt. Ltd., Pune',
    
    studentName: r.full_name || '',
    salutation: r.gender === 'Female' ? 'Ms.' : 'Mr.',
    enrollmentNumber: r.enrolment_no || '',
    className: r.class_division || 'LY-BTech-IT-A',
    departmentName: r.specialization ? `Department of ${r.specialization}` : 'Department of Computer Science & Engineering',
    academicYear: '2025-2026',
    semester: r.semester || 'Semester VIII (Final Year)',
    
    internshipRole: r.domain_of_company || 'Software Development Intern',
    duration: r.duration || '6 Months (182 Days)',
    startDate: r.start_date || '2026-02-01',
    endDate: r.end_date || '2026-08-01',
    
    mentorName: r.assigned_coordinator || 'Prof. Vaibhav Sawalkar',
    mentorDesignation: 'Assistant Professor & Faculty Coordinator',
    
    hodName: 'Dr. Shraddha Phansalkar',
    hodDesignation: 'Professor & Head of Department',
    
    directorName: 'Dr. Rajesh S',
    directorDesignation: 'Director, Corporate Relations & Placement Cell'
  };
};

export const NOCFormPage = ({ 
  onGeneratePreview, 
  onBack, 
  initialData,
  authUser,
  hasSubmittedApp,
  isApproved,
  studentStatus,
  onNavigate
}) => {
  const isStudent = authUser?.role === ROLES.STUDENT;
  const isAdmin = authUser?.role === ROLES.ADMIN;
  const studentKey = getStudentStorageKey(authUser);

  // Authority & Faculty Desk State
  const [deskRecords, setDeskRecords] = useState([]);
  const [loadingDesk, setLoadingDesk] = useState(true);
  const [deskSearch, setDeskSearch] = useState('');
  const [deskCoordinatorFilter, setDeskCoordinatorFilter] = useState('All');
  const [deskSpecializationFilter, setDeskSpecializationFilter] = useState('All');
  const [adminViewMode, setAdminViewMode] = useState('desk'); // 'desk' | 'form'
  const [downloadingStudentId, setDownloadingStudentId] = useState(null);
  const [activeDownloadData, setActiveDownloadData] = useState(null);

  const [generatedDoc, setGeneratedDoc] = useState(() => (isStudent && !isApproved ? null : loadGeneratedDocument('noc', studentKey)));
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toast, setToast] = useState(null);

  // Load records for Faculty & Authorities Desk
  useEffect(() => {
    if (!isStudent) {
      const loadDesk = async () => {
        setLoadingDesk(true);
        const { data } = await fetchStudentRecords();
        if (data) {
          setDeskRecords(data);
        }
        setLoadingDesk(false);
      };

      loadDesk();

      const unsubscribe = subscribeToStudentRecords(() => {
        loadDesk();
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [isStudent]);

  // If approval is revoked or not active for a student, immediately purge generated doc
  useEffect(() => {
    if (isStudent && !isApproved) {
      clearGeneratedDocument('noc', studentKey);
      setGeneratedDoc(null);
      setIsEditing(false);
    }
  }, [isStudent, isApproved, studentKey]);

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

  // Autosave to localStorage on change for student
  useEffect(() => {
    if (isStudent) {
      saveFormData('noc', formData);
    }
  }, [formData, isStudent]);

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

  const handleDeskDirectDownload = async (studentRecord) => {
    const formattedData = formatRecordToNOC(studentRecord);
    setActiveDownloadData(formattedData);
    setDownloadingStudentId(studentRecord.id || studentRecord.enrolment_no);

    // Allow DOM to update hidden template
    setTimeout(async () => {
      try {
        const targetElement = document.getElementById('noc-desk-download-element');
        if (!targetElement) throw new Error("Template element not ready");
        const studentNameClean = (studentRecord.full_name || 'Student').replace(/\s+/g, '_');
        const filename = `Internship_NOC_${studentNameClean}`;
        await downloadDocumentPDF(targetElement, filename);
        setToast({
          type: 'success',
          message: `NOC PDF for ${studentRecord.full_name} downloaded successfully!`
        });
      } catch (err) {
        console.error("PDF download failed:", err);
        setToast({
          type: 'error',
          message: 'PDF download failed. Please try clicking "Preview" instead.'
        });
      } finally {
        setDownloadingStudentId(null);
      }
    }, 150);
  };

  // =========================================================================
  // 1. FACULTY & AUTHORITIES DESK VIEW (When user is not a Student)
  // =========================================================================
  if (!isStudent && (!isAdmin || adminViewMode === 'desk')) {
    const isFaculty = authUser?.role === ROLES.FACULTY;
    const facultyName = (authUser?.full_name || '').toLowerCase();

    // Filter students: All approved / verified students
    const approvedStudents = deskRecords.filter(r => {
      const st = (r.status || '').toLowerCase();
      return ['approved', 'verified', 'completed'].includes(st);
    });

    const filteredDeskStudents = approvedStudents.filter(r => {
      const search = deskSearch.toLowerCase().trim();
      const matchesSearch = !search || 
        (r.full_name && r.full_name.toLowerCase().includes(search)) ||
        (r.enrolment_no && r.enrolment_no.toLowerCase().includes(search)) ||
        (r.company_name_and_city && r.company_name_and_city.toLowerCase().includes(search)) ||
        (r.specialization && r.specialization.toLowerCase().includes(search));

      const matchesCoord = deskCoordinatorFilter === 'All' || 
        (r.assigned_coordinator && r.assigned_coordinator.toLowerCase().includes(deskCoordinatorFilter.toLowerCase()));

      const matchesSpec = deskSpecializationFilter === 'All' || 
        (r.specialization && r.specialization.toLowerCase().includes(deskSpecializationFilter.toLowerCase()));

      return matchesSearch && matchesCoord && matchesSpec;
    });

    const myAssignedCount = approvedStudents.filter(r => {
      return r.assigned_coordinator && facultyName && r.assigned_coordinator.toLowerCase().includes(facultyName);
    }).length;

    return (
      <div className="animate-fade-in" style={{ padding: '2rem 0 5rem 0' }}>
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        {/* Hidden A4 Element for Direct PDF Downloads from Desk */}
        {activeDownloadData && (
          <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '794px' }}>
            <div id="noc-desk-download-element">
              <NOCTemplate data={activeDownloadData} />
            </div>
          </div>
        )}

        <div className="container" style={{ maxWidth: '1360px' }}>
          {/* Header Banner */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.75rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#fef3c7', color: '#b45309', borderColor: '#fde68a' }}>
                  <Award size={13} />
                  DOC-MIT-NOC-01 • OFFICIAL NOC LETTERS DESK
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                  Active Role: {authUser?.role}
                </span>
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--purple-950)', margin: 0 }}>
                Generated No Objection Certificates (NOC) Desk
              </h1>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem', margin: '0.3rem 0 0 0' }}>
                Official verification desk for all approved students. Preview individual NOC letters with Dr. Shraddha Phansalkar & Dr. Rajesh S signatories, or download single-page A4 PDFs.
              </p>
            </div>

            {isAdmin && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setAdminViewMode('form')}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Edit3 size={14} />
                  Open Blank Form Generator
                </button>
              </div>
            )}
          </div>

          {/* KPI Metrics Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.75rem'
          }}>
            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #d97706' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 600 }}>
                <span>TOTAL GENERATED NOC LETTERS</span>
                <Award size={20} color="#d97706" />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--purple-950)', marginTop: '0.4rem' }}>
                {approvedStudents.length} Students
              </div>
              <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600, marginTop: '0.2rem' }}>
                ✓ Official Letters Ready with Signatories & QR
              </div>
            </div>

            {isFaculty && (
              <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #7e22ce' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span>MY ASSIGNED STUDENTS</span>
                  <UserCheck size={20} color="#7e22ce" />
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--purple-950)', marginTop: '0.4rem' }}>
                  {myAssignedCount} Students
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b21a8', fontWeight: 600, marginTop: '0.2rem' }}>
                  Assigned to {authUser?.full_name}
                </div>
              </div>
            )}

            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #059669' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 600 }}>
                <span>LETTERHEAD SPECIFICATION</span>
                <FileCheck2 size={20} color="#059669" />
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--purple-950)', marginTop: '0.4rem' }}>
                Single Page A4 • 3 Official Signatories
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600, marginTop: '0.2rem' }}>
                Faculty Mentor • Head of Department • Director CRPC
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid var(--sidebar-border)' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', flex: '1 1 300px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  type="text"
                  placeholder="Search student, enrollment, company, specialization..."
                  value={deskSearch}
                  onChange={(e) => setDeskSearch(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.4rem', height: '40px', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <select
                  value={deskCoordinatorFilter}
                  onChange={(e) => setDeskCoordinatorFilter(e.target.value)}
                  className="form-input"
                  style={{ height: '40px', fontSize: '0.85rem', minWidth: '180px' }}
                >
                  <option value="All">All Faculty Coordinators</option>
                  <option value="Sawalkar">Prof. Vaibhav Sawalkar</option>
                  <option value="Verma">Prof. Aniket Verma</option>
                  <option value="Deshmukh">Dr. Sneha Deshmukh</option>
                </select>

                <select
                  value={deskSpecializationFilter}
                  onChange={(e) => setDeskSpecializationFilter(e.target.value)}
                  className="form-input"
                  style={{ height: '40px', fontSize: '0.85rem', minWidth: '160px' }}
                >
                  <option value="All">All Specializations</option>
                  <option value="Information Technology">Information Technology (IT)</option>
                  <option value="Computer Science">CSE-CORE</option>
                  <option value="Artificial Intelligence">AI & Data Science</option>
                  <option value="Cyber">Cyber Security</option>
                </select>

                {(deskSearch || deskCoordinatorFilter !== 'All' || deskSpecializationFilter !== 'All') && (
                  <button
                    onClick={() => {
                      setDeskSearch('');
                      setDeskCoordinatorFilter('All');
                      setDeskSpecializationFilter('All');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ height: '40px' }}
                  >
                    <RotateCcw size={14} /> Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Students Generated NOC Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--sidebar-border)' }}>
            <div style={{ padding: '1rem 1.5rem', backgroundColor: '#fffbeb', borderBottom: '1px solid #fef3c7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} color="#b45309" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--purple-950)', margin: 0 }}>
                  Approved Students with Generated NOC ({filteredDeskStudents.length})
                </h3>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', backgroundColor: '#fef3c7', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                Official NOC Format • MIT-ADT CRPC
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--slate-200)', textAlign: 'left', color: 'var(--slate-600)', fontSize: '0.775rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>#</th>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Student & Enrolment</th>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Company & Location</th>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Tenure & Dates</th>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Faculty Coordinator</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Official NOC</th>
                    <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingDesk ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--slate-500)' }}>
                        <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem auto', color: '#d97706' }} />
                        <div>Loading generated NOC letters...</div>
                      </td>
                    </tr>
                  ) : filteredDeskStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
                        <Award size={40} color="var(--slate-300)" style={{ margin: '0 auto 0.75rem auto' }} />
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-700)', margin: 0 }}>
                          No approved student NOC letters found
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                          Students whose applications are approved by their Faculty Coordinator will automatically appear here with generated NOC letters.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredDeskStudents.map((student, idx) => {
                      const nocData = formatRecordToNOC(student);
                      const isRowDownloading = downloadingStudentId === (student.id || student.enrolment_no);

                      return (
                        <tr 
                          key={student.id || student.enrolment_no || idx}
                          style={{
                            borderBottom: '1px solid var(--slate-100)',
                            transition: 'background-color 0.15s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fffdf7'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <td style={{ padding: '1rem', color: 'var(--slate-400)', fontWeight: 600, fontSize: '0.8rem' }}>
                            {idx + 1}
                          </td>

                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ fontWeight: 800, color: 'var(--purple-950)', fontSize: '0.925rem' }}>
                              {student.full_name}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
                              <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#92400e', backgroundColor: '#fef3c7', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                {student.enrolment_no}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                                {student.class_division || 'LY-BTech'}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.725rem', color: 'var(--slate-400)', marginTop: '0.1rem' }}>
                              Ref: {nocData.referenceNumber}
                            </div>
                          </td>

                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ fontWeight: 700, color: 'var(--slate-800)' }}>
                              {student.company_name_and_city || 'Corporate Firm'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.15rem' }}>
                              {student.domain_of_company || 'Information Technology'}
                            </div>
                            <div style={{ fontSize: '0.725rem', color: 'var(--slate-400)' }}>
                              Mode: {student.mode_of_internship || 'Offline'}
                            </div>
                          </td>

                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ fontWeight: 700, color: '#b45309', fontSize: '0.825rem' }}>
                              ⏱️ {student.duration || '6 Months'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.15rem' }}>
                              {student.start_date || '2026-02-01'} → {student.end_date || '2026-08-01'}
                            </div>
                          </td>

                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ fontWeight: 700, color: 'var(--purple-900)', fontSize: '0.825rem' }}>
                              {student.assigned_coordinator || 'Prof. Vaibhav Sawalkar'}
                            </div>
                            <div style={{ fontSize: '0.725rem', color: 'var(--slate-400)' }}>
                              Coordinator
                            </div>
                          </td>

                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              fontSize: '0.725rem',
                              fontWeight: 800,
                              padding: '0.25rem 0.65rem',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: '#fef3c7',
                              color: '#b45309',
                              border: '1px solid #fde68a'
                            }}>
                              <CheckCircle2 size={13} />
                              NOC Ready
                            </span>
                          </td>

                          <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', alignItems: 'center' }}>
                              {/* 1-Click Preview Action */}
                              <button
                                type="button"
                                onClick={() => onGeneratePreview('noc', nocData)}
                                className="btn btn-sm btn-primary"
                                style={{
                                  fontSize: '0.775rem',
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  padding: '0.35rem 0.75rem',
                                  backgroundColor: '#d97706',
                                  borderColor: '#b45309'
                                }}
                                title="Open full official A4 NOC preview"
                              >
                                <Eye size={14} />
                                Preview NOC
                              </button>

                              {/* 1-Click Direct Download PDF */}
                              <button
                                type="button"
                                onClick={() => handleDeskDirectDownload(student)}
                                disabled={isRowDownloading}
                                className="btn btn-sm btn-secondary"
                                style={{
                                  fontSize: '0.775rem',
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  padding: '0.35rem 0.65rem',
                                  backgroundColor: '#fffbeb',
                                  color: '#b45309',
                                  borderColor: '#fde68a'
                                }}
                                title="Instant single-page A4 PDF download"
                              >
                                {isRowDownloading ? (
                                  <RefreshCw size={14} className="animate-spin" />
                                ) : (
                                  <Download size={14} />
                                )}
                                PDF
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. STUDENT LOCKED STATE VIEW
  // =========================================================================
  if (isStudent && !isApproved) {
    const isRejected = (studentStatus || '').toLowerCase() === 'rejected';

    return (
      <div className="animate-fade-in" style={{ padding: '3rem 0 5rem 0' }}>
        <div className="container container-narrow">
          <div className="card" style={{ 
            padding: '2.75rem 2rem', 
            textAlign: 'center',
            border: isRejected ? '2px solid #fca5a5' : '1.5px solid #fed7aa',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: isRejected ? '#fee2e2' : '#fffbeb',
              color: isRejected ? '#dc2626' : '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              {isRejected ? <AlertCircle size={34} /> : <Award size={34} />}
            </div>

            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: isRejected ? '#ffe4e6' : '#fef3c7',
              color: isRejected ? '#be123c' : '#b45309',
              marginBottom: '0.75rem'
            }}>
              {isRejected ? 'APPLICATION REJECTED' : 'APPROVAL REVOKED / UNDER REVIEW'}
            </span>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.75rem' }}>
              🔒 NOC Letter Generation Locked
            </h2>
            <p style={{ color: 'var(--slate-600)', maxWidth: '520px', margin: '0 auto 1.75rem auto', lineHeight: 1.6, fontSize: '0.95rem' }}>
              {isRejected 
                ? 'Your internship application was rejected by the Faculty Coordinator. Any previously generated NOC letters have been revoked. Please review feedback, make required edits, and resubmit your application.'
                : hasSubmittedApp 
                ? 'Your application approval is not active or has been revoked for review by your Faculty Coordinator. All generated NOC records have been cleared until approval is reinstated.'
                : 'You must submit your Internship Application (Step 1) and receive Faculty Coordinator approval before generating the official NOC letter.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate(isRejected ? 'student-form' : hasSubmittedApp ? 'student-records' : 'student-form')}
                className="btn btn-primary"
              >
                {isRejected ? 'Update & Resubmit Application' : hasSubmittedApp ? 'Track Application Status' : 'Go to Step 1 Application'}
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

  // =========================================================================
  // 3. STUDENT GENERATED HUB (2nd Time Onwards View)
  // =========================================================================
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
            border: '2px solid #fde68a',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 4px 12px rgba(217, 119, 6, 0.08)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#d97706',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 8px rgba(217, 119, 6, 0.3)'
              }}>
                <Award size={30} />
              </div>

              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                  <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#b45309', fontWeight: 800, fontSize: '0.75rem' }}>
                    DOC-MIT-NOC-01 • OFFICIAL
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                    🕒 Generated: {formattedDate}
                  </span>
                </div>

                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--purple-950)', margin: '0 0 0.4rem 0' }}>
                  No Objection Certificate (NOC) Generated
                </h1>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem', margin: 0, lineHeight: 1.5 }}>
                  Your official <strong>No Objection Certificate (NOC) Letter</strong> has been generated and saved. You can download the single-page A4 printable PDF, preview with official signatures, or edit details if required.
                </p>
              </div>
            </div>
          </div>

          {/* Document Summary Overview Card */}
          <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem', border: '1px solid var(--sidebar-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--purple-950)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Award size={18} color="#d97706" />
                Generated NOC Summary
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                Ref: {docData.referenceNumber || 'MIT-ADT/SOC/CRPC/NOC/2026/0842'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 700, textTransform: 'uppercase' }}>Candidate</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--purple-950)', marginTop: '0.2rem' }}>
                  {docData.salutation} {docData.studentName}
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)', marginTop: '0.1rem' }}>
                  PRN/Enrol: {docData.enrollmentNumber}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 700, textTransform: 'uppercase' }}>Sponsoring Company</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--purple-950)', marginTop: '0.2rem' }}>
                  {docData.company_name_and_city || 'Corporate Firm'}
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)', marginTop: '0.1rem' }}>
                  Role: {docData.internshipRole}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 700, textTransform: 'uppercase' }}>Duration & Dates</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--purple-950)', marginTop: '0.2rem' }}>
                  {docData.duration || '6 Months (182 Days)'}
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)', marginTop: '0.1rem' }}>
                  {docData.startDate} → {docData.endDate}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 700, textTransform: 'uppercase' }}>Signatories Included</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--purple-950)', marginTop: '0.2rem' }}>
                  Mentor, HOD & Director CRPC
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)', marginTop: '0.1rem' }}>
                  Dr. Shraddha Phansalkar & Dr. Rajesh S
                </div>
              </div>
            </div>
          </div>

          {/* 3 Action Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {/* Option 1: Direct PDF Download */}
            <div className="card" style={{
              padding: '1.5rem',
              borderTop: '4px solid #d97706',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Download size={22} />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#b45309', backgroundColor: '#fef3c7', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                    Instant PDF
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--purple-950)', margin: '0 0 0.35rem 0' }}>
                  1. Download NOC Letter
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--slate-600)', margin: '0 0 1.25rem 0', lineHeight: 1.4 }}>
                  Export the official No Objection Certificate as an exact single-page A4 PDF file for submission to your employer.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDirectDownload}
                disabled={isDownloading}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', backgroundColor: '#d97706', borderColor: '#b45309', fontWeight: 700 }}
              >
                {isDownloading ? (
                  <><RefreshCw size={15} className="animate-spin" /> Generating PDF...</>
                ) : (
                  <><Download size={15} /> Download NOC PDF</>
                )}
              </button>
            </div>

            {/* Option 2: Full Preview & Print */}
            <div className="card" style={{
              padding: '1.5rem',
              borderTop: '4px solid #2563eb',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Eye size={22} />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1d4ed8', backgroundColor: '#dbeafe', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                    Preview Mode
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--purple-950)', margin: '0 0 0.35rem 0' }}>
                  2. Preview & Print
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--slate-600)', margin: '0 0 1.25rem 0', lineHeight: 1.4 }}>
                  Open the high-fidelity A4 document viewer to verify reference numbers, signatories, and QR code verification.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onGeneratePreview('noc', docData)}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', backgroundColor: '#1d4ed8', borderColor: '#2563eb', fontWeight: 700 }}
              >
                <Eye size={15} />
                Preview & Print
              </button>
            </div>

            {/* Option 3: Edit NOC Details */}
            <div className="card" style={{
              padding: '1.5rem',
              borderTop: '4px solid #7e22ce',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#f3e8ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Edit3 size={22} />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#7e22ce', backgroundColor: '#f3e8ff', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                    Editable
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--purple-950)', margin: '0 0 0.35rem 0' }}>
                  3. Edit NOC Details
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--slate-600)', margin: '0 0 1.25rem 0', lineHeight: 1.4 }}>
                  Update employer details, reference numbers, or internship tenure and re-generate your certificate.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center', fontWeight: 700, borderColor: '#d8b4fe', color: '#6b21a8' }}
              >
                <Edit3 size={15} />
                Edit NOC Details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. STUDENT FORM GENERATOR VIEW (1st Time or in Edit Mode / Admin Form Mode)
  // =========================================================================
  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem 0 4rem 0' }}>
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

        {/* Back Link & Admin Toggle */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <button
            onClick={() => {
              if (isEditing) {
                setIsEditing(false);
              } else if (isAdmin && adminViewMode === 'form') {
                setAdminViewMode('desk');
              } else {
                onBack();
              }
            }}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ArrowLeft size={16} />
            {isEditing ? 'Cancel Edit & Return to Generated Hub' : isAdmin && adminViewMode === 'form' ? 'Back to Generated Desk' : 'Back to Document Selection'}
          </button>

          {isEditing && (
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#b45309', backgroundColor: '#fef3c7', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
              ✏️ Modifying Saved NOC
            </span>
          )}

          {saveStatus && (
            <span className="badge badge-success" style={{ animation: 'fade-in 0.2s ease-out' }}>
              <CheckCircle2 size={13} />
              {saveStatus}
            </span>
          )}
        </div>

        {/* Form Container */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--sidebar-border)', paddingBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-primary">DOC-MIT-NOC-01</span>
              <span style={{ fontSize: '0.775rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                MIT-ADT Corporate Relations & Placement Cell Format
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--purple-950)', margin: '0.25rem 0' }}>
              No Objection Certificate (NOC)
            </h1>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem', margin: 0 }}>
              Official university certificate on letterhead granting permission for full-time industrial training, bearing approvals from Faculty Mentor, HOD, and Director CRPC.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Section 1: Document Metadata */}
            <div className="form-section">
              <div className="form-section-title">
                <FileText size={18} />
                Document Reference & Issuance
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <FormInput
                  label="Official NOC Reference Number"
                  id="referenceNumber"
                  name="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={handleChange}
                  placeholder="e.g., MIT-ADT/SOC/CRPC/NOC/2026/0842"
                  error={errors.referenceNumber}
                  required
                />
                <FormInput
                  label="Issuance Date"
                  id="documentDate"
                  name="documentDate"
                  type="date"
                  value={formData.documentDate}
                  onChange={handleChange}
                  error={errors.documentDate}
                  required
                />
              </div>
            </div>

            {/* Section 2: Student Identification */}
            <div className="form-section">
              <div className="form-section-title">
                <User size={18} />
                Student Identification Details
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem' }}>
                <FormSelect
                  label="Title"
                  id="salutation"
                  name="salutation"
                  value={formData.salutation}
                  onChange={handleChange}
                  options={[
                    { value: 'Mr.', label: 'Mr.' },
                    { value: 'Ms.', label: 'Ms.' }
                  ]}
                  required
                />
                <FormInput
                  label="Student Full Name"
                  id="studentName"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="e.g., Rohit Sharma"
                  error={errors.studentName}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <FormInput
                  label="Enrollment / PRN Number"
                  id="enrollmentNumber"
                  name="enrollmentNumber"
                  value={formData.enrollmentNumber}
                  onChange={handleChange}
                  placeholder="e.g., ADT23SOCB0999"
                  error={errors.enrollmentNumber}
                  required
                />
                <FormInput
                  label="Class / Division"
                  id="className"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  placeholder="e.g., LY-BTech-IT-A"
                  error={errors.className}
                  required
                />
                <FormInput
                  label="Academic Semester"
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  placeholder="e.g., Semester VIII (Final Year)"
                  error={errors.semester}
                  required
                />
              </div>

              <div style={{ marginTop: '1rem' }}>
                <FormInput
                  label="Department Name"
                  id="departmentName"
                  name="departmentName"
                  value={formData.departmentName}
                  onChange={handleChange}
                  placeholder="e.g., Department of Computer Science & Engineering"
                  error={errors.departmentName}
                  required
                />
              </div>
            </div>

            {/* Section 3: Employer & Organization Particulars */}
            <div className="form-section">
              <div className="form-section-title">
                <Building size={18} />
                Sponsoring Company & Position Details
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <FormInput
                  label="Company Name & City Location"
                  id="company_name_and_city"
                  name="company_name_and_city"
                  value={formData.company_name_and_city}
                  onChange={handleChange}
                  placeholder="e.g., Google India Pvt. Ltd., Pune"
                  error={errors.company_name_and_city}
                  required
                />
                <FormInput
                  label="Internship Role / Designation"
                  id="internshipRole"
                  name="internshipRole"
                  value={formData.internshipRole}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineering Intern"
                  error={errors.internshipRole}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <FormInput
                  label="Start Date"
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  error={errors.startDate}
                  required
                />
                <FormInput
                  label="End Date"
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  error={errors.endDate}
                  required
                />
                <FormInput
                  label="Internship Duration"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 6 Months (182 Days)"
                  helper="Auto-calculated from Start & End Date"
                  error={errors.duration}
                  required
                />
              </div>
            </div>

            {/* Section 4: Academic Signatories */}
            <div className="form-section">
              <div className="form-section-title">
                <Award size={18} />
                Institutional Signatories (Verified)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <FormInput
                    label="Faculty Mentor / Coordinator"
                    id="mentorName"
                    name="mentorName"
                    value={formData.mentorName}
                    onChange={handleChange}
                    placeholder="Prof. Vaibhav Sawalkar"
                    error={errors.mentorName}
                    required
                  />
                  <div style={{ fontSize: '0.725rem', color: 'var(--slate-400)', marginTop: '0.2rem' }}>
                    {formData.mentorDesignation}
                  </div>
                </div>

                <div>
                  <FormInput
                    label="Head of Department"
                    id="hodName"
                    name="hodName"
                    value={formData.hodName}
                    onChange={handleChange}
                    placeholder="Dr. Shraddha Phansalkar"
                    error={errors.hodName}
                    required
                  />
                  <div style={{ fontSize: '0.725rem', color: 'var(--slate-400)', marginTop: '0.2rem' }}>
                    {formData.hodDesignation}
                  </div>
                </div>

                <div>
                  <FormInput
                    label="Director, CRPC"
                    id="directorName"
                    name="directorName"
                    value={formData.directorName}
                    onChange={handleChange}
                    placeholder="Dr. Rajesh S"
                    error={errors.directorName}
                    required
                  />
                  <div style={{ fontSize: '0.725rem', color: 'var(--slate-400)', marginTop: '0.2rem' }}>
                    {formData.directorDesignation}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--sidebar-border)',
              flexWrap: 'wrap',
              gap: '1rem'
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

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', fontSize: '1rem', backgroundColor: '#d97706', borderColor: '#b45309' }}
                >
                  <Sparkles size={18} />
                  {isEditing ? 'Update & Re-generate NOC Preview' : 'Generate & Preview NOC'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
