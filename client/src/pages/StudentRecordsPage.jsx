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
  FileSpreadsheet,
  UserCheck,
  Check,
  XCircle,
  AlertTriangle,
  Lock
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { fetchStudentRecords, deleteStudentRecord, updateStudentRecord, uploadStudentDocument, subscribeToStudentRecords } from '../utils/supabaseClient';
import { DocumentPreviewModal } from '../components/common/DocumentPreviewModal';
import { ROLES, getFacultyCoordinators } from '../utils/auth';

export const StudentRecordsPage = ({ onNavigate, onPrefillDocument, authUser }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');
  const [ppoFilter, setPpoFilter] = useState('All');
  const [coordinatorFilter, setCoordinatorFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [facultyCoordinators, setFacultyCoordinators] = useState([]);
  const [facultyTab, setFacultyTab] = useState('assigned');
  const [isFallback, setIsFallback] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingCompletionRecord, setEditingCompletionRecord] = useState(null);
  const [completionFile, setCompletionFile] = useState(null);
  const [uploadingCompletion, setUploadingCompletion] = useState(false);
  const [notification, setNotification] = useState(null);

  const isStudent = authUser?.role === ROLES.STUDENT;
  const isFaculty = authUser?.role === ROLES.FACULTY || authUser?.role === ROLES.HOD;

  // PDF / Document Viewer Modal State
  const [previewingDoc, setPreviewingDoc] = useState({
    isOpen: false,
    url: '',
    title: '',
    studentName: ''
  });

  const loadRecords = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const res = await fetchStudentRecords();
    if (showLoading) setLoading(false);
    if (res.success) {
      setRecords(res.data);
      setIsFallback(res.isFallback || false);
    }
  };

  useEffect(() => {
    loadRecords(true);

    getFacultyCoordinators().then(list => {
      if (list && list.length > 0) setFacultyCoordinators(list);
    });

    // Subscribe to Supabase Realtime DB changes for instant multi-client live sync
    const unsubscribe = subscribeToStudentRecords(() => {
      loadRecords(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Quick Approval / Rejection / Review Handler for Faculty & Admin
  const handleStatusUpdate = async (record, newStatus) => {
    const updated = {
      ...record,
      status: newStatus,
      updated_at: new Date().toISOString()
    };

    // Instant local state update
    setRecords(prev => prev.map(r => (r.id === record.id || (record.enrolment_no && r.enrolment_no === record.enrolment_no)) ? { ...r, status: newStatus } : r));
    if (selectedRecord && (selectedRecord.id === record.id || selectedRecord.enrolment_no === record.enrolment_no)) {
      setSelectedRecord(prev => ({ ...prev, status: newStatus }));
    }

    const res = await updateStudentRecord(record.id, updated);
    if (res.success) {
      setNotification({
        type: newStatus === 'Rejected' ? 'error' : 'success',
        message: `Application for ${record.full_name} marked as "${newStatus}"!`
      });
      setTimeout(() => setNotification(null), 3500);
    } else {
      setNotification({ type: 'error', message: 'Failed to update status: ' + (res.error || 'Please try again') });
      setTimeout(() => setNotification(null), 4000);
    }
  };

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
      const publicUrl = uploadRes.publicUrl;
      const updateFields = {
        ...editingCompletionRecord,
        completion_letter_url: publicUrl,
        status: 'Completed',
        updated_at: new Date().toISOString()
      };

      // 1. Immediately update React state so UI updates instantaneously
      setRecords(prevRecords => prevRecords.map(r => {
        if (r.id === editingCompletionRecord.id ||
            (editingCompletionRecord.enrolment_no && r.enrolment_no && r.enrolment_no.toLowerCase() === editingCompletionRecord.enrolment_no.toLowerCase()) ||
            (editingCompletionRecord.email && r.email && r.email.toLowerCase() === editingCompletionRecord.email.toLowerCase()) ||
            (editingCompletionRecord.full_name && r.full_name && r.full_name.toLowerCase().trim() === editingCompletionRecord.full_name.toLowerCase().trim())) {
          return { ...r, ...updateFields };
        }
        return r;
      }));

      // 2. Persist to Supabase and cache
      const saveRes = await updateStudentRecord(editingCompletionRecord.id, updateFields);
      if (saveRes && saveRes.data && saveRes.data.length > 0) {
        const saved = saveRes.data[0];
        setRecords(prevRecords => prevRecords.map(r => {
          const isMatch = (editingCompletionRecord.enrolment_no && r.enrolment_no && r.enrolment_no.toLowerCase() === editingCompletionRecord.enrolment_no.toLowerCase()) ||
            (editingCompletionRecord.email && r.email && r.email.toLowerCase() === editingCompletionRecord.email.toLowerCase()) ||
            (editingCompletionRecord.full_name && r.full_name && r.full_name.toLowerCase().trim() === editingCompletionRecord.full_name.toLowerCase().trim());
          return isMatch ? { ...r, ...saved, completion_letter_url: publicUrl, status: 'Completed' } : r;
        }));
      }
      
      setUploadingCompletion(false);
      setEditingCompletionRecord(null);
      setCompletionFile(null);
      setNotification({ type: 'success', message: 'Completion Letter attached successfully & status updated to Completed!' });
      setTimeout(() => setNotification(null), 3500);
    } else {
      setUploadingCompletion(false);
      setNotification({ type: 'error', message: 'Failed to upload completion letter: ' + (uploadRes.error || 'Unknown error') });
      setTimeout(() => setNotification(null), 4000);
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
      "Class / Division",
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
      "Assigned Faculty Coordinator",
      "Offer Letter URL",
      "Completion Letter URL",
      "Status"
    ];

    const rows = filteredRecords.map(r => [
      `"${r.submission_date || ''}"`,
      `"${r.enrolment_no || ''}"`,
      `"${r.full_name || ''}"`,
      `"${r.class_division || ''}"`,
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
      `"${r.assigned_coordinator || 'Prof. Vaibhav Sawalkar'}"`,
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
    if (!filteredRecords || filteredRecords.length === 0) {
      alert('No student records to export.');
      return;
    }

    try {
      const excelData = filteredRecords.map((r, idx) => ({
        "Sr No": idx + 1,
        "Submission Date": r.submission_date || '',
        "Enrolment No": r.enrolment_no || '',
        "Full Name": r.full_name || '',
        "Class / Division": r.class_division || '',
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
        "Assigned Coordinator": r.assigned_coordinator || 'Prof. Vaibhav Sawalkar',
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
        { wch: 16 }, // Class / Division
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
        { wch: 28 }, // Assigned Coordinator
        { wch: 35 }, // Offer Letter URL
        { wch: 35 }, // Completion Letter URL
        { wch: 14 }  // Status
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Internship Records");

      // Generate binary array buffer
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' 
      });
      
      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `MIT_ADT_Student_Internships_${dateStr}.xlsx`;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 200);

      setNotification({ type: 'success', message: 'Excel spreadsheet (.xlsx) downloaded successfully!' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.warn('XLSX write fallback:', err);
      exportToExcelXML();
    }
  };

  const exportToExcelXML = () => {
    const headers = [
      "Sr No", "Submission Date", "Enrolment No", "Full Name", "Email ID",
      "Contact No", "Gender", "Specialization", "Semester", "Company Name & City",
      "Domain", "Source of Internship", "Start Date", "End Date", "Duration",
      "Mode of Internship", "PPO Offer", "Offer Letter URL", "Completion Letter URL", "Status"
    ];

    let xml = '<?xml version="1.0"?>\n';
    xml += '<?mso-application progid="Excel.Sheet"?>\n';
    xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
    xml += ' xmlns:o="urn:schemas-microsoft-com:office:office"\n';
    xml += ' xmlns:x="urn:schemas-microsoft-com:office:excel"\n';
    xml += ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\n';
    xml += ' xmlns:html="http://www.w3.org/TR/REC-html40">\n';
    xml += ' <Styles>\n';
    xml += '  <Style ss:ID="HeaderStyle">\n';
    xml += '   <Font ss:Bold="1" ss:Color="#FFFFFF"/>\n';
    xml += '   <Interior ss:Color="#4C1D95" ss:Pattern="Solid"/>\n';
    xml += '   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>\n';
    xml += '  </Style>\n';
    xml += ' </Styles>\n';
    xml += ' <Worksheet ss:Name="Internship Records">\n';
    xml += '  <Table>\n';

    // Header Row
    xml += '   <Row>\n';
    headers.forEach(h => {
      xml += `    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">${h}</Data></Cell>\n`;
    });
    xml += '   </Row>\n';

    // Data Rows
    filteredRecords.forEach((r, idx) => {
      xml += '   <Row>\n';
      const values = [
        idx + 1,
        r.submission_date || '',
        r.enrolment_no || '',
        r.full_name || '',
        r.email || '',
        r.contact_no || '',
        r.gender || '',
        r.specialization || '',
        r.semester || '',
        r.company_name_and_city || '',
        r.domain_of_company || '',
        r.source_of_internship || '',
        r.start_date || '',
        r.end_date || '',
        r.duration || '',
        r.mode_of_internship || '',
        r.is_ppo_offer || '',
        r.offer_letter_url || '',
        r.completion_letter_url || '',
        r.status || 'Submitted'
      ];
      values.forEach(v => {
        const safeVal = String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        xml += `    <Cell><Data ss:Type="String">${safeVal}</Data></Cell>\n`;
      });
      xml += '   </Row>\n';
    });

    xml += '  </Table>\n';
    xml += ' </Worksheet>\n';
    xml += '</Workbook>';

    const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const dateStr = new Date().toISOString().split('T')[0];
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MIT_ADT_Student_Internships_${dateStr}.xls`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 200);

    setNotification({ type: 'success', message: 'Excel file (.xls) downloaded successfully!' });
    setTimeout(() => setNotification(null), 3000);
  };

  // Role-Based Filtering:
  // If Student: Only show records belonging to the student
  // If Faculty and on 'assigned' tab: Show records assigned to this faculty coordinator
  // If All/Admin: Show all records
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
    : (isFaculty && facultyTab === 'assigned')
    ? records.filter(r => {
        const fName = authUser?.full_name?.toLowerCase();
        const fEmail = authUser?.email?.toLowerCase();
        return (
          (r.assigned_coordinator && fName && r.assigned_coordinator.toLowerCase().includes(fName)) ||
          (r.assigned_faculty_email && fEmail && r.assigned_faculty_email.toLowerCase() === fEmail) ||
          // Fallback if demo matching by last name
          (r.assigned_coordinator && fName && fName.includes('sawalkar') && r.assigned_coordinator.toLowerCase().includes('sawalkar')) ||
          (r.assigned_coordinator && fName && fName.includes('verma') && r.assigned_coordinator.toLowerCase().includes('verma')) ||
          (r.assigned_coordinator && fName && fName.includes('deshmukh') && r.assigned_coordinator.toLowerCase().includes('deshmukh'))
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
      (r.class_division && r.class_division.toLowerCase().includes(s)) ||
      (r.email && r.email.toLowerCase().includes(s)) ||
      (r.assigned_coordinator && r.assigned_coordinator.toLowerCase().includes(s)) ||
      (r.company_name_and_city && r.company_name_and_city.toLowerCase().includes(s)) ||
      (r.domain_of_company && r.domain_of_company.toLowerCase().includes(s));

    const matchesSpec = specializationFilter === 'All' || r.specialization === specializationFilter;
    const matchesSem = semesterFilter === 'All' || r.semester === semesterFilter;
    const matchesMode = modeFilter === 'All' || r.mode_of_internship === modeFilter;
    const matchesPpo = ppoFilter === 'All' || (r.is_ppo_offer && r.is_ppo_offer.includes(ppoFilter));
    const matchesCoord = coordinatorFilter === 'All' || (r.assigned_coordinator && r.assigned_coordinator.toLowerCase().includes(coordinatorFilter.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || (r.status && r.status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesSpec && matchesSem && matchesMode && matchesPpo && matchesCoord && matchesStatus;
  });

  // Calculate statistics
  const totalCount = records.length;
  const assignedCount = records.filter(r => {
    const fName = authUser?.full_name?.toLowerCase();
    return r.assigned_coordinator && fName && (r.assigned_coordinator.toLowerCase().includes(fName) || (fName.includes('sawalkar') && r.assigned_coordinator.toLowerCase().includes('sawalkar')));
  }).length;
  const pendingReviewCount = records.filter(r => {
    const fName = authUser?.full_name?.toLowerCase();
    const isAssigned = r.assigned_coordinator && fName && (r.assigned_coordinator.toLowerCase().includes(fName) || (fName.includes('sawalkar') && r.assigned_coordinator.toLowerCase().includes('sawalkar')));
    return isAssigned && (r.status === 'Submitted' || r.status === 'Under Review' || !r.status);
  }).length;
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
              {isStudent ? <GraduationCap size={14} /> : isFaculty ? <UserCheck size={14} /> : <Database size={12} />}
              {isStudent ? 'Student Application Desk' : isFaculty ? 'Faculty Review & Approval Desk' : 'Supabase Database'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 600 }}>
              {isStudent ? 'Personal Application Tracking' : isFaculty ? `Reviewer: ${authUser.full_name}` : 'Live Synchronization'}
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--purple-950)', margin: 0 }}>
            {isStudent ? 'My Internship Application & Status' : isFaculty ? 'Manage Student Internship Applications' : 'Student Internship Records Database'}
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {isStudent 
              ? 'Track your registered industrial training record, preview attached offer/completion letters, and generate official documents.' 
              : isFaculty
              ? `Review student applications assigned to you, inspect offer letters, and approve or reject submissions.`
              : 'Central repository of MIT-ADT School of Computing student industrial internships (18 Fields).'}
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
        (() => {
          const currentRec = filteredRecords.length > 0 ? filteredRecords[0] : null;
          const statusStr = currentRec?.status || 'Submitted';
          const isAppApproved = ['approved', 'verified', 'completed'].includes(statusStr.toLowerCase());
          const isAppRejected = statusStr.toLowerCase() === 'rejected';

          return (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
              marginBottom: '1.75rem'
            }}>
              {/* Card 1: Application Status */}
              <div className="card" style={{ 
                padding: '1.25rem',
                borderLeft: `4px solid ${isAppApproved ? '#16a34a' : isAppRejected ? '#dc2626' : '#2563eb'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span>APPLICATION STATUS</span>
                  {isAppApproved ? <CheckCircle2 size={18} color="#16a34a" /> : isAppRejected ? <XCircle size={18} color="#dc2626" /> : <Clock size={18} color="#2563eb" />}
                </div>
                <div style={{ 
                  fontSize: '1.35rem', 
                  fontWeight: 800, 
                  color: isAppApproved ? '#15803d' : isAppRejected ? '#be123c' : '#1e40af', 
                  marginTop: '0.35rem' 
                }}>
                  {isAppApproved 
                    ? 'Application Approved' 
                    : isAppRejected 
                    ? 'Rejected / Resubmit' 
                    : currentRec ? 'Submitted' : 'Pending Submission'}
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: isAppApproved ? '#16a34a' : isAppRejected ? '#be123c' : '#2563eb', 
                  fontWeight: 600, 
                  marginTop: '0.2rem' 
                }}>
                  {isAppApproved 
                    ? `✓ Approved by ${currentRec?.assigned_coordinator || 'Faculty Coordinator'}` 
                    : isAppRejected 
                    ? 'Please review feedback & resubmit' 
                    : currentRec 
                    ? `⏳ Waiting for Faculty Approval (${currentRec.assigned_coordinator || 'Assigned Coordinator'})` 
                    : 'Action Required • Step 1 Form'}
                </div>
              </div>

              {/* Card 2: Offer Letter */}
              <div className="card" style={{ padding: '1.25rem', borderLeft: currentRec?.offer_letter_url ? '4px solid #16a34a' : '4px solid #f59e0b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span>OFFER LETTER</span>
                  <FileCheck2 size={18} color={currentRec?.offer_letter_url ? '#16a34a' : '#d97706'} />
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: currentRec?.offer_letter_url ? '#15803d' : '#b45309', marginTop: '0.35rem' }}>
                  {currentRec?.offer_letter_url ? 'Attached (PDF)' : 'Not Uploaded'}
                </div>
                <div style={{ marginTop: '0.4rem' }}>
                  {currentRec?.offer_letter_url ? (
                    <button
                      type="button"
                      onClick={() => openDocumentPreview(currentRec.offer_letter_url, `${currentRec.full_name} - Offer Letter`, currentRec.full_name)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.725rem', padding: '0.2rem 0.5rem', color: '#15803d', borderColor: '#86efac', backgroundColor: '#f0fdf4', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Eye size={12} />
                      Preview Offer Letter
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                      Attach in Step 1 Application
                    </span>
                  )}
                </div>
              </div>

              {/* Card 3: Completion Certificate (Explicitly Locked During Active Internship) */}
              <div className="card" style={{ 
                padding: '1.25rem', 
                borderLeft: currentRec?.completion_letter_url ? '4px solid #16a34a' : '4px solid #94a3b8',
                backgroundColor: currentRec?.completion_letter_url ? '#ffffff' : '#fafafa'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span>COMPLETION CERTIFICATE</span>
                  {currentRec?.completion_letter_url ? <Award size={18} color="#16a34a" /> : <Lock size={16} color="var(--slate-400)" />}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: currentRec?.completion_letter_url ? '#15803d' : 'var(--slate-600)', marginTop: '0.35rem' }}>
                  {currentRec?.completion_letter_url ? 'Attached (PDF)' : '🔒 Locked for Now'}
                </div>
                <div style={{ marginTop: '0.4rem' }}>
                  {currentRec?.completion_letter_url ? (
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => openDocumentPreview(currentRec.completion_letter_url, `${currentRec.full_name} - Completion Certificate`, currentRec.full_name)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.725rem', padding: '0.2rem 0.5rem', color: '#0369a1', borderColor: '#7dd3fc', backgroundColor: '#f0f9ff', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <Award size={12} />
                        Preview Certificate
                      </button>
                    </div>
                  ) : (
                    <span style={{ 
                      fontSize: '0.725rem', 
                      color: 'var(--slate-500)', 
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      backgroundColor: '#f1f5f9',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <Lock size={12} /> Post-Internship Only
                    </span>
                  )}
                </div>
              </div>

              {/* Card 4: Official Letters */}
              <div className="card" style={{ 
                padding: '1.25rem',
                borderLeft: `4px solid ${isAppApproved ? '#16a34a' : '#f59e0b'}`,
                backgroundColor: isAppApproved ? '#ffffff' : '#fafafa'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span>OFFICIAL LETTERS</span>
                  {isAppApproved ? <Layers size={18} color="#16a34a" /> : <Lock size={16} color="#d97706" />}
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: isAppApproved ? '#15803d' : 'var(--slate-700)', marginTop: '0.35rem' }}>
                  Undertaking & NOC
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: isAppApproved ? '#16a34a' : '#b45309', 
                  fontWeight: 600, 
                  marginTop: '0.2rem' 
                }}>
                  {isAppApproved 
                    ? '✓ Ready for Download & Print' 
                    : '🔒 Locked (Awaiting Faculty Approval)'}
                </div>
              </div>
            </div>
          );
        })()
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

      {/* Action Required Alert Banner for Faculty & Authorities */}
      {!isStudent && pendingReviewCount > 0 && (
        <div style={{
          backgroundColor: '#fefce8',
          border: '2px solid #eab308',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 4px 14px rgba(234, 179, 8, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#ca8a04',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#854d0e' }}>
                🔔 {pendingReviewCount} Student Internship Application(s) Awaiting Your Review & Approval
              </div>
              <p style={{ fontSize: '0.85rem', color: '#a16207', margin: '0.2rem 0 0 0' }}>
                Inspect student offer letters below and click <strong>"Accept & Approve"</strong> to verify and unlock official Undertaking & NOC generation.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('Submitted');
                setFacultyTab('assigned');
              }}
              className="btn btn-sm"
              style={{ backgroundColor: '#ca8a04', color: '#ffffff', fontWeight: 800, padding: '0.35rem 0.85rem' }}
            >
              Filter Pending ({pendingReviewCount})
            </button>
          </div>
        </div>
      )}

      {/* Faculty Application Queue Tabs */}
      {isFaculty && (
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setFacultyTab('assigned')}
            className={`btn ${facultyTab === 'assigned' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '0.55rem 1.15rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
          >
            <UserCheck size={16} />
            My Assigned Student Applications ({assignedCount})
            {pendingReviewCount > 0 && (
              <span style={{ backgroundColor: '#ef4444', color: 'white', fontSize: '0.675rem', padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-full)', fontWeight: 800 }}>
                {pendingReviewCount} Action Needed
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setFacultyTab('all')}
            className={`btn ${facultyTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '0.55rem 1.15rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
          >
            <Database size={16} />
            All Department Applications ({totalCount})
          </button>
        </div>
      )}

      {/* Filter Toolbar (Hidden for Students) */}
      {!isStudent && (
        <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            {/* Search Box */}
            <div style={{ position: 'relative', gridColumn: 'span 2' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              <input
                type="text"
                placeholder="Search student, enrollment, coordinator, company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px', marginBottom: 0 }}
              />
            </div>

            {/* Coordinator Filter */}
            <div>
              <select
                value={coordinatorFilter}
                onChange={(e) => setCoordinatorFilter(e.target.value)}
                className="form-select"
                style={{ marginBottom: 0, fontWeight: 600, color: coordinatorFilter !== 'All' ? 'var(--purple-800)' : 'inherit' }}
              >
                <option value="All">All Faculty Coordinators</option>
                <option value="Prof. Vaibhav Sawalkar">Prof. Vaibhav Sawalkar</option>
                <option value="Prof. Aniket Verma">Prof. Aniket Verma</option>
                <option value="Dr. Sneha Deshmukh">Dr. Sneha Deshmukh</option>
                <option value="Prof. Dr. Jayashree Prasad">Prof. Dr. Jayashree Prasad</option>
                <option value="Prof. Dr. Swati More">Prof. Dr. Swati More</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-select"
                style={{ marginBottom: 0 }}
              >
                <option value="All">All Verification Statuses</option>
                <option value="Submitted">Submitted (Pending)</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
                <option value="Completed">Completed</option>
              </select>
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
          </div>

          {/* Quick "Assigned to Me" Filter for Faculty */}
          {authUser && (authUser.role === ROLES.FACULTY || authUser.role === ROLES.HOD) && (
            <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--slate-100)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>Quick Filter:</span>
              <button
                type="button"
                onClick={() => setCoordinatorFilter(authUser.full_name || 'Vaibhav Sawalkar')}
                className={`btn btn-sm ${coordinatorFilter === (authUser.full_name || 'Vaibhav Sawalkar') ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
              >
                <UserCheck size={13} />
                Applications Assigned to Me ({authUser.full_name})
              </button>
              {coordinatorFilter !== 'All' && (
                <button
                  type="button"
                  onClick={() => setCoordinatorFilter('All')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                >
                  Clear Filter (Show All)
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Records Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.865rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)', color: 'var(--slate-600)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Date & Student</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Enrolment & Class</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Company & Coordinator</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Tenure & Duration</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Status & Mode</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Uploaded Documents</th>
                {!isStudent && (
                  <th style={{ padding: '0.85rem 1.25rem', backgroundColor: '#f0fdf4', color: '#166534', fontWeight: 800, textAlign: 'center' }}>
                    ⚡ Coordinator Decision
                  </th>
                )}
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions & Letters</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={isStudent ? 7 : 8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-500)' }}>
                    <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem auto', color: 'var(--purple-600)' }} />
                    <div>Loading records from Supabase...</div>
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={isStudent ? 7 : 8} style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
                    <Database size={36} color="var(--slate-300)" style={{ margin: '0 auto 0.75rem auto' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-700)' }}>
                      {isStudent ? 'No internship application submitted yet' : 'No student records found'}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
                      {isStudent 
                        ? 'Please submit your internship registration (18 Fields) and upload your offer letter to track your status.' 
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

                    {/* Enrolment & Specialization & Class */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                        <span style={{ 
                          fontSize: '0.725rem', 
                          fontWeight: 700, 
                          backgroundColor: 'var(--purple-100)', 
                          color: 'var(--purple-800)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-sm)'
                        }}>
                          {r.enrolment_no}
                        </span>
                        {r.class_division && (
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            backgroundColor: 'var(--slate-100)',
                            color: 'var(--slate-700)',
                            padding: '0.15rem 0.4rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--slate-200)'
                          }}>
                            {r.class_division}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-700)', fontWeight: 600 }}>
                        {r.specialization}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                        {r.semester}
                      </div>
                    </td>

                    {/* Company & Assigned Coordinator */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--slate-800)' }}>
                        {r.company_name_and_city}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--purple-700)', fontWeight: 600 }}>
                        {r.domain_of_company || 'Information Technology'}
                      </div>
                      <div style={{ marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          backgroundColor: '#f5f3ff',
                          color: '#6d28d9',
                          border: '1px solid #ddd6fe',
                          padding: '0.15rem 0.45rem',
                          borderRadius: 'var(--radius-sm)'
                        }} title={`Assigned Faculty Coordinator: ${r.assigned_coordinator || 'Prof. Vaibhav Sawalkar'}`}>
                          <UserCheck size={11} />
                          {r.assigned_coordinator || 'Prof. Vaibhav Sawalkar'}
                        </span>
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

                    {/* Status & Mode */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      {/* Status Badge */}
                      <div style={{ marginBottom: '0.35rem' }}>
                        {(() => {
                          const rStatus = r.status || 'Submitted';
                          const isApprovedRow = ['approved', 'verified', 'completed'].includes(rStatus.toLowerCase());
                          const isRejectedRow = rStatus.toLowerCase() === 'rejected';

                          return (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              fontSize: '0.725rem',
                              fontWeight: 800,
                              padding: '0.2rem 0.6rem',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: 
                                isApprovedRow ? '#dcfce7' :
                                isRejectedRow ? '#ffe4e6' : '#eff6ff',
                              color: 
                                isApprovedRow ? '#15803d' :
                                isRejectedRow ? '#be123c' : '#1d4ed8',
                              border: '1px solid',
                              borderColor: 
                                isApprovedRow ? '#86efac' :
                                isRejectedRow ? '#fca5a5' : '#bfdbfe'
                            }}>
                              {isApprovedRow ? <CheckCircle2 size={12} /> : isRejectedRow ? <XCircle size={12} /> : <Clock size={12} />}
                              {isStudent 
                                ? (isApprovedRow ? 'Application Approved' : isRejectedRow ? 'Rejected' : 'Submitted (Waiting for Faculty Approval)')
                                : rStatus}
                            </span>
                          );
                        })()}
                      </div>

                      <div>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '0.1rem 0.4rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: r.mode_of_internship === 'Offline' ? '#f0fdf4' : r.mode_of_internship === 'Hybrid' ? '#f0f9ff' : '#fffbeb',
                          color: 'var(--slate-700)'
                        }}>
                          {r.mode_of_internship} • {r.is_ppo_offer?.includes('Yes') ? 'PPO' : 'Intern'}
                        </span>
                      </div>
                    </td>

                    {/* Uploaded Document Badges with Integrated Preview Modal */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {r.offer_letter_url ? (
                          <button
                            type="button"
                            onClick={() => openDocumentPreview(r.offer_letter_url, `${r.full_name} - Offer Letter PDF`, r.full_name)}
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
                            title="Click to preview Offer Letter PDF"
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
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <button
                              type="button"
                              onClick={() => openDocumentPreview(r.completion_letter_url, `${r.full_name} - Completion Certificate PDF`, r.full_name)}
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
                              title="Click to preview Completion Certificate PDF"
                            >
                              <Award size={13} />
                              Preview Completion PDF
                            </button>
                            {!isStudent && (
                              <button
                                type="button"
                                onClick={() => setEditingCompletionRecord(r)}
                                style={{
                                  border: 'none',
                                  background: 'none',
                                  color: 'var(--purple-600)',
                                  fontSize: '0.675rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  padding: '0 0.2rem',
                                  textAlign: 'left'
                                }}
                              >
                                Replace / Update Certificate
                              </button>
                            )}
                          </div>
                        ) : isStudent ? (
                          /* Locked Completion Option for Student */
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.725rem',
                            color: 'var(--slate-500)',
                            fontWeight: 600,
                            backgroundColor: 'var(--slate-100)',
                            padding: '0.25rem 0.55rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--slate-200)',
                            cursor: 'not-allowed'
                          }}>
                            <Lock size={12} color="var(--slate-400)" />
                            Completion (Locked for Now)
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditingCompletionRecord(r)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.725rem',
                              color: 'var(--purple-700)',
                              fontWeight: 700,
                              backgroundColor: 'var(--purple-50)',
                              padding: '0.25rem 0.55rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--purple-200)',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                            title="Attach Internship Completion Letter"
                          >
                            <Plus size={12} />
                            Attach Completion
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Dedicated Coordinator Decision Column for Faculty & Authorities */}
                    {!isStudent && (
                      <td style={{ 
                        padding: '1rem 1.25rem', 
                        backgroundColor: '#fafdfa', 
                        borderLeft: '1px solid #dcfce7',
                        borderRight: '1px solid #dcfce7',
                        textAlign: 'center', 
                        minWidth: '190px' 
                      }}>
                        {(() => {
                          const rStatus = r.status || 'Submitted';
                          const isApprovedRow = ['approved', 'verified', 'completed'].includes(rStatus.toLowerCase());
                          const isRejectedRow = rStatus.toLowerCase() === 'rejected';

                          if (isApprovedRow) {
                            return (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  fontSize: '0.775rem',
                                  fontWeight: 800,
                                  padding: '0.35rem 0.75rem',
                                  borderRadius: 'var(--radius-full)',
                                  backgroundColor: '#dcfce7',
                                  color: '#15803d',
                                  border: '1.5px solid #86efac',
                                  boxShadow: '0 1px 3px rgba(21,128,61,0.1)'
                                }}>
                                  <CheckCircle2 size={14} />
                                  Approved
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleStatusUpdate(r, 'Under Review')}
                                  style={{
                                    border: 'none',
                                    background: 'none',
                                    color: '#64748b',
                                    fontSize: '0.7rem',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    padding: '0.1rem 0.3rem'
                                  }}
                                  title="Change status back to Under Review"
                                >
                                  Change / Revoke
                                </button>
                              </div>
                            );
                          }

                          if (isRejectedRow) {
                            return (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  fontSize: '0.775rem',
                                  fontWeight: 800,
                                  padding: '0.35rem 0.75rem',
                                  borderRadius: 'var(--radius-full)',
                                  backgroundColor: '#ffe4e6',
                                  color: '#be123c',
                                  border: '1.5px solid #fca5a5'
                                }}>
                                  <XCircle size={14} />
                                  Rejected
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleStatusUpdate(r, 'Approved')}
                                  style={{
                                    border: 'none',
                                    background: 'none',
                                    color: '#15803d',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    padding: '0.1rem 0.3rem'
                                  }}
                                  title="Re-approve this application"
                                >
                                  Re-approve
                                </button>
                              </div>
                            );
                          }

                          // Pending / Submitted / Under Review -> 1-Click Accept & Approve
                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', alignItems: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleStatusUpdate(r, 'Approved')}
                                className="btn btn-sm"
                                style={{
                                  width: '100%',
                                  fontSize: '0.775rem',
                                  fontWeight: 800,
                                  padding: '0.45rem 0.85rem',
                                  backgroundColor: '#16a34a',
                                  color: '#ffffff',
                                  borderColor: '#15803d',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.4rem',
                                  boxShadow: '0 2px 4px rgba(22, 163, 74, 0.25)',
                                  borderRadius: 'var(--radius-md)',
                                  cursor: 'pointer'
                                }}
                                title="Approve and accept this student application"
                              >
                                <Check size={14} strokeWidth={3} />
                                Accept & Approve
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to reject the application for ${r.full_name}?`)) {
                                    handleStatusUpdate(r, 'Rejected');
                                  }
                                }}
                                className="btn btn-sm"
                                style={{
                                  width: '100%',
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  padding: '0.25rem 0.5rem',
                                  backgroundColor: '#ffffff',
                                  color: '#dc2626',
                                  borderColor: '#fca5a5',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.25rem',
                                  borderRadius: 'var(--radius-md)',
                                  cursor: 'pointer'
                                }}
                                title="Reject this application"
                              >
                                <XCircle size={12} />
                                Reject Application
                              </button>
                            </div>
                          );
                        })()}
                      </td>
                    )}

                    {/* Instant Document Generation & Row Actions */}
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                        {/* Student Row Approval Lock vs Unlocked Generator */}
                        {(() => {
                          const isRowApproved = ['approved', 'verified', 'completed'].includes((r.status || '').toLowerCase());
                          
                          if (isStudent && !isRowApproved) {
                            return (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                                <span style={{
                                  fontSize: '0.675rem',
                                  fontWeight: 700,
                                  color: '#b45309',
                                  backgroundColor: '#fef3c7',
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: 'var(--radius-full)',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}>
                                  <Clock size={11} /> Waiting for Faculty Approval
                                </span>

                                <div style={{ display: 'flex', gap: '0.35rem' }}>
                                  <button
                                    type="button"
                                    onClick={() => alert(`Your application is currently "${r.status || 'Submitted'}". Undertaking will unlock once approved by ${r.assigned_coordinator || 'your Faculty Coordinator'}.`)}
                                    className="btn btn-secondary btn-sm"
                                    style={{ fontSize: '0.725rem', padding: '0.25rem 0.5rem', color: 'var(--slate-400)', borderColor: 'var(--slate-300)', backgroundColor: 'var(--slate-100)', cursor: 'not-allowed' }}
                                    title="Locked until Faculty Coordinator approval"
                                  >
                                    <Lock size={11} />
                                    Undertaking
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => alert(`Your application is currently "${r.status || 'Submitted'}". NOC letter will unlock once approved by ${r.assigned_coordinator || 'your Faculty Coordinator'}.`)}
                                    className="btn btn-secondary btn-sm"
                                    style={{ fontSize: '0.725rem', padding: '0.25rem 0.5rem', color: 'var(--slate-400)', borderColor: 'var(--slate-300)', backgroundColor: 'var(--slate-100)', cursor: 'not-allowed' }}
                                    title="Locked until Faculty Coordinator approval"
                                  >
                                    <Lock size={11} />
                                    NOC
                                  </button>

                                  <button
                                    onClick={() => setSelectedRecord(r)}
                                    className="btn btn-secondary btn-sm"
                                    style={{ fontSize: '0.725rem', padding: '0.25rem 0.45rem' }}
                                    title="View Full Record (18 Fields)"
                                  >
                                    <Eye size={12} />
                                  </button>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem', flexWrap: 'wrap' }}>
                              {/* Auto-fill Undertaking */}
                              <button
                                onClick={() => {
                                  if (onPrefillDocument) {
                                    onPrefillDocument('undertaking', {
                                      studentName: r.full_name,
                                      className: r.class_division || r.semester || 'Semester VIII (Final Year)',
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
                                style={{ fontSize: '0.725rem', padding: '0.3rem 0.55rem', color: 'var(--purple-700)', borderColor: 'var(--purple-200)' }}
                                title="Generate Undertaking Document from this Record"
                              >
                                <FileCheck2 size={12} />
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
                                      className: r.class_division || r.semester || 'Final Year (VIII Semester)',
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
                                style={{ fontSize: '0.725rem', padding: '0.3rem 0.55rem', color: '#2563eb', borderColor: '#bfdbfe' }}
                                title="Generate NOC Certificate from this Record"
                              >
                                <Award size={12} />
                                NOC
                              </button>

                              {/* View Details Drawer */}
                              <button
                                onClick={() => setSelectedRecord(r)}
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: '0.725rem', padding: '0.3rem 0.45rem' }}
                                title="View Full Record (18 Fields)"
                              >
                                <Eye size={12} />
                              </button>

                              {/* Delete Record (Faculty/Admin Only - Hidden for Students) */}
                              {!isStudent && (
                                <button
                                  onClick={() => handleDelete(r.id, r.full_name)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ fontSize: '0.725rem', padding: '0.3rem 0.45rem', color: '#dc2626', borderColor: '#fecaca' }}
                                  title="Delete Record"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          );
                        })()}
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

            {/* 18 Fields Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <DetailItem label="1. Date of Entry" value={selectedRecord.submission_date} />
              <DetailItem label="2. Email ID" value={selectedRecord.email} />
              <DetailItem label="3. Contact No." value={selectedRecord.contact_no} />
              <DetailItem label="4. Enrolment No." value={selectedRecord.enrolment_no} />
              <DetailItem label="5. Full Name" value={selectedRecord.full_name} />
              <DetailItem label="6. Gender" value={selectedRecord.gender} />
              <DetailItem label="7. Specialization" value={selectedRecord.specialization} />
              <DetailItem label="8. Class / Division" value={selectedRecord.class_division || 'N/A'} highlight />
              <DetailItem label="9. Semester" value={selectedRecord.semester} />
              <DetailItem label="9. Source of Internship" value={selectedRecord.source_of_internship} />
              <DetailItem label="10. Start Date" value={selectedRecord.start_date} />
              <DetailItem label="11. End Date" value={selectedRecord.end_date} />
              <DetailItem label="Automatic Duration" value={selectedRecord.duration} highlight />
              <DetailItem label="12. Name of Company + City" value={selectedRecord.company_name_and_city} highlight />
              <DetailItem label="13. Mode of Internship" value={selectedRecord.mode_of_internship} />
              <DetailItem label="14. Domain of Company" value={selectedRecord.domain_of_company} />
              <DetailItem label="15. Whether Offer/PPO" value={selectedRecord.is_ppo_offer} />
              <DetailItem label="18. Assigned Faculty Coordinator" value={selectedRecord.assigned_coordinator || 'Prof. Vaibhav Sawalkar'} highlight />
            </div>

            {/* Faculty Decision & Status Control Box */}
            {!isStudent && (
              <div style={{ padding: '1.25rem', backgroundColor: '#faf5ff', border: '1px solid #ddd6fe', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ fontWeight: 800, color: 'var(--purple-950)', fontSize: '0.95rem' }}>
                    Faculty Verification & Decision:
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 
                      selectedRecord.status === 'Approved' || selectedRecord.status === 'Verified' ? '#dcfce7' :
                      selectedRecord.status === 'Rejected' ? '#ffe4e6' :
                      selectedRecord.status === 'Completed' ? '#e0f2fe' :
                      selectedRecord.status === 'Under Review' ? '#fef3c7' : '#f3e8ff',
                    color: 
                      selectedRecord.status === 'Approved' || selectedRecord.status === 'Verified' ? '#15803d' :
                      selectedRecord.status === 'Rejected' ? '#be123c' :
                      selectedRecord.status === 'Completed' ? '#0369a1' :
                      selectedRecord.status === 'Under Review' ? '#b45309' : '#7e22ce'
                  }}>
                    Current Status: {selectedRecord.status || 'Submitted'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(selectedRecord, 'Approved')}
                    className="btn btn-sm"
                    style={{ backgroundColor: '#16a34a', color: 'white', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Check size={14} />
                    Approve Application
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(selectedRecord, 'Under Review')}
                    className="btn btn-sm"
                    style={{ backgroundColor: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Clock size={14} />
                    Mark Under Review
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Reject application for ${selectedRecord.full_name}?`)) {
                        handleStatusUpdate(selectedRecord, 'Rejected');
                      }
                    }}
                    className="btn btn-sm"
                    style={{ backgroundColor: '#dc2626', color: 'white', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <XCircle size={14} />
                    Reject Application
                  </button>
                </div>
              </div>
            )}

            {/* Document Links with Direct PDF Preview Trigger */}
            <div style={{ padding: '1.25rem', backgroundColor: 'var(--purple-50)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--purple-950)', marginBottom: '0.75rem' }}>
                Uploaded Documents (Fields 16 & 17):
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {selectedRecord.offer_letter_url ? (
                  <button
                    type="button"
                    onClick={() => openDocumentPreview(selectedRecord.offer_letter_url, `${selectedRecord.full_name} - Offer Letter PDF`, selectedRecord.full_name)}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#16a34a', borderColor: '#86efac', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <CheckCircle2 size={14} />
                    16. Preview Offer Letter PDF
                  </button>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>16. No Offer Letter</span>
                )}

                {selectedRecord.completion_letter_url ? (
                  <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => openDocumentPreview(selectedRecord.completion_letter_url, `${selectedRecord.full_name} - Completion Letter PDF`, selectedRecord.full_name)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#0284c7', borderColor: '#7dd3fc', backgroundColor: '#f0f9ff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Award size={14} />
                      17. Preview Completion Letter PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const target = selectedRecord;
                        setSelectedRecord(null);
                        setEditingCompletionRecord(target);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                    >
                      Replace Certificate
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const target = selectedRecord;
                      setSelectedRecord(null);
                      setEditingCompletionRecord(target);
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}
                  >
                    <Plus size={13} />
                    17. Attach Completion Letter
                  </button>
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
          backgroundColor: 'rgba(15, 23, 42, 0.72)',
          backdropFilter: 'blur(6px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '520px', padding: '2rem', border: '1px solid var(--purple-300)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Award size={13} />
                Field 17: Post-Internship
              </span>
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.35rem' }}>
              {editingCompletionRecord.completion_letter_url ? 'Replace / Update Completion Letter' : 'Attach Internship Completion Letter'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1.25rem' }}>
              Student: <strong>{editingCompletionRecord.full_name}</strong> ({editingCompletionRecord.enrolment_no})
            </p>

            {editingCompletionRecord.completion_letter_url && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                fontSize: '0.8rem'
              }}>
                <span style={{ color: '#0369a1', fontWeight: 600 }}>Currently attached certificate:</span>
                <button
                  type="button"
                  onClick={() => openDocumentPreview(editingCompletionRecord.completion_letter_url, `${editingCompletionRecord.full_name} - Current Completion Certificate`, editingCompletionRecord.full_name)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.725rem', padding: '0.2rem 0.5rem' }}
                >
                  <Eye size={12} />
                  Preview Existing
                </button>
              </div>
            )}

            <form onSubmit={handleUploadCompletionSubmit}>
              <div style={{
                border: '2px dashed var(--purple-400)',
                backgroundColor: 'var(--purple-50)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem 1.25rem',
                textAlign: 'center',
                marginBottom: '1.25rem',
                position: 'relative',
                cursor: 'pointer'
              }}>
                <Award size={36} color="var(--purple-600)" style={{ margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--purple-950)' }}>
                  {completionFile ? completionFile.name : 'Select or Drop Completion Certificate'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.35rem' }}>
                  {completionFile ? `${(completionFile.size / 1024).toFixed(1)} KB • Ready to save` : 'Supported formats: PDF, JPG, PNG (Max 15MB)'}
                </div>

                <input
                  type="file"
                  id="completion_file_input"
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
                  style={{ minWidth: '180px', justifyContent: 'center' }}
                >
                  {uploadingCompletion ? 'Saving & Attaching...' : 'Save & Attach Letter'}
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
