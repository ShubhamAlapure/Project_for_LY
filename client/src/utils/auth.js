import { supabase } from './supabaseClient';
import lyStudents from '../data/lyStudents.json';

export const ROLES = {
  STUDENT: 'Student',
  FACULTY: 'Faculty/Coordinator',
  CENTRAL_TP: 'Central T&P',
  HOD: 'HOD',
  ADMIN: 'Admin'
};

export const ROLE_CONFIG = {
  [ROLES.STUDENT]: {
    label: 'Student',
    description: 'Submit internship details, track application verification status, and generate Undertaking & NOC.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: 'GraduationCap',
    defaultRoute: 'student-form'
  },
  [ROLES.FACULTY]: {
    label: 'Faculty / Internship Coordinator',
    description: 'Review student applications, verify offer letters, and endorse academic documents.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: 'UserCheck',
    defaultRoute: 'student-records'
  },
  [ROLES.CENTRAL_TP]: {
    label: 'Central Training & Placement (T&P)',
    description: 'Corporate relations, placement cell oversight, PPO confirmation, and campus drives.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: 'Building2',
    defaultRoute: 'student-records'
  },
  [ROLES.HOD]: {
    label: 'Head of Department (HOD)',
    description: 'Departmental approval, compliance with academic rules, and NOC authorization.',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    icon: 'Award',
    defaultRoute: 'student-records'
  },
  [ROLES.ADMIN]: {
    label: 'Institutional Admin',
    description: 'Complete system access, database administration, document issuing, and user management.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    icon: 'Shield',
    defaultRoute: 'student-records'
  }
};

export const DEFAULT_USERS = [
  // 1. Admin Accounts
  {
    id: 'usr_admin_01',
    email: 'harshit.sagar@mitadt.edu.in',
    password: 'admin123',
    full_name: 'Harshit Sagar',
    role: ROLES.ADMIN,
    department: 'School of Computing',
    designation: 'Institutional Administrator',
    phone: '9876543210',
    status: 'Active'
  },
  {
    id: 'usr_admin_02',
    email: 'shubham.alapure@mitadt.edu.in',
    password: 'admin123',
    full_name: 'Shubham Alapure',
    role: ROLES.ADMIN,
    department: 'School of Computing',
    designation: 'Lead System Administrator',
    phone: '9322610932',
    status: 'Active'
  },
  {
    id: 'usr_admin_03',
    email: 'admin@mitadt.edu.in',
    password: 'admin123',
    full_name: 'Harshit Sagar',
    role: ROLES.ADMIN,
    department: 'School of Computing',
    designation: 'Institutional Administrator',
    phone: '9876543210',
    status: 'Active'
  },

  // 2. Student Accounts
  {
    id: 'usr_student_01',
    email: 'aaryan99@gmail.com',
    password: 'student123',
    full_name: 'Aryan Patil',
    role: ROLES.STUDENT,
    department: 'Department of Computer Science & Engineering',
    enrolment_no: 'ADT23SOCB1190',
    designation: 'B.Tech Student (Final Year)',
    phone: '9876543210',
    status: 'Active'
  },
  {
    id: 'usr_student_02',
    email: 'pooja.sharma@mituniversity.edu.in',
    password: 'student123',
    full_name: 'Pooja Sharma',
    role: ROLES.STUDENT,
    department: 'Department of Artificial Intelligence & Data Science',
    enrolment_no: 'ADT23SOCB1204',
    designation: 'Final Year B.Tech (AI & DS)',
    phone: '9822334455',
    status: 'Active'
  },
  {
    id: 'usr_student_03',
    email: 'rahul.deshmukh@mituniversity.edu.in',
    password: 'student123',
    full_name: 'Rahul Deshmukh',
    role: ROLES.STUDENT,
    department: 'Department of Computer Science & Engineering',
    enrolment_no: 'ADT23SOCB1205',
    designation: 'Final Year B.Tech (CSE)',
    phone: '9811223344',
    status: 'Active'
  },
  {
    id: 'usr_student_04',
    email: 'student@mitadt.edu.in',
    password: 'student123',
    full_name: 'Shubham Santosh Alapure',
    role: ROLES.STUDENT,
    department: 'Department of Computer Science & Engineering',
    enrolment_no: 'MITADT2022CS084',
    designation: 'Final Year B.Tech Student',
    phone: '9876543210',
    status: 'Active'
  },

  // 3. Faculty / Coordinator Accounts
  {
    id: 'usr_faculty_01',
    email: 'vaibhav.sawalkar@mituniversity.edu.in',
    password: '9665368452',
    full_name: 'Prof. Vaibhav Sawalkar',
    role: ROLES.FACULTY,
    department: 'Department of Computer Science & Engineering',
    designation: 'Internship Coordinator & Assistant Professor',
    phone: '9665368452',
    status: 'Active'
  },
  {
    id: 'usr_faculty_02',
    email: 'faculty@mitadt.edu.in',
    password: 'faculty123',
    full_name: 'Prof. Vaibhav Sawalkar',
    role: ROLES.FACULTY,
    department: 'Department of Computer Science & Engineering',
    designation: 'Internship Coordinator & Assistant Professor',
    phone: '9665368452',
    status: 'Active'
  },

  // 4. Central T&P Accounts
  {
    id: 'usr_tp_01',
    email: 'swati.more@mituniversity.edu.in',
    password: 'tp123',
    full_name: 'Prof. Dr. Swati More',
    role: ROLES.CENTRAL_TP,
    department: 'Corporate Relations & Placement Cell',
    designation: 'Director, Central T&P',
    phone: '02067652560',
    status: 'Active'
  },
  {
    id: 'usr_tp_02',
    email: 'tp@mitadt.edu.in',
    password: 'tp123',
    full_name: 'Prof. Dr. Swati More',
    role: ROLES.CENTRAL_TP,
    department: 'Corporate Relations & Placement Cell',
    designation: 'Director, Central T&P',
    phone: '02067652560',
    status: 'Active'
  },

  // 5. HOD Accounts
  {
    id: 'usr_hod_01',
    email: 'jayashree.prasad@mituniversity.edu.in',
    password: 'hod123',
    full_name: 'Prof. Dr. Jayashree Prasad',
    role: ROLES.HOD,
    department: 'Department of CSE-AIA',
    designation: 'Head of Department (CSE)',
    phone: '02067652560',
    status: 'Active'
  },
  {
    id: 'usr_hod_02',
    email: 'hod@mitadt.edu.in',
    password: 'hod123',
    full_name: 'Prof. Dr. Jayashree Prasad',
    role: ROLES.HOD,
    department: 'Department of CSE-AIA',
    designation: 'Head of Department (CSE)',
    phone: '02067652560',
    status: 'Active'
  }
];

const AUTH_STORAGE_KEY = 'mit_interndocs_auth_user';
const USERS_CACHE_KEY = 'mit_interndocs_users_cache';

const ALL_SEED_USERS = [...DEFAULT_USERS, ...lyStudents];

const getCachedUsers = () => {
  try {
    const cached = localStorage.getItem(USERS_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const merged = [...ALL_SEED_USERS];
      parsed.forEach(pu => {
        if (!merged.find(u => u.email?.toLowerCase() === pu.email?.toLowerCase())) {
          merged.push(pu);
        }
      });
      return merged;
    }
    return ALL_SEED_USERS;
  } catch (e) {
    return ALL_SEED_USERS;
  }
};

export const saveCachedUsers = (users) => {
  try {
    localStorage.setItem(USERS_CACHE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to cache users:', e);
  }
};

/**
 * Get currently authenticated user
 */
export const getCurrentUser = () => {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};

/**
 * Normalizes role comparison
 */
const rolesMatch = (roleA, roleB) => {
  if (!roleA || !roleB) return true;
  const a = roleA.toLowerCase().trim();
  const b = roleB.toLowerCase().trim();
  if (a === b) return true;
  if (a.includes('faculty') && b.includes('faculty')) return true;
  if (a.includes('coordinator') && b.includes('coordinator')) return true;
  if (a.includes('tp') && b.includes('tp')) return true;
  if (a.includes('placement') && b.includes('placement')) return true;
  if (a.includes('hod') && b.includes('hod')) return true;
  if (a.includes('admin') && b.includes('admin')) return true;
  if (a.includes('student') && b.includes('student')) return true;
  return false;
};

/**
 * Shorthand aliases that map simple identifiers to full email addresses.
 */
const EMAIL_ALIASES = {
  'admin': 'admin@mitadt.edu.in',
  'student': 'student@mitadt.edu.in',
  'faculty': 'faculty@mitadt.edu.in',
  'tp': 'tp@mitadt.edu.in',
  'hod': 'hod@mitadt.edu.in',
};

/**
 * Resolves a user-typed identifier to a valid email address.
 */
const resolveEmail = (identifier) => {
  if (!identifier) return '';
  const clean = identifier.trim().toLowerCase();
  if (clean.includes('@')) return clean;
  if (EMAIL_ALIASES[clean]) return EMAIL_ALIASES[clean];
  const prefixMatch = DEFAULT_USERS.find(u => {
    if (!u.email) return false;
    return u.email.split('@')[0].toLowerCase() === clean;
  });
  if (prefixMatch) return prefixMatch.email.toLowerCase();
  return clean;
};

/**
 * Authenticate user by Email and Password.
 * Strategy order:
 *   1. Server API (/api/login) — works locally with service role key
 *   2. Direct Supabase client query — works on Vercel with anon key
 *   3. Local fallback (DEFAULT_USERS + cached users)
 */
export const loginUser = async (emailInput, passwordInput, requestedRole = null) => {
  const resolvedEmail = resolveEmail(emailInput);
  const cleanPass = (passwordInput || '').trim();

  console.log('[LOGIN] Attempting login for:', resolvedEmail);

  if (!resolvedEmail || !cleanPass) {
    return { success: false, error: 'Please enter both Email and Password.' };
  }

  // ──────── Strategy 1: Server API (/api/login) ────────
  try {
    const apiRes = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: resolvedEmail, password: cleanPass })
    });

    // Only parse as JSON if the response is actually JSON (not HTML fallback)
    const contentType = apiRes.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const apiData = await apiRes.json();
      console.log('[LOGIN] Server API response:', apiData.success, apiData.error || '');

      if (apiData.success && apiData.user) {
        const user = apiData.user;
        if (requestedRole && !rolesMatch(user.role, requestedRole) && user.role !== ROLES.ADMIN) {
          return {
            success: false,
            error: `Your account is registered as "${user.role}". Please switch to the ${user.role} tab.`
          };
        }
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        return { success: true, user };
      }

      // If server explicitly confirmed wrong password for an existing account, return error
      if (apiRes.status === 401 && apiData.error && apiData.error.toLowerCase().includes('password')) {
        return { success: false, error: apiData.error };
      }
    } else {
      console.log('[LOGIN] Server API returned non-JSON (HTML), skipping...');
    }
  } catch (apiErr) {
    console.log('[LOGIN] Server API not available:', apiErr.message);
  }

  // ──────── Strategy 2: Direct Supabase query (works on Vercel) ────────
  try {
    console.log('[LOGIN] Querying Supabase user_logins for:', resolvedEmail);

    const { data, error } = await supabase
      .from('user_logins')
      .select('*')
      .ilike('email', resolvedEmail)
      .limit(5);

    console.log('[LOGIN] Supabase response - data:', data?.length || 0, 'error:', error?.message || 'none');

    if (error) {
      console.error('[LOGIN] Supabase query error:', error);
    }

    if (data && data.length > 0) {
      // Find exact email match (case-insensitive)
      const user = data.find(u => u.email.toLowerCase() === resolvedEmail) || data[0];
      console.log('[LOGIN] Found user:', user.email, 'role:', user.role);

      if (String(user.password).trim() === cleanPass) {
        if (requestedRole && !rolesMatch(user.role, requestedRole) && user.role !== ROLES.ADMIN) {
          return {
            success: false,
            error: `Your account is registered as "${user.role}". Please switch to the ${user.role} tab.`
          };
        }
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        return { success: true, user };
      } else {
        console.log('[LOGIN] Password mismatch for Supabase record.');
        return { success: false, error: 'Incorrect password. Please try again.' };
      }
    }
  } catch (err) {
    console.error('[LOGIN] Supabase exception:', err);
  }

  // ──────── Strategy 3: Local fallback (ALL_SEED_USERS + cache) ────────
  console.log('[LOGIN] Falling back to local credentials store...');
  const users = getCachedUsers();
  const accountByEmail = users.find(
    u => u.email && u.email.toLowerCase() === resolvedEmail
  );

  if (accountByEmail) {
    if (String(accountByEmail.password).trim() === cleanPass) {
      if (requestedRole && !rolesMatch(accountByEmail.role, requestedRole) && accountByEmail.role !== ROLES.ADMIN) {
        return {
          success: false,
          error: `Your account is registered as "${accountByEmail.role}". Please switch to the ${accountByEmail.role} tab.`
        };
      }
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(accountByEmail));
      return { success: true, user: accountByEmail, isFallback: true };
    } else {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }
  }

  return { 
    success: false, 
    error: 'No account found with this email. Please check your email address.' 
  };
};

/**
 * Quick demo login — bypasses Supabase and logs in with the first
 * DEFAULT_USERS entry that matches the requested role.
 */
export const quickDemoLogin = (role) => {
  const demoUser = DEFAULT_USERS.find(u => u.role === role);
  if (!demoUser) {
    return { success: false, error: `No demo account configured for role "${role}".` };
  }
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
  return { success: true, user: demoUser };
};

/**
 * Log out user session
 */
export const logoutUser = () => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Update user password immediately in Supabase DB (table: user_logins) and update session cache
 */
export const updateUserPassword = async (email, currentPassword, newPassword) => {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanCurrentPass = (currentPassword || '').trim();
  const cleanNewPass = (newPassword || '').trim();

  if (!cleanEmail || !cleanCurrentPass || !cleanNewPass) {
    return { success: false, error: 'Please fill out all password fields.' };
  }

  if (cleanNewPass.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters long.' };
  }

  const users = getCachedUsers();
  const matchedLocalUser = users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
  const currentSession = getCurrentUser();

  let dbUpdated = false;
  let dbErrorNote = null;

  try {
    // 1. Verify current password against Supabase DB if accessible
    const { data: fetchUser, error: fetchErr } = await supabase
      .from('user_logins')
      .select('*')
      .ilike('email', cleanEmail)
      .limit(1);

    if (!fetchErr && fetchUser && fetchUser.length > 0) {
      if (fetchUser[0].password !== cleanCurrentPass) {
        return { success: false, error: 'Current password is incorrect. Please double-check your current password.' };
      }
    } else if (matchedLocalUser && matchedLocalUser.password !== cleanCurrentPass) {
      return { success: false, error: 'Current password is incorrect. Please double-check your current password.' };
    }

    // 2. Perform IMMEDIATE UPDATE on Supabase DB user_logins table
    let { data: updatedData, error: updateErr } = await supabase
      .from('user_logins')
      .update({ password: cleanNewPass })
      .eq('email', cleanEmail)
      .select();

    if ((!updatedData || updatedData.length === 0) && email !== cleanEmail) {
      const retry = await supabase
        .from('user_logins')
        .update({ password: cleanNewPass })
        .eq('email', email)
        .select();
      updatedData = retry.data;
      if (retry.error) updateErr = retry.error;
    }

    if (!updateErr && updatedData && updatedData.length > 0) {
      dbUpdated = true;
    } else {
      // Upsert if row was not found in DB
      const activeUser = getCurrentUser() || {};
      const { error: upsertErr } = await supabase
        .from('user_logins')
        .upsert({
          email: cleanEmail,
          password: cleanNewPass,
          full_name: activeUser.full_name || 'System User',
          role: activeUser.role || 'Student',
          department: activeUser.department || 'School of Computing',
          designation: activeUser.designation || '',
          phone: activeUser.phone || ''
        }, { onConflict: 'email' });

      if (!upsertErr) {
        dbUpdated = true;
      } else {
        dbErrorNote = upsertErr ? upsertErr.message : (updateErr ? updateErr.message : 'RLS or record match issue');
      }
    }
  } catch (err) {
    console.warn('Network exception updating Supabase DB, persisting locally:', err.message);
    dbErrorNote = err.message;
  }

  // 3. ALWAYS update localStorage session and users cache IMMEDIATELY
  if (currentSession && currentSession.email.toLowerCase() === cleanEmail) {
    const updatedSession = { ...currentSession, password: cleanNewPass };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedSession));
  }

  const updatedUsers = users.map(u => {
    if (u.email && u.email.toLowerCase() === cleanEmail) {
      return { ...u, password: cleanNewPass };
    }
    return u;
  });

  if (!updatedUsers.some(u => u.email && u.email.toLowerCase() === cleanEmail)) {
    const activeUser = getCurrentUser() || {};
    updatedUsers.push({
      email: cleanEmail,
      password: cleanNewPass,
      full_name: activeUser.full_name || 'System User',
      role: activeUser.role || 'Student'
    });
  }

  saveCachedUsers(updatedUsers);

  if (dbUpdated) {
    return {
      success: true,
      message: 'Password updated immediately in Supabase DB! Your next login will require this new password.',
      newPassword: cleanNewPass
    };
  } else {
    return {
      success: true,
      isFallback: true,
      message: `Password updated successfully in active session & local cache! (${dbErrorNote ? 'Cloud notice: ' + dbErrorNote : 'Local sync completed'}).`,
      newPassword: cleanNewPass
    };
  }
};

