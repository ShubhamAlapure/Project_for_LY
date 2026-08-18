import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  RefreshCw, 
  FileCheck2, 
  Award, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Building, 
  User, 
  Calendar, 
  Clock, 
  Trash2, 
  Edit3, 
  UploadCloud,
  ChevronRight,
  TrendingUp,
  Briefcase,
  Layers,
  Eye,
  X,
  GraduationCap,
  ShieldAlert,
  FileSpreadsheet
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { fetchStudentRecords, deleteStudentRecord, updateStudentRecord, uploadStudentDocument } from '../utils/supabaseClient';
import { DocumentPreviewModal } from '../components/common/DocumentPreviewModal';
import { ROLES } from '../utils/auth';

export const StudentRecordsPage = ({ onNavigate, onPrefillDocument, authUser }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');
  const [ppoFilter, setPpoFilter] = useState('All');
  const [isFallback, setIsFallback] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingCompletionRecord, setEditingCompletionRecord] = useState(null);
  const [completionFile, setCompletionFile] = useState(null);
  const [uploadingCompletion, setUploadingCompletion] = useState(false);
  const [notification, setNotification] = useState(null);

  const isStudent = authUser?.role === ROLES.STUDENT;

  // PDF / Document Viewer Modal State
  const [previewingDoc, setPreviewingDoc] = useState({
    isOpen: false,
    url: '',
    title: '',
    studentName: ''
  });

  const loadRecords = async () => {
    setLoading(true);
    const res = await fetchStudentRecords();
    setLoading(false);
    if (res.success) {
      setRecords(res.data);
      setIsFallback(res.isFallback || false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the internship record for ${name}?`)) {
      const res = await deleteStudentRecord(id);
      if (res.success) {
        setRecords(prev => prev.filter(r => r.id !== id));
        if (selectedRecord?.id === id) setSelectedRecord(null);
        setNotification({ type: 'success', message: 'Record deleted successfully.' });
        setTimeout(() => setNotification(null), 3000);
      }
    }
  };

  const handleUploadCompletionSubmit = async (e) => {
    e.preventDefault();
    if (!completionFile || !editingCompletionRecord) return;

    setUploadingCompletion(true);
    const uploadRes = await uploadStudentDocument(completionFile, 'completion-letters');
    
    if (uploadRes.success) {
      const updateRes = await updateStudentRecord(editingCompletionRecord.id, {
        completion_letter_url: uploadRes.publicUrl,
        status: 'Completed'
      });
      setUploadingCompletion(false);
      setEditingCompletionRecord(null);
      setCompletionFile(null);
      loadRecords();
      setNotification({ type: 'success', message: 'Completion Letter attached & status updated to Completed!' });
      setTimeout(() => setNotification(null), 3500);
    } else {
      setUploadingCompletion(false);
      setNotification({ type: 'error', message: 'Failed to upload completion letter.' });
      setTimeout(() => setNotification(null), 3500);
    }
  };

  const openDocumentPreview = (url, title, studentName) => {
    if (!url) return;
    setPreviewingDoc({
      isOpen: true,
      url,
      title,
      studentName
    });
  };

  const exportToCSV = () => {
    if (filteredRecords.length === 0) {
      alert('No student records to export.');
      return;
    }

    const headers = [
      "Submission Date",
      "Enrolment No",
      "Full Name",
      "Email ID",
      "Contact No",
      "Gender",
      "Specialization",
      "Semester",
      "Company Name + City",
      "Domain",
      "Source of Internship",
      "Start Date",
      "End Date",
      "Duration",
      "Mode",
      "PPO Offer",
      "Offer Letter URL",
      "Completion Letter URL",
      "Status"
    ];

    const rows = filteredRecords.map(r => [
      `"${r.submission_date || ''}"`,
      `"${r.enrolment_no || ''}"`,
      `"${r.full_name || ''}"`,
      `"${r.email || ''}"`,
      `"${r.contact_no || ''}"`,
      `"${r.gender || ''}"`,
      `"${r.specialization || ''}"`,
      `"${r.semester || ''}"`,
      `"${r.company_name_and_city || ''}"`,
      `"${r.domain_of_company || ''}"`,
      `"${r.source_of_internship || ''}"`,
      `"${r.start_date || ''}"`,
      `"${r.end_date || ''}"`,
      `"${r.duration || ''}"`,
      `"${r.mode_of_internship || ''}"`,
      `"${r.is_ppo_offer || ''}"`,
      `"${r.offer_letter_url || ''}"`,
      `"${r.completion_letter_url || ''}"`,
      `"${r.status || 'Submitted'}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MIT_ADT_Student_Internships_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    if (filteredRecords.length === 0) {
      alert('No student records to export.');
      return;
    }

    const excelData = filteredRecords.map((r, idx) => ({
      "Sr No": idx + 1,
      "Submission Date": r.submission_date || '',
      "Enrolment No": r.enrolment_no || '',
      "Full Name": r.full_name || '',
      "Email ID": r.email || '',
      "Contact No": r.contact_no || '',
      "Gender": r.gender || '',
      "Specialization": r.specialization || '',
      "Semester": r.semester || '',
      "Company Name & City": r.company_name_and_city || '',
      "Domain": r.domain_of_company || '',
      "Source of Internship": r.source_of_internship || '',
      "Start Date": r.start_date || '',
      "End Date": r.end_date || '',
      "Duration": r.duration || '',
      "Mode of Internship": r.mode_of_internship || '',
      "PPO Offer": r.is_ppo_offer || '',
      "Offer Letter URL": r.offer_letter_url || '',
      "Completion Letter URL": r.completion_letter_url || '',
      "Status": r.status || 'Submitted'
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Set auto column widths for readable spreadsheet layout
    worksheet['!cols'] = [
      { wch: 8 },  // Sr No
      { wch: 15 }, // Submission Date
      { wch: 18 }, // Enrolment No
      { wch: 25 }, // Full Name
      { wch: 28 }, // Email
      { wch: 15 }, // Contact
      { wch: 10 }, // Gender
      { wch: 30 }, // Specialization
      { wch: 12 }, // Semester
      { wch: 30 }, // Company Name & City
      { wch: 20 }, // Domain
      { wch: 22 }, // Source
      { wch: 14 }, // Start Date
      { wch: 14 }, // End Date
      { wch: 18 }, // Duration
      { wch: 15 }, // Mode
      { wch: 15 }, // PPO
      { wch: 35 }, // Offer Letter URL
      { wch: 35 }, // Completion Letter URL
      { wch: 14 }  // Status
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Internship Records");

    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `MIT_ADT_Student_Internships_${dateStr}.xlsx`);
  };

  // Role-Based Filtering:
  // If Student: Only show records belonging to the student
  // If Faculty / Coordinator / HOD / T&P / Admin: Show all records with full search & filters
  const visibleRecords = isStudent 
    ? records.filter(r => {
        const studentEmail = authUser?.email?.toLowerCase();
        const studentEnroll = authUser?.enrolment_no?.toLowerCase();
        const studentName = authUser?.full_name?.toLowerCase();
        return (
          (r.email && studentEmail && r.email.toLowerCase() === studentEmail) ||
          (r.enrolment_no && studentEnroll && r.enrolment_no.toLowerCase() === studentEnroll) ||
          (r.full_name && studentName && r.full_name.toLowerCase().includes(studentName)) ||
          records.length === 1 // If only 1 demo record, allow viewing
        );
      })
    : records;

  const filteredRecords = visibleRecords.filter(r => {
    if (isStudent) return true; // No complex filtering needed for student view

    const s = searchTerm.toLowerCase();
    const matchesSearch = 
      !s ||
      (r.full_name && r.full_name.toLowerCase().includes(s)) ||
      (r.enrolment_no && r.enrolment_no.toLowerCase().includes(s)) ||
      (r.email && r.email.toLowerCase().includes(s)) ||
      (r.company_name_and_city && r.company_name_and_city.toLowerCase().includes(s)) ||
      (r.domain_of_company && r.domain_of_company.toLowerCase().includes(s));

    const matchesSpec = specializationFilter === 'All' || r.specialization === specializationFilter;
    const matchesSem = semesterFilter === 'All' || r.semester === semesterFilter;
    const matchesMode = modeFilter === 'All' || r.mode_of_internship === modeFilter;
    const matchesPpo = ppoFilter === 'All' || (r.is_ppo_offer && r.is_ppo_offer.includes(ppoFilter));

    return matchesSearch && matchesSpec && matchesSem && matchesMode && matchesPpo;
  });

  // Calculate statistics
  const totalCount = records.length;
  const ppoCount = records.filter(r => r.is_ppo_offer && r.is_ppo_offer.toLowerCase().includes('yes')).length;
  const completedCount = records.filter(r => r.status === 'Completed' || r.completion_letter_url).length;
  const offlineCount = records.filter(r => r.mode_of_internship === 'Offline').length;

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem 0 5rem 0' }}>
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
          gap: '0.6rem'
        }}>
          <CheckCircle2 size={18} />
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

      {/* Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem',
        backgroundColor: '#ffffff',
        padding: '1.5rem 2rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--sidebar-border)',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              {isStudent ? <GraduationCap size={14} /> : <Database size={12} />}
              {isStudent ? 'Student Application Desk' : 'Supabase Database'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 600 }}>
              {isStudent ? 'Personal Application Tracking' : 'Live Synchronization'}
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--purple-950)', margin: 0 }}>
            {isStudent ? 'My Internship Application & Status' : 'Student Internship Records Database'}
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {isStudent 
              ? 'Track your registered industrial training record, preview attached offer/completion letters, and generate official documents.' 
              : 'Central repository of MIT-ADT School of Computing student industrial internships (17 Fields).'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={loadRecords}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            title="Refresh database records"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          
          {!isStudent && (
            <>
              <button
                onClick={exportToCSV}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                title="Export database records as CSV file"
              >
                <Download size={14} />
                Export CSV
              </button>

              <button
                onClick={exportToExcel}
                className="btn btn-secondary btn-sm"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.35rem',
                  backgroundColor: '#f0fdf4',
                  borderColor: '#86efac',
                  color: '#15803d',
                  fontWeight: 600
                }}
                title="Export database records as formatted Excel (.xlsx) spreadsheet"
              >
                <FileSpreadsheet size={14} color="#16a34a" />
                Export Excel (.xlsx)
              </button>
            </>
          )}

          <button
            onClick={() => onNavigate('student-form')}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Plus size={15} />
            {isStudent ? 'Update My Application' : 'Add Student Record'}
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      {isStudent ? (
        /* Student Specific Status Cards */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem'
        }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 600 }}>
              <span>APPLICATION STATUS</span>
              <CheckCircle2 size={16} color="#16a34a" />
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#15803d', marginTop: '0.35rem' }}>
              {filteredRecords.length > 0 ? (filteredRecords[0].status || 'Submitted') : 'Pending Submission'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600, marginTop: '0.2rem' }}>
              {filteredRecords.length > 0 ? 'Record Synchronized' : 'Action Required'}
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 600 }}>
              <span>OFFER LETTER</span>
              <FileCheck2 size={16} color="#2563eb" />
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1e40af', marginTop: '0.35rem' }}>
              {filteredRecords.length > 0 && filteredRecords[0].offer_letter_url ? 'Attached (PDF)' : 'Not Uploaded'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600, marginTop: '0.2rem' }}>
              Verification Ready
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 600 }}>
              <span>COMPLETION LETTER</span>
              <Award size={16} color="#d97706" />
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#b45309', marginTop: '0.35rem' }}>
              {filteredRecords.length > 0 && filteredRecords[0].completion_letter_url ? 'Attached' : 'Pending'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600, marginTop: '0.2rem' }}>
              Attach upon finishing tenure
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 600 }}>
              <span>OFFICIAL LETTERS</span>
              <Layers size={16} color="var(--purple-600)" />
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--purple-950)', marginTop: '0.35rem' }}>
              Undertaking & NOC
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: '0.2rem' }}>
              Ready for Download & Print
            </div>
          </div>
        </div>
      ) : (
        /* Faculty / Admin Institutional KPI Cards */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem'
        }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 600 }}>
              <span>TOTAL SUBMISSIONS</span>
              <Database size={16} color="var(--purple-600)" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--purple-950)', marginTop: '0.35rem' }}>
              {totalCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: '0.2rem' }}>
              All Verified Batches
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 600 }}>
              <span>PPO OPPORTUNITIES</span>
              <TrendingUp size={16} color="#2563eb" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1e40af', marginTop: '0.35rem' }}>
              {ppoCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600, marginTop: '0.2rem' }}>
              {totalCount > 0 ? Math.round((ppoCount / totalCount) * 100) : 0}% of Total Offers
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 600 }}>
              <span>COMPLETED TENURES</span>
              <Award size={16} color="#059669" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#065f46', marginTop: '0.35rem' }}>
              {completedCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600, marginTop: '0.2rem' }}>
              Completion Letter Attached
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 600 }}>
              <span>ON-SITE (OFFLINE)</span>
              <Building size={16} color="#d97706" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#92400e', marginTop: '0.35rem' }}>
              {offlineCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600, marginTop: '0.2rem' }}>
              Corporate Workstations
            </div>
          </div>
        </div>
      )}

      {/* Filter Toolbar (Hidden for Students) */}
      {!isStudent && (
        <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            {/* Search Box */}
            <div style={{ position: 'relative', gridColumn: 'span 2' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              <input
                type="text"
                placeholder="Search by student name, enrollment, email, company, domain..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px', marginBottom: 0 }}
              />
            </div>

            {/* Specialization Filter */}
            <div>
              <select
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                className="form-select"
                style={{ marginBottom: 0 }}
              >
                <option value="All">All Specializations</option>
                <option value="Computer Science & Engineering (CSE)">CSE</option>
                <option value="Artificial Intelligence & Data Science (AI & DS)">AI & DS</option>
                <option value="Information Technology (IT)">IT</option>
                <option value="Cyber Security & Forensics">Cyber Security</option>
              </select>
            </div>

            {/* Mode Filter */}
            <div>
              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="form-select"
                style={{ marginBottom: 0 }}
              >
                <option value="All">All Internship Modes</option>
                <option value="Offline">Offline (On-Site)</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Online">Online</option>
              </select>
            </div>

            {/* PPO Filter */}
            <div>
              <select
                value={ppoFilter}
                onChange={(e) => setPpoFilter(e.target.value)}
                className="form-select"
                style={{ marginBottom: 0 }}
              >
                <option value="All">All PPO Types</option>
                <option value="Yes">PPO Possibility</option>
                <option value="Performance">Performance Based</option>
                <option value="No">Internship Only</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Records Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.865rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)', color: 'var(--slate-600)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Date & Student</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Enrolment & Branch</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Company & Domain</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Tenure & Duration</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Mode & PPO</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Uploaded Documents</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Document Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-500)' }}>
                    <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem auto', color: 'var(--purple-600)' }} />
                    <div>Loading records from Supabase...</div>
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
                    <Database size={36} color="var(--slate-300)" style={{ margin: '0 auto 0.75rem auto' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-700)' }}>
                      {isStudent ? 'No internship application submitted yet' : 'No student records found'}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
                      {isStudent 
                        ? 'Please submit your internship registration (17 Fields) and upload your offer letter to track your status.' 
                        : 'Submit your first student internship record to store it in Supabase.'}
                    </p>
                    <button
                      onClick={() => onNavigate('student-form')}
                      className="btn btn-primary btn-sm"
                      style={{ margin: '0 auto' }}
                    >
                      <Plus size={14} />
                      {isStudent ? 'Submit My Internship Form' : 'Add Student Record'}
                    </button>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, idx) => (
                  <tr 
                    key={r.id || idx}
                    style={{ 
                      borderBottom: '1px solid var(--slate-100)',
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    {/* Date & Student Name */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontSize: '0.725rem', color: 'var(--slate-400)', fontWeight: 600 }}>
                        {r.submission_date || 'Today'}
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--purple-950)', fontSize: '0.925rem' }}>
                        {r.full_name}
                      </div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)' }}>
                        {r.email}
                      </div>
                    </td>

                    {/* Enrolment & Specialization */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ 
                        display: 'inline-block',
                        fontSize: '0.725rem', 
                        fontWeight: 700, 
                        backgroundColor: 'var(--purple-100)', 
                        color: 'var(--purple-800)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '0.25rem'
                      }}>
                        {r.enrolment_no}
                      </span>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-700)', fontWeight: 600 }}>
                        {r.specialization}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                        {r.semester}
                      </div>
                    </td>

                    {/* Company & Domain */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--slate-800)' }}>
                        {r.company_name_and_city}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--purple-700)', fontWeight: 600 }}>
                        {r.domain_of_company || 'Information Technology'}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--slate-400)' }}>
                        Source: {r.source_of_internship || 'Placement Cell'}
                      </div>
                    </td>

                    {/* Tenure & Duration */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.775rem', fontWeight: 700, color: 'var(--purple-900)', backgroundColor: 'var(--purple-50)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                        <Clock size={12} />
                        {r.duration || '6 Months'}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                        {r.start_date} → {r.end_date}
                      </div>
                    </td>

                    {/* Mode & PPO */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ marginBottom: '0.3rem' }}>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: r.mode_of_internship === 'Offline' ? '#ecfdf5' : r.mode_of_internship === 'Hybrid' ? '#eff6ff' : '#fef3c7',
                          color: r.mode_of_internship === 'Offline' ? '#047857' : r.mode_of_internship === 'Hybrid' ? '#1d4ed8' : '#b45309'
                        }}>
                          {r.mode_of_internship}
                        </span>
                      </div>
                      <div>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: r.is_ppo_offer?.includes('Yes') ? '#fdf2f8' : '#f1f5f9',
                          color: r.is_ppo_offer?.includes('Yes') ? '#be185d' : '#475569'
                        }}>
                          {r.is_ppo_offer?.includes('Yes') ? '★ PPO Opportunity' : 'Internship'}
                        </span>
                      </div>
                    </td>

                    {/* Uploaded Document Badges with Integrated Preview Modal */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {r.offer_letter_url ? (
                          <button
                            type="button"
                            onClick={() => openDocumentPreview(r.offer_letter_url, `${r.full_name} - Offer Letter`, r.full_name)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.75rem',
                              color: '#15803d',
                              fontWeight: 700,
                              backgroundColor: '#dcfce7',
                              padding: '0.25rem 0.55rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid #86efac',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            <Eye size={13} />
                            Preview Offer Letter PDF
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.725rem', color: 'var(--slate-400)' }}>
                            No Offer Letter
                          </span>
                        )}

                        {r.completion_letter_url ? (
                          <button
                            type="button"
                            onClick={() => openDocumentPreview(r.completion_letter_url, `${r.full_name} - Completion Certificate`, r.full_name)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.75rem',
                              color: '#0369a1',
                              fontWeight: 700,
                              backgroundColor: '#e0f2fe',
                              padding: '0.25rem 0.55rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid #7dd3fc',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            <Award size={13} />
                            Preview Completion PDF
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingCompletionRecord(r)}
                            style={{
                              border: 'none',
                              background: 'none',
                              color: 'var(--purple-600)',
                              fontSize: '0.725rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              padding: 0,
                              textAlign: 'left'
                            }}
                          >
                            + Attach Completion
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Instant Document Generation Actions */}
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {/* Auto-fill Undertaking */}
                        <button
                          onClick={() => {
                            if (onPrefillDocument) {
                              onPrefillDocument('undertaking', {
                                studentName: r.full_name,
                                rollNumber: r.enrolment_no?.slice(-7) || 'CS2022-084',
                                enrollmentNumber: r.enrolment_no,
                                contactNumber: r.contact_no,
                                email: r.email,
                                companyName: r.company_name_and_city,
                                internshipRole: `Intern - ${r.domain_of_company || 'Engineering'}`,
                                startDate: r.start_date,
                                endDate: r.end_date,
                                duration: r.duration || '6 Months',
                                location: r.company_name_and_city,
                                department: `Department of ${r.specialization || 'Computer Science & Engineering'}`,
                                universityName: 'MIT Art, Design and Technology University, Pune',
                                schoolName: 'School of Computing'
                              });
                            }
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem', color: 'var(--purple-700)', borderColor: 'var(--purple-200)' }}
                          title="Generate Undertaking Document from this Record"
                        >
                          <FileCheck2 size={13} />
                          Undertaking
                        </button>

                        {/* Auto-fill NOC */}
                        <button
                          onClick={() => {
                            if (onPrefillDocument) {
                              onPrefillDocument('noc', {
                                studentName: r.full_name,
                                rollNumber: r.enrolment_no?.slice(-7) || 'CS2022-084',
                                enrollmentNumber: r.enrolment_no,
                                course: `B.Tech in ${r.specialization || 'Computer Science & Engineering'}`,
                                className: r.semester || 'Final Year (VIII Semester)',
                                companyName: r.company_name_and_city.split(',')[0] || r.company_name_and_city,
                                companyLocation: r.company_name_and_city.split(',')[1]?.trim() || r.company_name_and_city,
                                internshipRole: `Intern - ${r.domain_of_company || 'Engineering'}`,
                                startDate: r.start_date,
                                endDate: r.end_date,
                                duration: r.duration || '6 Months'
                              });
                            }
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem', color: '#2563eb', borderColor: '#bfdbfe' }}
                          title="Generate NOC Certificate from this Record"
                        >
                          <Award size={13} />
                          NOC
                        </button>

                        {/* View Details Drawer */}
                        <button
                          onClick={() => setSelectedRecord(r)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
                          title="View Full Record (17 Fields)"
                        >
                          <Eye size={13} />
                        </button>

                        {/* Delete Record (Faculty/Admin Only - Hidden for Students) */}
                        {!isStudent && (
                          <button
                            onClick={() => handleDelete(r.id, r.full_name)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem', color: '#dc2626', borderColor: '#fecaca' }}
                            title="Delete Record"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Full View Modal (All 17 Fields) */}
      {selectedRecord && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="card animate-fade-in" style={{
            width: '100%',
            maxWidth: '750px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedRecord(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                border: 'none',
                background: 'var(--slate-100)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--slate-600)'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-primary">Supabase Record</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>ID: {selectedRecord.id}</span>
            </div>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '1.25rem' }}>
              {selectedRecord.full_name}
            </h2>

            {/* 17 Fields Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <DetailItem label="1. Date of Entry" value={selectedRecord.submission_date} />
              <DetailItem label="2. Email ID" value={selectedRecord.email} />
              <DetailItem label="3. Contact No." value={selectedRecord.contact_no} />
              <DetailItem label="4. Enrolment No." value={selectedRecord.enrolment_no} />
              <DetailItem label="5. Full Name" value={selectedRecord.full_name} />
              <DetailItem label="6. Gender" value={selectedRecord.gender} />
              <DetailItem label="7. Specialization" value={selectedRecord.specialization} />
              <DetailItem label="8. Semester" value={selectedRecord.semester} />
              <DetailItem label="9. Source of Internship" value={selectedRecord.source_of_internship} />
              <DetailItem label="10. Start Date" value={selectedRecord.start_date} />
              <DetailItem label="11. End Date" value={selectedRecord.end_date} />
              <DetailItem label="Automatic Duration" value={selectedRecord.duration} highlight />
              <DetailItem label="12. Name of Company + City" value={selectedRecord.company_name_and_city} highlight />
              <DetailItem label="13. Mode of Internship" value={selectedRecord.mode_of_internship} />
              <DetailItem label="14. Domain of Company" value={selectedRecord.domain_of_company} />
              <DetailItem label="15. Whether Offer/PPO" value={selectedRecord.is_ppo_offer} />
            </div>

            {/* Document Links with Direct PDF Preview Trigger */}
            <div style={{ padding: '1.25rem', backgroundColor: 'var(--purple-50)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--purple-950)', marginBottom: '0.75rem' }}>
                Uploaded Documents (Fields 16 & 17):
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {selectedRecord.offer_letter_url ? (
                  <button
                    type="button"
                    onClick={() => openDocumentPreview(selectedRecord.offer_letter_url, `${selectedRecord.full_name} - Offer Letter PDF`, selectedRecord.full_name)}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#16a34a', borderColor: '#86efac', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <CheckCircle2 size={14} />
                    16. Preview Offer Letter PDF
                  </button>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>16. No Offer Letter</span>
                )}

                {selectedRecord.completion_letter_url ? (
                  <button
                    type="button"
                    onClick={() => openDocumentPreview(selectedRecord.completion_letter_url, `${selectedRecord.full_name} - Completion Letter PDF`, selectedRecord.full_name)}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#0284c7', borderColor: '#7dd3fc', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Award size={14} />
                    17. Preview Completion Letter PDF
                  </button>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>17. No Completion Letter</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setSelectedRecord(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attach Completion Letter Modal */}
      {editingCompletionRecord && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.5rem' }}>
              Attach Internship Completion Letter
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1.25rem' }}>
              Student: <strong>{editingCompletionRecord.full_name}</strong> ({editingCompletionRecord.enrolment_no})
            </p>

            <form onSubmit={handleUploadCompletionSubmit}>
              <div style={{
                border: '2px dashed var(--purple-300)',
                backgroundColor: 'var(--purple-50)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                textAlign: 'center',
                marginBottom: '1.25rem',
                position: 'relative'
              }}>
                <Award size={32} color="var(--purple-600)" style={{ margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--purple-950)' }}>
                  {completionFile ? completionFile.name : 'Select Completion Certificate (PDF / Image)'}
                </div>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setCompletionFile(e.target.files[0])}
                  required
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
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setEditingCompletionRecord(null);
                    setCompletionFile(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingCompletion || !completionFile}
                  className="btn btn-primary"
                >
                  {uploadingCompletion ? 'Uploading to Supabase...' : 'Save & Attach Letter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ label, value, highlight }) => (
  <div style={{
    padding: '0.65rem 0.85rem',
    backgroundColor: highlight ? 'var(--purple-50)' : 'var(--slate-50)',
    borderRadius: 'var(--radius-sm)',
    border: highlight ? '1px solid var(--purple-200)' : '1px solid var(--slate-200)'
  }}>
    <div style={{ fontSize: '0.725rem', color: 'var(--slate-500)', fontWeight: 600 }}>{label}</div>
    <div style={{ fontSize: '0.875rem', color: highlight ? 'var(--purple-950)' : 'var(--slate-800)', fontWeight: highlight ? 700 : 500, marginTop: '0.15rem' }}>
      {value || '—'}
    </div>
  </div>
);
