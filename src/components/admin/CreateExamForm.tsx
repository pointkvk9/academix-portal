import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

interface CreateExamFormProps {
  onCreated: () => void;
}

export function CreateExamForm({ onCreated }: CreateExamFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    class: "",
    academic_year: "",
    exam_date: "",
    last_date_to_apply: "",
    fee_amount: "",
    instructions: "",
  });
  const [subjects, setSubjects] = useState<string[]>([""]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.class || !form.fee_amount) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("exams").insert({
      ...form,
      fee_amount: parseFloat(form.fee_amount),
      subjects: subjects.filter(Boolean),
      created_by: user?.id,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Exam created successfully!");
      onCreated();
    }
    setLoading(false);
  };

  const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  return (
    <Card className="border-t-4 border-t-primary">
      <CardHeader>
        <CardTitle>Create New Examination</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Exam Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Annual Examination 2025" required />
            </div>
            <div className="space-y-2">
              <Label>Class *</Label>
              <Select value={form.class} onValueChange={(v) => setForm({ ...form, class: v })}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {classes.map((c) => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Academic Year</Label>
              <Input value={form.academic_year} onChange={(e) => setForm({ ...form, academic_year: e.target.value })} placeholder="e.g. 2024-2025" />
            </div>
            <div className="space-y-2">
              <Label>Fee Amount (₹) *</Label>
              <Input type="number" value={form.fee_amount} onChange={(e) => setForm({ ...form, fee_amount: e.target.value })} placeholder="e.g. 500" required />
            </div>
            <div className="space-y-2">
              <Label>Exam Date</Label>
              <Input type="date" value={form.exam_date} onChange={(e) => setForm({ ...form, exam_date: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Last Date to Apply</Label>
              <Input type="date" value={form.last_date_to_apply} onChange={(e) => setForm({ ...form, last_date_to_apply: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Exam description and details" />
          </div>

          <div className="space-y-2">
            <Label>Subjects</Label>
            {subjects.map((s, i) => (
              <div key={i} className="flex gap-2">
                <Input value={s} onChange={(e) => { const ns = [...subjects]; ns[i] = e.target.value; setSubjects(ns); }} placeholder={`Subject ${i + 1}`} />
                {subjects.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => setSubjects(subjects.filter((_, j) => j !== i))}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setSubjects([...subjects, ""])}>
              <Plus className="mr-1 h-3 w-3" /> Add Subject
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Instructions</Label>
            <Textarea value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} placeholder="Instructions for students" rows={4} />
          </div>

          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? "Creating..." : "Create Examination"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
