-- ==============================================================================
-- MIT-ADT University Pune - School of Computing
-- Internship & Final Year Industrial Training Management System
-- Database Schema & Role-Based Authentication
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Student Internships Table (17 Essential Fields)
CREATE TABLE IF NOT EXISTS public.student_internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_date DATE DEFAULT CURRENT_DATE,
    email TEXT NOT NULL,
    contact_no TEXT NOT NULL,
    enrolment_no TEXT NOT NULL,
    full_name TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    specialization TEXT NOT NULL,
    semester TEXT NOT NULL,
    source_of_internship TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration TEXT,
    company_name_and_city TEXT NOT NULL,
    mode_of_internship TEXT CHECK (mode_of_internship IN ('Offline', 'Online', 'Hybrid')),
    domain_of_company TEXT,
    is_ppo_offer TEXT CHECK (is_ppo_offer IN ('Yes', 'No', 'Performance Based')),
    offer_letter_url TEXT,
    completion_letter_url TEXT,
    status TEXT DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Verified', 'Completed', 'Rejected')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_student_internships_enrolment ON public.student_internships (enrolment_no);
CREATE INDEX IF NOT EXISTS idx_student_internships_email ON public.student_internships (email);
CREATE INDEX IF NOT EXISTS idx_student_internships_specialization ON public.student_internships (specialization);
CREATE INDEX IF NOT EXISTS idx_student_internships_semester ON public.student_internships (semester);
CREATE INDEX IF NOT EXISTS idx_student_internships_company ON public.student_internships (company_name_and_city);
CREATE INDEX IF NOT EXISTS idx_student_internships_mode ON public.student_internships (mode_of_internship);
CREATE INDEX IF NOT EXISTS idx_student_internships_status ON public.student_internships (status);

-- 3. Automatic Updated-At Trigger
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

-- 4. Enable Row Level Security (RLS) & Idempotent Policies for student_internships
ALTER TABLE public.student_internships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to student records" ON public.student_internships;
CREATE POLICY "Allow public read access to student records" 
    ON public.student_internships 
    FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Allow public insert for student submissions" ON public.student_internships;
CREATE POLICY "Allow public insert for student submissions" 
    ON public.student_internships 
    FOR INSERT 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update for student records" ON public.student_internships;
CREATE POLICY "Allow public update for student records" 
    ON public.student_internships 
    FOR UPDATE 
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete for student records" ON public.student_internships;
CREATE POLICY "Allow public delete for student records" 
    ON public.student_internships 
    FOR DELETE 
    USING (true);

-- 5. Storage Bucket for Student Documents (Offer Letters & Completion Letters)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('student-documents', 'student-documents', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow public uploads to student-documents" ON storage.objects;
CREATE POLICY "Allow public uploads to student-documents"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'student-documents');

DROP POLICY IF EXISTS "Allow public read of student-documents" ON storage.objects;
CREATE POLICY "Allow public read of student-documents"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'student-documents');

DROP POLICY IF EXISTS "Allow public updates to student-documents" ON storage.objects;
CREATE POLICY "Allow public updates to student-documents"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'student-documents');

DROP POLICY IF EXISTS "Allow public delete in student-documents" ON storage.objects;
CREATE POLICY "Allow public delete in student-documents"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'student-documents');

-- ==============================================================================
-- 6. USER LOGINS TABLE (Role-Based Authentication: Username & Password)
-- Roles: Student, Faculty/Coordinator, Central T&P, HOD, Admin
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_logins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Student', 'Faculty/Coordinator', 'Central T&P', 'HOD', 'Admin')),
    department TEXT DEFAULT 'School of Computing',
    designation TEXT,
    enrolment_no TEXT,
    phone TEXT,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_login TIMESTAMPTZ
);

-- Index for authentication lookup
CREATE INDEX IF NOT EXISTS idx_user_logins_username ON public.user_logins (username);
CREATE INDEX IF NOT EXISTS idx_user_logins_role ON public.user_logins (role);

-- Enable RLS for user_logins & Idempotent Policies
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

-- Insert Default Seed Accounts (Admin, Student, Faculty, T&P, HOD)
INSERT INTO public.user_logins (username, email, password, full_name, role, department, designation, phone)
VALUES 
    -- 1. Admin Login (Shubham Alapure)
    ('admin', 'admin@mitadt.edu.in', 'admin123', 'Shubham Alapure', 'Admin', 'School of Computing', 'Lead System Administrator', '9876543210'),
    ('shubhamalapure', 'shubham.alapure@mitadt.edu.in', 'admin123', 'Shubham Alapure', 'Admin', 'School of Computing', 'Lead System Administrator', '9876543210'),
    
    -- 2. Student Login
    ('student', 'student@mitadt.edu.in', 'student123', 'Shubham Santosh Alapure', 'Student', 'Computer Science & Engineering', 'B.Tech Final Year Student', '9876543210'),
    
    -- 3. Faculty / Coordinator Login (Prof. Vaibhav Sawalkar)
    ('vaibhav.sawalkar@mituniversity.edu.in', 'vaibhav.sawalkar@mituniversity.edu.in', '9665368452', 'Prof. Vaibhav Sawalkar', 'Faculty/Coordinator', 'Department of Computer Science & Engineering', 'Internship Coordinator & Assistant Professor', '9665368452'),
    ('faculty', 'faculty@mitadt.edu.in', 'faculty123', 'Prof. Vaibhav Sawalkar', 'Faculty/Coordinator', 'Department of Computer Science & Engineering', 'Internship Coordinator & Assistant Professor', '9665368452'),
    ('vaibhav.sawalkar', 'vaibhav.sawalkar@mituniversity.edu.in', '9665368452', 'Prof. Vaibhav Sawalkar', 'Faculty/Coordinator', 'Department of Computer Science & Engineering', 'Internship Coordinator & Assistant Professor', '9665368452'),
    
    -- 4. Central T&P Login (Prof. Dr. Swati More)
    ('tp', 'tp@mitadt.edu.in', 'tp123', 'Prof. Dr. Swati More', 'Central T&P', 'Corporate Relations & Placement Cell', 'Director, Central T&P', '02067652560'),
    ('swati.more', 'swati.more@mituniversity.edu.in', 'tp123', 'Prof. Dr. Swati More', 'Central T&P', 'Corporate Relations & Placement Cell', 'Director, Central T&P', '02067652560'),
    
    -- 5. HOD Login (Prof. Dr. Jayashree Prasad)
    ('hod', 'hod@mitadt.edu.in', 'hod123', 'Prof. Dr. Jayashree Prasad', 'HOD', 'Department of CSE-AIA', 'Head of Department (CSE)', '02067652560'),
    ('jayashree.prasad', 'jayashree.prasad@mituniversity.edu.in', 'hod123', 'Prof. Dr. Jayashree Prasad', 'HOD', 'Department of CSE-AIA', 'Head of Department (CSE)', '02067652560')
ON CONFLICT (username) DO UPDATE 
SET 
    password = EXCLUDED.password,
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone;
