import React from 'react';
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
  UserCheck
} from 'lucide-react';
import { ROLES } from '../utils/auth';

export const HomePage = ({ onNavigate, onSelectDocument, authUser, hasSubmittedApp, isApproved, studentStatus }) => {
  const role = authUser ? authUser.role : ROLES.ADMIN;
  const name = authUser ? authUser.full_name : 'Shubham Alapure';
  const isStudent = role === ROLES.STUDENT;

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

  return (
    <div className="animate-fade-in">
      {/* Portal Hero Banner */}
      <div className="portal-hero-banner">
        <div>
          <span className="portal-hero-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>●</span> {role.toUpperCase()} PORTAL DESK • WELCOME, {name.toUpperCase()}
          </span>
          <h1 className="portal-hero-title">
            {isStudent ? 'Student Industrial Training & Document Desk' : 'Student Internship Management Portal'}
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
              SUPABASE CONNECTED
            </div>
          </div>
          <div className="portal-stat-pill">
            <div className="portal-stat-pill-label">Portal Access</div>
            <div className="portal-stat-pill-value" style={{ color: '#ffffff', fontSize: '1.05rem', marginTop: '4px' }}>
              {role} Dashboard
            </div>
          </div>
        </div>
      </div>

      {/* Student Progress Guidance Notice */}
      {isStudent && (
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
              backgroundColor: isApproved ? '#16a34a' : hasSubmittedApp ? '#2563eb' : '#ca8a04',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {isApproved ? <CheckCircle2 size={24} /> : hasSubmittedApp ? <Clock size={22} /> : <PlusCircle size={22} />}
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: isApproved ? '#166534' : hasSubmittedApp ? '#1e40af' : '#854d0e' }}>
                {isApproved 
                  ? '🎉 Application Approved! Undertaking & NOC are now fully unlocked.' 
                  : hasSubmittedApp 
                  ? `Application Submitted • Status: ${studentStatus || 'Under Review'}` 
                  : 'Action Required • Step 1: Submit Your Internship Application'}
              </div>
              <p style={{ fontSize: '0.825rem', color: isApproved ? '#15803d' : hasSubmittedApp ? '#3b82f6' : '#a16207', margin: '0.2rem 0 0 0' }}>
                {isApproved 
                  ? 'Your Faculty Coordinator has verified your offer letter. You can now generate your official Undertaking & NOC letters.' 
                  : hasSubmittedApp 
                  ? 'Your application has been forwarded to your Faculty Coordinator for review. Once approved, Undertaking & NOC will unlock.' 
                  : 'Please complete your internship registration and attach your Offer Letter PDF. Other modules remain locked until submitted & approved.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate(hasSubmittedApp ? 'student-records' : 'student-form')}
            className={`btn btn-sm ${isApproved ? 'btn-secondary' : 'btn-primary'}`}
            style={{ fontSize: '0.825rem', fontWeight: 700 }}
          >
            {hasSubmittedApp ? 'Track Review Status' : 'Start Application Now'}
            <ArrowRight size={14} />
          </button>
        </div>
      )}

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
              backgroundColor: (isStudent && hasSubmittedApp) ? '#dcfce7' : '#fef08a',
              color: (isStudent && hasSubmittedApp) ? '#15803d' : '#854d0e',
              fontSize: '0.725rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)'
            }}>
              {isStudent ? (hasSubmittedApp ? '✓ Step 1 Submitted' : 'Step 1 • Required') : '18 Fields • Uploads'}
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.4rem' }}>
            {isStudent ? '1. My Internship Application' : 'Submit Student Internship'}
          </h3>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            {isStudent 
              ? 'Register your company offer, start/end dates, automatic tenure calculation, and upload valid offer letter PDF.'
              : 'Register complete student internship details with automatic duration calculation and offer letter upload.'}
          </p>

          <button
            onClick={() => onNavigate('student-form')}
            className="btn btn-primary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {isStudent ? (hasSubmittedApp ? 'Edit / View Application' : 'Open My Application') : 'Open Submission Form'}
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Card 2: Student Records Database / My Status */}
        <div className="card" style={{ 
          padding: '1.75rem', 
          position: 'relative', 
          borderTop: '4px solid #2563eb',
          opacity: (isStudent && !hasSubmittedApp) ? 0.75 : 1
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
              {(isStudent && !hasSubmittedApp) ? <Lock size={20} color="var(--slate-400)" /> : <CheckCircle2 size={22} />}
            </div>

            <span style={{
              backgroundColor: (isStudent && !hasSubmittedApp) ? '#f1f5f9' : '#eff6ff',
              color: (isStudent && !hasSubmittedApp) ? '#64748b' : '#1d4ed8',
              fontSize: '0.725rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)'
            }}>
              {isStudent ? (!hasSubmittedApp ? '🔒 Step 2 Locked' : `Status: ${studentStatus || 'Submitted'}`) : 'Live Database'}
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: (isStudent && !hasSubmittedApp) ? 'var(--slate-600)' : 'var(--purple-950)', marginBottom: '0.4rem' }}>
            {isStudent ? '2. My Application Status' : 'Manage Student Applications'}
          </h3>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            {isStudent 
              ? (!hasSubmittedApp 
                ? '🔒 Submit Step 1 (Internship Application) to unlock tracking and review progress with your coordinator.' 
                : 'Review your verified internship details, preview uploaded offer letter, and track faculty coordinator approval.')
              : 'Browse, filter, review student applications, inspect offer letters, and issue one-click approval or rejection.'}
          </p>

          <button
            onClick={() => {
              if (isStudent && !hasSubmittedApp) {
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
              color: (isStudent && !hasSubmittedApp) ? 'var(--slate-500)' : '#2563eb', 
              borderColor: (isStudent && !hasSubmittedApp) ? 'var(--slate-300)' : '#bfdbfe',
              backgroundColor: (isStudent && !hasSubmittedApp) ? 'var(--slate-100)' : 'transparent'
            }}
          >
            {isStudent ? (!hasSubmittedApp ? '🔒 Submit Application to Unlock' : 'Track My Application') : 'Manage Student Records'}
            {(isStudent && !hasSubmittedApp) ? <Lock size={14} /> : <ArrowRight size={15} />}
          </button>
        </div>

        {/* Card 3: Internship Undertaking */}
        <div className="card" style={{ 
          padding: '1.75rem', 
          position: 'relative', 
          borderTop: `4px solid ${isStudent && !isApproved ? 'var(--slate-300)' : '#059669'}`,
          opacity: (isStudent && !isApproved) ? 0.72 : 1,
          backgroundColor: (isStudent && !isApproved) ? '#fafafa' : '#ffffff'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: (isStudent && !isApproved) ? 'var(--slate-100)' : '#ecfdf5',
              color: (isStudent && !isApproved) ? 'var(--slate-400)' : '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {(isStudent && !isApproved) ? <Lock size={20} /> : <FileCheck2 size={22} />}
            </div>

            <span style={{
              backgroundColor: (isStudent && !isApproved) ? '#fef3c7' : '#ecfdf5',
              color: (isStudent && !isApproved) ? '#b45309' : '#059669',
              fontSize: '0.725rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)'
            }}>
              {isStudent ? (!isApproved ? (hasSubmittedApp ? '🔒 Awaiting Approval' : '🔒 Locked') : '✓ Unlocked') : 'Clauses I - IX'}
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: (isStudent && !isApproved) ? 'var(--slate-600)' : 'var(--purple-950)', marginBottom: '0.4rem' }}>
            Internship Undertaking
          </h3>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            {isStudent && !isApproved
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
              color: (isStudent && !isApproved) ? 'var(--slate-500)' : '#059669', 
              borderColor: (isStudent && !isApproved) ? 'var(--slate-300)' : '#a7f3d0',
              backgroundColor: (isStudent && !isApproved) ? 'var(--slate-100)' : 'transparent'
            }}
          >
            {isStudent && !isApproved ? (hasSubmittedApp ? '🔒 Awaiting Faculty Approval' : '🔒 Submit Step 1 First') : 'Generate Undertaking'}
            {isStudent && !isApproved ? <Lock size={14} /> : <ArrowRight size={15} />}
          </button>
        </div>

        {/* Card 4: No Objection Certificate (NOC) */}
        <div className="card" style={{ 
          padding: '1.75rem', 
          position: 'relative', 
          borderTop: `4px solid ${isStudent && !isApproved ? 'var(--slate-300)' : '#d97706'}`,
          opacity: (isStudent && !isApproved) ? 0.72 : 1,
          backgroundColor: (isStudent && !isApproved) ? '#fafafa' : '#ffffff'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: (isStudent && !isApproved) ? 'var(--slate-100)' : '#fffbeb',
              color: (isStudent && !isApproved) ? 'var(--slate-400)' : '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {(isStudent && !isApproved) ? <Lock size={20} /> : <Award size={22} />}
            </div>

            <span style={{
              backgroundColor: (isStudent && !isApproved) ? '#fef3c7' : '#fffbeb',
              color: (isStudent && !isApproved) ? '#b45309' : '#b45309',
              fontSize: '0.725rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)'
            }}>
              {isStudent ? (!isApproved ? (hasSubmittedApp ? '🔒 Awaiting Approval' : '🔒 Locked') : '✓ Unlocked') : '3 Signatories'}
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: (isStudent && !isApproved) ? 'var(--slate-600)' : 'var(--purple-950)', marginBottom: '0.4rem' }}>
            No Objection Certificate
          </h3>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.865rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            {isStudent && !isApproved
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
              color: (isStudent && !isApproved) ? 'var(--slate-500)' : '#d97706', 
              borderColor: (isStudent && !isApproved) ? 'var(--slate-300)' : '#fde68a',
              backgroundColor: (isStudent && !isApproved) ? 'var(--slate-100)' : 'transparent'
            }}
          >
            {isStudent && !isApproved ? (hasSubmittedApp ? '🔒 Awaiting Faculty Approval' : '🔒 Submit Step 1 First') : 'Generate NOC Letter'}
            {isStudent && !isApproved ? <Lock size={14} /> : <ArrowRight size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
};
