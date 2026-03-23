import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, CreditCard } from "lucide-react";
import { downloadElementAsPdf } from "@/lib/pdfDownload";
import { getGroupLabel, getGroupClasses } from "@/lib/groups";

interface AdmitCardViewProps {
  admitCards: any[];
  profile: any;
}

export function AdmitCardView({ admitCards, profile }: AdmitCardViewProps) {
  if (admitCards.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CreditCard className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No admit cards available yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Admit cards will appear here after centers are assigned.</p>
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
              <Button variant="outline" size="sm" onClick={() => downloadElementAsPdf(`admit-card-${card.id}`, `AdmitCard_${card.roll_number}`)}>
                <Download className="h-4 w-4 mr-1" /> Download PDF
              </Button>
            </div>

            <div id={`admit-card-${card.id}`} className="bg-white text-black p-0">
              <div style={{ border: "3px solid #8B0000", maxWidth: "750px", margin: "0 auto", fontFamily: "'Noto Sans', Arial, sans-serif", fontSize: "13px" }}>
                {/* Header */}
                <div style={{ background: "linear-gradient(135deg, #8B0000, #B22222)", color: "white", padding: "14px 20px", textAlign: "center" }}>
                  <p style={{ fontSize: "10px", opacity: 0.7, letterSpacing: "2px", marginBottom: "2px" }}>K.V.K SANSTHA</p>
                  <h2 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "3px", margin: 0 }}>ADMIT CARD</h2>
                  <p style={{ fontSize: "11px", opacity: 0.8, marginTop: "2px" }}>सामान्य ज्ञान प्रतियोगिता — {exam?.academic_year || "2026-27"}</p>
                </div>

                <div style={{ padding: "16px 20px" }}>
                  {/* Roll Number */}
                  <div style={{ background: "#fff3e0", border: "2px solid #ff9800", borderRadius: "4px", padding: "8px", textAlign: "center", marginBottom: "14px" }}>
                    <p style={{ fontSize: "10px", color: "#888", textTransform: "uppercase", letterSpacing: "2px" }}>Roll Number</p>
                    <p style={{ fontSize: "22px", fontWeight: 900, color: "#8B0000", letterSpacing: "4px", fontFamily: "monospace" }}>{card.roll_number}</p>
                  </div>

                  {/* Photo + Details */}
                  <div style={{ display: "flex", gap: "16px", marginBottom: "14px" }}>
                    <div style={{ flex: 1 }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <tbody>
                          {[
                            ["Candidate Name", profile?.full_name?.toUpperCase()],
                            ["Father's Name", profile?.father_name || "—"],
                            ["Mother's Name", profile?.mother_name || "—"],
                            ["Date of Birth", profile?.dob || "—"],
                            ["Gender", profile?.gender || "—"],
                            ["Group", `${getGroupLabel(exam?.class)} (${getGroupClasses(exam?.class)})`],
                          ].map(([label, val], i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #e0e0e0" }}>
                              <td style={{ padding: "4px 8px", fontWeight: 600, width: "38%", background: "#f5f5f5", fontSize: "11px" }}>{label}</td>
                              <td style={{ padding: "4px 8px", fontSize: "11px", fontWeight: i === 0 ? 700 : 400 }}>{val}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Photo */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                      <div style={{ width: "95px", height: "115px", border: "2px solid #8B0000", borderRadius: "3px", overflow: "hidden", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {profile?.photo_url ? (
                          <img src={profile.photo_url} alt="Candidate" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <span style={{ fontSize: "9px", color: "#999", textAlign: "center", padding: "4px" }}>Candidate Photo</span>
                        )}
                      </div>
                      <span style={{ fontSize: "8px", color: "#999" }}>Passport Photo</span>
                    </div>
                  </div>

                  {/* Exam Details */}
                  <div style={{ marginBottom: "12px" }}>
                    <h3 style={{ fontSize: "10px", fontWeight: 700, color: "#8B0000", borderBottom: "2px solid #8B0000", paddingBottom: "3px", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>Examination Details</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <tbody>
                        {[
                          ["Examination", exam?.title],
                          ["Exam Date", exam?.exam_date || "TBD"],
                          ["Exam Time", exam?.exam_time || "TBD"],
                          ["Duration", `${exam?.duration_minutes || 180} Minutes`],
                          ["Total Marks", exam?.total_marks || "—"],
                          ["Exam Type", (exam?.exam_type || "Offline")],
                        ].map(([label, val], i) => (
                          <tr key={i} style={{ borderBottom: "1px solid #e0e0e0" }}>
                            <td style={{ padding: "4px 8px", fontWeight: 600, width: "35%", background: "#f5f5f5", fontSize: "11px" }}>{label}</td>
                            <td style={{ padding: "4px 8px", fontSize: "11px", fontWeight: i === 1 ? 700 : 400, color: i === 1 ? "#B22222" : "inherit" }}>{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Subject Schedule */}
                  {subjects.length > 0 && (
                    <div style={{ marginBottom: "12px" }}>
                      <h3 style={{ fontSize: "10px", fontWeight: 700, color: "#8B0000", borderBottom: "2px solid #8B0000", paddingBottom: "3px", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>Subject Schedule</h3>
                      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
                        <thead>
                          <tr style={{ background: "#8B0000", color: "white" }}>
                            <th style={{ padding: "4px 8px", textAlign: "left", fontSize: "10px" }}>S.No.</th>
                            <th style={{ padding: "4px 8px", textAlign: "left", fontSize: "10px" }}>Subject</th>
                            <th style={{ padding: "4px 8px", textAlign: "left", fontSize: "10px" }}>Date</th>
                            <th style={{ padding: "4px 8px", textAlign: "left", fontSize: "10px" }}>Timing</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjects.map((s: string, i: number) => (
                            <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                              <td style={{ padding: "3px 8px", background: i % 2 === 0 ? "#fafafa" : "white", fontSize: "10px" }}>{i + 1}</td>
                              <td style={{ padding: "3px 8px", fontWeight: 500, fontSize: "10px" }}>{s}</td>
                              <td style={{ padding: "3px 8px", fontSize: "10px" }}>{exam?.exam_date || "TBD"}</td>
                              <td style={{ padding: "3px 8px", fontSize: "10px" }}>{exam?.exam_time || "TBD"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Center Details */}
                  <div style={{ border: "2px dashed #8B0000", borderRadius: "4px", padding: "10px", marginBottom: "12px", background: "#fafafa" }}>
                    <h3 style={{ fontSize: "10px", fontWeight: 700, color: "#8B0000", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>Examination Center (परीक्षा केंद्र)</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <tbody>
                        {[
                          ["Center Name", center?.center_name],
                          ["Center Code", center?.center_code || "—"],
                          ["Address", `${center?.address || ""}, ${center?.city || ""}, ${center?.state || ""} ${center?.pincode ? `- ${center.pincode}` : ""}`],
                          ["Reporting Time", center?.reporting_time || "30 min before exam"],
                          ["Gate Closing", center?.gate_closing_time || "At exam time"],
                        ].map(([label, val], i) => (
                          <tr key={i} style={{ borderBottom: "1px solid #e0e0e0" }}>
                            <td style={{ padding: "4px 8px", fontWeight: 600, width: "35%", fontSize: "11px" }}>{label}</td>
                            <td style={{ padding: "4px 8px", fontSize: "11px", fontWeight: i === 3 || i === 4 ? 700 : 400, color: i === 3 || i === 4 ? "#B22222" : "inherit" }}>{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Instructions */}
                  <div style={{ padding: "8px 10px", background: "#fff8e1", border: "1px solid #ffc107", borderRadius: "4px", fontSize: "10px", marginBottom: "12px" }}>
                    <h4 style={{ fontWeight: 700, color: "#e65100", marginBottom: "4px", fontSize: "9px", textTransform: "uppercase" }}>⚠ Important Instructions</h4>
                    <ul style={{ paddingLeft: "14px", margin: 0, lineHeight: 1.5 }}>
                      <li>Carry Admit Card + valid govt photo ID (Aadhar/Voter ID).</li>
                      <li>Report by Reporting Time. No entry after Gate Closing.</li>
                      <li>Electronic devices strictly prohibited.</li>
                      <li>Carry blue/black ballpoint pen, pencil, eraser.</li>
                      <li>Unfair means → cancellation of candidature.</li>
                    </ul>
                  </div>

                  {/* Signature Section */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: "12px", borderTop: "2px dashed #ccc" }}>
                    <div style={{ textAlign: "center", width: "150px" }}>
                      {profile?.signature_url ? (
                        <img src={profile.signature_url} alt="Signature" style={{ height: "35px", margin: "0 auto 4px" }} />
                      ) : (
                        <div style={{ height: "35px" }} />
                      )}
                      <div style={{ borderTop: "1px solid #333", paddingTop: "3px" }}>
                        <p style={{ fontSize: "9px", fontWeight: 600 }}>Candidate's Signature</p>
                      </div>
                    </div>
                    <div style={{ textAlign: "center", width: "150px" }}>
                      <div style={{ height: "35px" }} />
                      <div style={{ borderTop: "1px solid #333", paddingTop: "3px" }}>
                        <p style={{ fontSize: "9px", fontWeight: 600 }}>Controller of Examination</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ marginTop: "10px", textAlign: "center", fontSize: "9px", color: "#999", borderTop: "1px solid #e0e0e0", paddingTop: "6px" }}>
                    <p>Computer-generated document. | Generated: {new Date(card.generated_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
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
