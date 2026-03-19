import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi"];

export function StepAddress({ data, onNext, onBack }: Props) {
  const [form, setForm] = useState({
    address_line1: data.address_line1 || "",
    address_line2: data.address_line2 || "",
    city: data.city || "",
    state: data.state || "",
    pincode: data.pincode || "",
    permanent_same: data.permanent_same ?? true,
    p_address_line1: data.p_address_line1 || "",
    p_city: data.p_city || "",
    p_state: data.p_state || "",
    p_pincode: data.p_pincode || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold text-sm text-primary">Correspondence Address</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-2">
          <Label>Address Line 1 *</Label>
          <Input value={form.address_line1} onChange={(e) => setForm({ ...form, address_line1: e.target.value })} required />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label>Address Line 2</Label>
          <Input value={form.address_line2} onChange={(e) => setForm({ ...form, address_line2: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>City *</Label>
          <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>State *</Label>
          <Select value={form.state} onValueChange={(v) => setForm({ ...form, state: v })}>
            <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
            <SelectContent>
              {STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Pincode *</Label>
          <Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} required maxLength={6} />
        </div>
      </div>

      <div className="flex items-center gap-2 py-2">
        <Checkbox id="samePerm" checked={form.permanent_same} onCheckedChange={(c) => setForm({ ...form, permanent_same: !!c })} />
        <Label htmlFor="samePerm" className="text-sm">Permanent address is same as correspondence address</Label>
      </div>

      {!form.permanent_same && (
        <>
          <h3 className="font-semibold text-sm text-primary">Permanent Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label>Address *</Label>
              <Input value={form.p_address_line1} onChange={(e) => setForm({ ...form, p_address_line1: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>City *</Label>
              <Input value={form.p_city} onChange={(e) => setForm({ ...form, p_city: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>State *</Label>
              <Select value={form.p_state} onValueChange={(v) => setForm({ ...form, p_state: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pincode *</Label>
              <Input value={form.p_pincode} onChange={(e) => setForm({ ...form, p_pincode: e.target.value })} required maxLength={6} />
            </div>
          </div>
        </>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>← Back</Button>
        <Button type="submit">Save & Continue →</Button>
      </div>
    </form>
  );
}
