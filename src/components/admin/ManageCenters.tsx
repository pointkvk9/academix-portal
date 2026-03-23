import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Zap, MapPin, Building, Trash2, Users, ChevronDown, ChevronUp, ArrowRightLeft } from "lucide-react";
import { getGroupLabel } from "@/lib/groups";

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
  const [admitCards, setAdmitCards] = useState<any[]>([]);
  const [changeCenterCard, setChangeCenterCard] = useState<any>(null);
  const [newCenterId, setNewCenterId] = useState("");
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

  const fetchAdmitCards = async () => {
    if (!selectedExamId) return;
    const { data } = await supabase.from("admit_cards").select("*, exam_centers(center_name, center_code, city)").eq("exam_id", selectedExamId);
    if (data) setAdmitCards(data);
  };

  useEffect(() => { fetchCenters(); fetchAdmitCards(); }, [selectedExamId]);

  const resetForm = () => {
    setForm({ center_name: "", center_code: "", address: "", city: "", state: "", capacity: "", pincode: "", contact_number: "", contact_email: "", center_type: "school", reporting_time: "09:00 AM", gate_closing_time: "09:30 AM", incharge_name: "", landmark: "", is_accessible: true });
  };

  const handleAddCenter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId || !form.center_name || !form.capacity || !form.city || !form.state) {
      toast.error("Fill all required fields"); return;
    }
    const { error } = await supabase.from("exam_centers").insert({
      center_name: form.center_name, center_code: form.center_code, address: form.address,
      city: form.city, state: form.state, capacity: parseInt(form.capacity), exam_id: selectedExamId,
      pincode: form.pincode, contact_number: form.contact_number, contact_email: form.contact_email,
      center_type: form.center_type, reporting_time: form.reporting_time, gate_closing_time: form.gate_closing_time,
      incharge_name: form.incharge_name, landmark: form.landmark, is_accessible: form.is_accessible,
    } as any);
    if (error) toast.error(error.message);
    else { toast.success("Center added!"); resetForm(); setShowForm(false); fetchCenters(); }
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
    const { data: applications } = await supabase.from("exam_applications").select("id, user_id, address_details").eq("exam_id", selectedExamId).eq("is_submitted", true).eq("fee_status", "paid");
    if (!applications || applications.length === 0) { toast.error("No paid & submitted applications found"); setGenerating(false); return; }

    const { data: existingCards } = await supabase.from("admit_cards").select("user_id").eq("exam_id", selectedExamId);
    const existingUserIds = new Set((existingCards || []).map(c => c.user_id));
    const newApplications = applications.filter(a => !existingUserIds.has(a.user_id));
    if (newApplications.length === 0) { toast.info("All admit cards already generated"); setGenerating(false); return; }

    const centersCopy = centers.map(c => ({ ...c }));
    const admitCardsToInsert: any[] = [];
    let rollCounter = (existingCards?.length || 0) + 1;

    for (const app of newApplications) {
      const addr = app.address_details as any;
      const candidateCity = addr?.city?.toLowerCase() || "";
      const candidateState = addr?.state?.toLowerCase() || "";
      let bestCenter = centersCopy.find(c => c.allocated < c.capacity && c.city?.toLowerCase() === candidateCity);
      if (!bestCenter) bestCenter = centersCopy.find(c => c.allocated < c.capacity && c.state?.toLowerCase() === candidateState);
      if (!bestCenter) bestCenter = centersCopy.find(c => c.allocated < c.capacity);
      if (!bestCenter) { toast.error("Not enough center capacity!"); setGenerating(false); return; }

      admitCardsToInsert.push({
        user_id: app.user_id, exam_id: selectedExamId, application_id: app.id,
        center_id: bestCenter.id,
        roll_number: `${bestCenter.center_code || "C"}${String(rollCounter++).padStart(5, "0")}`,
      });
      bestCenter.allocated++;
    }

    const { error } = await supabase.from("admit_cards").insert(admitCardsToInsert);
    if (error) { toast.error(error.message); }
    else {
      for (const c of centersCopy) {
        if (c.allocated !== centers.find(oc => oc.id === c.id)?.allocated) {
          await supabase.from("exam_centers").update({ allocated: c.allocated }).eq("id", c.id);
        }
      }
      toast.success(`${admitCardsToInsert.length} admit cards generated!`);
      fetchCenters(); fetchAdmitCards();
    }
    setGenerating(false);
  };

  const handleChangeCenter = async () => {
    if (!changeCenterCard || !newCenterId) return;
    const oldCenterId = changeCenterCard.center_id;
    const { error } = await supabase.from("admit_cards").update({ center_id: newCenterId }).eq("id", changeCenterCard.id);
    if (error) { toast.error(error.message); return; }
    await supabase.from("exam_centers").update({ allocated: Math.max(0, (centers.find(c => c.id === oldCenterId)?.allocated || 1) - 1) }).eq("id", oldCenterId);
    await supabase.from("exam_centers").update({ allocated: (centers.find(c => c.id === newCenterId)?.allocated || 0) + 1 }).eq("id", newCenterId);
    toast.success("Center changed!"); setChangeCenterCard(null); setNewCenterId("");
    fetchCenters(); fetchAdmitCards();
  };

  const totalCapacity = centers.reduce((sum, c) => sum + c.capacity, 0);
  const totalAllocated = centers.reduce((sum, c) => sum + c.allocated, 0);

  return (
    <div className="space-y-4">
      <Card className="border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Exam Centers & Admit Cards</CardTitle>
          <CardDescription>Add centers, allocate by location, generate admit cards</CardDescription>
          <Select value={selectedExamId || ""} onValueChange={onSelectExam}>
            <SelectTrigger className="w-full max-w-sm"><SelectValue placeholder="Select an examination" /></SelectTrigger>
            <SelectContent>
              {exams.map((e) => <SelectItem key={e.id} value={e.id}>{e.title} ({getGroupLabel(e.class)})</SelectItem>)}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {!selectedExamId ? (
            <div className="text-center py-12"><MapPin className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground">Select an exam to manage centers</p></div>
          ) : (
            <>
              {centers.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mb-6">
                  <div className="bg-primary/5 rounded-md p-3 text-center"><p className="text-2xl font-bold text-primary">{centers.length}</p><p className="text-xs text-muted-foreground">Centers</p></div>
                  <div className="bg-info/10 rounded-md p-3 text-center"><p className="text-2xl font-bold text-info">{totalCapacity}</p><p className="text-xs text-muted-foreground">Capacity</p></div>
                  <div className="bg-success/10 rounded-md p-3 text-center"><p className="text-2xl font-bold text-success">{totalAllocated}</p><p className="text-xs text-muted-foreground">Allocated</p></div>
                  <div className="bg-warning/10 rounded-md p-3 text-center"><p className="text-2xl font-bold text-accent">{admitCards.length}</p><p className="text-xs text-muted-foreground">Admit Cards</p></div>
                </div>
              )}

              <div className="flex gap-2 mb-4 flex-wrap">
                <Button variant="outline" onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" /> Add Center</Button>
                <Button onClick={handleGenerateAdmitCards} disabled={generating || centers.length === 0}>
                  <Zap className="h-4 w-4 mr-1" /> {generating ? "Generating..." : "Generate Admit Cards"}
                </Button>
              </div>

              {showForm && (
                <Card className="mb-6 bg-muted/20 border-2 border-dashed border-primary/30">
                  <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Building className="h-4 w-4" /> New Center</CardTitle></CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddCenter} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1"><Label className="text-xs">Center Name *</Label><Input value={form.center_name} onChange={(e) => setForm({ ...form, center_name: e.target.value })} required /></div>
                        <div className="space-y-1"><Label className="text-xs">Center Code</Label><Input value={form.center_code} onChange={(e) => setForm({ ...form, center_code: e.target.value })} placeholder="e.g. VNS001" /></div>
                        <div className="space-y-1"><Label className="text-xs">Type</Label>
                          <Select value={form.center_type} onValueChange={(v) => setForm({ ...form, center_type: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="school">School</SelectItem><SelectItem value="college">College / Inter College</SelectItem><SelectItem value="university">University</SelectItem><SelectItem value="institute">Institute</SelectItem><SelectItem value="community_hall">Community Hall</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1"><Label className="text-xs">Capacity *</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required /></div>
                        <div className="space-y-1"><Label className="text-xs">Incharge</Label><Input value={form.incharge_name} onChange={(e) => setForm({ ...form, incharge_name: e.target.value })} /></div>
                        <div className="space-y-1"><Label className="text-xs">Contact</Label><Input value={form.contact_number} onChange={(e) => setForm({ ...form, contact_number: e.target.value })} /></div>
                        <div className="space-y-1"><Label className="text-xs">Email</Label><Input value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} /></div>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2 space-y-1"><Label className="text-xs">Address *</Label><Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} /></div>
                        <div className="space-y-1"><Label className="text-xs">Landmark</Label><Input value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} /></div>
                        <div className="space-y-1"><Label className="text-xs">City *</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required /></div>
                        <div className="space-y-1"><Label className="text-xs">State *</Label>
                          <Select value={form.state} onValueChange={(v) => setForm({ ...form, state: v })}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>{INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1"><Label className="text-xs">Pincode</Label><Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} maxLength={6} /></div>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1"><Label className="text-xs">Reporting Time</Label>
                          <Select value={form.reporting_time} onValueChange={(v) => setForm({ ...form, reporting_time: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="07:00 AM">07:00 AM</SelectItem><SelectItem value="07:30 AM">07:30 AM</SelectItem><SelectItem value="08:00 AM">08:00 AM</SelectItem><SelectItem value="08:30 AM">08:30 AM</SelectItem><SelectItem value="09:00 AM">09:00 AM</SelectItem><SelectItem value="01:00 PM">01:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1"><Label className="text-xs">Gate Closing</Label>
                          <Select value={form.gate_closing_time} onValueChange={(v) => setForm({ ...form, gate_closing_time: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="08:00 AM">08:00 AM</SelectItem><SelectItem value="08:30 AM">08:30 AM</SelectItem><SelectItem value="09:00 AM">09:00 AM</SelectItem><SelectItem value="09:30 AM">09:30 AM</SelectItem><SelectItem value="02:00 PM">02:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-3 pt-4">
                          <Switch checked={form.is_accessible} onCheckedChange={(v) => setForm({ ...form, is_accessible: v })} />
                          <Label className="text-xs">PwD Accessible</Label>
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

              {/* Centers List */}
              {centers.length > 0 ? (
                <div className="space-y-2 mb-6">
                  {centers.map((c) => (
                    <Card key={c.id} className="overflow-hidden">
                      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setExpandedCenter(expandedCenter === c.id ? null : c.id)}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center"><Building className="h-5 w-5 text-primary" /></div>
                          <div>
                            <p className="font-medium text-sm">{c.center_name}</p>
                            <p className="text-xs text-muted-foreground">{c.center_code || "—"} • {c.city}, {c.state}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">{c.allocated}/{c.capacity}</Badge>
                          {expandedCenter === c.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </div>
                      {expandedCenter === c.id && (
                        <div className="px-4 pb-4 border-t">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3 text-xs">
                            <div><span className="text-muted-foreground">Type:</span> <span className="capitalize">{c.center_type}</span></div>
                            <div><span className="text-muted-foreground">Incharge:</span> {c.incharge_name || "—"}</div>
                            <div><span className="text-muted-foreground">Contact:</span> {c.contact_number || "—"}</div>
                            <div><span className="text-muted-foreground">Reporting:</span> {c.reporting_time}</div>
                            <div><span className="text-muted-foreground">Gate:</span> {c.gate_closing_time}</div>
                            <div><span className="text-muted-foreground">Pincode:</span> {c.pincode || "—"}</div>
                            <div className="col-span-2"><span className="text-muted-foreground">Address:</span> {c.address} {c.landmark ? `(Near: ${c.landmark})` : ""}</div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteCenter(c.id)}><Trash2 className="h-3 w-3 mr-1" /> Delete</Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8"><p className="text-muted-foreground text-sm">No centers added yet</p></div>
              )}

              {/* Admit Cards List */}
              {admitCards.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Generated Admit Cards ({admitCards.length})</h3>
                  <div className="overflow-x-auto rounded-md border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-2 text-xs">#</th>
                          <th className="text-left p-2 text-xs">Roll No.</th>
                          <th className="text-left p-2 text-xs">Center</th>
                          <th className="text-left p-2 text-xs">City</th>
                          <th className="text-left p-2 text-xs">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {admitCards.map((ac, i) => (
                          <tr key={ac.id} className="border-b last:border-0">
                            <td className="p-2 text-xs">{i + 1}</td>
                            <td className="p-2 font-mono font-semibold text-xs">{ac.roll_number}</td>
                            <td className="p-2 text-xs">{(ac.exam_centers as any)?.center_name || "—"}</td>
                            <td className="p-2 text-xs">{(ac.exam_centers as any)?.city || "—"}</td>
                            <td className="p-2">
                              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setChangeCenterCard(ac); setNewCenterId(""); }}>
                                <ArrowRightLeft className="h-3 w-3 mr-1" /> Change
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Change Center Dialog */}
      <Dialog open={!!changeCenterCard} onOpenChange={() => setChangeCenterCard(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Change Center — Roll: {changeCenterCard?.roll_number}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">Current: {(changeCenterCard?.exam_centers as any)?.center_name}</p>
            <div className="space-y-2">
              <Label>New Center</Label>
              <Select value={newCenterId} onValueChange={setNewCenterId}>
                <SelectTrigger><SelectValue placeholder="Select new center" /></SelectTrigger>
                <SelectContent>
                  {centers.filter(c => c.id !== changeCenterCard?.center_id).map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.center_name} — {c.city} ({c.allocated}/{c.capacity})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeCenterCard(null)}>Cancel</Button>
            <Button onClick={handleChangeCenter} disabled={!newCenterId}>Confirm Change</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
