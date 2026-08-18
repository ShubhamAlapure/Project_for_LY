import { createClient } from '@supabase/supabase-js';

// Supabase Project Credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://nwwchkmbycbgvneauqex.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_1c6YarkkLcbFHvoi5YPtfQ__yaYF5xo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

/**
 * Calculates human-readable duration between start and end dates.
 * e.g., "6 Months (176 Days)" or "3 Months (92 Days)"
 */
export const calculateInternshipDuration = (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr) return '';
  
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return '';
  }
  
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
  
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
};

// Initial default student records for testing & offline mode
const DEFAULT_INITIAL_RECORDS = [
  {
    id: 'rec_aryan_patil_01',
    submission_date: '2026-01-01',
    full_name: 'Aryan Patil',
    email: 'aaryan99@gmail.com',
    contact_no: '9876543210',
    gender: 'Male',
    enrolment_no: 'ADT23SOCB1190',
    specialization: 'Computer Science & Engineering (CSE)',
    semester: 'Semester VII (Final Year)',
    company_name_and_city: 'Google India pvt ltd.',
    domain_of_company: 'Information Technology (IT) / Software',
    source_of_internship: 'Off-Campus Drive',
    start_date: '2026-02-01',
    end_date: '2026-08-01',
    duration: '6 Months (182 Days)',
    mode_of_internship: 'Offline',
    is_ppo_offer: 'No',
    offer_letter_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop',
    completion_letter_url: null,
    status: 'Verified'
  },
  {
    id: 'rec_pooja_sharma_02',
    submission_date: '2026-01-15',
    full_name: 'Pooja Sharma',
    email: 'pooja.sharma@mituniversity.edu.in',
    contact_no: '9822334455',
    gender: 'Female',
    enrolment_no: 'ADT23SOCB1204',
    specialization: 'Artificial Intelligence & Data Science (AI & DS)',
    semester: 'Semester VIII (Final Year)',
    company_name_and_city: 'Microsoft India R&D Pvt. Ltd., Bengaluru',
    domain_of_company: 'Artificial Intelligence & Cloud Systems',
    source_of_internship: 'Campus Placement Cell',
    start_date: '2026-01-15',
    end_date: '2026-07-15',
    duration: '6 Months (182 Days)',
    mode_of_internship: 'Hybrid',
    is_ppo_offer: 'Yes',
    offer_letter_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop',
    completion_letter_url: null,
    status: 'Verified'
  }
];

// Local storage key for offline caching & fallback
const LOCAL_STORAGE_RECORDS_KEY = 'interndocs_supabase_cached_records';

const getCachedRecords = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_RECORDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.length > 0) return parsed;
    }
    return DEFAULT_INITIAL_RECORDS;
  } catch (err) {
    console.error('Error reading cached student records:', err);
    return DEFAULT_INITIAL_RECORDS;
  }
};

const saveCachedRecords = (records) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_RECORDS_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Error saving cached student records:', err);
  }
};

/**
 * Fetch all student internship records from Supabase with resilient fallback
 */
export const fetchStudentRecords = async () => {
  try {
    const { data, error } = await supabase
      .from('student_internships')
      .select('*')
      .order('submission_date', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error, using local fallback:', error.message);
      const cached = getCachedRecords();
      return { success: true, data: cached, isFallback: true, error: error.message };
    }

    // Update local cache
    saveCachedRecords(data || []);
    return { success: true, data: data || [], isFallback: false };
  } catch (err) {
    console.warn('Network error reaching Supabase:', err);
    const cached = getCachedRecords();
    return { success: true, data: cached, isFallback: true, error: err.message };
  }
};

/**
 * Insert a new student internship record to Supabase
 */
export const insertStudentRecord = async (recordData) => {
  // Ensure duration is computed
  const duration = recordData.duration || calculateInternshipDuration(recordData.start_date, recordData.end_date);
  
  const payload = {
    submission_date: recordData.submission_date || new Date().toISOString().split('T')[0],
    email: recordData.email?.trim(),
    contact_no: recordData.contact_no?.trim(),
    enrolment_no: recordData.enrolment_no?.trim().toUpperCase(),
    full_name: recordData.full_name?.trim(),
    gender: recordData.gender || 'Male',
    specialization: recordData.specialization?.trim(),
    semester: recordData.semester?.trim(),
    source_of_internship: recordData.source_of_internship?.trim(),
    start_date: recordData.start_date,
    end_date: recordData.end_date,
    duration: duration,
    company_name_and_city: recordData.company_name_and_city?.trim(),
    mode_of_internship: recordData.mode_of_internship || 'Offline',
    domain_of_company: recordData.domain_of_company?.trim(),
    is_ppo_offer: recordData.is_ppo_offer || 'No',
    offer_letter_url: recordData.offer_letter_url || null,
    completion_letter_url: recordData.completion_letter_url || null,
    status: recordData.status || 'Submitted',
    notes: recordData.notes || ''
  };

  try {
    const { data, error } = await supabase
      .from('student_internships')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Supabase insert error, saving to local cache:', error.message);
      const newRecord = { ...payload, id: `local_${Date.now()}`, created_at: new Date().toISOString() };
      const current = getCachedRecords();
      const updated = [newRecord, ...current];
      saveCachedRecords(updated);
      return { success: true, data: [newRecord], isFallback: true, error: error.message };
    }

    // Refresh cache
    const current = getCachedRecords();
    saveCachedRecords([data[0], ...current.filter(r => r.id !== data[0].id)]);
    return { success: true, data, isFallback: false };
  } catch (err) {
    console.warn('Network exception during insert, saving locally:', err);
    const newRecord = { ...payload, id: `local_${Date.now()}`, created_at: new Date().toISOString() };
    const current = getCachedRecords();
    saveCachedRecords([newRecord, ...current]);
    return { success: true, data: [newRecord], isFallback: true, error: err.message };
  }
};

/**
 * Update an existing student record (e.g. uploading completion letter or updating status)
 */
export const updateStudentRecord = async (id, updateFields) => {
  try {
    const { data, error } = await supabase
      .from('student_internships')
      .update(updateFields)
      .eq('id', id)
      .select();

    if (error) {
      console.warn('Supabase update error, updating local cache:', error.message);
      const current = getCachedRecords();
      const updated = current.map(r => r.id === id ? { ...r, ...updateFields, updated_at: new Date().toISOString() } : r);
      saveCachedRecords(updated);
      return { success: true, data: updated.filter(r => r.id === id), isFallback: true };
    }

    const current = getCachedRecords();
    const updated = current.map(r => r.id === id ? data[0] : r);
    saveCachedRecords(updated);
    return { success: true, data, isFallback: false };
  } catch (err) {
    console.warn('Network exception during update:', err);
    const current = getCachedRecords();
    const updated = current.map(r => r.id === id ? { ...r, ...updateFields } : r);
    saveCachedRecords(updated);
    return { success: true, data: updated.filter(r => r.id === id), isFallback: true };
  }
};

/**
 * Delete a student record
 */
export const deleteStudentRecord = async (id) => {
  try {
    const { error } = await supabase
      .from('student_internships')
      .delete()
      .eq('id', id);

    const current = getCachedRecords();
    saveCachedRecords(current.filter(r => r.id !== id));

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    const current = getCachedRecords();
    saveCachedRecords(current.filter(r => r.id !== id));
    return { success: true, isFallback: true };
  }
};

/**
 * Upload student document (Offer Letter or Completion Letter) to Supabase Storage
 */
export const uploadStudentDocument = async (file, folder = 'offer-letters') => {
  if (!file) return { success: false, error: 'No file provided' };

  const timestamp = Date.now();
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${folder}/${timestamp}_${cleanName}`;

  try {
    const { data, error } = await supabase.storage
      .from('student-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.warn('Supabase storage upload error, creating object URL fallback:', error.message);
      // Create a base64 / ObjectURL fallback for local viewing
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            success: true,
            publicUrl: reader.result,
            fileName: file.name,
            fileSize: (file.size / 1024).toFixed(1) + ' KB',
            isFallback: true
          });
        };
        reader.readAsDataURL(file);
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from('student-documents')
      .getPublicUrl(filePath);

    return {
      success: true,
      publicUrl: publicUrlData.publicUrl,
      filePath,
      fileName: file.name,
      fileSize: (file.size / 1024).toFixed(1) + ' KB',
      isFallback: false
    };
  } catch (err) {
    console.warn('Storage exception, creating fallback:', err);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          success: true,
          publicUrl: reader.result,
          fileName: file.name,
          fileSize: (file.size / 1024).toFixed(1) + ' KB',
          isFallback: true
        });
      };
      reader.readAsDataURL(file);
    });
  }
};
