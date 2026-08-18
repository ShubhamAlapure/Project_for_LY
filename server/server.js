import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabaseAdmin } from './supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Document configurations metadata (extensible registry)
const DOCUMENT_CONFIGS = [
  {
    id: "undertaking",
    code: "DOC-MIT-UT-01",
    name: "Internship Undertaking",
    shortTitle: "Undertaking Form",
    category: "Mandatory Student Compliance",
    description: "Official student undertaking format declaring academic eligibility, company compliance, intellectual property adherence, and university guidelines for internship tenure.",
    route: "/form/undertaking",
    badge: "Active Template",
    icon: "FileCheck2",
    tags: ["Undertaking", "Compliance", "Student Declaration"],
    estimatedTime: "3 mins",
    availableFormats: ["A4 Print", "PDF Download"],
    defaultUniversity: "MIT-ADT University",
    defaultSchool: "School of Computing"
  },
  {
    id: "noc",
    code: "DOC-MIT-NOC-02",
    name: "No Objection Certificate for Internship",
    shortTitle: "Internship NOC",
    category: "Official University Certificate",
    description: "Official institutional NOC issued to company HR certifying university approval, enrollment details, duration, and academic authorization for student internship.",
    route: "/form/noc",
    badge: "Official Stamp & Sign",
    icon: "Award",
    tags: ["NOC", "Official Clearance", "Company Letter"],
    estimatedTime: "4 mins",
    availableFormats: ["A4 Letterhead", "PDF Download"],
    defaultUniversity: "MIT-ADT University",
    defaultSchool: "School of Computing"
  },
  {
    id: "completion",
    code: "DOC-MIT-ICL-03",
    name: "Internship Completion Letter",
    shortTitle: "Completion Letter",
    category: "Post-Internship Verification",
    description: "Official post-internship verification certificate acknowledging successful completion of internship tenure and project evaluation.",
    route: "/documents",
    badge: "Coming Soon",
    icon: "FileBadge",
    tags: ["Completion", "Evaluation"],
    estimatedTime: "2 mins",
    availableFormats: ["A4 Letterhead"],
    isUpcoming: true
  },
  {
    id: "bonafide",
    code: "DOC-MIT-BON-04",
    name: "Bonafide Student Certificate",
    shortTitle: "Bonafide Certificate",
    category: "Student Identity Verification",
    description: "Institutional bonafide certificate for background check, stipend bank accounts, and company onboarding.",
    route: "/documents",
    badge: "Coming Soon",
    icon: "BadgeCheck",
    tags: ["Bonafide", "Verification"],
    estimatedTime: "2 mins",
    availableFormats: ["A4 Letterhead"],
    isUpcoming: true
  },
  {
    id: "recommendation",
    code: "DOC-MIT-LOR-05",
    name: "Letter of Recommendation for Internship",
    shortTitle: "Recommendation Letter",
    category: "Faculty Endorsement",
    description: "Academic mentor & HOD recommendation letter endorsing student technical competency for industrial training.",
    route: "/documents",
    badge: "Coming Soon",
    icon: "ScrollText",
    tags: ["Recommendation", "Faculty Letter"],
    estimatedTime: "3 mins",
    availableFormats: ["A4 Letterhead"],
    isUpcoming: true
  }
];

// Sample test data for quick loading and evaluation
const SAMPLE_DATA = {
  undertaking: {
    studentName: "Shubham Santosh Alapure",
    salutation: "Mr.",
    className: "B.Tech Final Year (Computer Science & Engineering)",
    rollNumber: "CS2022-084",
    enrollmentNumber: "MITADT2022CS084",
    department: "Department of Computer Science & Engineering",
    universityName: "MIT Art, Design and Technology University, Pune",
    schoolName: "School of Computing",
    companyName: "Google Cloud Platform / DeepMind Technologies",
    internshipRole: "Software Engineering Intern - Cloud AI",
    duration: "6 Months (176 Days)",
    startDate: "2026-01-05",
    endDate: "2026-06-30",
    location: "Bangalore / Hybrid",
    contactNumber: "9876543210",
    email: "shubham.alapure@mitadt.edu.in",
    documentDate: "2026-01-02",
    mentorName: "Dr. Rajesh K. Sharma"
  },
  noc: {
    referenceNumber: "MITADT/SOC/T&P/2026/NOC-0842",
    documentDate: "2026-01-03",
    universityName: "MIT Art, Design and Technology University",
    schoolName: "School of Computing",
    department: "Department of Computer Science & Engineering",
    universityAddress: "Rajbaug, Next to Hadapsar, Loni Kalbhor, Pune - 412201, Maharashtra, India",
    
    // Recipient Company
    companyName: "Google India Private Limited",
    companyLocation: "Prestige Cyber Earth, Whitefield, Bangalore - 560066",
    internshipRole: "Software Engineering Intern",
    
    // Student details
    studentName: "Shubham Santosh Alapure",
    salutation: "Mr.",
    rollNumber: "CS2022-084",
    enrollmentNumber: "MITADT2022CS084",
    course: "B.Tech in Computer Science and Engineering",
    className: "Final Year (VIII Semester)",
    
    // Internship details
    startDate: "2026-01-05",
    endDate: "2026-06-30",
    duration: "6 Months (Full-Time)",
    
    // Signatories
    internshipHeadName: "Prof. Aniket Verma",
    internshipHeadDesignation: "Head - Industry Internship Cell",
    hodName: "Dr. Sneha Deshmukh",
    hodDesignation: "Head of Department (CSE)",
    directorName: "Dr. Milind S. Kulkarni",
    directorDesignation: "Director, Corporate Relations & Placement Cell"
  }
};

/**
 * Utility: Calculate Duration from Start and End Dates
 */
function calculateDuration(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return '';
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return '';
  
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const approxMonths = Math.round(diffDays / 30.4375);
  
  if (approxMonths >= 1) {
    const monthText = approxMonths === 1 ? '1 Month' : `${approxMonths} Months`;
    return `${monthText} (${diffDays} Days)`;
  }
  const weeks = Math.round(diffDays / 7);
  if (weeks >= 1) {
    return `${weeks} Weeks (${diffDays} Days)`;
  }
  return `${diffDays} Days`;
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'InternDocs API with Supabase DB',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Document Endpoints
app.get('/api/documents', (req, res) => {
  res.json({
    success: true,
    count: DOCUMENT_CONFIGS.length,
    data: DOCUMENT_CONFIGS
  });
});

app.get('/api/documents/:id', (req, res) => {
  const doc = DOCUMENT_CONFIGS.find(d => d.id === req.params.id);
  if (!doc) {
    return res.status(404).json({
      success: false,
      error: `Document template '${req.params.id}' not found.`
    });
  }
  res.json({
    success: true,
    data: doc
  });
});

app.get('/api/sample-data/:id', (req, res) => {
  const sample = SAMPLE_DATA[req.params.id];
  if (!sample) {
    return res.status(404).json({
      success: false,
      error: `No sample data found for document type '${req.params.id}'`
    });
  }
  res.json({
    success: true,
    docId: req.params.id,
    data: sample
  });
});

// Validate Document Payload Endpoint
app.post('/api/validate/:id', (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const errors = {};

  if (id === 'undertaking') {
    if (!payload.studentName?.trim()) errors.studentName = "Student full name is required.";
    if (!payload.rollNumber?.trim()) errors.rollNumber = "Roll number is required.";
    if (!payload.enrollmentNumber?.trim()) errors.enrollmentNumber = "Enrollment number is required.";
    if (!payload.companyName?.trim()) errors.companyName = "Company/Organization name is required.";
    if (!payload.internshipRole?.trim()) errors.internshipRole = "Internship role is required.";
    if (!payload.startDate) errors.startDate = "Internship start date is required.";
    if (!payload.endDate) errors.endDate = "Internship end date is required.";
    if (payload.startDate && payload.endDate && new Date(payload.endDate) < new Date(payload.startDate)) {
      errors.endDate = "End date cannot be earlier than start date.";
    }
    if (!payload.contactNumber?.trim()) {
      errors.contactNumber = "Contact number is required.";
    } else if (!/^[0-9+\-\s]{8,15}$/.test(payload.contactNumber.trim())) {
      errors.contactNumber = "Please enter a valid phone number.";
    }
    if (!payload.email?.trim()) {
      errors.email = "Student email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
  } else if (id === 'noc') {
    if (!payload.studentName?.trim()) errors.studentName = "Student full name is required.";
    if (!payload.rollNumber?.trim()) errors.rollNumber = "Roll number is required.";
    if (!payload.enrollmentNumber?.trim()) errors.enrollmentNumber = "Enrollment number is required.";
    if (!payload.companyName?.trim()) errors.companyName = "Company name is required.";
    if (!payload.companyLocation?.trim()) errors.companyLocation = "Company location is required.";
    if (!payload.startDate) errors.startDate = "Internship start date is required.";
    if (!payload.endDate) errors.endDate = "Internship end date is required.";
    if (payload.startDate && payload.endDate && new Date(payload.endDate) < new Date(payload.startDate)) {
      errors.endDate = "End date cannot be earlier than start date.";
    }
  }

  const isValid = Object.keys(errors).length === 0;
  res.json({
    success: isValid,
    valid: isValid,
    errors
  });
});

// ==============================================================================
// SUPABASE STUDENT INTERNSHIP RECORDS ENDPOINTS (17 Fields)
// ==============================================================================

// 1. Get all student records
app.get('/api/students', async (req, res) => {
  try {
    const { search, specialization, semester, mode, ppo, domain } = req.query;
    
    let query = supabaseAdmin
      .from('student_internships')
      .select('*')
      .order('submission_date', { ascending: false });

    if (specialization && specialization !== 'All') {
      query = query.eq('specialization', specialization);
    }
    if (semester && semester !== 'All') {
      query = query.eq('semester', semester);
    }
    if (mode && mode !== 'All') {
      query = query.eq('mode_of_internship', mode);
    }
    if (ppo && ppo !== 'All') {
      query = query.eq('is_ppo_offer', ppo);
    }
    if (domain && domain !== 'All') {
      query = query.ilike('domain_of_company', `%${domain}%`);
    }
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,enrolment_no.ilike.%${search}%,email.ilike.%${search}%,company_name_and_city.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({
      success: true,
      count: data?.length || 0,
      data: data || []
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Get single student record by ID
app.get('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('student_internships')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ success: false, error: 'Student record not found' });
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Create new student record (with 17 fields and automatic duration)
app.post('/api/students', async (req, res) => {
  try {
    const payload = req.body;
    
    // Validate required fields
    const errors = {};
    if (!payload.email?.trim()) errors.email = "Email ID is required.";
    if (!payload.contact_no?.trim()) errors.contact_no = "Contact number is required.";
    if (!payload.enrolment_no?.trim()) errors.enrolment_no = "Enrolment number is required.";
    if (!payload.full_name?.trim()) errors.full_name = "Full name is required.";
    if (!payload.specialization?.trim()) errors.specialization = "Specialization is required.";
    if (!payload.semester?.trim()) errors.semester = "Semester is required.";
    if (!payload.start_date) errors.start_date = "Start date is required.";
    if (!payload.end_date) errors.end_date = "End date is required.";
    if (!payload.company_name_and_city?.trim()) errors.company_name_and_city = "Company Name + City is required.";

    if (payload.start_date && payload.end_date && new Date(payload.end_date) < new Date(payload.start_date)) {
      errors.end_date = "End date cannot be earlier than start date.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Automatically compute duration if missing
    const duration = payload.duration || calculateDuration(payload.start_date, payload.end_date);

    const record = {
      submission_date: payload.submission_date || new Date().toISOString().split('T')[0],
      email: payload.email.trim(),
      contact_no: payload.contact_no.trim(),
      enrolment_no: payload.enrolment_no.trim().toUpperCase(),
      full_name: payload.full_name.trim(),
      gender: payload.gender || 'Male',
      specialization: payload.specialization.trim(),
      semester: payload.semester.trim(),
      source_of_internship: payload.source_of_internship?.trim() || 'College Placement Cell',
      start_date: payload.start_date,
      end_date: payload.end_date,
      duration: duration,
      company_name_and_city: payload.company_name_and_city.trim(),
      mode_of_internship: payload.mode_of_internship || 'Offline',
      domain_of_company: payload.domain_of_company?.trim() || 'IT / Software',
      is_ppo_offer: payload.is_ppo_offer || 'No',
      offer_letter_url: payload.offer_letter_url || null,
      completion_letter_url: payload.completion_letter_url || null,
      status: payload.status || 'Submitted',
      notes: payload.notes || ''
    };

    const { data, error } = await supabaseAdmin
      .from('student_internships')
      .insert([record])
      .select();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.status(201).json({
      success: true,
      message: 'Student internship record registered successfully',
      data: data[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Update existing student record
app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.start_date && updates.end_date) {
      updates.duration = calculateDuration(updates.start_date, updates.end_date);
    }

    const { data, error } = await supabaseAdmin
      .from('student_internships')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({
      success: true,
      message: 'Student record updated successfully',
      data: data[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Delete student record
app.delete('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
      .from('student_internships')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({
      success: true,
      message: 'Record deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Analytics & Statistics Endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('student_internships')
      .select('*');

    if (error || !data) {
      return res.json({
        success: true,
        stats: {
          total: 0,
          ppoCount: 0,
          verifiedCount: 0,
          bySpecialization: {},
          byMode: {}
        }
      });
    }

    const total = data.length;
    const ppoCount = data.filter(d => d.is_ppo_offer && d.is_ppo_offer.toLowerCase().includes('yes')).length;
    const verifiedCount = data.filter(d => d.status === 'Verified').length;
    
    const bySpecialization = {};
    const byMode = {};
    
    data.forEach(d => {
      bySpecialization[d.specialization] = (bySpecialization[d.specialization] || 0) + 1;
      byMode[d.mode_of_internship] = (byMode[d.mode_of_internship] || 0) + 1;
    });

    res.json({
      success: true,
      stats: {
        total,
        ppoCount,
        verifiedCount,
        bySpecialization,
        byMode
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 InternDocs Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 Supabase Connected: ${process.env.SUPABASE_URL || 'https://nwwchkmbycbgvneauqex.supabase.co'}`);
});
