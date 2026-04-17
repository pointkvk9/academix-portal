import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Search, FileText, Eye, User } from "lucide-react";
import { getGroupLabel } from "@/lib/groups";

interface ExamSubmissionsProps {
  exams: any[];
  selectedExamId: string | null;
  onSelectExam: (id: string) => void;
}

export function ExamSubmissions({ exams, selectedExamId, onSelectExam }: ExamSubmissionsProps) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    if (!selectedExamId) return;
    setLoading(true);
    const fetchData = async () => {
      const { data: apps } = await supabase.from("exam_applications").select("*").eq("exam_id", selectedExamId).order("created_at", { ascending: false });
      if (!apps || apps.length === 0) { setSubmissions([]); setLoading(false); return; }
      const userIds = [...new Set(apps.map(a => a.user_id))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email, class, mobile, gender, father_name, password").in("user_id", userIds);
      const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));
      setSubmissions(apps.map(app => ({ ...app, profile: profileMap.get(app.user_id) || null })));
      setLoading(false);
    };
    fetchData();
  }, [selectedExamId]);

  const filteredSubmissions = submissions.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.profile?.full_name?.toLowerCase().includes(q) || s.profile?.email?.toLowerCase().includes(q) || s.profile?.mobile?.includes(q);
  });

  const totalSubmitted = submissions.filter(s => s.is_submitted).length;
  const totalPaid = submissions.filter(s => s.fee_status === "paid").length;
  const totalInProgress = submissions.filter(s => !s.is_submitted).length;

  return (
    <Card className="border-t-4 border-t-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Exam Submissions</CardTitle>
        <CardDescription>View all student applications with full details</CardDescription>
        <Select value={selectedExamId || ""} onValueChange={onSelectExam}>
          <SelectTrigger className="w-full max-w-sm"><SelectValue placeholder="Select an examination" /></SelectTrigger>
          <SelectContent>
            {exams.map((e) => (
              <SelectItem key={e.id} value={e.id}>{e.title} ({getGroupLabel(e.class)})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {!selectedExamId ? (
          <div className="text-center py-12"><FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground">Select an exam to view submissions</p></div>
        ) : loading ? (
          <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" /><p className="mt-3 text-sm text-muted-foreground">Loading...</p></div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="bg-primary/5 rounded-md p-3 text-center"><p className="text-xl font-bold text-primary">{submissions.length}</p><p className="text-xs text-muted-foreground">Total</p></div>
              <div className="bg-success/10 rounded-md p-3 text-center"><p className="text-xl font-bold text-success">{totalSubmitted}</p><p className="text-xs text-muted-foreground">Submitted</p></div>
              <div className="bg-info/10 rounded-md p-3 text-center"><p className="text-xl font-bold text-info">{totalPaid}</p><p className="text-xs text-muted-foreground">Fee Paid</p></div>
              <div className="bg-warning/10 rounded-md p-3 text-center"><p className="text-xl font-bold text-accent">{totalInProgress}</p><p className="text-xs text-muted-foreground">In Progress</p></div>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, email, or mobile..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            {filteredSubmissions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No submissions found</p>
            ) : (
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-10">#</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Father's Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((s, i) => (
                      <TableRow key={s.id}>
                        <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                        <TableCell className="font-medium">{s.profile?.full_name || "—"}</TableCell>
                        <TableCell className="text-sm">{s.profile?.father_name || "—"}</TableCell>
                        <TableCell className="text-sm">{s.profile?.email || "—"}</TableCell>
                        <TableCell className="text-sm">{s.profile?.mobile || "—"}</TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">{s.user_id.slice(0, 8)}...</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <div className="w-16 bg-muted rounded-full h-2"><div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${(s.current_step / 6) * 100}%` }} /></div>
                            <span className="text-xs text-muted-foreground">{s.current_step}/6</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={s.fee_status === "paid" ? "default" : "secondary"} className={s.fee_status === "paid" ? "bg-success text-success-foreground" : ""}>{s.fee_status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={s.is_submitted ? "default" : "outline"}>{s.is_submitted ? "✓ Submitted" : "Pending"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" onClick={() => setSelectedStudent(s)}>
                            <Eye className="h-3 w-3 mr-1" /> Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </CardContent>

      {/* Student Detail Modal */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Student Details
            </DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <InfoRow label="Full Name" value={selectedStudent.profile?.full_name} />
                <InfoRow label="Father's Name" value={selectedStudent.profile?.father_name} />
                <InfoRow label="Email (Login ID)" value={selectedStudent.profile?.email} highlight />
                <InfoRow label="Password" value={selectedStudent.profile?.password || "Not stored (old account)"} highlight mono />
                <InfoRow label="Mobile" value={selectedStudent.profile?.mobile} />
                <InfoRow label="Gender" value={selectedStudent.profile?.gender} />
                <InfoRow label="Group/Class" value={selectedStudent.profile?.class ? getGroupLabel(selectedStudent.profile.class) : "—"} />
                <InfoRow label="User ID" value={selectedStudent.user_id} mono />
                <InfoRow label="Application ID" value={selectedStudent.id} mono />
                <InfoRow label="Fee Status" value={selectedStudent.fee_status} />
                <InfoRow label="Submitted" value={selectedStudent.is_submitted ? `Yes (${new Date(selectedStudent.submitted_at || selectedStudent.created_at).toLocaleDateString("en-IN")})` : "No"} />
                <InfoRow label="Application Date" value={new Date(selectedStudent.created_at).toLocaleDateString("en-IN")} />
                <InfoRow label="Progress" value={`Step ${selectedStudent.current_step}/6`} />
              </div>

              {selectedStudent.personal_details && Object.keys(selectedStudent.personal_details).length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-primary mb-2">Personal Details (from form)</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedStudent.personal_details as Record<string, any>).map(([key, val]) => (
                      <InfoRow key={key} label={key.replace(/_/g, " ")} value={String(val || "—")} />
                    ))}
                  </div>
                </div>
              )}

              {selectedStudent.address_details && Object.keys(selectedStudent.address_details).length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-primary mb-2">Address Details</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedStudent.address_details as Record<string, any>).map(([key, val]) => (
                      <InfoRow key={key} label={key.replace(/_/g, " ")} value={String(val || "—")} />
                    ))}
                  </div>
                </div>
              )}

              {selectedStudent.education_details && Object.keys(selectedStudent.education_details).length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-primary mb-2">Education Details</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedStudent.education_details as Record<string, any>).map(([key, val]) => (
                      <InfoRow key={key} label={key.replace(/_/g, " ")} value={String(val || "—")} />
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[10px] text-muted-foreground">
                Note: Login credentials (Email & Password) are shown above for admin reference.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function InfoRow({ label, value, highlight, mono }: { label: string; value?: string | null; highlight?: boolean; mono?: boolean }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] text-muted-foreground capitalize">{label}</p>
      <p className={`text-xs ${highlight ? "font-semibold text-primary" : ""} ${mono ? "font-mono text-[10px]" : ""}`}>
        {value || "—"}
      </p>
    </div>
  );
}
