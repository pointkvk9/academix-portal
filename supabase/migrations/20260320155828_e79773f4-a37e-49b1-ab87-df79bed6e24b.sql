
-- Add more detailed fields to exams table
ALTER TABLE public.exams
ADD COLUMN IF NOT EXISTS exam_type text DEFAULT 'offline',
ADD COLUMN IF NOT EXISTS duration_minutes integer DEFAULT 180,
ADD COLUMN IF NOT EXISTS total_marks integer DEFAULT 100,
ADD COLUMN IF NOT EXISTS passing_marks integer DEFAULT 33,
ADD COLUMN IF NOT EXISTS negative_marking boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS negative_marks_value numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS exam_pattern text DEFAULT '',
ADD COLUMN IF NOT EXISTS eligibility text DEFAULT '',
ADD COLUMN IF NOT EXISTS exam_time text DEFAULT '',
ADD COLUMN IF NOT EXISTS syllabus_url text DEFAULT '',
ADD COLUMN IF NOT EXISTS important_dates jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS total_questions integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS language text DEFAULT 'Hindi & English';

-- Add more detailed fields to exam_centers table
ALTER TABLE public.exam_centers
ADD COLUMN IF NOT EXISTS pincode text DEFAULT '',
ADD COLUMN IF NOT EXISTS contact_number text DEFAULT '',
ADD COLUMN IF NOT EXISTS contact_email text DEFAULT '',
ADD COLUMN IF NOT EXISTS center_type text DEFAULT 'school',
ADD COLUMN IF NOT EXISTS facilities jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS reporting_time text DEFAULT '',
ADD COLUMN IF NOT EXISTS gate_closing_time text DEFAULT '',
ADD COLUMN IF NOT EXISTS incharge_name text DEFAULT '',
ADD COLUMN IF NOT EXISTS landmark text DEFAULT '',
ADD COLUMN IF NOT EXISTS is_accessible boolean DEFAULT true;
