import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ExamSubmissionsProps {
  exams: any[];
  selectedExamId: string | null;
  onSelectExam: (id: string) => void;
}

export function ExamSubmissions({ exams, selectedExamId, onSelectExam }: ExamSubmissionsProps) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedExamId) return;
    setLoading(true);
    supabase
      .from("exam_applications")
      .select("*, profiles!exam_applications_user_id_fkey(full_name, email, class, mobile)")
      .eq("exam_id", selectedExamId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setSubmissions(data || []);
        setLoading(false);
      });
  }, [selectedExamId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Submissions</CardTitle>
        <Select value={selectedExamId || ""} onValueChange={onSelectExam}>
          <SelectTrigger className="w-full max-w-sm">
            <SelectValue placeholder="Select an examination" />
          </SelectTrigger>
          <SelectContent>
            {exams.map((e) => (
              <SelectItem key={e.id} value={e.id}>{e.title} (Class {e.class})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {!selectedExamId ? (
          <p className="text-muted-foreground text-center py-8">Select an exam to view submissions</p>
        ) : loading ? (
          <p className="text-center py-8">Loading...</p>
        ) : submissions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No submissions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Step</TableHead>
                  <TableHead>Fee Status</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((s, i) => (
                  <TableRow key={s.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">{(s.profiles as any)?.full_name || "—"}</TableCell>
                    <TableCell>{(s.profiles as any)?.email || "—"}</TableCell>
                    <TableCell>{(s.profiles as any)?.mobile || "—"}</TableCell>
                    <TableCell>Step {s.current_step}/6</TableCell>
                    <TableCell>
                      <Badge variant={s.fee_status === "paid" ? "default" : "secondary"}>
                        {s.fee_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={s.is_submitted ? "default" : "outline"}>
                        {s.is_submitted ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
