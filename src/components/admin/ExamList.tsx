import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Calendar, IndianRupee, Clock, FileText, BookOpen, Users, Pencil, CalendarClock, Copy } from "lucide-react";
import { getGroupLabel, getGroupClasses, GROUPS } from "@/lib/groups";

interface ExamListProps {
  exams: any[];
  onRefresh: () => void;
  onSelect: (id: string) => void;
}

export function ExamList({ exams, onRefresh, onSelect }: ExamListProps) {
  const [editExam, setEditExam] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [dateChangeExam, setDateChangeExam] = useState<any>(null);
  const [newExamDate, setNewExamDate] = useState("");
  const [newLastDate, setNewLastDate] = useState("");
  const [saving, setSaving] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;
    const { error } = await supabase.from("exams").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Exam deleted"); onRefresh(); }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const { error } = await supabase.from("exams").update({ is_active: !currentActive }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Exam ${!currentActive ? "activated" : "deactivated"}`); onRefresh(); }
  };

  const openEdit = (exam: any) => {
    setEditExam(exam);
    setEditForm({
      title: exam.title,
      description: exam.description || "",
      fee_amount: exam.fee_amount?.toString() || "0",
      duration_minutes: exam.duration_minutes?.toString() || "180",
      total_marks: exam.total_marks?.toString() || "100",
      passing_marks: exam.passing_marks?.toString() || "33",
      exam_time: exam.exam_time || "10:00 AM",
      language: exam.language || "Hindi & English",
      eligibility: exam.eligibility || "",
      exam_pattern: exam.exam_pattern || "",
      instructions: exam.instructions || "",
      total_questions: exam.total_questions?.toString() || "0",
      negative_marking: exam.negative_marking || false,
      negative_marks_value: exam.negative_marks_value?.toString() || "0",
    });
  };

  const handleSaveEdit = async () => {
    if (!editExam) return;
    setSaving(true);
    const { error } = await supabase.from("exams").update({
      title: editForm.title,
      description: editForm.description,
      fee_amount: parseFloat(editForm.fee_amount),
      duration_minutes: parseInt(editForm.duration_minutes) || 180,
      total_marks: parseInt(editForm.total_marks) || 100,
      passing_marks: parseInt(editForm.passing_marks) || 33,
      exam_time: editForm.exam_time,
      language: editForm.language,
      eligibility: editForm.eligibility,
      exam_pattern: editForm.exam_pattern,
      instructions: editForm.instructions,
      total_questions: parseInt(editForm.total_questions) || 0,
      negative_marking: editForm.negative_marking,
      negative_marks_value: editForm.negative_marking ? parseFloat(editForm.negative_marks_value) : 0,
    } as any).eq("id", editExam.id);
    if (error) toast.error(error.message);
    else { toast.success("Exam updated successfully!"); setEditExam(null); onRefresh(); }
    setSaving(false);
  };

  const openDateChange = (exam: any) => {
    setDateChangeExam(exam);
    setNewExamDate(exam.exam_date || "");
    setNewLastDate(exam.last_date_to_apply || "");
  };

  const handleDateChange = async () => {
    if (!dateChangeExam) return;
    setSaving(true);
    const updates: any = {};
    if (newExamDate) updates.exam_date = newExamDate;
    if (newLastDate) updates.last_date_to_apply = newLastDate;
    const { error } = await supabase.from("exams").update(updates).eq("id", dateChangeExam.id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Dates updated! All candidates will see the updated dates.");
      setDateChangeExam(null);
      onRefresh();
    }
    setSaving(false);
  };

  const handleDuplicate = async (exam: any) => {
    const { id, created_at, updated_at, ...rest } = exam;
    const { error } = await supabase.from("exams").insert({
      ...rest,
      title: `${exam.title} (Copy)`,
      is_active: false,
    } as any);
    if (error) toast.error(error.message);
    else { toast.success("Exam duplicated!"); onRefresh(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> All Examinations ({exams.length})
          </h2>
          <p className="text-sm text-muted-foreground">Manage exams — edit, change dates, duplicate, or deactivate</p>
        </div>
      </div>

      {exams.length === 0 ? (
        <Card><CardContent className="py-12 text-center"><FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground">No examinations created yet.</p></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {exams.map((exam) => (
            <Card key={exam.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className={`h-1.5 ${exam.is_active ? "bg-success" : "bg-muted-foreground/30"}`} />
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{exam.title}</CardTitle>
                    <CardDescription>{getGroupLabel(exam.class)} ({getGroupClasses(exam.class)}) | {exam.academic_year || "—"}</CardDescription>
                  </div>
                  <Badge variant={exam.is_active ? "default" : "secondary"} className={exam.is_active ? "bg-success text-success-foreground" : ""}>
                    {exam.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {exam.description && <p className="text-xs text-muted-foreground line-clamp-2">{exam.description}</p>}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3 text-muted-foreground" /><span>Exam: <strong>{exam.exam_date || "TBD"}</strong></span></div>
                  <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3 text-muted-foreground" /><span>Last Date: <strong>{exam.last_date_to_apply || "TBD"}</strong></span></div>
                  <div className="flex items-center gap-1.5"><IndianRupee className="h-3 w-3 text-muted-foreground" /><span>Fee: <strong>₹{exam.fee_amount}</strong></span></div>
                  <div className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-muted-foreground" /><span>Duration: <strong>{exam.duration_minutes || 180} min</strong></span></div>
                </div>
                <Separator />
                <div className="flex gap-1.5 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => onSelect(exam.id)}><Users className="h-3 w-3 mr-1" /> Submissions</Button>
                  <Button size="sm" variant="outline" onClick={() => openEdit(exam)}><Pencil className="h-3 w-3 mr-1" /> Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => openDateChange(exam)}><CalendarClock className="h-3 w-3 mr-1" /> Dates</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDuplicate(exam)}><Copy className="h-3 w-3 mr-1" /> Duplicate</Button>
                  <Button size="sm" variant={exam.is_active ? "secondary" : "default"} onClick={() => handleToggleActive(exam.id, exam.is_active)}>
                    {exam.is_active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(exam.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Exam Dialog - includes instructions */}
      <Dialog open={!!editExam} onOpenChange={() => setEditExam(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Examination — {editExam?.title}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1"><Label className="text-xs">Title</Label><Input value={editForm.title || ""} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} /></div>
              <div className="col-span-2 space-y-1"><Label className="text-xs">Description</Label><Textarea value={editForm.description || ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={2} /></div>
              <div className="space-y-1"><Label className="text-xs">Fee (₹)</Label><Input type="number" value={editForm.fee_amount || ""} onChange={(e) => setEditForm({ ...editForm, fee_amount: e.target.value })} /></div>
              <div className="space-y-1"><Label className="text-xs">Duration (min)</Label><Input type="number" value={editForm.duration_minutes || ""} onChange={(e) => setEditForm({ ...editForm, duration_minutes: e.target.value })} /></div>
              <div className="space-y-1"><Label className="text-xs">Total Marks</Label><Input type="number" value={editForm.total_marks || ""} onChange={(e) => setEditForm({ ...editForm, total_marks: e.target.value })} /></div>
              <div className="space-y-1"><Label className="text-xs">Passing Marks</Label><Input type="number" value={editForm.passing_marks || ""} onChange={(e) => setEditForm({ ...editForm, passing_marks: e.target.value })} /></div>
              <div className="space-y-1"><Label className="text-xs">Total Questions</Label><Input type="number" value={editForm.total_questions || ""} onChange={(e) => setEditForm({ ...editForm, total_questions: e.target.value })} /></div>
              <div className="space-y-1">
                <Label className="text-xs">Language</Label>
                <Select value={editForm.language || "Hindi & English"} onValueChange={(v) => setEditForm({ ...editForm, language: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hindi & English">Hindi & English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1"><Label className="text-xs">Eligibility</Label><Textarea value={editForm.eligibility || ""} onChange={(e) => setEditForm({ ...editForm, eligibility: e.target.value })} rows={2} /></div>
              <div className="col-span-2 space-y-1"><Label className="text-xs">Exam Pattern</Label><Textarea value={editForm.exam_pattern || ""} onChange={(e) => setEditForm({ ...editForm, exam_pattern: e.target.value })} rows={2} /></div>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs font-semibold text-primary">Instructions (परीक्षा निर्देश)</Label>
                <Textarea value={editForm.instructions || ""} onChange={(e) => setEditForm({ ...editForm, instructions: e.target.value })} rows={5} />
                <p className="text-[10px] text-muted-foreground">These instructions appear on admit cards and receipts</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditExam(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Dates Dialog */}
      <Dialog open={!!dateChangeExam} onOpenChange={() => setDateChangeExam(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Change Dates — {dateChangeExam?.title}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="bg-warning/10 border border-warning/30 rounded-md p-3 text-xs">
              <p className="font-semibold mb-1">⚠ Note:</p>
              <p>Changing dates will automatically reflect on all student dashboards.</p>
            </div>
            <div className="space-y-2">
              <Label>New Exam Date</Label>
              <Input type="date" value={newExamDate} onChange={(e) => setNewExamDate(e.target.value)} />
              <p className="text-xs text-muted-foreground">Current: {dateChangeExam?.exam_date || "Not set"}</p>
            </div>
            <div className="space-y-2">
              <Label>New Last Date to Apply (Extend)</Label>
              <Input type="date" value={newLastDate} onChange={(e) => setNewLastDate(e.target.value)} />
              <p className="text-xs text-muted-foreground">Current: {dateChangeExam?.last_date_to_apply || "Not set"}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDateChangeExam(null)}>Cancel</Button>
            <Button onClick={handleDateChange} disabled={saving}>{saving ? "Updating..." : "Update Dates"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
