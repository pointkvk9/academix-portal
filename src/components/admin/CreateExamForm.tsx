import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Plus, X, BookOpen, Clock, Award, FileText, Settings, AlertTriangle } from "lucide-react";

interface CreateExamFormProps {
  onCreated: () => void;
}

export function CreateExamForm({ onCreated }: CreateExamFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [form, setForm] = useState({
    title: "",
    description: "",
    class: "",
    academic_year: "",
    exam_date: "",
    last_date_to_apply: "",
    fee_amount: "",
    instructions: "",
    exam_type: "offline",
    duration_minutes: "180",
    total_marks: "100",
    passing_marks: "33",
    negative_marking: false,
    negative_marks_value: "0.25",
    exam_pattern: "",
    eligibility: "",
    exam_time: "10:00 AM",
    language: "Hindi & English",
    total_questions: "",
  });
  const [subjects, setSubjects] = useState<string[]>([""]);

  const sections = [
    { icon: BookOpen, label: "Basic Details" },
    { icon: Settings, label: "Exam Pattern" },
    { icon: Clock, label: "Schedule & Fee" },
    { icon: Award, label: "Subjects" },
    { icon: FileText, label: "Instructions" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.class || !form.fee_amount) {
      toast.error("Please fill all required fields (Title, Class, Fee)");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("exams").insert({
      title: form.title,
      description: form.description,
      class: form.class,
      academic_year: form.academic_year,
      exam_date: form.exam_date || null,
      last_date_to_apply: form.last_date_to_apply || null,
      fee_amount: parseFloat(form.fee_amount),
      instructions: form.instructions,
      exam_type: form.exam_type,
      duration_minutes: parseInt(form.duration_minutes) || 180,
      total_marks: parseInt(form.total_marks) || 100,
      passing_marks: parseInt(form.passing_marks) || 33,
      negative_marking: form.negative_marking,
      negative_marks_value: form.negative_marking ? parseFloat(form.negative_marks_value) : 0,
      exam_pattern: form.exam_pattern,
      eligibility: form.eligibility,
      exam_time: form.exam_time,
      language: form.language,
      total_questions: parseInt(form.total_questions) || 0,
      subjects: subjects.filter(Boolean),
      created_by: user?.id,
    } as any);
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
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Create New Examination
        </CardTitle>
        <CardDescription>Fill in all sections to create a comprehensive exam form for students</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Section Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {sections.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveSection(i)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                activeSection === i
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <s.icon className="h-3.5 w-3.5" />
              {s.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 0: Basic Details */}
          {activeSection === 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-primary flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> Basic Examination Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label>Exam Title *</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Annual Examination 2025-26" required />
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
                  <Input value={form.academic_year} onChange={(e) => setForm({ ...form, academic_year: e.target.value })} placeholder="e.g. 2025-2026" />
                </div>
                <div className="space-y-2">
                  <Label>Exam Type *</Label>
                  <Select value={form.exam_type} onValueChange={(v) => setForm({ ...form, exam_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="offline">Offline (Pen & Paper)</SelectItem>
                      <SelectItem value="online">Online (Computer Based)</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={form.language} onValueChange={(v) => setForm({ ...form, language: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hindi & English">Hindi & English</SelectItem>
                      <SelectItem value="Hindi">Hindi Only</SelectItem>
                      <SelectItem value="English">English Only</SelectItem>
                      <SelectItem value="Regional">Regional Languages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description about the examination" rows={3} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Eligibility Criteria</Label>
                  <Textarea value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} placeholder="e.g. Students must be enrolled in the respective class for the current academic year" rows={2} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="button" onClick={() => setActiveSection(1)}>Next: Exam Pattern →</Button>
              </div>
            </div>
          )}

          {/* Section 1: Exam Pattern */}
          {activeSection === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-primary flex items-center gap-2">
                <Settings className="h-4 w-4" /> Exam Pattern & Marking Scheme
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Duration (Minutes) *</Label>
                  <Input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Total Marks *</Label>
                  <Input type="number" value={form.total_marks} onChange={(e) => setForm({ ...form, total_marks: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Passing Marks *</Label>
                  <Input type="number" value={form.passing_marks} onChange={(e) => setForm({ ...form, passing_marks: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Total Questions</Label>
                  <Input type="number" value={form.total_questions} onChange={(e) => setForm({ ...form, total_questions: e.target.value })} placeholder="e.g. 100" />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
                <div>
                  <Label className="text-sm font-semibold">Negative Marking</Label>
                  <p className="text-xs text-muted-foreground">Deduct marks for wrong answers</p>
                </div>
                <Switch checked={form.negative_marking} onCheckedChange={(v) => setForm({ ...form, negative_marking: v })} />
              </div>

              {form.negative_marking && (
                <div className="bg-warning/10 border border-warning/30 rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <Label className="text-sm font-semibold">Negative Marks per Wrong Answer</Label>
                  </div>
                  <Input type="number" step="0.01" value={form.negative_marks_value} onChange={(e) => setForm({ ...form, negative_marks_value: e.target.value })} className="max-w-xs" />
                </div>
              )}

              <div className="space-y-2">
                <Label>Exam Pattern Details</Label>
                <Textarea value={form.exam_pattern} onChange={(e) => setForm({ ...form, exam_pattern: e.target.value })} placeholder="e.g. Section A: 30 MCQs (1 mark each)&#10;Section B: 10 Short Answer (3 marks each)&#10;Section C: 5 Long Answer (4 marks each)" rows={4} />
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveSection(0)}>← Back</Button>
                <Button type="button" onClick={() => setActiveSection(2)}>Next: Schedule →</Button>
              </div>
            </div>
          )}

          {/* Section 2: Schedule & Fee */}
          {activeSection === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-primary flex items-center gap-2">
                <Clock className="h-4 w-4" /> Schedule & Fee Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Exam Date</Label>
                  <Input type="date" value={form.exam_date} onChange={(e) => setForm({ ...form, exam_date: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Exam Time</Label>
                  <Select value={form.exam_time} onValueChange={(v) => setForm({ ...form, exam_time: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00 AM">09:00 AM (Morning Shift)</SelectItem>
                      <SelectItem value="10:00 AM">10:00 AM (Morning Shift)</SelectItem>
                      <SelectItem value="11:00 AM">11:00 AM (Morning Shift)</SelectItem>
                      <SelectItem value="02:00 PM">02:00 PM (Afternoon Shift)</SelectItem>
                      <SelectItem value="03:00 PM">03:00 PM (Afternoon Shift)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Last Date to Apply</Label>
                  <Input type="date" value={form.last_date_to_apply} onChange={(e) => setForm({ ...form, last_date_to_apply: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Fee Amount (₹) *</Label>
                  <Input type="number" value={form.fee_amount} onChange={(e) => setForm({ ...form, fee_amount: e.target.value })} placeholder="e.g. 500" required />
                </div>
              </div>

              {/* Fee Summary */}
              {form.fee_amount && (
                <div className="bg-primary/5 border border-primary/20 rounded-md p-4">
                  <h4 className="text-sm font-semibold mb-2">Fee Summary</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between"><span>Application Fee:</span><span>₹{form.fee_amount}</span></div>
                    <div className="flex justify-between"><span>Processing Charges:</span><span>₹0 (Included)</span></div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold"><span>Total:</span><span className="text-primary">₹{form.fee_amount}</span></div>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveSection(1)}>← Back</Button>
                <Button type="button" onClick={() => setActiveSection(3)}>Next: Subjects →</Button>
              </div>
            </div>
          )}

          {/* Section 3: Subjects */}
          {activeSection === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-primary flex items-center gap-2">
                <Award className="h-4 w-4" /> Subjects
              </h3>
              <p className="text-xs text-muted-foreground">Add all subjects that students can select for this examination</p>
              <div className="space-y-2">
                {subjects.map((s, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <span className="text-xs text-muted-foreground w-6">{i + 1}.</span>
                    <Input value={s} onChange={(e) => { const ns = [...subjects]; ns[i] = e.target.value; setSubjects(ns); }} placeholder={`Subject ${i + 1} (e.g. Mathematics)`} />
                    {subjects.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => setSubjects(subjects.filter((_, j) => j !== i))}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => setSubjects([...subjects, ""])}>
                <Plus className="mr-1 h-3 w-3" /> Add Subject
              </Button>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveSection(2)}>← Back</Button>
                <Button type="button" onClick={() => setActiveSection(4)}>Next: Instructions →</Button>
              </div>
            </div>
          )}

          {/* Section 4: Instructions */}
          {activeSection === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-primary flex items-center gap-2">
                <FileText className="h-4 w-4" /> Exam Instructions
              </h3>
              <div className="space-y-2">
                <Label>Instructions for Students</Label>
                <Textarea
                  value={form.instructions}
                  onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                  placeholder={"1. Carry your Admit Card and a valid photo ID.\n2. Report at the center 30 minutes before.\n3. Use only blue/black ballpoint pen.\n4. No electronic devices allowed.\n5. Read all questions carefully before answering."}
                  rows={8}
                />
              </div>

              {/* Preview Summary */}
              <div className="bg-muted/50 rounded-md p-4 space-y-2">
                <h4 className="text-sm font-semibold">Exam Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span className="text-muted-foreground">Title:</span><span className="font-medium">{form.title || "—"}</span>
                  <span className="text-muted-foreground">Class:</span><span>{form.class ? `Class ${form.class}` : "—"}</span>
                  <span className="text-muted-foreground">Type:</span><span className="capitalize">{form.exam_type}</span>
                  <span className="text-muted-foreground">Duration:</span><span>{form.duration_minutes} min</span>
                  <span className="text-muted-foreground">Total Marks:</span><span>{form.total_marks}</span>
                  <span className="text-muted-foreground">Fee:</span><span>₹{form.fee_amount || "—"}</span>
                  <span className="text-muted-foreground">Subjects:</span><span>{subjects.filter(Boolean).length}</span>
                  <span className="text-muted-foreground">Negative Marking:</span><span>{form.negative_marking ? `Yes (-${form.negative_marks_value})` : "No"}</span>
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveSection(3)}>← Back</Button>
                <Button type="submit" disabled={loading} size="lg">
                  {loading ? "Creating..." : "Create Examination"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
