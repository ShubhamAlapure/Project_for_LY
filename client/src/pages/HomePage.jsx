import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  Award, 
  Layers, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Building, 
  Database, 
  PlusCircle, 
  TrendingUp, 
  GraduationCap,
  Lock,
  UserCheck,
  AlertCircle,
  Briefcase,
  Users,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ROLES } from '../utils/auth';
import { fetchStudentRecords, subscribeToStudentRecords } from '../utils/supabaseClient';

export const HomePage = ({ onNavigate, onSelectDocument, authUser, hasSubmittedApp, isApproved, studentStatus }) => {
  const role = authUser ? authUser.role : ROLES.ADMIN;
  const name = authUser ? authUser.full_name : 'Shubham Alapure';
  const isStudent = role === ROLES.STUDENT;
  const isFaculty = role === ROLES.FACULTY;
  const isCentralTP = role === ROLES.CENTRAL_TP || role === ROLES.HOD;
  const isAdmin = role === ROLES.ADMIN;

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const res = await fetchStudentRecords();
      if (res && res.success && Array.isArray(res.data)) {
        setRecords(res.data);
      } else if (Array.isArray(res)) {
        setRecords(res);
      }
    } catch (err) {
      console.warn('Could not load student records for homepage stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isStudent) {
      loadRecords();
      const unsubscribe = subscribeToStudentRecords(() => {
        loadRecords();
      });
      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    }
  }, [isStudent]);

  // Compute live counts
  const totalCount = records.length;
  const pendingRecords = records.filter(r => {
    const s = (r.status || 'Pending').toLowerCase();
    return s === 'pending' || s === 'submitted' || s === 'under review';
  });
  const approvedRecords = records.filter(r => {
    const s = (r.status || '').toLowerCase();
    return s === 'approved' || s === 'freezed' || s === 'active' || s === 'completed';
  });
  const rejectedRecords = records.filter(r => {
    const s = (r.status || '').toLowerCase();
    return s === 'rejected';
  });

  const ppoRecords = records.filter(r => {
    const ppo = (r.is_ppo_offer || r.ppo_offered || '').toString().toLowerCase();
    return ppo === 'yes' || ppo === 'true' || ppo === '1';
  });

  // Undertaking & NOC counts
  const undertakingGeneratedRecords = records.filter(r => {
    const studentKey = (r.enrolment_no || r.enrollment_no || r.id || '').toString().toLowerCase();
    return r.undertaking_generated || 
           (studentKey && localStorage.getItem('mit_undertaking_doc_' + studentKey)) ||
           (r.email && localStorage.getItem('mit_undertaking_doc_' + r.email.toLowerCase())) ||
           (r.status && (r.status.toLowerCase() === 'approved' || r.status.toLowerCase() === 'completed'));
  });

  const nocGeneratedRecords = records.filter(r => {
    const studentKey = (r.enrolment_no || r.enrollment_no || r.id || '').toString().toLowerCase();
    return r.noc_generated || 
           (studentKey && localStorage.getItem('mit_noc_doc_' + studentKey)) ||
           (r.email && localStorage.getItem('mit_noc_doc_' + r.email.toLowerCase())) ||
           (r.status && (r.status.toLowerCase() === 'approved' || r.status.toLowerCase() === 'completed'));
  });

  // Top hiring companies
  const companyCounts = {};
  records.forEach(r => {
    const rawComp = r.company_name_and_city || r.company_name || r.company || '';
    const comp = rawComp.split(',')[0].trim();
    if (comp) {
      companyCounts[comp] = (companyCounts[comp] || 0) + 1;
    }
  });
  const topCompanies = Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const handleDocumentClick = (docType) => {
    if (isStudent && !isApproved) {
      if (!hasSubmittedApp) {
        alert('Please complete Step 1: Submit your Internship Application first.');
        onNavigate('student-form');
      } else {
        alert(`Your application is currently "${studentStatus || 'Pending'}". Official documents unlock once your Faculty Coordinator approves your application.`);
        onNavigate('student-records');
      }
      return;
    }
    onSelectDocument(docType);
  };

  // =========================================================================
  // 1. STUDENT VIEW (Exact same flow preserved for students)
  // =========================================================================
  if (isStudent) {
    return (
      <div className="animate-fade-in">
        {/* Portal Hero Banner */}
        <div className="portal-hero-banner">
          <div>
            <span className="portal-hero-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>●</span> STUDENT PORTAL DESK • WELCOME, {name.toUpperCase()}
            </span>
            <h1 className="portal-hero-title">
              Student Industrial Training & Document Desk
            </h1>
            <p className="portal-hero-subtitle">
              MIT-ADT University • School of Computing (SOC) • Verified Role: <strong>{role}</strong>
            </p>
          </div>

          {/* Right Stat Pills */}
          <div className="portal-stat-pill-group">
            <div className="portal-stat-pill">
              <div className="portal-stat-pill-label">Database Status</div>
              <div className="portal-stat-pill-value" style={{ color: '#86efac', fontSize: '1.05rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }}></span>
                LIVE DATABASE CONNECTED
              </div>
            </div>
            <div className="portal-stat-pill">
              <div className="portal-stat-pill-label">Portal Access</div>
              <div className="portal-stat-pill-value" style={{ color: '#ffffff', fontSize: '1.05rem', marginTop: '4px' }}>
                Student Dashboard
              </div>
            </div>
          </div>
        </div>

        {/* Student Progress Guidance Notice */}
        <div style={{
          backgroundColor: isApproved ? '#f0fdf4' : hasSubmittedApp ? '#eff6ff' : '#fefce8',
          border: `1.5px solid ${isApproved ? '#86efac' : hasSubmittedApp ? '#bfdbfe' : '#fde047'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: isApproved ? '#16a34a' : (studentStatus?.toLowerCase() === 'rejected') ? '#dc2626' : hasSubmittedApp ? '#2563eb' : '#ca8a04',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {isApproved ? <CheckCircle2 size={24} /> : (studentStatus?.toLowerCase() === 'rejected') ? <AlertCircle size={22} /> : hasSubmittedApp ? <Clock size={22} /> : <PlusCircle size={22} />}
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: isApproved ? '#166534' : (studentStatus?.toLowerCase() === 'rejected') ? '#991b1b' : hasSubmittedApp ? '#1e40af' : '#854d0e' }}>
                {isApproved 
                  ? '🎉 Application Approved & Freezed! Undertaking & NOC are now fully unlocked.' 
                  : (studentStatus?.toLowerCase() === 'rejected')
                  ? '⚠️ Application Rejected by Faculty Coordinator • Action Required'
                  : hasSubmittedApp 
                  ? `Application Submitted • Status: ${studentStatus || 'Under Review'}` 
                  : 'Action Required • Step 1: Submit Your Internship Application'}
              </div>
              <p style={{ fontSize: '0.825rem', color: isApproved ? '#15803d' : (studentStatus?.toLowerCase() === 'rejected') ? '#b91c1c' : hasSubmittedApp ? '#3b82f6' : '#a16207', margin: '0.2rem 0 0 0' }}>
                {isApproved 
                  ? 'Your Faculty Coordinator has verified and approved your application. You can now generate your official Undertaking & NOC letters.' 
                  : (studentStatus?.toLowerCase() === 'rejected')
                  ? 'Your application was rejected. Please review feedback, edit your details or re-upload your offer letter, and resubmit for approval.'
                  : hasSubmittedApp 
                  ? 'Your application has been forwarded to your Faculty Coordinator for review. Once approved, Undertaking & NOC will unlock.' 
                  : 'Please complete your internship registration and attach your Offer Letter PDF. Other modules remain locked until submitted & approved.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate((studentStatus?.toLowerCase() === 'rejected') ? 'student-form' : (hasSubmittedApp ? 'student-records' : 'student-form'))}
            className={`btn btn-sm ${isApproved ? 'btn-secondary' : 'btn-primary'}`}
            style={{ fontSize: '0.825rem', fontWeight: 700, ...(studentStatus?.toLowerCase() === 'rejected' ? { backgroundColor: '#dc2626', borderColor: '#b91c1c' } : {}) }}
          >
            {(studentStatus?.toLowerCase() === 'rejected') ? 'Update & Resubmit Now' : hasSubmittedApp ? 'Track Review Status' : 'Start Application Now'}
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 4 Main Action Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Card 1: Student Record Submission (18 Fields) */}
          <div className="card" style={{ padding: '1.75rem', position: 'relative', borderTop: '4px solid var(--purple-600)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'var(--purple-50)',
                color: 'var(--purple-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <PlusCircle size={22} />
              </div>

              <span style={{
                backgroundColor: isApproved 
                  ? '#dcfce7' 
                  : (studentStatus?.toLowerCase() === 'rejected')
                  ? '#fee2e2'
                  : hasSubmittedApp 
                  ? '#eff6ff' 
                  : '#fef08a',
                color: isApproved 
                  ? '#15803d' 
                  : (studentStatus?.toLowerCase() === 'rejected')
                  ? '#b91c1c'
                  : hasSubmittedApp 
                  ? '#1d4ed8' 
                  : '#854d0e',
                fontSize: '0.725rem',
                fontWeight: 700,
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)'
              }}>
                {isApproved 
                  ? '🔒 Approved & Freezed' 
                  : (studentStatus?.toLowerCase() === 'rejected')
                  ? '⚠️ Action Required'
                  : hasSubmittedApp 
                  ? '✓ Step 1 Submitted' 
                  : 'Step 1 • Required'}
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.4rem' }}>
              1. My Internship Application
            </h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Register your company offer, start/end dates, automatic tenure calculation, and upload valid offer letter PDF.
            </p>

            <button
              onClick={() => onNavigate('student-form')}
              className="btn btn-primary btn-sm"
              style={{ 
                width: '100%', 
                justifyContent: 'center',
                ...(studentStatus?.toLowerCase() === 'rejected' ? { backgroundColor: '#dc2626', borderColor: '#b91c1c' } : {})
              }}
            >
              {isApproved 
                ? 'View Freezed Application' 
                : (studentStatus?.toLowerCase() === 'rejected')
                ? 'Update & Resubmit Application'
                : hasSubmittedApp 
                ? 'View / Edit Application' 
                : 'Open My Application'}
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Card 2: Student Records Database / My Status */}
          <div className="card" style={{ 
            padding: '1.75rem', 
            position: 'relative', 
            borderTop: '4px solid #2563eb',
            opacity: !hasSubmittedApp ? 0.75 : 1
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {!hasSubmittedApp ? <Lock size={20} color="var(--slate-400)" /> : <CheckCircle2 size={22} />}
              </div>

              <span style={{
                backgroundColor: !hasSubmittedApp ? '#f1f5f9' : '#eff6ff',
                color: !hasSubmittedApp ? '#64748b' : '#1d4ed8',
                fontSize: '0.725rem',
                fontWeight: 700,
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)'
              }}>
                {!hasSubmittedApp ? '🔒 Step 2 Locked' : `Status: ${studentStatus || 'Submitted'}`}
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: !hasSubmittedApp ? 'var(--slate-600)' : 'var(--purple-950)', marginBottom: '0.4rem' }}>
              2. My Application Status
            </h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              {!hasSubmittedApp 
                ? '🔒 Submit Step 1 (Internship Application) to unlock tracking and review progress with your coordinator.' 
                : 'Review your verified internship details, preview uploaded offer letter, and track faculty coordinator approval.'}
            </p>

            <button
              onClick={() => {
                if (!hasSubmittedApp) {
                  alert('Please submit your Internship Application (Step 1) first.');
                  onNavigate('student-form');
                  return;
                }
                onNavigate('student-records');
              }}
              className="btn btn-secondary btn-sm"
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                color: (!hasSubmittedApp) ? 'var(--slate-500)' : '#2563eb', 
                borderColor: (!hasSubmittedApp) ? 'var(--slate-300)' : '#bfdbfe',
                backgroundColor: (!hasSubmittedApp) ? 'var(--slate-100)' : 'transparent'
              }}
            >
              {!hasSubmittedApp ? '🔒 Submit Application to Unlock' : 'Track My Application'}
              {!hasSubmittedApp ? <Lock size={14} /> : <ArrowRight size={15} />}
            </button>
          </div>

          {/* Card 3: Internship Undertaking */}
          <div className="card" style={{ 
            padding: '1.75rem', 
            position: 'relative', 
            borderTop: `4px solid ${!isApproved ? 'var(--slate-300)' : '#059669'}`,
            opacity: !isApproved ? 0.72 : 1,
            backgroundColor: !isApproved ? '#fafafa' : '#ffffff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: !isApproved ? 'var(--slate-100)' : '#ecfdf5',
                color: !isApproved ? 'var(--slate-400)' : '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {!isApproved ? <Lock size={20} /> : <FileCheck2 size={22} />}
              </div>

              <span style={{
                backgroundColor: !isApproved ? '#fef3c7' : '#ecfdf5',
                color: !isApproved ? '#b45309' : '#059669',
                fontSize: '0.725rem',
                fontWeight: 700,
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)'
              }}>
                {!isApproved ? (hasSubmittedApp ? '🔒 Awaiting Approval' : '🔒 Locked') : '✓ Unlocked'}
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: !isApproved ? 'var(--slate-600)' : 'var(--purple-950)', marginBottom: '0.4rem' }}>
              Internship Undertaking
            </h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              {!isApproved
                ? (hasSubmittedApp 
                  ? '🔒 Unlocks once your assigned Faculty Coordinator reviews and approves your internship application.'
                  : '🔒 Submit your application in Step 1 to begin the approval process for this undertaking.')
                : 'Official student undertaking document with all mandatory clauses, attendance commitments, and manual signature blocks.'}
            </p>

            <button
              onClick={() => handleDocumentClick('undertaking')}
              className="btn btn-secondary btn-sm"
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                color: !isApproved ? 'var(--slate-500)' : '#059669', 
                borderColor: !isApproved ? 'var(--slate-300)' : '#a7f3d0',
                backgroundColor: !isApproved ? 'var(--slate-100)' : 'transparent'
              }}
            >
              {!isApproved ? (hasSubmittedApp ? '🔒 Awaiting Faculty Approval' : '🔒 Submit Step 1 First') : 'Generate Undertaking'}
              {!isApproved ? <Lock size={14} /> : <ArrowRight size={15} />}
            </button>
          </div>

          {/* Card 4: No Objection Certificate (NOC) */}
          <div className="card" style={{ 
            padding: '1.75rem', 
            position: 'relative', 
            borderTop: `4px solid ${!isApproved ? 'var(--slate-300)' : '#d97706'}`,
            opacity: !isApproved ? 0.72 : 1,
            backgroundColor: !isApproved ? '#fafafa' : '#ffffff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: !isApproved ? 'var(--slate-100)' : '#fffbeb',
                color: !isApproved ? 'var(--slate-400)' : '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {!isApproved ? <Lock size={20} /> : <Award size={22} />}
              </div>

              <span style={{
                backgroundColor: !isApproved ? '#fef3c7' : '#fffbeb',
                color: !isApproved ? '#b45309' : '#b45309',
                fontSize: '0.725rem',
                fontWeight: 700,
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)'
              }}>
                {!isApproved ? (hasSubmittedApp ? '🔒 Awaiting Approval' : '🔒 Locked') : '✓ Unlocked'}
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: !isApproved ? 'var(--slate-600)' : 'var(--purple-950)', marginBottom: '0.4rem' }}>
              No Objection Certificate
            </h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              {!isApproved
                ? (hasSubmittedApp 
                  ? '🔒 Unlocks once your assigned Faculty Coordinator reviews and approves your internship application.'
                  : '🔒 Submit your application in Step 1 to begin the approval process for your NOC.')
                : 'Official NOC for corporate employers with automatic reference dispatch numbers, period certification, and faculty endorsement lines.'}
            </p>

            <button
              onClick={() => handleDocumentClick('noc')}
              className="btn btn-secondary btn-sm"
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                color: !isApproved ? 'var(--slate-500)' : '#d97706', 
                borderColor: !isApproved ? 'var(--slate-300)' : '#fde68a',
                backgroundColor: !isApproved ? 'var(--slate-100)' : 'transparent'
              }}
            >
              {!isApproved ? (hasSubmittedApp ? '🔒 Awaiting Faculty Approval' : '🔒 Submit Step 1 First') : 'Generate NOC Letter'}
              {!isApproved ? <Lock size={14} /> : <ArrowRight size={15} />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. FACULTY / COORDINATOR VIEW
  // =========================================================================
  if (isFaculty) {
    return (
      <div className="animate-fade-in">
        {/* Portal Hero Banner */}
        <div className="portal-hero-banner" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)' }}>
          <div>
            <span className="portal-hero-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.18)' }}>
              <span>●</span> FACULTY COORDINATOR DESK • WELCOME, {name.toUpperCase()}
            </span>
            <h1 className="portal-hero-title">
              Faculty Verification & Mentorship Desk
            </h1>
            <p className="portal-hero-subtitle">
              MIT-ADT University • School of Computing (SOC) • Verified Role: <strong>Faculty / Coordinator</strong>
            </p>
          </div>

          {/* Right Stat Pills */}
          <div className="portal-stat-pill-group">
            <div className="portal-stat-pill" style={{ background: 'rgba(30, 27, 75, 0.75)' }}>
              <div className="portal-stat-pill-label">Review Queue</div>
              <div className="portal-stat-pill-value" style={{ color: pendingRecords.length > 0 ? '#fde047' : '#86efac', fontSize: '1.25rem', marginTop: '4px' }}>
                {pendingRecords.length} Pending
              </div>
            </div>
            <div className="portal-stat-pill" style={{ background: 'rgba(30, 27, 75, 0.75)' }}>
              <div className="portal-stat-pill-label">Portal Access</div>
              <div className="portal-stat-pill-value" style={{ color: '#ffffff', fontSize: '1.05rem', marginTop: '4px' }}>
                Faculty Desk
              </div>
            </div>
          </div>
        </div>

        {/* Top KPI Metrics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b', backgroundColor: '#fffdfa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Reviews</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#92400e' }}>{pendingRecords.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '0.25rem' }}>Applications awaiting approval</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981', backgroundColor: '#fafdfb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Approved Mentees</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#065f46' }}>{approvedRecords.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#047857', marginTop: '0.25rem' }}>Verified & authorized for training</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #059669', backgroundColor: '#f9fdfa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Undertakings Signed</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileCheck2 size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#14532d' }}>{undertakingGeneratedRecords.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#15803d', marginTop: '0.25rem' }}>Mandatory compliance clauses generated</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #6366f1', backgroundColor: '#fafaff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dispatched NOCs</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#3730a3' }}>{nocGeneratedRecords.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#4338ca', marginTop: '0.25rem' }}>Official NOC letters issued</div>
          </div>
        </div>

        {/* 3 Action Cards for Faculty */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Card 1: Review & Approve Applications */}
          <div className="card" style={{ padding: '1.75rem', position: 'relative', borderTop: '4px solid #4f46e5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#eef2ff',
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserCheck size={22} />
              </div>

              <span style={{
                backgroundColor: pendingRecords.length > 0 ? '#fef3c7' : '#dcfce7',
                color: pendingRecords.length > 0 ? '#b45309' : '#15803d',
                fontSize: '0.725rem',
                fontWeight: 700,
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)'
              }}>
                {pendingRecords.length > 0 ? `⚠️ ${pendingRecords.length} Pending Review` : '✓ All Reviewed'}
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.4rem' }}>
              Student Review & Approval Desk
            </h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Inspect student offer letters, verify internship criteria, period dates, stipends, and issue instant 1-click Approval or Rejection decisions.
            </p>

            <button
              onClick={() => onNavigate('student-records')}
              className="btn btn-primary btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Open Approval Desk ({pendingRecords.length} Pending)
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Card 2: Generated Undertakings Desk */}
          <div className="card" style={{ padding: '1.75rem', position: 'relative', borderTop: '4px solid #059669' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileCheck2 size={22} />
              </div>

              <span style={{
                backgroundColor: '#ecfdf5',
                color: '#059669',
                fontSize: '0.725rem',
                fontWeight: 700,
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)'
              }}>
                {undertakingGeneratedRecords.length} Signed
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.4rem' }}>
              Generated Undertakings Desk
            </h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              View all students who generated their institutional undertakings. Preview live A4 replicas and inspect student compliance commitments.
            </p>

            <button
              onClick={() => onSelectDocument('undertaking')}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center', color: '#059669', borderColor: '#a7f3d0' }}
            >
              Open Undertakings Desk
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Card 3: Generated NOC Letters Desk */}
          <div className="card" style={{ padding: '1.75rem', position: 'relative', borderTop: '4px solid #d97706' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#fffbeb',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Award size={22} />
              </div>

              <span style={{
                backgroundColor: '#fffbeb',
                color: '#b45309',
                fontSize: '0.725rem',
                fontWeight: 700,
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)'
              }}>
                {nocGeneratedRecords.length} Dispatched
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.4rem' }}>
              Generated NOC Letters Desk
            </h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Inspect dispatched No Objection Certificates issued with unique dispatch numbers and faculty coordinator endorsements.
            </p>

            <button
              onClick={() => onSelectDocument('noc')}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center', color: '#d97706', borderColor: '#fde68a' }}
            >
              Open NOC Letters Desk
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Quick Review Queue Widget */}
        {pendingRecords.length > 0 && (
          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Clock size={20} color="#d97706" />
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--purple-950)' }}>
                  Action Needed: Pending Student Submissions ({pendingRecords.length})
                </h4>
              </div>
              <button 
                onClick={() => onNavigate('student-records')}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.785rem' }}
              >
                Review All in Approval Desk
                <ArrowRight size={13} />
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.865rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid var(--slate-200)', textAlign: 'left' }}>
                    <th style={{ padding: '0.65rem 0.85rem', color: 'var(--slate-600)', fontWeight: 700 }}>Student Name</th>
                    <th style={{ padding: '0.65rem 0.85rem', color: 'var(--slate-600)', fontWeight: 700 }}>Enrolment No</th>
                    <th style={{ padding: '0.65rem 0.85rem', color: 'var(--slate-600)', fontWeight: 700 }}>Company & Role</th>
                    <th style={{ padding: '0.65rem 0.85rem', color: 'var(--slate-600)', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '0.65rem 0.85rem', color: 'var(--slate-600)', fontWeight: 700, textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRecords.slice(0, 5).map((rec, i) => (
                    <tr key={rec.id || i} style={{ borderBottom: '1px solid var(--slate-100)', transition: 'background-color 0.15s' }}>
                      <td style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: 'var(--purple-950)' }}>
                        {rec.full_name || rec.student_name || 'Student'}
                      </td>
                      <td style={{ padding: '0.75rem 0.85rem', color: 'var(--slate-600)', fontFamily: 'monospace' }}>
                        {rec.enrolment_no || rec.enrollment_no || 'ADT-'}
                      </td>
                      <td style={{ padding: '0.75rem 0.85rem', color: 'var(--slate-700)' }}>
                        <div style={{ fontWeight: 600 }}>{rec.company_name_and_city || rec.company_name || 'Industry Partner'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{rec.specialization || rec.domain_of_company || 'Intern'}</div>
                      </td>
                      <td style={{ padding: '0.75rem 0.85rem' }}>
                        <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 700 }}>
                          ⏳ Pending Review
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.85rem', textAlign: 'right' }}>
                        <button
                          onClick={() => onNavigate('student-records')}
                          className="btn btn-sm btn-primary"
                          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                        >
                          Review & Decide
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 3. CENTRAL T&P / HOD VIEW
  // =========================================================================
  if (isCentralTP) {
    return (
      <div className="animate-fade-in">
        {/* Portal Hero Banner */}
        <div className="portal-hero-banner" style={{ background: 'linear-gradient(135deg, #2b1055 0%, #4c1d95 50%, #6d28d9 100%)' }}>
          <div>
            <span className="portal-hero-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.18)' }}>
              <span>●</span> CORPORATE RELATIONS & PLACEMENT CELL (CRPC) • WELCOME, {name.toUpperCase()}
            </span>
            <h1 className="portal-hero-title">
              Central T&P & Placement Intelligence Hub
            </h1>
            <p className="portal-hero-subtitle">
              MIT-ADT University • School of Computing (SOC) • Verified Role: <strong>{role}</strong>
            </p>
          </div>

          {/* Right Stat Pills */}
          <div className="portal-stat-pill-group">
            <div className="portal-stat-pill" style={{ background: 'rgba(43, 16, 85, 0.75)' }}>
              <div className="portal-stat-pill-label">Total Placements</div>
              <div className="portal-stat-pill-value" style={{ color: '#86efac', fontSize: '1.25rem', marginTop: '4px' }}>
                {totalCount} Active
              </div>
            </div>
            <div className="portal-stat-pill" style={{ background: 'rgba(43, 16, 85, 0.75)' }}>
              <div className="portal-stat-pill-label">Portal Access</div>
              <div className="portal-stat-pill-value" style={{ color: '#ffffff', fontSize: '1.05rem', marginTop: '4px' }}>
                Central T&P Desk
              </div>
            </div>
          </div>
        </div>

        {/* Top KPI Metrics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #7c3aed', backgroundColor: '#faf5ff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6d28d9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Registrations</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#4c1d95' }}>{totalCount}</div>
            <div style={{ fontSize: '0.75rem', color: '#6d28d9', marginTop: '0.25rem' }}>Active 6-month candidates</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981', backgroundColor: '#fafdfb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified Placements</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#065f46' }}>{approvedRecords.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#047857', marginTop: '0.25rem' }}>Faculty & Cell Approved</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #2563eb', backgroundColor: '#f8faff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hiring Companies</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1e40af' }}>{Object.keys(companyCounts).length}</div>
            <div style={{ fontSize: '0.75rem', color: '#1d4ed8', marginTop: '0.25rem' }}>Active corporate partners</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #d97706', backgroundColor: '#fffdfa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Corporate NOCs</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#92400e' }}>{nocGeneratedRecords.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '0.25rem' }}>Dispatched official NOCs</div>
          </div>
        </div>

        {/* 3 Action Cards for Central T&P */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Card 1: Applications & Placement Records */}
          <div className="card" style={{ padding: '1.75rem', position: 'relative', borderTop: '4px solid #7c3aed' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#f5f3ff',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Database size={22} />
              </div>

              <span style={{
                backgroundColor: '#ede9fe',
                color: '#6d28d9',
                fontSize: '0.725rem',
                fontWeight: 700,
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)'
              }}>
                {totalCount} Total Records
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.4rem' }}>
              Student Placement Records & Database
            </h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Search across all department students, filter by hiring company, inspect offer letters, and export spreadsheet reports.
            </p>

            <button
              onClick={() => onNavigate('student-records')}
              className="btn btn-primary btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Open Placement Records Database
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Card 2: Corporate NOC Letters Hub */}
          <div className="card" style={{ padding: '1.75rem', position: 'relative', borderTop: '4px solid #d97706' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#fffbeb',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Award size={22} />
              </div>

              <span style={{
                backgroundColor: '#fef3c7',
                color: '#b45309',
                fontSize: '0.725rem',
                fontWeight: 700,
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)'
              }}>
                {nocGeneratedRecords.length} Dispatched
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.4rem' }}>
              Corporate NOC Letters Hub
            </h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Inspect and verify No Objection Certificates issued for recruiting partners with institutional reference tracking.
            </p>

            <button
              onClick={() => onSelectDocument('noc')}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center', color: '#d97706', borderColor: '#fde68a' }}
            >
              Open NOC Verification Hub
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Card 3: Undertakings Compliance Hub */}
          <div className="card" style={{ padding: '1.75rem', position: 'relative', borderTop: '4px solid #059669' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileCheck2 size={22} />
              </div>

              <span style={{
                backgroundColor: '#ecfdf5',
                color: '#059669',
                fontSize: '0.725rem',
                fontWeight: 700,
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)'
              }}>
                {undertakingGeneratedRecords.length} Signed
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.4rem' }}>
              Undertakings Compliance Desk
            </h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Monitor student compliance agreements, attendance undertakings, and verify signed official commitments.
            </p>

            <button
              onClick={() => onSelectDocument('undertaking')}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center', color: '#059669', borderColor: '#a7f3d0' }}
            >
              Open Undertakings Desk
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Top Corporate Recruiters Summary */}
        {topCompanies.length > 0 && (
          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Building size={20} color="#7c3aed" />
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--purple-950)' }}>
                  Top Recruiting Partners & Corporate Distribution
                </h4>
              </div>
              <span style={{ fontSize: '0.785rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                {Object.keys(companyCounts).length} Unique Companies
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {topCompanies.map(([comp, count], i) => (
                <div key={i} style={{
                  flex: '1 1 180px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '0.865rem', fontWeight: 700, color: 'var(--purple-950)' }}>{comp}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>Recruiting Partner</div>
                  </div>
                  <span style={{
                    backgroundColor: '#ede9fe',
                    color: '#6d28d9',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.25rem 0.55rem',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {count} {count === 1 ? 'Intern' : 'Interns'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 4. MASTER ADMIN DASHBOARD VIEW
  // =========================================================================
  return (
    <div className="animate-fade-in">
      {/* Master Admin Hero Banner */}
      <div className="portal-hero-banner" style={{ background: 'linear-gradient(135deg, #1e0e38 0%, #3b136f 50%, #581c87 100%)' }}>
        <div>
          <span className="portal-hero-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.18)' }}>
            <span>●</span> MASTER EXECUTIVE ADMINISTRATOR DESK • WELCOME, {name.toUpperCase()}
          </span>
          <h1 className="portal-hero-title">
            Master Administrative & System Overview
          </h1>
          <p className="portal-hero-subtitle">
            MIT-ADT University • School of Computing (SOC) • Verified Role: <strong>Master Administrator</strong>
          </p>
        </div>

        {/* Right Stat Pills */}
        <div className="portal-stat-pill-group">
          <div className="portal-stat-pill" style={{ background: 'rgba(30, 14, 56, 0.85)' }}>
            <div className="portal-stat-pill-label">Database Status</div>
            <div className="portal-stat-pill-value" style={{ color: '#86efac', fontSize: '1.05rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }}></span>
              CONNECTED
            </div>
          </div>
          <div className="portal-stat-pill" style={{ background: 'rgba(30, 14, 56, 0.85)' }}>
            <div className="portal-stat-pill-label">Total DB Records</div>
            <div className="portal-stat-pill-value" style={{ color: '#ffffff', fontSize: '1.25rem', marginTop: '4px' }}>
              {totalCount}
            </div>
          </div>
        </div>
      </div>

      {/* Top KPI Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #7c3aed', backgroundColor: '#faf5ff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6d28d9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Master Records</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#4c1d95' }}>{totalCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#6d28d9', marginTop: '0.25rem' }}>System-wide student database</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b', backgroundColor: '#fffdfa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Reviews</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#92400e' }}>{pendingRecords.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '0.25rem' }}>Awaiting faculty approval</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981', backgroundColor: '#fafdfb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified & Approved</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#065f46' }}>{approvedRecords.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#047857', marginTop: '0.25rem' }}>Active approved files</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #0284c7', backgroundColor: '#f0f9ff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Documents</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#075985' }}>{undertakingGeneratedRecords.length + nocGeneratedRecords.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#0369a1', marginTop: '0.25rem' }}>Undertakings & NOCs generated</div>
        </div>
      </div>

      {/* 4 Main Action Cards Grid for Admin */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Card 1: Register / Add Student Record */}
        <div className="card" style={{ padding: '1.75rem', position: 'relative', borderTop: '4px solid var(--purple-600)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'var(--purple-50)',
              color: 'var(--purple-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PlusCircle size={22} />
            </div>

            <span style={{
              backgroundColor: 'var(--purple-100)',
              color: 'var(--purple-800)',
              fontSize: '0.725rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)'
            }}>
              18 Fields • Full Entry
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.4rem' }}>
            Register Student Record
          </h3>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Directly register new student internship records, upload offer letters, configure duration calculation, and assign coordinators.
          </p>

          <button
            onClick={() => onNavigate('student-form')}
            className="btn btn-primary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Register New Record
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Card 2: Master Records & Approvals Database */}
        <div className="card" style={{ padding: '1.75rem', position: 'relative', borderTop: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Database size={22} />
            </div>

            <span style={{
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              fontSize: '0.725rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)'
            }}>
              Master Database
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.4rem' }}>
            Master Records & Approvals Desk
          </h3>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Manage all student records, review/edit applications, approve/revoke submissions, and export full reports.
          </p>

          <button
            onClick={() => onNavigate('student-records')}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center', color: '#2563eb', borderColor: '#bfdbfe' }}
          >
            Open Master Records Desk
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Card 3: Master Undertakings Desk */}
        <div className="card" style={{ padding: '1.75rem', position: 'relative', borderTop: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileCheck2 size={22} />
            </div>

            <span style={{
              backgroundColor: '#dcfce7',
              color: '#15803d',
              fontSize: '0.725rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)'
            }}>
              {undertakingGeneratedRecords.length} Generated
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.4rem' }}>
            Master Undertakings Desk
          </h3>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Inspect, preview, and download all student undertaking documents generated system-wide across all departments.
          </p>

          <button
            onClick={() => onSelectDocument('undertaking')}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center', color: '#059669', borderColor: '#a7f3d0' }}
          >
            Open Undertakings Desk
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Card 4: Master NOC Letters Desk */}
        <div className="card" style={{ padding: '1.75rem', position: 'relative', borderTop: '4px solid #d97706' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#fffbeb',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Award size={22} />
            </div>

            <span style={{
              backgroundColor: '#fef3c7',
              color: '#b45309',
              fontSize: '0.725rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)'
            }}>
              {nocGeneratedRecords.length} Dispatched
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.4rem' }}>
            Master NOC Letters Desk
          </h3>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Inspect, preview, and print all No Objection Certificates with university dispatch reference codes and signatory tracking.
          </p>

          <button
            onClick={() => onSelectDocument('noc')}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center', color: '#d97706', borderColor: '#fde68a' }}
          >
            Open NOC Letters Desk
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
