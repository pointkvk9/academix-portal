import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export function StepEducation({ data, onNext, onBack }: Props) {
  const [form, setForm] = useState({
    school_name: data.school_name || "",
    board: data.board || "",
    medium: data.medium || "",
    last_class_passed: data.last_class_passed || "",
    last_class_percentage: data.last_class_percentage || "",
    roll_no: data.roll_no || "",
    year_of_passing: data.year_of_passing || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-2">
          <Label>School/Institution Name *</Label>
          <Input value={form.school_name} onChange={(e) => setForm({ ...form, school_name: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Board *</Label>
          <Select value={form.board} onValueChange={(v) => setForm({ ...form, board: v })}>
            <SelectTrigger><SelectValue placeholder="Select Board" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="cbse">CBSE</SelectItem>
              <SelectItem value="icse">ICSE</SelectItem>
              <SelectItem value="state">State Board</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Medium *</Label>
          <Select value={form.medium} onValueChange={(v) => setForm({ ...form, medium: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="hindi">Hindi</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Last Class Passed *</Label>
          <Input value={form.last_class_passed} onChange={(e) => setForm({ ...form, last_class_passed: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Percentage/CGPA *</Label>
          <Input value={form.last_class_percentage} onChange={(e) => setForm({ ...form, last_class_percentage: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Previous Roll No.</Label>
          <Input value={form.roll_no} onChange={(e) => setForm({ ...form, roll_no: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Year of Passing</Label>
          <Input value={form.year_of_passing} onChange={(e) => setForm({ ...form, year_of_passing: e.target.value })} placeholder="e.g. 2024" />
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>← Back</Button>
        <Button type="submit">Save & Continue →</Button>
      </div>
    </form>
  );
}
