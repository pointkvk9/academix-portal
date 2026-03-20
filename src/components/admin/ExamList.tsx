import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Eye, Calendar, IndianRupee, Clock, FileText, BookOpen, Users } from "lucide-react";

interface ExamListProps {
  exams: any[];
  onRefresh: () => void;
  onSelect: (id: string) => void;
}

export function ExamList({ exams, onRefresh, onSelect }: ExamListProps) {
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this exam? This action cannot be undone.")) return;
    const { error } = await supabase.from("exams").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Exam deleted"); onRefresh(); }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const { error } = await supabase.from("exams").update({ is_active: !currentActive }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Exam ${!currentActive ? "activated" : "deactivated"}`); onRefresh(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> All Examinations ({exams.length})
          </h2>
          <p className="text-sm text-muted-foreground">Manage all created exams, view details, and track submissions</p>
        </div>
      </div>

      {exams.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No examinations created yet.</p>
            <p className="text-sm text-muted-foreground">Go to "Create Exam" tab to create your first exam.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {exams.map((exam) => (
            <Card key={exam.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className={`h-1.5 ${exam.is_active ? "bg-success" : "bg-muted-foreground/30"}`} />
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{exam.title}</CardTitle>
                    <CardDescription>Class {exam.class} | {exam.academic_year || "—"}</CardDescription>
                  </div>
                  <Badge variant={exam.is_active ? "default" : "secondary"} className={exam.is_active ? "bg-success text-success-foreground" : ""}>
                    {exam.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {exam.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{exam.description}</p>
                )}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>Exam: <strong>{exam.exam_date || "TBD"}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>Last Date: <strong>{exam.last_date_to_apply || "TBD"}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="h-3 w-3 text-muted-foreground" />
                    <span>Fee: <strong>₹{exam.fee_amount}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>Duration: <strong>{(exam as any).duration_minutes || 180} min</strong></span>
                  </div>
                </div>

                {exam.subjects && (exam.subjects as string[]).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {(exam.subjects as string[]).slice(0, 5).map((s: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-[10px]">{s}</Badge>
                    ))}
                    {(exam.subjects as string[]).length > 5 && (
                      <Badge variant="outline" className="text-[10px]">+{(exam.subjects as string[]).length - 5} more</Badge>
                    )}
                  </div>
                )}

                <Separator />
                
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => onSelect(exam.id)}>
                    <Users className="h-3 w-3 mr-1" /> Submissions
                  </Button>
                  <Button size="sm" variant={exam.is_active ? "secondary" : "default"} onClick={() => handleToggleActive(exam.id, exam.is_active)}>
                    {exam.is_active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(exam.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
