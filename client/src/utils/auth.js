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
    description: 'Submit internship details, track approval status, and generate Undertaking & NOC letters.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: 'GraduationCap',
    defaultRoute: 'student-form'
  },
  [ROLES.FACULTY]: {
    label: 'Faculty / Coordinator',
    description: 'Review departmental student internships, verify offer letters, and endorse Undertakings.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: 'UserCheck',
    defaultRoute: 'student-records'
  },
  [ROLES.CENTRAL_TP]: {
    label: 'Central T&P Cell',
    description: 'Campus-wide corporate relations dashboard, PPO conversions, and company analytics.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: 'Building2',
    defaultRoute: 'student-records'
  },
  [ROLES.HOD]: {
    label: 'Head of Department (HOD)',
    description: 'Departmental oversight, academic approvals, and official NOC authorization.',
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
  {
    id: 'usr_admin_01',
    username: 'admin',
    email: 'admin@mitadt.edu.in',
    password: 'admin123',
    full_name: 'Shubham Alapure',
    role: ROLES.ADMIN,
    department: 'School of Computing',
    designation: 'Lead System Administrator',
    phone: '9876543210',
    status: 'Active'
  },
  {
    id: 'usr_admin_02',
    username: 'shubhamalapure',
    email: 'shubham.alapure@mitadt.edu.in',
    password: 'admin123',
    full_name: 'Shubham Alapure',
    role: ROLES.ADMIN,
    department: 'School of Computing',
    designation: 'Lead System Administrator',
    phone: '9876543210',
    status: 'Active'
  },
  {
    id: 'usr_student_01',
    username: 'student',
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
  {
    id: 'usr_faculty_01',
    username: 'faculty',
    email: 'faculty@mitadt.edu.in',
    password: 'faculty123',
    full_name: 'Prof. Vaibhav Sawalkar',
    role: ROLES.FACULTY,
    department: 'Department of Computer Science & Engineering',
    designation: 'Internship Coordinator & Assistant Professor',
    phone: '02067652560',
    status: 'Active'
  },
  {
    id: 'usr_tp_01',
    username: 'tp',
    email: 'tp@mitadt.edu.in',
    password: 'tp123',
    full_name: 'Prof. Dr. Swati More',
    role: ROLES.CENTRAL_TP,
    department: 'Corporate Relations & Placement Cell',
    designation: 'Director, Central T&P',
    phone: '02067652560',
    status: 'Active'
  },
  {
    id: 'usr_hod_01',
    username: 'hod',
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
    return cached ? JSON.parse(cached) : DEFAULT_USERS;
  } catch (e) {
    return DEFAULT_USERS;
  }
};

const saveCachedUsers = (users) => {
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
 * Authenticate user by username/email and password
 */
export const loginUser = async (identifier, password, requestedRole = null) => {
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  if (!cleanId || !cleanPass) {
    return { success: false, error: 'Please provide both username/email and password.' };
  }

  try {
    // 1. Try Supabase query first
    const { data, error } = await supabase
      .from('user_logins')
      .select('*')
      .or(`username.eq.${cleanId},email.eq.${cleanId}`)
      .limit(1);

    if (!error && data && data.length > 0) {
      const user = data[0];
      if (user.password === cleanPass) {
        if (requestedRole && user.role !== requestedRole && user.role !== ROLES.ADMIN) {
          return {
            success: false,
            error: `Your account is registered as ${user.role}. Please select ${user.role} to login.`
          };
        }
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        return { success: true, user };
      } else {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }
    }
  } catch (err) {
    console.warn('Supabase auth network notice, checking local seed database:', err);
  }

  // 2. Fallback to cached / seed user database
  const users = getCachedUsers();
  const matchedUser = users.find(
    u => (u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId) && u.password === cleanPass
  );

  if (matchedUser) {
    if (requestedRole && matchedUser.role !== requestedRole && matchedUser.role !== ROLES.ADMIN) {
      return {
        success: false,
        error: `Your account is registered as ${matchedUser.role}. Please select the ${matchedUser.role} tab.`
      };
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matchedUser));
    return { success: true, user: matchedUser, isFallback: true };
  }

  return { success: false, error: 'Invalid username or password. Please verify credentials.' };
};

/**
 * Quick 1-click Demo Login for effortless role switching
 */
export const quickDemoLogin = (role) => {
  const users = getCachedUsers();
  const user = users.find(u => u.role === role) || DEFAULT_USERS.find(u => u.role === role);
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, error: 'Role account not found' };
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
 * Fetch all registered users (for Admin dashboard)
 */
export const fetchAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('user_logins')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      saveCachedUsers(data);
      return { success: true, data };
    }
  } catch (err) {
    console.warn('Error fetching users from Supabase:', err);
  }

  return { success: true, data: getCachedUsers(), isFallback: true };
};

/**
 * Add or register a new user login (Admin feature)
 */
export const registerUser = async (userData) => {
  const newUser = {
    ...userData,
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('user_logins')
      .insert([newUser])
      .select();

    if (!error && data) {
      const current = getCachedUsers();
      saveCachedUsers([data[0], ...current]);
      return { success: true, data: data[0] };
    }
  } catch (err) {
    console.warn('Supabase insert user notice:', err);
  }

  const current = getCachedUsers();
  const localNewUser = { ...newUser, id: 'usr_' + Date.now() };
  saveCachedUsers([localNewUser, ...current]);
  return { success: true, data: localNewUser, isFallback: true };
};
