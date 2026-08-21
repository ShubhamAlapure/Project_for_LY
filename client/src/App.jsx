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
      />

      {/* Main Body: Sidebar + Main Content Area */}
      <div className="portal-body-wrapper">
        {/* Left Sidebar with Role Filtering */}
        <Sidebar 
          currentRoute={currentRoute} 
          onNavigate={handleNavigate}
          authUser={authUser}
        />

        {/* Content Area */}
        <main className="portal-main-area">
          {currentRoute === 'home' && (
            <HomePage 
              onNavigate={handleNavigate} 
              onSelectDocument={handleSelectDocument}
              authUser={authUser}
            />
          )}

          {currentRoute === 'student-form' && (
            <StudentSubmissionPage 
              onNavigate={handleNavigate}
              onPrefillDocument={handlePrefillDocument}
              authUser={authUser}
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
            />
          )}

          {currentRoute === 'undertaking' && (
            <UndertakingFormPage 
              initialData={undertakingPrefill}
              onGeneratePreview={handleGeneratePreview}
              onBack={() => handleNavigate('documents')}
            />
          )}

          {currentRoute === 'noc' && (
            <NOCFormPage 
              initialData={nocPrefill}
              onGeneratePreview={handleGeneratePreview}
              onBack={() => handleNavigate('documents')}
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
                  InternDocs generates official university-compliant documents matching the standard formats established by MIT Art, Design and Technology University, School of Computing, Pune. All student submissions and document attachments are synchronized with Supabase.
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
                      Supabase Cloud Storage
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
