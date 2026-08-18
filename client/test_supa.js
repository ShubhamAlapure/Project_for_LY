import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nwwchkmbycbgvneauqex.supabase.co';
const SUPABASE_KEY = 'sb_publishable_1c6YarkkLcbFHvoi5YPtfQ__yaYF5xo';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  console.log('--- Testing Supabase Connection ---');
  
  // 1. Check user_logins
  const { data: users, error: userError } = await supabase.from('user_logins').select('email, full_name, role');
  console.log('Users count:', users?.length, 'userError:', userError?.message);

  // 2. Check student_internships
  const { data: students, error: studentError } = await supabase.from('student_internships').select('*');
  console.log('Students count:', students?.length, 'studentError:', studentError?.message);
  console.log('Students data in Supabase:', students);

  // 3. Test updating Aryan Patil
  if (students && students.length > 0) {
    const aryan = students.find(s => s.enrolment_no === 'ADT23SOCB1190' || s.email === 'aaryan99@gmail.com');
    if (aryan) {
      console.log('Found Aryan in DB, ID:', aryan.id);
      const { data: updateRes, error: updateError } = await supabase
        .from('student_internships')
        .update({ 
          completion_letter_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800', 
          status: 'Completed' 
        })
        .eq('id', aryan.id)
        .select();
      console.log('Update result:', { updateRes, updateError: updateError?.message });
    }
  }

  // 4. Test storage bucket
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  console.log('Storage buckets:', { buckets, bucketError: bucketError?.message });
}

test();
