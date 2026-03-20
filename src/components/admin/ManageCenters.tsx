import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Plus, Zap, MapPin, Building, Trash2, Users, ChevronDown, ChevronUp } from "lucide-react";

interface ManageCentersProps {
  exams: any[];
  selectedExamId: string | null;
  onSelectExam: (id: string) => void;
}

const INDIAN_STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Chandigarh","Puducherry"];

export function ManageCenters({ exams, selectedExamId, onSelectExam }: ManageCentersProps) {
  const [centers, setCenters] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [expandedCenter, setExpandedCenter] = useState<string | null>(null);
  const [form, setForm] = useState({
    center_name: "", center_code: "", address: "", city: "", state: "",
    capacity: "", pincode: "", contact_number: "", contact_email: "",
    center_type: "school", reporting_time: "09:00 AM", gate_closing_time: "09:30 AM",
    incharge_name: "", landmark: "", is_accessible: true,
  });

  const fetchCenters = async () => {
    if (!selectedExamId) return;
    const { data } = await supabase.from("exam_centers").select("*").eq("exam_id", selectedExamId).order("created_at");
    if (data) setCenters(data);
  };

  useEffect(() => { fetchCenters(); }, [selectedExamId]);

  const resetForm = () => {
    setForm({
      center_name: "", center_code: "", address: "", city: "", state: "",
      capacity: "", pincode: "", contact_number: "", contact_email: "",
      center_type: "school", reporting_time: "09:00 AM", gate_closing_time: "09:30 AM",
      incharge_name: "", landmark: "", is_accessible: true,
    });
  };

  const handleAddCenter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId) return;
    if (!form.center_name || !form.capacity || !form.city || !form.state) {
      toast.error("Please fill all required fields");
      return;
    }
    const { error } = await supabase.from("exam_centers").insert({
      center_name: form.center_name,
      center_code: form.center_code,
      address: form.address,
      city: form.city,
      state: form.state,
      capacity: parseInt(form.capacity),
      exam_id: selectedExamId,
      pincode: form.pincode,
      contact_number: form.contact_number,
      contact_email: form.contact_email,
      center_type: form.center_type,
      reporting_time: form.reporting_time,
      gate_closing_time: form.gate_closing_time,
      incharge_name: form.incharge_name,
      landmark: form.landmark,
      is_accessible: form.is_accessible,
    } as any);
    if (error) toast.error(error.message);
    else { toast.success("Center added successfully!"); resetForm(); setShowForm(false); fetchCenters(); }
  };

  const handleDeleteCenter = async (id: string) => {
    if (!confirm("Delete this center?")) return;
    const { error } = await supabase.from("exam_centers").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Center deleted"); fetchCenters(); }
  };

  const handleGenerateAdmitCards = async () => {
    if (!selectedExamId) return;
    setGenerating(true);

    const { data: applications } = await supabase
      .from("exam_applications")
      .select("id, user_id")
      .eq("exam_id", selectedExamId)
      .eq("is_submitted", true)
      .eq("fee_status", "paid");

    if (!applications || applications.length === 0) {
      toast.error("No paid & submitted applications found");
      setGenerating(false);
      return;
    }

    const { data: existingCards } = await supabase
      .from("admit_cards").select("user_id").eq("exam_id", selectedExamId);
    
    const existingUserIds = new Set((existingCards || []).map(c => c.user_id));
    const newApplications = applications.filter(a => !existingUserIds.has(a.user_id));

    if (newApplications.length === 0) {
      toast.info("All admit cards already generated");
      setGenerating(false);
      return;
    }

    const sortedCenters = [...centers].sort((a, b) => (b.capacity - b.allocated) - (a.capacity - a.allocated));
    const admitCards: any[] = [];
    let rollCounter = 1;

    for (const app of newApplications) {
      const center = sortedCenters.find(c => c.allocated < c.capacity);
      if (!center) {
        toast.error("Not enough center capacity! Add more centers.");
        setGenerating(false);
        return;
      }
      admitCards.push({
        user_id: app.user_id,
        exam_id: selectedExamId,
        application_id: app.id,
        center_id: center.id,
        roll_number: `${center.center_code || "C"}${String(rollCounter++).padStart(5, "0")}`,
      });
      center.allocated++;
    }

    const { error } = await supabase.from("admit_cards").insert(admitCards);
    if (error) {
      toast.error(error.message);
    } else {
      for (const center of sortedCenters) {
        await supabase.from("exam_centers").update({ allocated: center.allocated }).eq("id", center.id);
      }
      toast.success(`${admitCards.length} admit cards generated!`);
      fetchCenters();
    }
    setGenerating(false);
  };

  const totalCapacity = centers.reduce((sum, c) => sum + c.capacity, 0);
  const totalAllocated = centers.reduce((sum, c) => sum + c.allocated, 0);

  return (
    <div className="space-y-4">
      <Card className="border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Exam Centers & Admit Cards</CardTitle>
          <CardDescription>Add centers, set capacity, and generate admit cards for students</CardDescription>
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
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">Select an exam to manage centers</p>
            </div>
          ) : (
            <>
              {/* Stats */}
              {centers.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-primary/5 rounded-md p-3 text-center">
                    <p className="text-2xl font-bold text-primary">{centers.length}</p>
                    <p className="text-xs text-muted-foreground">Total Centers</p>
                  </div>
                  <div className="bg-info/10 rounded-md p-3 text-center">
                    <p className="text-2xl font-bold text-info">{totalCapacity}</p>
                    <p className="text-xs text-muted-foreground">Total Capacity</p>
                  </div>
                  <div className="bg-success/10 rounded-md p-3 text-center">
                    <p className="text-2xl font-bold text-success">{totalAllocated}</p>
                    <p className="text-xs text-muted-foreground">Allocated</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 mb-4 flex-wrap">
                <Button variant="outline" onClick={() => setShowForm(!showForm)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Center
                </Button>
                <Button onClick={handleGenerateAdmitCards} disabled={generating || centers.length === 0}>
                  <Zap className="h-4 w-4 mr-1" /> {generating ? "Generating..." : "Generate Admit Cards"}
                </Button>
              </div>

              {showForm && (
                <Card className="mb-6 bg-muted/20 border-2 border-dashed border-primary/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building className="h-4 w-4" /> New Center Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddCenter} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Center Name *</Label>
                          <Input value={form.center_name} onChange={(e) => setForm({ ...form, center_name: e.target.value })} placeholder="e.g. Govt. Higher Secondary School" required />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Center Code *</Label>
                          <Input value={form.center_code} onChange={(e) => setForm({ ...form, center_code: e.target.value })} placeholder="e.g. DL001" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Center Type</Label>
                          <Select value={form.center_type} onValueChange={(v) => setForm({ ...form, center_type: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="school">School</SelectItem>
                              <SelectItem value="college">College</SelectItem>
                              <SelectItem value="university">University</SelectItem>
                              <SelectItem value="institute">Institute</SelectItem>
                              <SelectItem value="community_hall">Community Hall</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Capacity *</Label>
                          <Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="e.g. 200" required />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Incharge Name</Label>
                          <Input value={form.incharge_name} onChange={(e) => setForm({ ...form, incharge_name: e.target.value })} placeholder="Center incharge" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Contact Number</Label>
                          <Input value={form.contact_number} onChange={(e) => setForm({ ...form, contact_number: e.target.value })} placeholder="Phone number" />
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2 space-y-1">
                          <Label className="text-xs">Full Address *</Label>
                          <Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Complete address" rows={2} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Landmark</Label>
                          <Input value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} placeholder="Near/Opposite..." />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">City *</Label>
                          <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">State *</Label>
                          <Select value={form.state} onValueChange={(v) => setForm({ ...form, state: v })}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              {INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Pincode</Label>
                          <Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} maxLength={6} />
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Reporting Time</Label>
                          <Select value={form.reporting_time} onValueChange={(v) => setForm({ ...form, reporting_time: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="08:00 AM">08:00 AM</SelectItem>
                              <SelectItem value="08:30 AM">08:30 AM</SelectItem>
                              <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                              <SelectItem value="09:30 AM">09:30 AM</SelectItem>
                              <SelectItem value="01:00 PM">01:00 PM</SelectItem>
                              <SelectItem value="01:30 PM">01:30 PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Gate Closing Time</Label>
                          <Select value={form.gate_closing_time} onValueChange={(v) => setForm({ ...form, gate_closing_time: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                              <SelectItem value="09:30 AM">09:30 AM</SelectItem>
                              <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                              <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                              <SelectItem value="02:30 PM">02:30 PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-3 pt-4">
                          <Switch checked={form.is_accessible} onCheckedChange={(v) => setForm({ ...form, is_accessible: v })} />
                          <Label className="text-xs">Accessible (PwD Friendly)</Label>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button type="submit">Save Center</Button>
                        <Button type="button" variant="ghost" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {centers.length > 0 ? (
                <div className="space-y-2">
                  {centers.map((c) => (
                    <Card key={c.id} className="overflow-hidden">
                      <div 
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setExpandedCenter(expandedCenter === c.id ? null : c.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                            <Building className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{c.center_name}</p>
                            <p className="text-xs text-muted-foreground">{c.center_code || "—"} • {c.city}, {c.state}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={c.allocated >= c.capacity ? "destructive" : "secondary"}>
                            <Users className="h-3 w-3 mr-1" />{c.allocated}/{c.capacity}
                          </Badge>
                          {expandedCenter === c.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </div>
                      {expandedCenter === c.id && (
                        <div className="border-t px-4 py-3 bg-muted/30 text-sm space-y-2">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            <div><span className="text-muted-foreground">Type:</span> <span className="capitalize">{c.center_type || "School"}</span></div>
                            <div><span className="text-muted-foreground">Pincode:</span> {c.pincode || "—"}</div>
                            <div><span className="text-muted-foreground">Contact:</span> {c.contact_number || "—"}</div>
                            <div><span className="text-muted-foreground">Incharge:</span> {c.incharge_name || "—"}</div>
                            <div><span className="text-muted-foreground">Reporting:</span> {c.reporting_time || "—"}</div>
                            <div><span className="text-muted-foreground">Gate Close:</span> {c.gate_closing_time || "—"}</div>
                            <div><span className="text-muted-foreground">Accessible:</span> {c.is_accessible ? "Yes" : "No"}</div>
                            <div><span className="text-muted-foreground">Landmark:</span> {c.landmark || "—"}</div>
                          </div>
                          {c.address && <p className="text-xs"><span className="text-muted-foreground">Address:</span> {c.address}</p>}
                          <div className="flex justify-end">
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteCenter(c.id)}>
                              <Trash2 className="h-3 w-3 mr-1" /> Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-muted-foreground text-sm">No centers added yet. Click "Add Center" to get started.</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
