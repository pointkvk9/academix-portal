import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Shield, CheckCircle } from "lucide-react";
import { downloadElementAsPdf } from "@/lib/pdfDownload";
import { getGroupLabel, getGroupClasses } from "@/lib/groups";

interface ApplicationReceiptProps {
  application: any;
  profile: any;
}

export function ApplicationReceipt({ application, profile }: ApplicationReceiptProps) {
  const exam = application.exams;
  const personalDetails = application.personal_details || {};
  const addressDetails = application.address_details || {};
  const selectedSubjects = application.selected_subjects || [];

  return (
    <div>
      <div className="flex justify-end gap-2 mb-3">
        <Button variant="outline" size="sm" onClick={() => downloadElementAsPdf(`receipt-${application.id}`, `Receipt_${application.id.slice(0, 8)}`)}>
          <Download className="h-4 w-4 mr-1" /> Download PDF
        </Button>
      </div>

      <div id={`receipt-${application.id}`} className="bg-white text-black p-0">
        <div style={{ border: "3px solid #8B0000", maxWidth: "700px", margin: "0 auto", fontFamily: "'Noto Sans', Arial, sans-serif", fontSize: "13px" }}>
          {/* Header */}
          <div style={{ background: "linear-gradient(135deg, #8B0000, #B22222)", color: "white", padding: "16px 20px", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "2px" }}>APPLICATION CONFIRMATION</span>
            </div>
            <p style={{ fontSize: "12px", opacity: 0.8 }}>K.V.K Sanstha — सामान्य ज्ञान प्रतियोगिता</p>
          </div>

          <div style={{ padding: "16px 20px" }}>
            {/* Status */}
            <div style={{ background: "#e8f5e9", border: "1px solid #4caf50", borderRadius: "4px", padding: "10px", textAlign: "center", marginBottom: "14px" }}>
              <p style={{ color: "#2e7d32", fontWeight: 700, fontSize: "13px" }}>✓ Application Successfully Submitted</p>
              <p style={{ fontSize: "11px", color: "#666", marginTop: "4px" }}>
                Submitted: {application.submitted_at ? new Date(application.submitted_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "—"}
              </p>
            </div>

            {/* App Number */}
            <div style={{ background: "#fff3e0", border: "1px solid #ff9800", borderRadius: "4px", padding: "8px", textAlign: "center", marginBottom: "14px" }}>
              <p style={{ fontSize: "10px", color: "#888", textTransform: "uppercase", letterSpacing: "2px" }}>Application Number</p>
              <p style={{ fontSize: "18px", fontWeight: 900, color: "#8B0000", fontFamily: "monospace", letterSpacing: "3px" }}>{application.id.slice(0, 8).toUpperCase()}</p>
            </div>

            {/* Exam Details */}
            <div style={{ marginBottom: "12px" }}>
              <h3 style={{ fontSize: "11px", fontWeight: 700, color: "#8B0000", borderBottom: "2px solid #8B0000", paddingBottom: "3px", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>Examination Details</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {[
                    ["Examination", exam?.title],
                    ["Group", `${getGroupLabel(exam?.class)} (${getGroupClasses(exam?.class)})`],
                    ["Exam Date", exam?.exam_date || "To Be Announced"],
                    ["Duration", `${exam?.duration_minutes || 180} Minutes`],
                    ["Fee Status", `✓ Paid — ₹${exam?.fee_amount}`],
                  ].map(([label, val], i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #e0e0e0" }}>
                      <td style={{ padding: "5px 8px", fontWeight: 600, width: "40%", background: "#f5f5f5", fontSize: "12px" }}>{label}</td>
                      <td style={{ padding: "5px 8px", fontSize: "12px" }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Candidate Details */}
            <div style={{ marginBottom: "12px" }}>
              <h3 style={{ fontSize: "11px", fontWeight: 700, color: "#8B0000", borderBottom: "2px solid #8B0000", paddingBottom: "3px", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>Candidate Details</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {[
                    ["Candidate Name", profile?.full_name?.toUpperCase()],
                    ["Father's Name", personalDetails.father_name || profile?.father_name || "—"],
                    ["Mother's Name", personalDetails.mother_name || profile?.mother_name || "—"],
                    ["Date of Birth", personalDetails.dob || profile?.dob || "—"],
                    ["Gender", (personalDetails.gender || profile?.gender || "—")],
                    ["Email", profile?.email || "—"],
                    ["Mobile", personalDetails.mobile || profile?.mobile || "—"],
                  ].map(([label, val], i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #e0e0e0" }}>
                      <td style={{ padding: "5px 8px", fontWeight: 600, width: "40%", background: "#f5f5f5", fontSize: "12px" }}>{label}</td>
                      <td style={{ padding: "5px 8px", fontSize: "12px" }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Address */}
            {addressDetails.address && (
              <div style={{ marginBottom: "12px" }}>
                <h3 style={{ fontSize: "11px", fontWeight: 700, color: "#8B0000", borderBottom: "2px solid #8B0000", paddingBottom: "3px", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>Address</h3>
                <p style={{ fontSize: "12px" }}>{addressDetails.address}, {addressDetails.city}, {addressDetails.district}, {addressDetails.state} — {addressDetails.pincode}</p>
              </div>
            )}

            {/* Subjects */}
            {selectedSubjects.length > 0 && (
              <div style={{ marginBottom: "12px" }}>
                <h3 style={{ fontSize: "11px", fontWeight: 700, color: "#8B0000", borderBottom: "2px solid #8B0000", paddingBottom: "3px", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>Selected Subjects</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {selectedSubjects.map((s: string, i: number) => (
                    <span key={i} style={{ background: "#fff3e0", color: "#8B0000", padding: "2px 8px", borderRadius: "3px", fontSize: "11px", fontWeight: 600 }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Important Notice */}
            <div style={{ padding: "10px", background: "#fff8e1", border: "1px solid #ffc107", borderRadius: "4px", fontSize: "11px", marginBottom: "12px" }}>
              <h4 style={{ fontWeight: 700, color: "#e65100", marginBottom: "4px", fontSize: "10px", textTransform: "uppercase" }}>⚠ Important Notice</h4>
              <ul style={{ paddingLeft: "16px", margin: 0 }}>
                <li>Keep this confirmation safe for future reference.</li>
                <li>Admit Card will be available after centers are allocated.</li>
                <li>Check your registered email regularly for updates.</li>
              </ul>
            </div>

            {/* Footer */}
            <div style={{ textAlign: "center", fontSize: "10px", color: "#999", borderTop: "1px solid #e0e0e0", paddingTop: "8px" }}>
              <p>This is a computer-generated document. No signature is required.</p>
              <p>Generated on: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
