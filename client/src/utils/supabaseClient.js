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

// Local storage & IndexedDB keys
const LOCAL_STORAGE_RECORDS_KEY = 'interndocs_supabase_cached_records';
const DB_NAME = 'InternDocsDB';
const DB_VERSION = 1;
const STORE_NAME = 'student_documents';

// Helper for IndexedDB to store full heavy PDFs without any truncation or 5MB limits
const getIDB = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) return resolve(null);
    try {
      const req = window.indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch (err) {
      resolve(null);
    }
  });
};

export const persistDocumentOffline = async (key, dataUrl) => {
  if (!key || !dataUrl) return;
  try {
    const db = await getIDB();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ key, data: dataUrl, timestamp: Date.now() });
  } catch (err) {
    console.warn('IndexedDB write warning:', err);
  }
};

export const getDocumentOffline = async (key) => {
  if (!key) return null;
  try {
    const db = await getIDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? req.result.data : null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
};

const hydrateWithIndexedDB = async (recordsList) => {
  if (!recordsList || !Array.isArray(recordsList)) return recordsList || [];
  const hydrated = await Promise.all(recordsList.map(async (r) => {
    let completionUrl = r.completion_letter_url;
    let offerUrl = r.offer_letter_url;

    if (r.enrolment_no) {
      const enrolKey = r.enrolment_no.toLowerCase();
      if (!completionUrl) {
        const savedDoc = await getDocumentOffline(`completion_${enrolKey}`);
        if (savedDoc) completionUrl = savedDoc;
      }
      if (!offerUrl) {
        const savedDoc = await getDocumentOffline(`offer_${enrolKey}`);
        if (savedDoc) offerUrl = savedDoc;
      }
    }

    return {
      ...r,
      completion_letter_url: completionUrl || null,
      offer_letter_url: offerUrl || r.offer_letter_url,
      status: completionUrl ? 'Completed' : (r.status || 'Submitted')
    };
  }));
  return hydrated;
};

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
    return DEFAULT_INITIAL_RECORDS;
  }
};

export const saveCachedRecords = (records) => {
  if (!records || !Array.isArray(records)) return;
  
  // Persist full records in IndexedDB
  persistDocumentOffline('all_student_records_store', JSON.stringify(records));

  // Also persist individual documents into IndexedDB
  records.forEach(r => {
    if (r.enrolment_no) {
      const enrolKey = r.enrolment_no.toLowerCase();
      if (r.completion_letter_url) {
        persistDocumentOffline(`completion_${enrolKey}`, r.completion_letter_url);
      }
      if (r.offer_letter_url) {
        persistDocumentOffline(`offer_${enrolKey}`, r.offer_letter_url);
      }
    }
  });

  // Save lightweight version in localStorage (without corrupting strings)
  try {
    localStorage.setItem(LOCAL_STORAGE_RECORDS_KEY, JSON.stringify(records));
  } catch (err) {
    // If localStorage quota exceeded, store without huge base64 strings in localStorage
    // while IndexedDB keeps 100% full quality
    try {
      const safe = records.map(r => ({
        ...r,
        completion_letter_url: (r.completion_letter_url && r.completion_letter_url.startsWith('data:')) ? null : r.completion_letter_url,
        offer_letter_url: (r.offer_letter_url && r.offer_letter_url.startsWith('data:')) ? null : r.offer_letter_url
      }));
      localStorage.setItem(LOCAL_STORAGE_RECORDS_KEY, JSON.stringify(safe));
    } catch (e) {
      // IndexedDB handles full storage
    }
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

  cachedData.forEach(cachedItem => {
    const matchIndex = merged.findIndex(r => 
      (cachedItem.id && r.id === cachedItem.id) ||
      (cachedItem.enrolment_no && r.enrolment_no && cachedItem.enrolment_no.toLowerCase() === r.enrolment_no.toLowerCase()) ||
      (cachedItem.email && r.email && cachedItem.email.toLowerCase() === r.email.toLowerCase())
    );

    if (matchIndex !== -1) {
      const completionUrl = merged[matchIndex].completion_letter_url || cachedItem.completion_letter_url;
      const offerUrl = merged[matchIndex].offer_letter_url || cachedItem.offer_letter_url;

      merged[matchIndex] = {
        ...merged[matchIndex],
        completion_letter_url: completionUrl || null,
        offer_letter_url: offerUrl || null,
        status: completionUrl ? 'Completed' : (merged[matchIndex].status || cachedItem.status),
        notes: cachedItem.notes || merged[matchIndex].notes
      };
    } else if (String(cachedItem.id).startsWith('local_')) {
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

    if (error || !data) {
      console.warn('Supabase fetch notice, hydrating with cache & IndexedDB:', error?.message);
      const hydrated = await hydrateWithIndexedDB(cached);
      return { success: true, data: hydrated, isFallback: true, error: error?.message };
    }

    // Merge Supabase records with local documents & IndexedDB
    const merged = mergeRecords(data, cached);
    const hydrated = await hydrateWithIndexedDB(merged);
    saveCachedRecords(hydrated);
    return { success: true, data: hydrated, isFallback: false };
  } catch (err) {
    console.warn('Network notice reaching Supabase, loading from cache:', err);
    const cached = getCachedRecords();
    const hydrated = await hydrateWithIndexedDB(cached);
    return { success: true, data: hydrated, isFallback: true, error: err.message };
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
    source_of_internship: recordData.source_of_internship?.trim() || 'College Placement Cell',
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

  if (payload.completion_letter_url && payload.enrolment_no) {
    persistDocumentOffline(`completion_${payload.enrolment_no.toLowerCase()}`, payload.completion_letter_url);
  }
  if (payload.offer_letter_url && payload.enrolment_no) {
    persistDocumentOffline(`offer_${payload.enrolment_no.toLowerCase()}`, payload.offer_letter_url);
  }

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
      console.warn('Supabase insert notice, saving to local cache:', error.message);
      const newRecord = { ...payload, id: `local_${Date.now()}`, created_at: new Date().toISOString() };
      const current = getCachedRecords();
      const updated = [newRecord, ...current];
      saveCachedRecords(updated);
      return { success: true, data: [newRecord], isFallback: true, error: error.message };
    }

    // Refresh cache
    const current = getCachedRecords();
    const refreshed = [data[0], ...current.filter(r => r.id !== data[0].id)];
    saveCachedRecords(refreshed);
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
    (id && r.id === id) || 
    (updateFields.enrolment_no && r.enrolment_no && r.enrolment_no.toLowerCase() === updateFields.enrolment_no.toLowerCase()) ||
    (updateFields.email && r.email && r.email.toLowerCase() === updateFields.email.toLowerCase())
  ) || { id, ...updateFields };

  const effectiveEnrolment = updateFields.enrolment_no || targetRecord.enrolment_no;
  const effectiveEmail = updateFields.email || targetRecord.email;
  const effectiveId = targetRecord.id || id;

  const mergedUpdate = {
    ...targetRecord,
    ...updateFields,
    updated_at: new Date().toISOString()
  };

  // If completion letter is attached, ensure status is Completed
  if (mergedUpdate.completion_letter_url) {
    mergedUpdate.status = updateFields.status || 'Completed';
    if (effectiveEnrolment) {
      persistDocumentOffline(`completion_${effectiveEnrolment.toLowerCase()}`, mergedUpdate.completion_letter_url);
    }
  }
  if (mergedUpdate.offer_letter_url && effectiveEnrolment) {
    persistDocumentOffline(`offer_${effectiveEnrolment.toLowerCase()}`, mergedUpdate.offer_letter_url);
  }

  // 1. Immediately update local cache & memory
  const updatedCache = current.map(r => {
    if ((r.id && r.id === effectiveId) || 
        (effectiveEnrolment && r.enrolment_no && r.enrolment_no.toLowerCase() === effectiveEnrolment.toLowerCase()) ||
        (effectiveEmail && r.email && r.email.toLowerCase() === effectiveEmail.toLowerCase())) {
      return { ...r, ...mergedUpdate };
    }
    return r;
  });

  const existsInCache = updatedCache.some(r => 
    (r.id && r.id === effectiveId) || 
    (effectiveEnrolment && r.enrolment_no && r.enrolment_no.toLowerCase() === effectiveEnrolment.toLowerCase())
  );
  if (!existsInCache) {
    updatedCache.unshift(mergedUpdate);
  }

  saveCachedRecords(updatedCache);

  // 2. Persist to Supabase with multi-tier matching & automatic row creation
  try {
    const dbPayload = {
      submission_date: mergedUpdate.submission_date || new Date().toISOString().split('T')[0],
      email: effectiveEmail,
      contact_no: mergedUpdate.contact_no,
      enrolment_no: effectiveEnrolment,
      full_name: mergedUpdate.full_name,
      gender: mergedUpdate.gender || 'Male',
      specialization: mergedUpdate.specialization,
      semester: mergedUpdate.semester,
      source_of_internship: mergedUpdate.source_of_internship || 'College Placement Cell',
      start_date: mergedUpdate.start_date,
      end_date: mergedUpdate.end_date,
      duration: mergedUpdate.duration,
      company_name_and_city: mergedUpdate.company_name_and_city,
      mode_of_internship: mergedUpdate.mode_of_internship || 'Offline',
      domain_of_company: mergedUpdate.domain_of_company,
      is_ppo_offer: mergedUpdate.is_ppo_offer || 'No',
      offer_letter_url: mergedUpdate.offer_letter_url || null,
      completion_letter_url: mergedUpdate.completion_letter_url || null,
      status: mergedUpdate.status || 'Completed',
      notes: mergedUpdate.notes || '',
      updated_at: new Date().toISOString()
    };

    let updateRes = null;

    if (isValidUUID(effectiveId)) {
      updateRes = await supabase
        .from('student_internships')
        .update(dbPayload)
        .eq('id', effectiveId)
        .select();
    }

    if (!updateRes || !updateRes.data || updateRes.data.length === 0) {
      if (effectiveEnrolment) {
        updateRes = await supabase
          .from('student_internships')
          .update(dbPayload)
          .ilike('enrolment_no', effectiveEnrolment)
          .select();
      }
    }

    if (!updateRes || !updateRes.data || updateRes.data.length === 0) {
      if (effectiveEmail) {
        updateRes = await supabase
          .from('student_internships')
          .update(dbPayload)
          .ilike('email', effectiveEmail)
          .select();
      }
    }

    // If row wasn't found in DB to update, insert it so HOD & Faculty see it immediately
    if (!updateRes || !updateRes.data || updateRes.data.length === 0) {
      const insertRes = await supabase
        .from('student_internships')
        .insert([dbPayload])
        .select();

      if (insertRes.data && insertRes.data.length > 0) {
        const savedDbRecord = insertRes.data[0];
        const refreshed = updatedCache.map(r => 
          (effectiveEnrolment && r.enrolment_no && r.enrolment_no.toLowerCase() === effectiveEnrolment.toLowerCase()) ? savedDbRecord : r
        );
        saveCachedRecords(refreshed);
        return { success: true, data: [savedDbRecord], isFallback: false };
      }
    } else if (updateRes.data && updateRes.data.length > 0) {
      const savedDbRecord = updateRes.data[0];
      const refreshed = updatedCache.map(r => 
        (effectiveEnrolment && r.enrolment_no && r.enrolment_no.toLowerCase() === effectiveEnrolment.toLowerCase()) ? savedDbRecord : r
      );
      saveCachedRecords(refreshed);
      return { success: true, data: updateRes.data, isFallback: false };
    }

    return { success: true, data: [mergedUpdate], isFallback: false };
  } catch (err) {
    console.warn('Supabase update notice (Persisted in IndexedDB & cache):', err);
    return { success: true, data: [mergedUpdate], isFallback: true };
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

