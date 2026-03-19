import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Zap, MapPin } from "lucide-react";

interface ManageCentersProps {
  exams: any[];
  selectedExamId: string | null;
  onSelectExam: (id: string) => void;
}

export function ManageCenters({ exams, selectedExamId, onSelectExam }: ManageCentersProps) {
  const [centers, setCenters] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({ center_name: "", center_code: "", address: "", city: "", state: "", capacity: "" });

  const fetchCenters = async () => {
    if (!selectedExamId) return;
    const { data } = await supabase.from("exam_centers").select("*").eq("exam_id", selectedExamId).order("created_at");
    if (data) setCenters(data);
  };

  useEffect(() => { fetchCenters(); }, [selectedExamId]);

  const handleAddCenter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId) return;
    const { error } = await supabase.from("exam_centers").insert({
      ...form,
      capacity: parseInt(form.capacity),
      exam_id: selectedExamId,
    });
    if (error) toast.error(error.message);
    else { toast.success("Center added!"); setForm({ center_name: "", center_code: "", address: "", city: "", state: "", capacity: "" }); setShowForm(false); fetchCenters(); }
  };

  const handleGenerateAdmitCards = async () => {
    if (!selectedExamId) return;
    setGenerating(true);

    // Get all submitted & paid applications for this exam
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

    // Check existing admit cards
    const { data: existingCards } = await supabase
      .from("admit_cards")
      .select("user_id")
      .eq("exam_id", selectedExamId);
    
    const existingUserIds = new Set((existingCards || []).map(c => c.user_id));
    const newApplications = applications.filter(a => !existingUserIds.has(a.user_id));

    if (newApplications.length === 0) {
      toast.info("All admit cards already generated");
      setGenerating(false);
      return;
    }

    // Allocate students to centers
    const sortedCenters = [...centers].sort((a, b) => (a.capacity - a.allocated) - (b.capacity - b.allocated));
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
      // Update allocated counts
      for (const center of sortedCenters) {
        await supabase.from("exam_centers").update({ allocated: center.allocated }).eq("id", center.id);
      }
      toast.success(`${admitCards.length} admit cards generated!`);
      fetchCenters();
    }
    setGenerating(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Exam Centers</CardTitle>
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
            <p className="text-muted-foreground text-center py-8">Select an exam to manage centers</p>
          ) : (
            <>
              <div className="flex gap-2 mb-4">
                <Button variant="outline" onClick={() => setShowForm(!showForm)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Center
                </Button>
                <Button onClick={handleGenerateAdmitCards} disabled={generating || centers.length === 0}>
                  <Zap className="h-4 w-4 mr-1" /> {generating ? "Generating..." : "Generate Admit Cards"}
                </Button>
              </div>

              {showForm && (
                <Card className="mb-4 bg-muted/30">
                  <CardContent className="pt-4">
                    <form onSubmit={handleAddCenter} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div><Label>Center Name *</Label><Input value={form.center_name} onChange={(e) => setForm({ ...form, center_name: e.target.value })} required /></div>
                      <div><Label>Center Code</Label><Input value={form.center_code} onChange={(e) => setForm({ ...form, center_code: e.target.value })} /></div>
                      <div><Label>Capacity *</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required /></div>
                      <div><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
                      <div><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                      <div><Label>State</Label><Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
                      <div className="md:col-span-3"><Button type="submit">Save Center</Button></div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {centers.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Allocated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {centers.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.center_name}</TableCell>
                        <TableCell>{c.center_code || "—"}</TableCell>
                        <TableCell>{c.city || "—"}</TableCell>
                        <TableCell>{c.capacity}</TableCell>
                        <TableCell>{c.allocated}/{c.capacity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
