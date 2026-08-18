-- ==============================================================================
-- INTERNDOCS: SUPABASE SQL SCHEMA FOR STUDENT INTERNSHIP MANAGEMENT
-- MIT-ADT University - School of Computing (SOC)
-- ==============================================================================

-- 1. Create the student_internships table
CREATE TABLE IF NOT EXISTS public.student_internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Field 1: Date of entry / submission
    submission_date DATE DEFAULT CURRENT_DATE NOT NULL,
    
    -- Field 2: Email ID (Student's college/personal email)
    email TEXT NOT NULL,
    
    -- Field 3: Contact No. (Student's phone number)
    contact_no TEXT NOT NULL,
    
    -- Field 4: Enrolment No. (College/university enrollment number)
    enrolment_no TEXT NOT NULL,
    
    -- Field 5: Full Name (Student's complete name)
    full_name TEXT NOT NULL,
    
    -- Field 6: Gender (Male / Female / Other)
    gender TEXT DEFAULT 'Male',
    
    -- Field 7: Specialization (Branch: CSE, AI&DS, IT, Cyber Security, etc.)
    specialization TEXT NOT NULL,
    
    -- Field 8: Semester (Current semester e.g. VIII, VII, VI)
    semester TEXT NOT NULL,
    
    -- Field 9: Source of Internship (Placement Cell, LinkedIn, Company Website, Referral, etc.)
    source_of_internship TEXT,
    
    -- Field 10: Start Date (Internship starting date)
    start_date DATE NOT NULL,
    
    -- Field 11: End Date (Internship ending date)
    end_date DATE NOT NULL,
    
    -- Automatically calculated duration (e.g. "6 Months (176 Days)")
    duration TEXT,
    
    -- Field 12: Name of Company + City
    company_name_and_city TEXT NOT NULL,
    
    -- Field 13: Mode of Internship (Online / Offline / Hybrid)
    mode_of_internship TEXT DEFAULT 'Offline',
    
    -- Field 14: Domain of Company (IT, Finance, Healthcare, Education, Manufacturing, etc.)
    domain_of_company TEXT,
    
    -- Field 15: Whether this is an Offer / PPO (Yes / No / Performance Based)
    is_ppo_offer TEXT DEFAULT 'No',
    
    -- Field 16: Upload Valid Offer Letter (URL in Supabase Storage)
    offer_letter_url TEXT,
    
    -- Field 17: Internship Completion Letter (URL in Supabase Storage)
    completion_letter_url TEXT,
    
    -- Record Status & Metadata
    status TEXT DEFAULT 'Submitted', -- 'Submitted', 'Verified', 'Completed', 'Action Required'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create useful indexes for search and filter performance
CREATE INDEX IF NOT EXISTS idx_student_internships_enrolment ON public.student_internships (enrolment_no);
CREATE INDEX IF NOT EXISTS idx_student_internships_email ON public.student_internships (email);
CREATE INDEX IF NOT EXISTS idx_student_internships_specialization ON public.student_internships (specialization);
CREATE INDEX IF NOT EXISTS idx_student_internships_company ON public.student_internships (company_name_and_city);
CREATE INDEX IF NOT EXISTS idx_student_internships_submission_date ON public.student_internships (submission_date DESC);

-- 3. Automatic updated_at trigger function
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

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.student_internships ENABLE ROW LEVEL SECURITY;

-- Allow public read access to records (or configure according to institutional needs)
CREATE POLICY "Allow public read access to student records" 
    ON public.student_internships 
    FOR SELECT 
    USING (true);

-- Allow public insert access for student submissions
CREATE POLICY "Allow public insert for student submissions" 
    ON public.student_internships 
    FOR INSERT 
    WITH CHECK (true);

-- Allow public update access (for attaching completion letters, etc.)
CREATE POLICY "Allow public update for student records" 
    ON public.student_internships 
    FOR UPDATE 
    USING (true)
    WITH CHECK (true);

-- Allow deletion
CREATE POLICY "Allow public delete for student records" 
    ON public.student_internships 
    FOR DELETE 
    USING (true);

-- 5. Storage Bucket for Student Documents (Offer Letters & Completion Letters)
-- Run this in Supabase SQL editor to create the storage bucket:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('student-documents', 'student-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies: Allow public downloads and uploads
CREATE POLICY "Allow public uploads to student-documents"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'student-documents');

CREATE POLICY "Allow public read of student-documents"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'student-documents');

CREATE POLICY "Allow public updates to student-documents"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'student-documents');

CREATE POLICY "Allow public delete in student-documents"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'student-documents');
