import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { HomePage } from './pages/HomePage';
import { DocumentSelectionPage } from './pages/DocumentSelectionPage';
import { UndertakingFormPage } from './pages/UndertakingFormPage';
import { NOCFormPage } from './pages/NOCFormPage';
import { DocumentPreviewPage } from './pages/DocumentPreviewPage';
import { StudentSubmissionPage } from './pages/StudentSubmissionPage';
import { StudentRecordsPage } from './pages/StudentRecordsPage';
import { LandingPage } from './pages/LandingPage';
import { ChangePasswordPage } from './pages/ChangePasswordPage';
import { getCurrentUser, logoutUser, ROLES, ROLE_CONFIG } from './utils/auth';
import { fetchStudentRecords, subscribeToStudentRecords } from './utils/supabaseClient';
import { Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import './index.css';
import './print.css';

export const App = () => {
  const [authUser, setAuthUser] = useState(() => getCurrentUser());
  const [currentRoute, setCurrentRoute] = useState(() => {
    const user = getCurrentUser();
    return user ? 'home' : 'login';
  });
  const [activeDocType, setActiveDocType] = useState('undertaking');
  const [previewData, setPreviewData] = useState(null);
  const [undertakingPrefill, setUndertakingPrefill] = useState(null);
  const [nocPrefill, setNocPrefill] = useState(null);
  const [hasSubmittedApp, setHasSubmittedApp] = useState(false);
  const [studentStatus, setStudentStatus] = useState(null);
  const [isApproved, setIsApproved] = useState(false);

  // Check if active student already has submitted application and get approval status with real-time sync
  useEffect(() => {
    const checkSubmission = async () => {
      if (!authUser) return;
      if (authUser.role === ROLES.STUDENT) {
        try {
          const { data } = await fetchStudentRecords();
          if (data && data.length > 0) {
            const userEmail = authUser.email?.toLowerCase();
            const userEnroll = authUser.enrolment_no?.toLowerCase();
            const userName = authUser.full_name?.toLowerCase();
            const found = data.find(r => 
              (r.email && userEmail && r.email.toLowerCase() === userEmail) ||
              (r.enrolment_no && userEnroll && r.enrolment_no.toLowerCase() === userEnroll) ||
              (r.full_name && userName && r.full_name.toLowerCase().includes(userName))
            );
            if (found) {
              setHasSubmittedApp(true);
              const status = found.status || 'Submitted';
              setStudentStatus(status);
              const approved = ['approved', 'verified', 'completed'].includes(status.toLowerCase());
              setIsApproved(approved);
            } else {
              setHasSubmittedApp(false);
              setStudentStatus(null);
              setIsApproved(false);
            }
          } else {
            setHasSubmittedApp(false);
            setStudentStatus(null);
            setIsApproved(false);
          }
        } catch (err) {
          console.error('Error checking student submission status:', err);
        }
      } else {
        setHasSubmittedApp(true);
        setIsApproved(true);
        setStudentStatus('Approved');
      }
    };

    checkSubmission();

    // Live multi-browser / multi-device realtime synchronization
    const unsubscribe = subscribeToStudentRecords(() => {
      checkSubmission();
    });

    const handleFocus = () => {
      checkSubmission();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      if (unsubscribe) unsubscribe();
      window.removeEventListener('focus', handleFocus);
    };
  }, [authUser]);

  const handleNavigate = (route) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user) => {
    setAuthUser(user);
    const defaultRoute = ROLE_CONFIG[user.role]?.defaultRoute || 'home';
    setCurrentRoute(defaultRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logoutUser();
    setAuthUser(null);
    setCurrentRoute('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDocument = (docId) => {
    if (docId === 'undertaking') {
      setActiveDocType('undertaking');
      setCurrentRoute('undertaking');
    } else if (docId === 'noc') {
      setActiveDocType('noc');
      setCurrentRoute('noc');
    } else {
      setCurrentRoute('documents');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrefillDocument = (docType, prefillData) => {
    if (docType === 'undertaking') {
      setUndertakingPrefill(prefillData);
      setActiveDocType('undertaking');
      setCurrentRoute('undertaking');
    } else if (docType === 'noc') {
      setNocPrefill(prefillData);
      setActiveDocType('noc');
      setCurrentRoute('noc');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGeneratePreview = (docType, data) => {
    setActiveDocType(docType);
    setPreviewData(data);
    setCurrentRoute('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditDetails = () => {
    setCurrentRoute(activeDocType);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartNew = () => {
    setPreviewData(null);
    setCurrentRoute('documents');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is not authenticated or explicitly on the landing/login page, render the Hero Landing Page
  if (!authUser || currentRoute === 'login') {
    return (
      <LandingPage 
        onLoginSuccess={handleLoginSuccess}
        onExplore={() => setCurrentRoute('home')}
      />
    );
  }

  return (
    <div className="portal-layout">
      {/* Top Navigation Bar */}
      <Navbar 
        currentRoute={currentRoute} 
        onNavigate={handleNavigate}
        authUser={authUser}
        onLogout={handleLogout}
        hasSubmittedApp={hasSubmittedApp}
        isApproved={isApproved}
        studentStatus={studentStatus}
      />

      {/* Main Body: Sidebar + Main Content Area */}
      <div className="portal-body-wrapper">
        {/* Left Sidebar with Role Filtering */}
        <Sidebar 
          currentRoute={currentRoute} 
          onNavigate={handleNavigate}
          authUser={authUser}
          hasSubmittedApp={hasSubmittedApp}
          isApproved={isApproved}
          studentStatus={studentStatus}
        />

        {/* Content Area */}
        <main className="portal-main-area">
          {currentRoute === 'home' && (
            <HomePage 
              onNavigate={handleNavigate} 
              onSelectDocument={handleSelectDocument}
              authUser={authUser}
              hasSubmittedApp={hasSubmittedApp}
              isApproved={isApproved}
              studentStatus={studentStatus}
            />
          )}

          {currentRoute === 'student-form' && (
            <StudentSubmissionPage 
              onNavigate={handleNavigate}
              onPrefillDocument={handlePrefillDocument}
              authUser={authUser}
              onApplicationSubmitted={(record) => {
                setHasSubmittedApp(true);
                setStudentStatus(record?.status || 'Submitted');
                const approved = ['approved', 'verified', 'completed'].includes((record?.status || '').toLowerCase());
                setIsApproved(approved);
              }}
            />
          )}

          {currentRoute === 'student-records' && (
            <StudentRecordsPage 
              onNavigate={handleNavigate}
              onPrefillDocument={handlePrefillDocument}
              authUser={authUser}
            />
          )}

          {currentRoute === 'documents' && (
            <DocumentSelectionPage 
              onSelectDocument={handleSelectDocument}
              authUser={authUser}
              hasSubmittedApp={hasSubmittedApp}
              isApproved={isApproved}
              studentStatus={studentStatus}
              onNavigate={handleNavigate}
            />
          )}

          {currentRoute === 'undertaking' && (
            <UndertakingFormPage 
              initialData={undertakingPrefill}
              onGeneratePreview={handleGeneratePreview}
              onBack={() => handleNavigate('documents')}
              authUser={authUser}
              hasSubmittedApp={hasSubmittedApp}
              isApproved={isApproved}
              onNavigate={handleNavigate}
            />
          )}

          {currentRoute === 'noc' && (
            <NOCFormPage 
              initialData={nocPrefill}
              onGeneratePreview={handleGeneratePreview}
              onBack={() => handleNavigate('documents')}
              authUser={authUser}
              hasSubmittedApp={hasSubmittedApp}
              isApproved={isApproved}
              onNavigate={handleNavigate}
            />
          )}

          {currentRoute === 'preview' && (
            <DocumentPreviewPage
              docType={activeDocType}
              formData={previewData}
              onEdit={handleEditDetails}
              onStartNew={handleStartNew}
            />
          )}

          {currentRoute === 'change-password' && (
            <ChangePasswordPage
              authUser={authUser}
              onNavigate={handleNavigate}
            />
          )}

          {currentRoute === 'about' && (
            <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div style={{ marginBottom: '2rem' }}>
                <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Guidelines & Policies</span>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--purple-950)' }}>
                  MIT-ADT School of Computing Documentation System
                </h1>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                  Tagline: <strong>"Generate. Preview. Print."</strong>
                </p>
              </div>

              <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--purple-950)', marginBottom: '0.75rem' }}>
                  Official Institutional Formats & Database Sync
                </h2>
                <p style={{ color: 'var(--slate-700)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  InternDocs generates official university-compliant documents matching the standard formats established by MIT Art, Design and Technology University, School of Computing, Pune. All student submissions and document attachments are synchronized with the institutional database.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
                  <div style={{ padding: '1.25rem', backgroundColor: 'var(--purple-50)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--purple-950)', marginBottom: '0.4rem' }}>
                      <CheckCircle2 size={16} color="var(--purple-600)" />
                      100% Institutional Compliance
                    </div>
                    <p style={{ fontSize: '0.825rem', color: 'var(--slate-600)' }}>
                      Preserves exact clauses I to IX, signatories, letterheads, and Central T&P seal.
                    </p>
                  </div>

                  <div style={{ padding: '1.25rem', backgroundColor: 'var(--purple-50)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--purple-950)', marginBottom: '0.4rem' }}>
                      <Shield size={16} color="var(--purple-600)" />
                      Encrypted Cloud Storage
                    </div>
                    <p style={{ fontSize: '0.825rem', color: 'var(--slate-600)' }}>
                      Student records, offer letters, and completion certificates securely organized.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleNavigate('student-form')}
                className="btn btn-primary btn-lg"
              >
                Go to Student Submission Form
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
