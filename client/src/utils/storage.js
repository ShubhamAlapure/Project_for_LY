/**
 * Local Storage Persistence Helpers
 * Ensures form state survives accidental page refresh or tab close
 */

const STORAGE_PREFIX = 'interndocs_';

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
