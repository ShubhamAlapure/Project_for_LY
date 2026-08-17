import React, { useState } from 'react';
import { 
  FileCheck2, 
  Award, 
  FileBadge, 
  BadgeCheck, 
  ScrollText, 
  Briefcase, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { DOCUMENTS } from '../data/documentsConfig';
import { StepIndicator } from '../components/common/StepIndicator';

const iconMap = {
  FileCheck2,
  Award,
  FileBadge,
  BadgeCheck,
  ScrollText,
  Briefcase
};

export const DocumentSelectionPage = ({ onSelectDocument }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Mandatory Student Compliance', 'Official University Certificate', 'Post-Internship Verification', 'Faculty Endorsement'];

  const filteredDocs = DOCUMENTS.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Step Indicator */}
        <StepIndicator 
          currentStep={1}
          steps={[
            { title: "Select Document" },
            { title: "Enter Details" },
            { title: "Preview & Print" }
          ]}
        />

        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Template Catalog</span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            Select an Internship Document
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '1rem', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
            Choose the specific institutional document you need to generate for your industrial internship.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2.5rem',
          backgroundColor: 'white',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--slate-200)',
          boxShadow: 'var(--shadow-xs)'
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            <input
              type="text"
              placeholder="Search document templates (e.g. Undertaking, NOC, Bonafide)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px', marginBottom: 0 }}
            />
          </div>

          {/* Category Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {['All', 'Active Templates', 'Upcoming'].map(filter => {
              const isActive = (filter === 'All' && selectedCategory === 'All') ||
                               (filter === 'Active Templates' && selectedCategory === 'Active') ||
                               (filter === 'Upcoming' && selectedCategory === 'Upcoming');
              return (
                <button
                  key={filter}
                  onClick={() => {
                    if (filter === 'All') setSelectedCategory('All');
                    else if (filter === 'Active Templates') setSelectedCategory('Active');
                    else if (filter === 'Upcoming') setSelectedCategory('Upcoming');
                  }}
                  className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Documents Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.75rem'
        }}>
          {filteredDocs.map(doc => {
            const IconComponent = iconMap[doc.iconName] || FileCheck2;
            const isAvailable = !doc.isUpcoming;

            return (
              <div 
                key={doc.id}
                className="card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  opacity: isAvailable ? 1 : 0.85,
                  position: 'relative'
                }}
              >
                <div>
                  {/* Card Header: Icon & Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: isAvailable ? 'var(--primary-50)' : 'var(--slate-100)',
                      color: isAvailable ? 'var(--primary-600)' : 'var(--slate-500)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComponent size={24} />
                    </div>

                    <span className={`badge ${isAvailable ? 'badge-primary' : 'badge-neutral'}`}>
                      {doc.badge}
                    </span>
                  </div>

                  {/* Document Title & Code */}
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-400)', letterSpacing: '0.05em' }}>
                    {doc.code}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-900)', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                    {doc.name}
                  </h3>

                  {/* Description */}
                  <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {doc.description}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.5rem' }}>
                    {doc.tags.map(tag => (
                      <span 
                        key={tag} 
                        style={{
                          fontSize: '0.725rem',
                          backgroundColor: 'var(--slate-100)',
                          color: 'var(--slate-600)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.775rem',
                    color: 'var(--slate-500)',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--slate-100)',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={13} />
                      Est. {doc.estimatedTime}
                    </span>
                    <span>{doc.availableFormats.join(' • ')}</span>
                  </div>

                  {isAvailable ? (
                    <button
                      onClick={() => onSelectDocument(doc.id)}
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Generate {doc.shortTitle}
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="btn btn-secondary"
                      style={{ width: '100%', justifyContent: 'center', cursor: 'not-allowed', color: 'var(--slate-400)' }}
                    >
                      <Lock size={15} />
                      Template In Review
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
