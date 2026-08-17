/**
 * DOCUMENT CONFIGURATION REGISTRY
 * Easily extensible for adding new university/internship documents in the future
 * (e.g. Completion Certificate, Bonafide Letter, Recommendation Letter, etc.)
 */

export const DOCUMENTS = [
  {
    id: "undertaking",
    code: "DOC-MIT-UT-01",
    name: "Internship Undertaking",
    shortTitle: "Undertaking Form",
    category: "Mandatory Student Compliance",
    description: "Official student undertaking format declaring academic eligibility, company compliance, intellectual property adherence, and university guidelines for internship tenure.",
    route: "/form/undertaking",
    badge: "Active Template",
    iconName: "FileCheck2",
    popular: true,
    tags: ["Undertaking", "Compliance", "Declaration"],
    estimatedTime: "3 mins",
    availableFormats: ["A4 Print", "PDF Download"],
    defaultUniversity: "MIT-ADT University",
    defaultSchool: "School of Computing",
    previewThumbnail: "undertaking"
  },
  {
    id: "noc",
    code: "DOC-MIT-NOC-02",
    name: "No Objection Certificate for Internship",
    shortTitle: "Internship NOC",
    category: "Official University Certificate",
    description: "Official institutional NOC issued to company HR certifying university approval, student enrollment, duration, and academic clearance for student internship.",
    route: "/form/noc",
    badge: "Official Stamp & Sign",
    iconName: "Award",
    popular: true,
    tags: ["NOC", "Official Clearance", "Company Letter"],
    estimatedTime: "4 mins",
    availableFormats: ["A4 Letterhead", "PDF Download"],
    defaultUniversity: "MIT-ADT University",
    defaultSchool: "School of Computing",
    previewThumbnail: "noc"
  },
  {
    id: "completion",
    code: "DOC-MIT-ICL-03",
    name: "Internship Completion Letter",
    shortTitle: "Completion Letter",
    category: "Post-Internship Verification",
    description: "Official post-internship verification certificate acknowledging successful completion of industrial training and project evaluation.",
    route: "/documents",
    badge: "Coming Soon",
    iconName: "FileBadge",
    tags: ["Completion", "Evaluation", "Certificate"],
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
    description: "Institutional bonafide certificate for industrial background check, stipend bank account opening, and corporate onboarding.",
    route: "/documents",
    badge: "Coming Soon",
    iconName: "BadgeCheck",
    tags: ["Bonafide", "Verification", "Identity"],
    estimatedTime: "2 mins",
    availableFormats: ["A4 Letterhead"],
    isUpcoming: true
  },
  {
    id: "recommendation",
    code: "DOC-MIT-LOR-05",
    name: "Letter of Recommendation (LOR)",
    shortTitle: "Recommendation Letter",
    category: "Faculty Endorsement",
    description: "Academic mentor & HOD recommendation letter endorsing student technical competency and moral character for industrial internship.",
    route: "/documents",
    badge: "Coming Soon",
    iconName: "ScrollText",
    tags: ["Recommendation", "Faculty Letter", "Endorsement"],
    estimatedTime: "3 mins",
    availableFormats: ["A4 Letterhead"],
    isUpcoming: true
  },
  {
    id: "training_letter",
    code: "DOC-MIT-TRN-06",
    name: "Industrial Training Permission Letter",
    shortTitle: "Training Letter",
    category: "Academic Permission",
    description: "Official college permission request to company allowing semester-long industrial training with project credits.",
    route: "/documents",
    badge: "Coming Soon",
    iconName: "Briefcase",
    tags: ["Training", "Permission", "Semester Credits"],
    estimatedTime: "3 mins",
    availableFormats: ["A4 Letterhead"],
    isUpcoming: true
  }
];

export const getDocumentById = (id) => {
  return DOCUMENTS.find(doc => doc.id === id);
};
