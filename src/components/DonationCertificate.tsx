import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { downloadElementAsPdf } from "@/lib/pdfDownload";

interface DonationCertificateProps {
  donation: {
    name: string;
    email: string;
    amount: number;
    payment_id: string;
    purpose: string;
    created_at: string;
  };
}

export function DonationCertificate({ donation }: DonationCertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<Record<string, { setting_value: string; file_url: string }>>({});

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("admin_settings").select("*");
      if (data) {
        const map: any = {};
        data.forEach((s: any) => { map[s.setting_key] = s; });
        setSettings(map);
      }
    };
    fetchSettings();
  }, []);

  const signUrl = settings.certificate_sign_url?.file_url;
  const sealUrl = settings.certificate_seal_url?.file_url;
  const signatoryName = settings.certificate_signatory_name?.setting_value || "Secretary, KVK Sanstha";
  const signatoryDesignation = settings.certificate_signatory_designation?.setting_value || "Authorized Signatory";

  const certNumber = `KVK/DON/${new Date(donation.created_at).getFullYear()}/${donation.payment_id?.slice(-6) || "000000"}`;

  return (
    <div>
      <div ref={certRef} className="bg-white p-6 md:p-10 border-4 border-double border-accent/60 rounded-lg max-w-2xl mx-auto" style={{ fontFamily: "'Noto Sans', sans-serif" }}>
        {/* Header Border */}
        <div className="border-b-2 border-accent/40 pb-4 mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-primary mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            किसान विकास कार्यदाई संस्था
          </h2>
          <p className="text-sm text-muted-foreground">Kisan Vikas Karyadayi Sanstha</p>
          <p className="text-xs text-muted-foreground mt-1">Reg. No: VAR/07494/2024-2025 | Varanasi, Uttar Pradesh</p>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-accent uppercase tracking-widest">Donation Certificate</h3>
          <p className="text-xs text-muted-foreground mt-1">Certificate No: {certNumber}</p>
        </div>

        <div className="text-sm leading-relaxed mb-6 text-center">
          <p className="mb-4">This is to certify that</p>
          <p className="text-lg font-bold text-primary border-b border-primary/30 inline-block px-4 pb-1">{donation.name}</p>
          <p className="mt-4">has generously donated</p>
          <p className="text-2xl font-black text-accent my-2">₹{donation.amount.toLocaleString()}</p>
          <p>towards <span className="font-semibold">{donation.purpose}</span></p>
          <p className="mt-4 text-muted-foreground">on {new Date(donation.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
          <p className="text-xs text-muted-foreground mt-1">Payment ID: {donation.payment_id}</p>
        </div>

        <p className="text-xs text-center text-muted-foreground italic mb-8">
          We deeply appreciate your support for the welfare and development of our community. May your generosity inspire others.
        </p>

        {/* Signature & Seal */}
        <div className="flex items-end justify-between pt-4 border-t border-muted mt-8">
          <div className="text-center">
            {signUrl ? (
              <img src={signUrl} alt="Signature" className="h-12 mx-auto mb-1 object-contain" />
            ) : (
              <div className="h-12 w-32 border-b border-foreground/30 mb-1" />
            )}
            <p className="text-xs font-semibold">{signatoryName}</p>
            <p className="text-[10px] text-muted-foreground">{signatoryDesignation}</p>
          </div>
          <div className="text-center">
            {sealUrl ? (
              <img src={sealUrl} alt="Official Seal" className="h-16 mx-auto mb-1 object-contain opacity-80" />
            ) : (
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center mb-1">
                <span className="text-[8px] text-muted-foreground">SEAL</span>
              </div>
            )}
            <p className="text-[10px] text-muted-foreground">Official Seal</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <Button onClick={() => downloadElementAsPDF(certRef.current!, `Donation_Certificate_${donation.name}.pdf`)}>
          <Download className="mr-2 h-4 w-4" /> Download Certificate (PDF)
        </Button>
      </div>
    </div>
  );
}
