import { supabase } from './supabaseClient';

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

const getCachedUsers = () => {
  try {
    const cached = localStorage.getItem(USERS_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const merged = [...DEFAULT_USERS];
      parsed.forEach(pu => {
        if (!merged.find(u => u.email?.toLowerCase() === pu.email?.toLowerCase())) {
          merged.push(pu);
        }
      });
      return merged;
    }
    return DEFAULT_USERS;
  } catch (e) {
    return DEFAULT_USERS;
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
 * Authenticate user strictly by Email and Password (No other fields permitted)
 */
export const loginUser = async (emailInput, passwordInput, requestedRole = null) => {
  const cleanEmail = (emailInput || '').trim().toLowerCase();
  const cleanPass = (passwordInput || '').trim();

  if (!cleanEmail || !cleanPass) {
    return { success: false, error: 'Please enter both Email and Password.' };
  }

  // 1. Query Supabase cloud database strictly by Email
  try {
    const { data, error } = await supabase
      .from('user_logins')
      .select('*')
      .ilike('email', cleanEmail)
      .limit(1);

    if (!error && data && data.length > 0) {
      const user = data[0];
      if (user.password === cleanPass) {
        if (requestedRole && !rolesMatch(user.role, requestedRole) && user.role !== ROLES.ADMIN) {
          return {
            success: false,
            error: `Your account is registered as ${user.role}. Please switch to the ${user.role} tab.`
          };
        }
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        return { success: true, user };
      } else {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }
    }
  } catch (err) {
    console.warn('Supabase query note, falling back to local credentials:', err);
  }

  // 2. Fallback to cached / default seed user database strictly by Email
  const users = getCachedUsers();
  const matchedUser = users.find(
    u => u.email && u.email.toLowerCase() === cleanEmail && u.password === cleanPass
  );

  if (matchedUser) {
    if (requestedRole && !rolesMatch(matchedUser.role, requestedRole) && matchedUser.role !== ROLES.ADMIN) {
      return {
        success: false,
        error: `Your account is registered as ${matchedUser.role}. Please select the ${matchedUser.role} tab.`
      };
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matchedUser));
    return { success: true, user: matchedUser, isFallback: true };
  }

  return { success: false, error: 'Invalid email or password. Please verify your credentials.' };
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
