import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://nwwchkmbcybgvneauqex.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_1c6YarkkLcbFHvoi5YPtfQ__yaYF5xo';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // keep as is
      }
    }

    const email = body?.email;
    const password = body?.password;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please enter both Email and Password.'
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPass = String(password).trim();

    // Query user_logins with service role key (bypasses RLS completely)
    const { data, error } = await supabase
      .from('user_logins')
      .select('*')
      .ilike('email', cleanEmail)
      .limit(1);

    if (error) {
      console.error('Login DB error:', error);
      return res.status(500).json({
        success: false,
        error: 'Database query failed: ' + error.message
      });
    }

    if (!data || data.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'No account found with this email. Please check your email address.'
      });
    }

    const user = data[0];

    if (String(user.password).trim() !== cleanPass) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect password. Please try again.'
      });
    }

    // Success — return user
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        department: user.department,
        designation: user.designation,
        enrolment_no: user.enrolment_no,
        phone: user.phone,
        status: user.status,
        password: cleanPass
      }
    });

  } catch (err) {
    console.error('Login exception:', err);
    return res.status(500).json({
      success: false,
      error: 'Server error: ' + err.message
    });
  }
}
