import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  data: any;
  onNext: (data: any) => void;
}

export function StepPersonalDetails({ data, onNext }: Props) {
  const [form, setForm] = useState({
    full_name: data.full_name || "",
    father_name: data.father_name || "",
    mother_name: data.mother_name || "",
    dob: data.dob || "",
    gender: data.gender || "",
    mobile: data.mobile || "",
    email: data.email || "",
    aadhar: data.aadhar || "",
    category: data.category || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Full Name *</Label>
          <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Father's Name *</Label>
          <Input value={form.father_name} onChange={(e) => setForm({ ...form, father_name: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Mother's Name *</Label>
          <Input value={form.mother_name} onChange={(e) => setForm({ ...form, mother_name: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Date of Birth *</Label>
          <Input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Gender *</Label>
          <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Mobile Number *</Label>
          <Input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="10-digit mobile" required />
        </div>
        <div className="space-y-2">
          <Label>Email *</Label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Aadhar Number</Label>
          <Input value={form.aadhar} onChange={(e) => setForm({ ...form, aadhar: e.target.value })} placeholder="12-digit Aadhar" />
        </div>
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="obc">OBC</SelectItem>
              <SelectItem value="sc">SC</SelectItem>
              <SelectItem value="st">ST</SelectItem>
              <SelectItem value="ews">EWS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <Button type="submit">Save & Continue →</Button>
      </div>
    </form>
  );
}
