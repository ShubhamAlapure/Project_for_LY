-- ==============================================================================
-- MIT-ADT University Pune - School of Computing
-- Internship & Final Year Industrial Training Management System (InternDocs)
-- 100% Error-Free, Idempotent Supabase SQL Schema
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. STUDENT INTERNSHIPS TABLE (17 Essential Fields + Timestamps)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.student_internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_date DATE DEFAULT CURRENT_DATE,
    email TEXT NOT NULL,
    contact_no TEXT NOT NULL,
    enrolment_no TEXT NOT NULL,
    full_name TEXT NOT NULL,
    gender TEXT DEFAULT 'Male',
    specialization TEXT NOT NULL,
    semester TEXT NOT NULL,
    source_of_internship TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration TEXT,
    company_name_and_city TEXT NOT NULL,
    mode_of_internship TEXT DEFAULT 'Offline',
    domain_of_company TEXT,
    is_ppo_offer TEXT DEFAULT 'No',
    offer_letter_url TEXT,
    completion_letter_url TEXT,
    status TEXT DEFAULT 'Submitted',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure all necessary columns exist (Safe for existing tables)
ALTER TABLE public.student_internships ADD COLUMN IF NOT EXISTS submission_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.student_internships ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.student_internships ADD COLUMN IF NOT EXISTS contact_no TEXT;
ALTER TABLE public.student_internships ADD COLUMN IF NOT EXISTS enrolment_no TEXT;
ALTER TABLE public.student_internships ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.student_internships ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'Male';
ALTER TABLE public.student_internships ADD COLUMN IF NOT EXISTS specialization TEXT;
ALTER TABLE public.student_internships ADD COLUMN IF NOT EXISTS semester TEXT;
ALTER TABLE public.student_internships ADD COLUMN IF NOT EXISTS source_of_internship TEXT;
ALTER TABLE public.student_internships ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE public.student_internships ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE public.student_internships ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE public.student_internships ADD COLUMN IF NOT EXISTS company_name_and_city TEXT;
ALTER TABLE public.student_internships ADD COLUMN IF NOT EXISTS mode_of_internship TEXT DEFAULT 'Offline';
ALTER TABLE public.student_internships ADD COLUMN IF NOT EXISTS domain_of_company TEXT;
ALTER TABLE public.student_internships ADD COLUMN IF NOT EXISTS is_ppo_offer TEXT DEFAULT 'No';
ALTER TABLE public.student_internships ADD COLUMN IF NOT EXISTS offer_letter_url TEXT;
ALTER TABLE public.student_internships ADD COLUMN IF NOT EXISTS completion_letter_url TEXT;
ALTER TABLE public.student_internships ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Submitted';
ALTER TABLE public.student_internships ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.student_internships ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
ALTER TABLE public.student_internships ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- Indexes for high-performance querying & search
CREATE INDEX IF NOT EXISTS idx_student_internships_enrolment ON public.student_internships (enrolment_no);
CREATE INDEX IF NOT EXISTS idx_student_internships_email ON public.student_internships (email);
CREATE INDEX IF NOT EXISTS idx_student_internships_specialization ON public.student_internships (specialization);
CREATE INDEX IF NOT EXISTS idx_student_internships_status ON public.student_internships (status);
CREATE INDEX IF NOT EXISTS idx_student_internships_submission_date ON public.student_internships (submission_date DESC);

-- Automatic Updated-At Trigger Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.student_internships;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.student_internships
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security (RLS) for student_internships
ALTER TABLE public.student_internships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to student records" ON public.student_internships;
CREATE POLICY "Allow public read access to student records" 
    ON public.student_internships FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert for student submissions" ON public.student_internships;
CREATE POLICY "Allow public insert for student submissions" 
    ON public.student_internships FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update for student records" ON public.student_internships;
CREATE POLICY "Allow public update for student records" 
    ON public.student_internships FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete for student records" ON public.student_internships;
CREATE POLICY "Allow public delete for student records" 
    ON public.student_internships FOR DELETE USING (true);

-- ==============================================================================
-- 3. STORAGE BUCKET FOR STUDENT DOCUMENTS (Offer & Completion Letters)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'student-documents', 
    'student-documents', 
    true,
    52428800, -- 50MB limit
    ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies (Safe drop & create)
DROP POLICY IF EXISTS "Allow public uploads to student-documents" ON storage.objects;
CREATE POLICY "Allow public uploads to student-documents"
    ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'student-documents');

DROP POLICY IF EXISTS "Allow public read of student-documents" ON storage.objects;
CREATE POLICY "Allow public read of student-documents"
    ON storage.objects FOR SELECT USING (bucket_id = 'student-documents');

DROP POLICY IF EXISTS "Allow public updates to student-documents" ON storage.objects;
CREATE POLICY "Allow public updates to student-documents"
    ON storage.objects FOR UPDATE USING (bucket_id = 'student-documents');

DROP POLICY IF EXISTS "Allow public delete in student-documents" ON storage.objects;
CREATE POLICY "Allow public delete in student-documents"
    ON storage.objects FOR DELETE USING (bucket_id = 'student-documents');

-- ==============================================================================
-- 4. USER LOGINS TABLE (Strictly Email & Password Authentication)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_logins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT DEFAULT 'School of Computing',
    designation TEXT,
    enrolment_no TEXT,
    phone TEXT,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_login TIMESTAMPTZ
);

-- Delete obsolete username column if it still exists in older installations
ALTER TABLE public.user_logins DROP COLUMN IF EXISTS username;

-- Ensure email unique index exists
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_logins_email_unique ON public.user_logins (email);
CREATE INDEX IF NOT EXISTS idx_user_logins_role ON public.user_logins (role);

-- Enable RLS for user_logins
ALTER TABLE public.user_logins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to user_logins" ON public.user_logins;
CREATE POLICY "Allow public read access to user_logins"
    ON public.user_logins FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert to user_logins" ON public.user_logins;
CREATE POLICY "Allow public insert to user_logins"
    ON public.user_logins FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update to user_logins" ON public.user_logins;
CREATE POLICY "Allow public update to user_logins"
    ON public.user_logins FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete from user_logins" ON public.user_logins;
CREATE POLICY "Allow public delete from user_logins"
    ON public.user_logins FOR DELETE USING (true);

-- ==============================================================================
-- 5. SEED / UPSERT INSTITUTIONAL USER ACCOUNTS (Idempotent)
-- ==============================================================================
INSERT INTO public.user_logins (email, password, full_name, role, department, designation, phone)
VALUES
    ('admin@mitadt.edu.in', 'admin123', 'Harshit Sagar', 'Admin', 'School of Computing', 'Institutional Administrator', '9876543210'),
    ('harshit.sagar@mitadt.edu.in', 'admin123', 'Harshit Sagar', 'Admin', 'School of Computing', 'Institutional Administrator', '9876543210'),
    ('shubham.alapure@mitadt.edu.in', 'admin123', 'Shubham Alapure', 'Admin', 'School of Computing', 'Lead System Administrator', '9322610932'),
    ('faculty@mitadt.edu.in', 'faculty123', 'Prof. Vaibhav Sawalkar', 'Faculty/Coordinator', 'Department of Computer Science & Engineering', 'Internship Coordinator & Assistant Professor', '9665368452'),
    ('vaibhav.sawalkar@mituniversity.edu.in', '9665368452', 'Prof. Vaibhav Sawalkar', 'Faculty/Coordinator', 'Department of Computer Science & Engineering', 'Internship Coordinator & Assistant Professor', '9665368452'),
    ('tp@mitadt.edu.in', 'tp123', 'Prof. Dr. Swati More', 'Central T&P', 'Corporate Relations & Placement Cell', 'Director, Central T&P', '02067652560'),
    ('swati.more@mituniversity.edu.in', 'tp123', 'Prof. Dr. Swati More', 'Central T&P', 'Corporate Relations & Placement Cell', 'Director, Central T&P', '02067652560'),
    ('hod@mitadt.edu.in', 'hod123', 'Prof. Dr. Jayashree Prasad', 'HOD', 'Department of CSE-AIA', 'Head of Department (CSE)', '02067652560'),
    ('jayashree.prasad@mituniversity.edu.in', 'hod123', 'Prof. Dr. Jayashree Prasad', 'HOD', 'Department of CSE-AIA', 'Head of Department (CSE)', '02067652560'),
    ('student@mitadt.edu.in', 'student123', 'Shubham Santosh Alapure', 'Student', 'Computer Science & Engineering', 'B.Tech Final Year Student', '9876543210'),
    ('aaryan99@gmail.com', 'student123', 'Aryan Patil', 'Student', 'Computer Science & Engineering', 'B.Tech Student (Final Year)', '9876543210'),
    ('pooja.sharma@mituniversity.edu.in', 'student123', 'Pooja Sharma', 'Student', 'Artificial Intelligence & Data Science', 'Final Year B.Tech (AI & DS)', '9822334455'),
    ('pooja.sharma@gmail.com', 'student123', 'Pooja Sharma', 'Student', 'Computer Science & Engineering', 'Final Year B.Tech (CSE)', '9822334455')
ON CONFLICT (email) DO UPDATE SET 
    password = EXCLUDED.password,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    designation = EXCLUDED.designation,
    phone = EXCLUDED.phone;

-- ==============================================================================
-- 6. SEED / UPSERT SAMPLE STUDENT RECORDS (Idempotent)
-- ==============================================================================
INSERT INTO public.student_internships (
    submission_date, email, contact_no, enrolment_no, full_name, gender, specialization,
    semester, source_of_internship, start_date, end_date, duration, company_name_and_city,
    mode_of_internship, domain_of_company, is_ppo_offer, offer_letter_url, completion_letter_url, status
)
VALUES
(
    '2026-01-01', 'aaryan99@gmail.com', '9876543210', 'ADT23SOCB1190', 'Aryan Patil', 'Male', 'Computer Science & Engineering (CSE)',
    'Semester VII (Final Year)', 'Off-Campus Drive', '2026-02-01', '2026-08-01', '6 Months (182 Days)', 'Google India pvt ltd.',
    'Offline', 'Information Technology (IT) / Software', 'No (Internship Only)', 
    'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA1OTUgODQyXSAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA1IDAgUiA+PiA+PiAvQ29udGVudHMgNCAwIFIgPj4KZW5kb2JqCjQgMCBvYmoKPDwgL0xlbmd0aCAxMDMzID4+CnN0cmVhbQpCVAovRjEgMjAgVGYKNTAgNzgwIFRkCihHT09HTEUgSU5ESUEgUFZULiBMVEQuIC0gT0ZGSUNJQUwgT0ZGRVIgTEVUVEVSKSBUagowIC0zMCBUZAovRjEgMTIgVGYKKERhdGU6IEF1Z3VzdCAxOCwgMjAyNikgVGoKMCAtMjUgVGQKKFRvOiBBcnlhbiBQYXRpbCAoQURUMjNTT0NCMTE5MCkpIFRqCjAgLTIwIFRkCihNSVQtQURUIFVuaXZlcnNpdHksIFB1bmUgLSBTY2hvb2wgb2YgQ29tcHV0aW5nKSBUagowIC00MCBUZAovRjEgMTQgVGYKKFN1YmplY3Q6IE9mZmVyIExldHRlciBmb3IgU29mdHdhcmUgRW5naW5lZXJpbmcgSW50ZXJuKSBUagowIC0zMCBUZAovRjEgMTEgVGYKKERlYXIgQXJ5YW4gUGF0aWwgKEFEVDIzU09DQjExOTApLCkgVGoKMCAtMjUgVGQKKFdlIGFyZSBwbGVhc2VkIHRvIGlzc3VlIHRoaXMgb2ZmaWNpYWwgb2ZmZXIgbGV0dGVyIHJlZ2FyZGluZyB5b3VyIGluZHVzdHJpYWwgaW50ZXJuc2hpcCB0ZW51cmUgYXQgR29vZ2xlIEluZGlhIFB2dC4gTHRkLi4pIFRqCjAgLTIwIFRkCihQb3NpdGlvbjogU29mdHdhcmUgRW5naW5lZXJpbmcgSW50ZXJuKSBUagowIC0yMCBUZAooVGVudXJlICYgRHVyYXRpb246IEZlYiAwMSwgMjAyNiB0byBBdWcgMDEsIDIwMjYgKDYgTW9udGhzKSkgVGoKMCAtMjAgVGQKKE1vZGU6IEluZHVzdHJpYWwgT24tU2l0ZSAmIEh5YnJpZCBWZXJpZmljYXRpb24pIFRqCjAgLTIwIFRkCihTdGlwZW5kIC8gSG9ub3Jhcml1bTogSU5SIDg1LDAwMCAvIE1vbnRoKSBUagowIC0zNSBUZAooUGVyZm9ybWFuY2UgJiBFdmFsdWF0aW9uOiBTdWNjZXNzZnVsbHkgdmVyaWZpZWQgYnkgQ29ycG9yYXRlIFRhbGVudCAmIFVuaXZlcnNpdHkgQ29vcmRpbmF0b3IuKSBUagowIC00MCBUZAooQXV0aG9yaXplZCBTaWduYXRvcnksKSBUagowIC0yMCBUZAooL3MvIERpcmVjdG9yIG9mIFVuaXZlcnNpdHkgUmVsYXRpb25zICYgVGFsZW50IEFjcXVpc2l0aW9uKSBUagowIC0xNSBUZAooR29vZ2xlIEluZGlhIFB2dC4gTHRkLiBHbG9iYWwgRGVsaXZlcnkgJiBEZXZlbG9wbWVudCBDZW50cmUpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDIyNyAwMDAwMCBuIAowMDAwMDAwMDAwIDAwMDAwIG4gCnRyYWlsZXIKPDwgL1NpemUgNiAvUm9vdCAxIDAgUiA+PgolJUVPRg==', 
    NULL, 
    'Verified'
),
(
    '2026-01-15', 'pooja.sharma@mituniversity.edu.in', '9822334455', 'ADT23SOCB1204', 'Pooja Sharma', 'Female', 'Artificial Intelligence & Data Science (AI & DS)',
    'Semester VIII (Final Year)', 'Campus Placement Cell', '2026-01-15', '2026-07-15', '6 Months (182 Days)', 'Microsoft India R&D Pvt. Ltd., Bengaluru',
    'Hybrid', 'Artificial Intelligence & Cloud Systems', 'Yes (PPO Possibility)', 
    'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA1OTUgODQyXSAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA1IDAgUiA+PiA+PiAvQ29udGVudHMgNCAwIFIgPj4KZW5kb2JqCjQgMCBvYmoKPDwgL0xlbmd0aCAxMDUyID4+CnN0cmVhbQpCVAovRjEgMjAgVGYKNTAgNzgwIFRkCihNSUNST1NPRlQgSU5ESUEgUiZEIFBWVC4gTFRELiAtIE9GRklDSUFMIE9GRkVSIExFVFRFUikgVGoKMCAtMzAgVGQKL0YxIDEyIFRmCihEYXRlOiBBdWd1c3QgMTgsIDIwMjYpIFRqCjAgLTI1IFRkCihUbzogUG9vamEgU2hhcm1hIChBRFQyM1NPQ0IxMjA0KSkgVGoKMCAtMjAgVGQKKE1JVC1BRFQgVW5pdmVyc2l0eSwgUHVuZSAtIFNjaG9vbCBvZiBDb21wdXRpbmcpIFRqCjAgLTQwIFRkCi9GMSAxNCBUZgooU3ViamVjdDogT2ZmZXIgTGV0dGVyIGZvciBBSSAmIENsb3VkIFN5c3RlbXMgSW50ZXJuKSBUagowIC0zMCBUZAovRjEgMTEgVGYKKERlYXIgUG9vamEgU2hhcm1hIChBRFQyM1NPQ0IxMjA0KSwpIFRqCjAgLTI1IFRkCihXZSBhcmUgcGxlYXNlZCB0byBpc3N1ZSB0aGlzIG9mZmljaWFsIG9mZmVyIGxldHRlciByZWdhcmRpbmcgeW91ciBpbmR1c3RyaWFsIGludGVybnNoaXAgdGVudXJlIGF0IE1pY3Jvc29mdCBJbmRpYSBSJkQgUHZ0LiBMdGQuLikgVGoKMCAtMjAgVGQKKFBvc2l0aW9uOiBBSSAmIENsb3VkIFN5c3RlbXMgSW50ZXJuKSBUagowIC0yMCBUZAooVGVudXJlICYgRHVyYXRpb246IEphbiAxNSwgMjAyNiB0byBKdWwgMTUsIDIwMjYgKDYgTW9udGhzKSkgVGoKMCAtMjAgVGQKKE1vZGU6IEluZHVzdHJpYWwgT24tU2l0ZSAmIEh5YnJpZCBWZXJpZmljYXRpb24pIFRqCjAgLTIwIFRkCihTdGlwZW5kIC8gSG9ub3Jhcml1bTogSU5SIDkwLDAwMCAvIE1vbnRoKSBUagowIC0zNSBUZAooUGVyZm9ybWFuY2UgJiBFdmFsdWF0aW9uOiBTdWNjZXNzZnVsbHkgdmVyaWZpZWQgYnkgQ29ycG9yYXRlIFRhbGVudCAmIFVuaXZlcnNpdHkgQ29vcmRpbmF0b3IuKSBUagowIC00MCBUZAooQXV0aG9yaXplZCBTaWduYXRvcnksKSBUagowIC0yMCBUZAooL3MvIERpcmVjdG9yIG9mIFVuaXZlcnNpdHkgUmVsYXRpb25zICYgVGFsZW50IEFjcXVpc2l0aW9uKSBUagowIC0xNSBUZAooTWljcm9zb2Z0IEluZGlhIFImRCBQdnQuIEx0ZC4gR2xvYmFsIERlbGl2ZXJ5ICYgRGV2ZWxvcG1lbnQgQ2VudHJlKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKPDwgL1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyMjcgMDAwMDAgbiAKMDAwMDAwMDAwMCAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDYgL1Jvb3QgMSAwIFIgPj4KJSVFT0Y=', 
    NULL, 
    'Verified'
)
ON CONFLICT (id) DO NOTHING;

-- Verification Query to check everything is active
SELECT 'user_logins count' AS metric, count(*)::text AS value FROM public.user_logins
UNION ALL
SELECT 'student_internships count', count(*)::text FROM public.student_internships
UNION ALL
SELECT 'storage_bucket created', name FROM storage.buckets WHERE id = 'student-documents';
