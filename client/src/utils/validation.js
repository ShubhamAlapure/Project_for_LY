/**
 * Form Validation Utilities for InternDocs
 */

export const validateUndertakingForm = (data) => {
  const errors = {};

  // Student Info
  if (!data.studentName?.trim()) {
    errors.studentName = "Please enter your full name.";
  }
  if (!data.className?.trim()) {
    errors.className = "Please enter your class / branch.";
  }
  if (!data.rollNumber?.trim()) {
    errors.rollNumber = "Please enter your roll number.";
  }
  if (!data.enrollmentNumber?.trim()) {
    errors.enrollmentNumber = "Please enter your university enrollment number.";
  }
  if (!data.department?.trim()) {
    errors.department = "Please enter your department name.";
  }
  if (!data.universityName?.trim()) {
    errors.universityName = "Please enter your university name.";
  }

  // Internship Info
  if (!data.companyName?.trim()) {
    errors.companyName = "Please enter the company/organization name.";
  }
  if (!data.internshipRole?.trim()) {
    errors.internshipRole = "Please enter your internship role or title.";
  }
  if (!data.duration?.trim()) {
    errors.duration = "Please specify internship duration (e.g. 6 Months).";
  }
  if (!data.startDate) {
    errors.startDate = "Please select internship start date.";
  }
  if (!data.endDate) {
    errors.endDate = "Please select internship end date.";
  }
  if (data.startDate && data.endDate && new Date(data.endDate) < new Date(data.startDate)) {
    errors.endDate = "End date cannot be earlier than start date.";
  }
  if (!data.location?.trim()) {
    errors.location = "Please enter internship location (e.g. Pune / Remote).";
  }

  // Contact Info
  if (!data.contactNumber?.trim()) {
    errors.contactNumber = "Please enter student contact number.";
  } else if (!/^[0-9+\-\s]{8,15}$/.test(data.contactNumber.trim())) {
    errors.contactNumber = "Please enter a valid 10-digit phone number.";
  }

  if (!data.email?.trim()) {
    errors.email = "Please enter student email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  // Document Info
  if (!data.documentDate) {
    errors.documentDate = "Please select document date.";
  }
  if (!data.mentorName?.trim()) {
    errors.mentorName = "Please enter academic mentor name.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateNOCForm = (data) => {
  const errors = {};

  // Student Info
  if (!data.studentName?.trim()) {
    errors.studentName = "Please enter student full name.";
  }
  if (!data.rollNumber?.trim()) {
    errors.rollNumber = "Please enter roll number.";
  }
  if (!data.enrollmentNumber?.trim()) {
    errors.enrollmentNumber = "Please enter enrollment number.";
  }
  if (!data.department?.trim()) {
    errors.department = "Please enter department.";
  }
  if (!data.course?.trim()) {
    errors.course = "Please enter course (e.g. B.Tech Computer Science).";
  }
  if (!data.className?.trim()) {
    errors.className = "Please enter class/semester.";
  }

  // Company Info
  if (!data.companyName?.trim()) {
    errors.companyName = "Please enter company name.";
  }
  if (!data.companyLocation?.trim()) {
    errors.companyLocation = "Please enter company location/address.";
  }
  if (!data.internshipRole?.trim()) {
    errors.internshipRole = "Please enter internship role.";
  }

  // Internship Info
  if (!data.startDate) {
    errors.startDate = "Please select internship start date.";
  }
  if (!data.endDate) {
    errors.endDate = "Please select internship end date.";
  }
  if (data.startDate && data.endDate && new Date(data.endDate) < new Date(data.startDate)) {
    errors.endDate = "End date cannot be earlier than start date.";
  }
  if (!data.duration?.trim()) {
    errors.duration = "Please enter duration (e.g. 6 Months).";
  }

  // University Info
  if (!data.universityName?.trim()) {
    errors.universityName = "Please enter university name.";
  }
  if (!data.schoolName?.trim()) {
    errors.schoolName = "Please enter school/faculty name.";
  }
  if (!data.universityAddress?.trim()) {
    errors.universityAddress = "Please enter university address.";
  }

  // Document Info
  if (!data.referenceNumber?.trim()) {
    errors.referenceNumber = "Please enter reference number.";
  }
  if (!data.documentDate) {
    errors.documentDate = "Please select document date.";
  }

  // Signatories
  if (!data.internshipHeadName?.trim()) {
    errors.internshipHeadName = "Please enter Internship Head name.";
  }
  if (!data.hodName?.trim()) {
    errors.hodName = "Please enter Head of Department name.";
  }
  if (!data.directorName?.trim()) {
    errors.directorName = "Please enter Director / Placement Cell name.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const formatDateForDoc = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
};

export const formatDateShort = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
};
