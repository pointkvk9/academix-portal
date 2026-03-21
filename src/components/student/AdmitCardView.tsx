import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Shield, Printer, CreditCard } from "lucide-react";

interface AdmitCardViewProps {
  admitCards: any[];
  profile: any;
}

export function AdmitCardView({ admitCards, profile }: AdmitCardViewProps) {
  const handleDownload = (cardId: string) => {
    const card = document.getElementById(`admit-card-${cardId}`);
    if (!card) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Admit Card — National Examination Portal</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Noto Sans', Arial, sans-serif; padding: 20px; background: #fff; }
        .card { border: 3px solid #1e3a5f; max-width: 750px; margin: auto; }
        .header { background: linear-gradient(135deg, #1e3a5f, #2d5a8f); color: white; padding: 16px 20px; text-align: center; }
        .header h2 { font-size: 20px; letter-spacing: 2px; margin-bottom: 2px; }
        .header p { font-size: 11px; opacity: 0.8; }
        .content { padding: 20px; }
        .photo-section { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
        .photo-box { width: 100px; height: 120px; border: 2px solid #1e3a5f; display: flex; align-items: center; justify-content: center; background: #f5f7fa; }
        .photo-box img { width: 100%; height: 100%; object-fit: cover; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        td { padding: 8px 12px; font-size: 13px; border: 1px solid #ddd; }
        td:first-child { font-weight: 600; width: 35%; background: #f5f7fa; color: #333; }
        .roll-number { font-size: 18px; font-weight: 800; color: #1e3a5f; }
        .subjects-table td { padding: 6px 10px; font-size: 12px; }
        .subjects-table th { padding: 6px 10px; font-size: 11px; background: #1e3a5f; color: white; text-align: left; }
        .signature-section { display: flex; justify-content: space-between; margin-top: 24px; padding-top: 16px; border-top: 1px dashed #ccc; }
        .sig-box { text-align: center; width: 180px; }
        .sig-box .line { border-top: 1px solid #333; margin-top: 50px; padding-top: 4px; font-size: 11px; }
        .sig-box img { height: 40px; margin-top: 10px; }
        .important { margin-top: 16px; padding: 12px; background: #fff8e1; border: 1px solid #ffc107; font-size: 11px; border-radius: 4px; }
        .important h4 { margin-bottom: 6px; color: #e65100; }
        .important ul { padding-left: 18px; }
        .important li { margin-bottom: 3px; }
        .footer { text-align: center; padding: 10px; font-size: 10px; color: #999; border-top: 1px solid #ddd; }
        @media print { body { padding: 0; } .no-print { display: none; } }
      </style></head><body>
      ${card.innerHTML}
      <script>window.print();<\/script>
      </body></html>
    `);
    printWindow.document.close();
  };

  if (admitCards.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CreditCard className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No admit cards available yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Admit cards will appear here after your application is processed and centers are assigned.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {admitCards.map((card) => {
        const exam = card.exams as any;
        const center = card.exam_centers as any;
        const subjects = (exam?.subjects as string[]) || [];

        return (
          <div key={card.id}>
            <div className="flex justify-end gap-2 mb-3">
              <Button variant="outline" size="sm" onClick={() => handleDownload(card.id)}>
                <Download className="h-4 w-4 mr-1" /> Download
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDownload(card.id)}>
                <Printer className="h-4 w-4 mr-1" /> Print
              </Button>
            </div>
            <div id={`admit-card-${card.id}`}>
              <div className="border-[3px] border-primary rounded-lg overflow-hidden max-w-2xl mx-auto bg-card shadow-lg">
                {/* Header */}
                <div className="bg-primary text-primary-foreground p-5 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Shield className="h-6 w-6" />
                    <h2 className="text-xl font-bold tracking-widest">ADMIT CARD</h2>
                    <Shield className="h-6 w-6" />
                  </div>
                  <p className="text-sm opacity-80">National Examination Portal</p>
                  <p className="text-xs opacity-60 mt-1">Government of India</p>
                </div>

                <div className="p-5">
                  {/* Roll Number */}
                  <div className="bg-primary/5 border-2 border-primary/20 rounded-md p-3 mb-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Roll Number</p>
                    <p className="text-2xl font-black text-primary tracking-wider">{card.roll_number}</p>
                  </div>

                  {/* Photo + Details */}
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <table className="w-full text-sm border-collapse">
                        <tbody>
                          <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3 w-2/5">Candidate Name</td><td className="py-2 px-3 font-bold">{profile?.full_name?.toUpperCase()}</td></tr>
                          <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Father's Name</td><td className="py-2 px-3">{profile?.father_name || "—"}</td></tr>
                          <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Mother's Name</td><td className="py-2 px-3">{profile?.mother_name || "—"}</td></tr>
                          <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Date of Birth</td><td className="py-2 px-3">{profile?.dob || "—"}</td></tr>
                          <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Gender</td><td className="py-2 px-3 capitalize">{profile?.gender || "—"}</td></tr>
                        </tbody>
                      </table>
                    </div>
                    {/* Photo Box */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-[100px] h-[120px] border-2 border-primary rounded-sm overflow-hidden bg-muted/30 flex items-center justify-center">
                        {profile?.photo_url ? (
                          <img src={profile.photo_url} alt="Candidate" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-muted-foreground text-center px-1">Candidate Photo</span>
                        )}
                      </div>
                      <p className="text-[9px] text-muted-foreground">Passport Photo</p>
                    </div>
                  </div>

                  {/* Exam Details */}
                  <div className="mb-4">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Examination Details</h3>
                    <table className="w-full text-sm border-collapse">
                      <tbody>
                        <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3 w-2/5">Examination</td><td className="py-2 px-3 font-semibold">{exam?.title}</td></tr>
                        <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Exam Date</td><td className="py-2 px-3 font-bold text-destructive">{exam?.exam_date || "TBD"}</td></tr>
                        <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Exam Time</td><td className="py-2 px-3 font-bold">{exam?.exam_time || "TBD"}</td></tr>
                        <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Duration</td><td className="py-2 px-3">{exam?.duration_minutes || 180} Minutes</td></tr>
                        <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Total Marks</td><td className="py-2 px-3">{exam?.total_marks || "—"}</td></tr>
                        <tr className="border-b"><td className="py-2 font-semibold bg-muted/50 px-3">Exam Type</td><td className="py-2 px-3 capitalize">{exam?.exam_type || "Offline"}</td></tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Subjects Table */}
                  {subjects.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Subject & Timing Schedule</h3>
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full text-xs border-collapse">
                          <thead>
                            <tr className="bg-primary text-primary-foreground">
                              <th className="py-2 px-3 text-left">S.No.</th>
                              <th className="py-2 px-3 text-left">Subject</th>
                              <th className="py-2 px-3 text-left">Date</th>
                              <th className="py-2 px-3 text-left">Timing</th>
                            </tr>
                          </thead>
                          <tbody>
                            {subjects.map((s: string, i: number) => (
                              <tr key={i} className="border-b last:border-0">
                                <td className="py-2 px-3 bg-muted/30">{i + 1}</td>
                                <td className="py-2 px-3 font-medium">{s}</td>
                                <td className="py-2 px-3">{exam?.exam_date || "TBD"}</td>
                                <td className="py-2 px-3">{exam?.exam_time || "TBD"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Center Details */}
                  <div className="border-2 border-dashed border-primary/20 rounded-md p-3 mb-4">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Examination Center</h3>
                    <table className="w-full text-sm border-collapse">
                      <tbody>
                        <tr className="border-b"><td className="py-2 font-semibold bg-muted/30 px-3 w-2/5">Center Name</td><td className="py-2 px-3 font-semibold">{center?.center_name}</td></tr>
                        <tr className="border-b"><td className="py-2 font-semibold bg-muted/30 px-3">Center Code</td><td className="py-2 px-3">{center?.center_code || "—"}</td></tr>
                        <tr className="border-b"><td className="py-2 font-semibold bg-muted/30 px-3">Address</td><td className="py-2 px-3">{center?.address}, {center?.city}, {center?.state} {center?.pincode ? `- ${center.pincode}` : ""}</td></tr>
                        <tr className="border-b"><td className="py-2 font-semibold bg-muted/30 px-3">Reporting Time</td><td className="py-2 px-3 text-destructive font-bold">{center?.reporting_time || "30 min before exam"}</td></tr>
                        <tr><td className="py-2 font-semibold bg-muted/30 px-3">Gate Closing</td><td className="py-2 px-3 text-destructive font-bold">{center?.gate_closing_time || "At exam time"}</td></tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Important Instructions */}
                  <div className="p-4 bg-warning/10 border border-warning/30 rounded-md text-xs mb-4">
                    <h4 className="font-bold text-destructive mb-2 uppercase tracking-wider text-[11px]">⚠ Important Instructions</h4>
                    <ul className="list-disc pl-4 space-y-1 text-foreground/80">
                      <li>Carry this <strong>Admit Card</strong> along with a <strong>valid government photo ID</strong> (Aadhar/Voter ID).</li>
                      <li>Report at the center by the <strong>Reporting Time</strong>. Entry NOT allowed after Gate Closing.</li>
                      <li>Electronic devices including mobile phones, calculators are <strong>strictly prohibited</strong>.</li>
                      <li>Carry your own <strong>blue/black ballpoint pen, pencil, and eraser</strong>.</li>
                      <li>Any form of unfair means will lead to <strong>cancellation of candidature</strong>.</li>
                    </ul>
                  </div>

                  {/* Signature Section */}
                  <div className="flex justify-between items-end pt-4 border-t-2 border-dashed border-muted">
                    <div className="text-center w-[160px]">
                      {profile?.signature_url ? (
                        <img src={profile.signature_url} alt="Candidate Signature" className="h-10 mx-auto mb-1" />
                      ) : (
                        <div className="h-10 mb-1" />
                      )}
                      <div className="border-t border-foreground pt-1">
                        <p className="text-[10px] font-semibold">Candidate's Signature</p>
                      </div>
                    </div>
                    <div className="text-center w-[160px]">
                      <div className="h-10 mb-1" />
                      <div className="border-t border-foreground pt-1">
                        <p className="text-[10px] font-semibold">Controller of Examination</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 text-center text-[10px] text-muted-foreground border-t pt-3">
                    <p>This is a computer-generated document.</p>
                    <p className="mt-1">Generated on: {new Date(card.generated_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
