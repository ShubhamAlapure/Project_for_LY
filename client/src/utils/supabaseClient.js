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

const isValidUUID = (str) => {
  if (!str || typeof str !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
};

export const getCachedRecords = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_RECORDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    return DEFAULT_INITIAL_RECORDS;
  } catch (err) {
    console.error('Error reading cached student records:', err);
    return DEFAULT_INITIAL_RECORDS;
  }
};

export const saveCachedRecords = (records) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_RECORDS_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Error saving cached student records:', err);
  }
};

/**
 * Merges freshly fetched Supabase records with locally modified records
 * to ensure that uploaded document URLs and local changes are never overwritten by stale DB data.
 */
const mergeRecords = (supabaseData, cachedData) => {
  if (!supabaseData || supabaseData.length === 0) return cachedData || [];
  if (!cachedData || cachedData.length === 0) return supabaseData || [];

  const merged = [...supabaseData];

  // Look for any cached records that have newer updates or documents
  cachedData.forEach(cachedItem => {
    const matchIndex = merged.findIndex(r => 
      (cachedItem.id && r.id === cachedItem.id) ||
      (cachedItem.enrolment_no && r.enrolment_no && cachedItem.enrolment_no.toLowerCase() === r.enrolment_no.toLowerCase()) ||
      (cachedItem.email && r.email && cachedItem.email.toLowerCase() === r.email.toLowerCase())
    );

    if (matchIndex !== -1) {
      // If cached item has a completion_letter_url or offer_letter_url and DB doesn't, preserve it
      merged[matchIndex] = {
        ...merged[matchIndex],
        completion_letter_url: cachedItem.completion_letter_url || merged[matchIndex].completion_letter_url,
        offer_letter_url: cachedItem.offer_letter_url || merged[matchIndex].offer_letter_url,
        status: cachedItem.completion_letter_url ? (cachedItem.status || 'Completed') : (merged[matchIndex].status || cachedItem.status),
        notes: cachedItem.notes || merged[matchIndex].notes
      };
    } else if (String(cachedItem.id).startsWith('local_')) {
      // Keep local-only fallback records
      merged.push(cachedItem);
    }
  });

  return merged;
};

/**
 * Fetch all student internship records from Supabase with resilient fallback & intelligent cache merge
 */
export const fetchStudentRecords = async () => {
  try {
    const { data, error } = await supabase
      .from('student_internships')
      .select('*')
      .order('submission_date', { ascending: false });

    const cached = getCachedRecords();

    if (error) {
      console.warn('Supabase fetch error, using local fallback:', error.message);
      return { success: true, data: cached, isFallback: true, error: error.message };
    }

    // Merge Supabase records with any locally updated documents
    const merged = mergeRecords(data || [], cached);
    saveCachedRecords(merged);
    return { success: true, data: merged, isFallback: false };
  } catch (err) {
    console.warn('Network error reaching Supabase:', err);
    const cached = getCachedRecords();
    return { success: true, data: cached, isFallback: true, error: err.message };
  }
};

/**
 * Insert or Update a student internship record to Supabase
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
    status: recordData.status || (recordData.completion_letter_url ? 'Completed' : 'Submitted'),
    notes: recordData.notes || ''
  };

  // Check if an existing record matches by ID, enrollment, or email to update instead of duplicate
  const cached = getCachedRecords();
  const existingRecord = cached.find(r => 
    (recordData.id && r.id === recordData.id) ||
    (payload.enrolment_no && r.enrolment_no && r.enrolment_no.toLowerCase() === payload.enrolment_no.toLowerCase()) ||
    (payload.email && r.email && r.email.toLowerCase() === payload.email.toLowerCase())
  );

  if (existingRecord) {
    return await updateStudentRecord(existingRecord.id, payload);
  }

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
  const current = getCachedRecords();
  const targetRecord = current.find(r => 
    r.id === id || 
    (updateFields.enrolment_no && r.enrolment_no && r.enrolment_no.toLowerCase() === updateFields.enrolment_no.toLowerCase()) ||
    (updateFields.email && r.email && r.email.toLowerCase() === updateFields.email.toLowerCase())
  ) || { id };

  const effectiveId = targetRecord.id || id;
  const mergedUpdate = {
    ...updateFields,
    updated_at: new Date().toISOString()
  };

  // If completion letter is added and status wasn't explicitly changed to something else, set Completed
  if (mergedUpdate.completion_letter_url && (!mergedUpdate.status || mergedUpdate.status === 'Submitted')) {
    mergedUpdate.status = 'Completed';
  }

  // 1. Immediately update local cache to ensure zero loss
  const updatedCache = current.map(r => {
    if (r.id === effectiveId || 
        (targetRecord.enrolment_no && r.enrolment_no && r.enrolment_no === targetRecord.enrolment_no) ||
        (targetRecord.email && r.email && r.email === targetRecord.email)) {
      return { ...r, ...mergedUpdate };
    }
    return r;
  });
  saveCachedRecords(updatedCache);

  // 2. Attempt update to Supabase
  try {
    let query = supabase.from('student_internships').update(mergedUpdate);

    if (isValidUUID(effectiveId)) {
      query = query.eq('id', effectiveId);
    } else if (targetRecord.enrolment_no) {
      query = query.eq('enrolment_no', targetRecord.enrolment_no);
    } else if (targetRecord.email) {
      query = query.eq('email', targetRecord.email);
    } else {
      query = query.eq('id', effectiveId);
    }

    const { data, error } = await query.select();

    if (error) {
      console.warn('Supabase update notice, saved in local cache:', error.message);
      return { 
        success: true, 
        data: updatedCache.filter(r => r.id === effectiveId), 
        isFallback: true,
        error: error.message 
      };
    }

    if (data && data.length > 0) {
      const refreshedCache = updatedCache.map(r => r.id === effectiveId ? data[0] : r);
      saveCachedRecords(refreshedCache);
      return { success: true, data, isFallback: false };
    }

    return { success: true, data: updatedCache.filter(r => r.id === effectiveId), isFallback: false };
  } catch (err) {
    console.warn('Network exception during update, saved locally:', err);
    return { success: true, data: updatedCache.filter(r => r.id === effectiveId), isFallback: true };
  }
};

/**
 * Delete a student record
 */
export const deleteStudentRecord = async (id) => {
  try {
    const current = getCachedRecords();
    const target = current.find(r => r.id === id);

    let query = supabase.from('student_internships').delete();
    if (isValidUUID(id)) {
      query = query.eq('id', id);
    } else if (target?.enrolment_no) {
      query = query.eq('enrolment_no', target.enrolment_no);
    } else {
      query = query.eq('id', id);
    }

    const { error } = await query;
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
 * Upload student document (Offer Letter or Completion Letter) to Supabase Storage with resilient Data URL fallback
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
      console.warn('Supabase storage fallback to data URL:', error.message);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            success: true,
            publicUrl: reader.result,
            filePath,
            fileName: file.name,
            fileSize: (file.size / 1024).toFixed(1) + ' KB',
            isFallback: true
          });
        };
        reader.onerror = () => {
          resolve({ success: false, error: 'Failed to read file locally' });
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
    console.warn('Storage exception, creating Data URL fallback:', err);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          success: true,
          publicUrl: reader.result,
          filePath,
          fileName: file.name,
          fileSize: (file.size / 1024).toFixed(1) + ' KB',
          isFallback: true
        });
      };
      reader.onerror = () => {
        resolve({ success: false, error: 'Failed to read file locally' });
      };
      reader.readAsDataURL(file);
    });
  }
};

