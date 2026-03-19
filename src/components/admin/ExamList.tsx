import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Eye, Calendar, IndianRupee } from "lucide-react";

interface ExamListProps {
  exams: any[];
  onRefresh: () => void;
  onSelect: (id: string) => void;
}

export function ExamList({ exams, onRefresh, onSelect }: ExamListProps) {
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;
    const { error } = await supabase.from("exams").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Exam deleted"); onRefresh(); }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Examinations ({exams.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {exams.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No examinations created yet. Create your first exam.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Exam Date</TableHead>
                  <TableHead>Last Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.title}</TableCell>
                    <TableCell>Class {exam.class}</TableCell>
                    <TableCell>₹{exam.fee_amount}</TableCell>
                    <TableCell>{exam.exam_date || "—"}</TableCell>
                    <TableCell>{exam.last_date_to_apply || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={exam.is_active ? "default" : "secondary"}>
                        {exam.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => onSelect(exam.id)}>
                          <Eye className="h-3 w-3 mr-1" /> View
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(exam.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
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
