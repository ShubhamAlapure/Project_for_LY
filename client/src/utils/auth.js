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
  // 1. Lead Admin
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

  // 2. Student Accounts
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

  // 3. Faculty / Coordinator Accounts
  {
    id: 'usr_faculty_01',
    username: 'vaibhav.sawalkar@mituniversity.edu.in',
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
    username: 'faculty',
    email: 'faculty@mitadt.edu.in',
    password: 'faculty123',
    full_name: 'Prof. Vaibhav Sawalkar',
    role: ROLES.FACULTY,
    department: 'Department of Computer Science & Engineering',
    designation: 'Internship Coordinator & Assistant Professor',
    phone: '9665368452',
    status: 'Active'
  },
  {
    id: 'usr_faculty_03',
    username: 'vaibhavsawalkar',
    email: 'vaibhav.sawalkar@mitadt.edu.in',
    password: '9665368452',
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
    id: 'usr_tp_02',
    username: 'swati.more@mituniversity.edu.in',
    email: 'swati.more@mituniversity.edu.in',
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
    username: 'hod',
    email: 'hod@mitadt.edu.in',
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
    username: 'jayashree.prasad@mituniversity.edu.in',
    email: 'jayashree.prasad@mituniversity.edu.in',
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
      // Merge with DEFAULT_USERS
      const merged = [...DEFAULT_USERS];
      parsed.forEach(pu => {
        if (!merged.find(u => u.username.toLowerCase() === pu.username?.toLowerCase() || u.email.toLowerCase() === pu.email?.toLowerCase())) {
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
 * Normalizes role comparison (e.g. 'Faculty' vs 'Faculty/Coordinator')
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
 * Authenticate user by username/email/phone and password
 */
export const loginUser = async (identifier, password, requestedRole = null) => {
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  if (!cleanId || !cleanPass) {
    return { success: false, error: 'Please provide both username/email and password.' };
  }

  // 1. Try Supabase cloud query first if connected
  try {
    const { data, error } = await supabase
      .from('user_logins')
      .select('*')
      .or(`username.ilike.${cleanId},email.ilike.${cleanId},phone.eq.${cleanId}`)
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

  // 2. Fallback to cached / default seed user database
  const users = getCachedUsers();
  const matchedUser = users.find(
    u => (
      (u.username && u.username.toLowerCase() === cleanId) || 
      (u.email && u.email.toLowerCase() === cleanId) ||
      (u.phone && u.phone.trim() === cleanId)
    ) && u.password === cleanPass
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

  return { success: false, error: 'Invalid username or password. Please verify credentials.' };
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
 * Add a new user to the local cache and Supabase
 */
export const registerUser = async (userData) => {
  const users = getCachedUsers();
  const newUser = {
    id: `usr_${Date.now()}`,
    status: 'Active',
    ...userData
  };

  users.push(newUser);
  saveCachedUsers(users);

  try {
    await supabase.from('user_logins').insert([newUser]);
  } catch (err) {
    console.warn('Could not sync user to Supabase:', err);
  }

  return { success: true, user: newUser };
};
