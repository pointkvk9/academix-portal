import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Printer, Shield, CheckCircle, FileText } from "lucide-react";

interface ApplicationReceiptProps {
  application: any;
  profile: any;
}

export function ApplicationReceipt({ application, profile }: ApplicationReceiptProps) {
  const exam = application.exams;

  const handlePrint = () => {
    const el = document.getElementById(`receipt-${application.id}`);
    if (!el) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Application Confirmation — ${exam?.title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Noto Sans', Arial, sans-serif; padding: 24px; background: #fff; color: #1a1a1a; }
        .receipt { border: 2px solid #1e3a5f; max-width: 700px; margin: auto; }
        .header { background: linear-gradient(135deg, #1e3a5f, #2d5a8f); color: white; padding: 16px 20px; text-align: center; }
        .header h2 { font-size: 18px; letter-spacing: 2px; margin-bottom: 4px; }
        .header p { font-size: 11px; opacity: 0.8; }
        .content { padding: 20px; }
        .status-bar { background: #e8f5e9; border: 1px solid #4caf50; padding: 10px; text-align: center; margin-bottom: 16px; border-radius: 4px; }
        .status-bar .check { color: #2e7d32; font-weight: bold; font-size: 14px; }
        .section { margin-bottom: 16px; }
        .section h3 { font-size: 13px; font-weight: 700; color: #1e3a5f; border-bottom: 2px solid #1e3a5f; padding-bottom: 4px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 6px 10px; font-size: 12px; border: 1px solid #e0e0e0; }
        td:first-child { font-weight: 600; width: 40%; background: #f5f7fa; }
        .subjects-list { display: flex; flex-wrap: wrap; gap: 6px; }
        .subject-badge { background: #e3f2fd; color: #1565c0; padding: 2px 8px; border-radius: 3px; font-size: 11px; }
        .footer { text-align: center; padding: 12px; font-size: 10px; color: #888; border-top: 1px solid #e0e0e0; margin-top: 16px; }
        .app-id { font-family: monospace; font-size: 11px; color: #555; }
        @media print { body { padding: 0; } }
      </style></head><body>
      ${el.innerHTML}
      <script>window.print();<\/script>
      </body></html>
    `);
    printWindow.document.close();
  };

  const personalDetails = application.personal_details || {};
  const addressDetails = application.address_details || {};
  const educationDetails = application.education_details || {};
  const selectedSubjects = application.selected_subjects || [];

  return (
    <div>
      <div className="flex justify-end gap-2 mb-3">
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Download className="h-4 w-4 mr-1" /> Download
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-1" /> Print
        </Button>
      </div>

      <div id={`receipt-${application.id}`}>
        <div className="border-2 border-primary rounded-lg overflow-hidden max-w-2xl mx-auto bg-card shadow-lg">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Shield className="h-5 w-5" />
              <h2 className="text-lg font-bold tracking-widest">APPLICATION CONFIRMATION</h2>
              <Shield className="h-5 w-5" />
            </div>
            <p className="text-sm opacity-80">National Examination Portal</p>
          </div>

          <div className="p-5 space-y-4">
            {/* Status */}
            <div className="bg-success/10 border border-success/30 rounded-md p-3 text-center">
              <CheckCircle className="h-6 w-6 text-success mx-auto mb-1" />
              <p className="text-sm font-semibold text-success">Application Successfully Submitted</p>
              <p className="text-xs text-muted-foreground mt-1">
                Submitted on: {application.submitted_at ? new Date(application.submitted_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
              </p>
            </div>

            {/* Application ID */}
            <div className="bg-primary/5 border border-primary/20 rounded-md p-3 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Application Number</p>
              <p className="text-lg font-black text-primary font-mono tracking-wider">{application.id.slice(0, 8).toUpperCase()}</p>
            </div>

            {/* Exam Details */}
            <div>
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b-2 border-primary pb-1 mb-2">Examination Details</h3>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3 w-2/5">Examination</td><td className="py-2 px-3 font-semibold">{exam?.title}</td></tr>
                  <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Class</td><td className="py-2 px-3">Class {exam?.class}</td></tr>
                  <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Exam Date</td><td className="py-2 px-3">{exam?.exam_date || "To Be Announced"}</td></tr>
                  <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Duration</td><td className="py-2 px-3">{exam?.duration_minutes || 180} Minutes</td></tr>
                  <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Fee Status</td><td className="py-2 px-3"><Badge className="bg-success text-success-foreground text-xs">✓ Paid — ₹{exam?.fee_amount}</Badge></td></tr>
                </tbody>
              </table>
            </div>

            {/* Personal Details */}
            <div>
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b-2 border-primary pb-1 mb-2">Candidate Details</h3>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3 w-2/5">Candidate Name</td><td className="py-2 px-3 font-semibold">{profile?.full_name?.toUpperCase()}</td></tr>
                  <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Father's Name</td><td className="py-2 px-3">{personalDetails.father_name || profile?.father_name || "—"}</td></tr>
                  <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Mother's Name</td><td className="py-2 px-3">{personalDetails.mother_name || profile?.mother_name || "—"}</td></tr>
                  <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Date of Birth</td><td className="py-2 px-3">{personalDetails.dob || profile?.dob || "—"}</td></tr>
                  <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Gender</td><td className="py-2 px-3 capitalize">{personalDetails.gender || profile?.gender || "—"}</td></tr>
                  <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Email</td><td className="py-2 px-3">{profile?.email || "—"}</td></tr>
                  <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Mobile</td><td className="py-2 px-3">{personalDetails.mobile || profile?.mobile || "—"}</td></tr>
                </tbody>
              </table>
            </div>

            {/* Address */}
            {addressDetails.address && (
              <div>
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b-2 border-primary pb-1 mb-2">Address</h3>
                <p className="text-sm">{addressDetails.address}, {addressDetails.city}, {addressDetails.district}, {addressDetails.state} — {addressDetails.pincode}</p>
              </div>
            )}

            {/* Subjects */}
            {selectedSubjects.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b-2 border-primary pb-1 mb-2">Selected Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSubjects.map((s: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Important Notice */}
            <div className="p-3 bg-warning/10 border border-warning/30 rounded-md text-xs">
              <h4 className="font-bold text-destructive mb-1 uppercase tracking-wider text-[11px]">⚠ Important Notice</h4>
              <ul className="list-disc pl-4 space-y-1 text-foreground/80">
                <li>Keep this confirmation safe for future reference.</li>
                <li>Your Admit Card will be available for download once centers are allocated.</li>
                <li>Check your registered email regularly for exam updates.</li>
                <li>For any queries, contact the examination helpdesk with your Application Number.</li>
              </ul>
            </div>

            {/* Footer */}
            <div className="text-center text-[10px] text-muted-foreground border-t pt-3">
              <p>This is a computer-generated document. No signature is required.</p>
              <p className="mt-1">Generated on: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
