import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

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
    duration: "6 Months",
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

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'InternDocs API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Get all document configurations
app.get('/api/documents', (req, res) => {
  res.json({
    success: true,
    count: DOCUMENT_CONFIGS.length,
    data: DOCUMENT_CONFIGS
  });
});

// Get document configuration by ID
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

// Get sample data for a document
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

app.listen(PORT, () => {
  console.log(`🚀 InternDocs Backend Server running on http://localhost:${PORT}`);
});
