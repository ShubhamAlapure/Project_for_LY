const STORAGE_PREFIX = 'interndocs_';

export const getStudentStorageKey = (authUser) => {
  if (!authUser) return 'default';
  return (authUser.enrolment_no || authUser.email || authUser.id || 'default')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_');
};

export const saveFormData = (docId, data) => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${docId}`, JSON.stringify(data));
  } catch (err) {
    console.warn('Could not save form data to localStorage:', err);
  }
};

export const loadFormData = (docId, fallback = {}) => {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${docId}`);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch (err) {
    console.warn('Could not load form data from localStorage:', err);
    return fallback;
  }
};

export const clearFormData = (docId) => {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${docId}`);
  } catch (err) {
    console.warn('Could not clear form data from localStorage:', err);
  }
};

export const saveGeneratedDocument = (docId, studentKey, data) => {
  try {
    const payload = {
      docId,
      studentKey,
      data,
      generatedAt: new Date().toISOString()
    };
    localStorage.setItem(`${STORAGE_PREFIX}gen_${docId}_${studentKey}`, JSON.stringify(payload));
    return payload;
  } catch (err) {
    console.warn('Could not save generated document to localStorage:', err);
    return null;
  }
};

export const loadGeneratedDocument = (docId, studentKey) => {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}gen_${docId}_${studentKey}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Could not load generated document from localStorage:', err);
    return null;
  }
};

export const clearGeneratedDocument = (docId, studentKey) => {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}gen_${docId}_${studentKey}`);
  } catch (err) {
    console.warn('Could not clear generated document from localStorage:', err);
  }
};

