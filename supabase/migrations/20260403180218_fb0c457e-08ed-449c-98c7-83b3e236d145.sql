
-- Members table for membership system
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  father_name TEXT DEFAULT '',
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  address TEXT DEFAULT '',
  city TEXT DEFAULT '',
  state TEXT DEFAULT 'Uttar Pradesh',
  pincode TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  member_type TEXT NOT NULL DEFAULT 'annual',
  amount NUMERIC NOT NULL DEFAULT 500,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  gender TEXT DEFAULT '',
  occupation TEXT DEFAULT '',
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Admin settings table for certificate sign/seal
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT DEFAULT '',
  file_url TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID
);

-- Enable RLS
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Members policies: anyone can insert (public donation), admins can manage
CREATE POLICY "Anyone can create member" ON public.members FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can view members" ON public.members FOR SELECT TO public USING (true);
CREATE POLICY "Admins can update members" ON public.members FOR UPDATE TO public USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete members" ON public.members FOR DELETE TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- Donations policies (missing from existing table)
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create donation" ON public.donations FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admins can view donations" ON public.donations FOR SELECT TO public USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Donor can view own donation" ON public.donations FOR SELECT TO public USING (true);

-- Admin settings policies
CREATE POLICY "Anyone can view settings" ON public.admin_settings FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage settings" ON public.admin_settings FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- Add certificate_url to donations for generated certificates
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS donor_address TEXT DEFAULT '';
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS donor_city TEXT DEFAULT '';
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS purpose TEXT DEFAULT 'General Donation';

-- Insert default admin settings for certificate
INSERT INTO public.admin_settings (setting_key, setting_value) VALUES
  ('certificate_sign_url', ''),
  ('certificate_seal_url', ''),
  ('certificate_signatory_name', 'Secretary, KVK Sanstha'),
  ('certificate_signatory_designation', 'Authorized Signatory')
ON CONFLICT (setting_key) DO NOTHING;
