import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { IndianRupee, Heart, Users, TrendingUp, Upload, Save } from "lucide-react";
import { toast } from "sonner";

export function DonationAnalytics() {
  const [donations, setDonations] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [signFile, setSignFile] = useState<File | null>(null);
  const [sealFile, setSealFile] = useState<File | null>(null);
  const [signatoryName, setSignatoryName] = useState("");
  const [signatoryDesignation, setSignatoryDesignation] = useState("");
  const [activeView, setActiveView] = useState<"donations" | "members" | "settings">("donations");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [{ data: don }, { data: mem }, { data: set }] = await Promise.all([
      supabase.from("donations").select("*").order("created_at", { ascending: false }),
      supabase.from("members").select("*").order("created_at", { ascending: false }),
      supabase.from("admin_settings").select("*"),
    ]);
    if (don) setDonations(don);
    if (mem) setMembers(mem);
    if (set) {
      const map: any = {};
      set.forEach((s: any) => { map[s.setting_key] = s; });
      setSettings(map);
      setSignatoryName(map.certificate_signatory_name?.setting_value || "");
      setSignatoryDesignation(map.certificate_signatory_designation?.setting_value || "");
    }
  };

  const totalDonations = donations.reduce((s, d) => s + (Number(d.amount) || 0), 0);
  const totalMembers = members.filter(m => m.payment_status === "paid").length;
  const memberRevenue = members.filter(m => m.payment_status === "paid").reduce((s, m) => s + (Number(m.amount) || 0), 0);
  const annualMembers = members.filter(m => m.payment_status === "paid" && m.member_type === "annual").length;
  const permanentMembers = members.filter(m => m.payment_status === "paid" && m.member_type === "permanent").length;

  const purposeData = donations.reduce((acc: any[], d) => {
    const p = d.purpose || "General Donation";
    const existing = acc.find(a => a.name === p);
    if (existing) existing.value += Number(d.amount) || 0;
    else acc.push({ name: p, value: Number(d.amount) || 0 });
    return acc;
  }, []);

  const memberTypeData = [
    { name: "Annual (₹500)", value: annualMembers },
    { name: "Permanent (₹1000)", value: permanentMembers },
  ];

  const PIE_COLORS = ["hsl(0, 75%, 42%)", "hsl(38, 92%, 50%)", "hsl(142, 70%, 35%)", "hsl(199, 89%, 48%)", "hsl(270, 70%, 50%)"];

  const handleUploadSetting = async (key: string, file: File) => {
    const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
    const path = `settings/${key}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("documents").upload(path, file);
    if (error) { toast.error("Upload failed"); return; }
    const { data: urlData } = supabase.storage.from("documents").getPublicUrl(path);
    await supabase.from("admin_settings").update({ file_url: urlData.publicUrl, updated_at: new Date().toISOString() }).eq("setting_key", key);
    toast.success("Uploaded successfully");
    fetchAll();
  };

  const handleSaveSettings = async () => {
    await Promise.all([
      supabase.from("admin_settings").update({ setting_value: signatoryName }).eq("setting_key", "certificate_signatory_name"),
      supabase.from("admin_settings").update({ setting_value: signatoryDesignation }).eq("setting_key", "certificate_signatory_designation"),
    ]);
    if (signFile) await handleUploadSetting("certificate_sign_url", signFile);
    if (sealFile) await handleUploadSetting("certificate_seal_url", sealFile);
    toast.success("Settings saved!");
    fetchAll();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button variant={activeView === "donations" ? "default" : "outline"} size="sm" onClick={() => setActiveView("donations")}>
          <Heart className="mr-1 h-4 w-4" /> Donations
        </Button>
        <Button variant={activeView === "members" ? "default" : "outline"} size="sm" onClick={() => setActiveView("members")}>
          <Users className="mr-1 h-4 w-4" /> Members
        </Button>
        <Button variant={activeView === "settings" ? "default" : "outline"} size="sm" onClick={() => setActiveView("settings")}>
          <Save className="mr-1 h-4 w-4" /> Certificate Settings
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 bg-primary/5">
          <IndianRupee className="h-6 w-6 text-primary mb-2" />
          <p className="text-2xl font-bold">₹{totalDonations.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total Donations</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 bg-accent/10">
          <Heart className="h-6 w-6 text-accent mb-2" />
          <p className="text-2xl font-bold">{donations.length}</p>
          <p className="text-xs text-muted-foreground">Donors</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 bg-success/10">
          <Users className="h-6 w-6 text-success mb-2" />
          <p className="text-2xl font-bold">{totalMembers}</p>
          <p className="text-xs text-muted-foreground">Total Members</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 bg-info/10">
          <TrendingUp className="h-6 w-6 text-info mb-2" />
          <p className="text-2xl font-bold">₹{memberRevenue.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Member Revenue</p>
        </CardContent></Card>
      </div>

      {activeView === "donations" && (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Donations by Purpose</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={purposeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `₹${value}`}>
                      {purposeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Member Type Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={memberTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(0, 75%, 42%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">All Donations ({donations.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Payment ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donations.map(d => (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">{d.name}</TableCell>
                        <TableCell className="text-xs">{d.email}</TableCell>
                        <TableCell className="text-xs">{d.mobile}</TableCell>
                        <TableCell className="font-semibold">₹{d.amount}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{d.purpose || "General"}</Badge></TableCell>
                        <TableCell className="text-xs">{new Date(d.created_at).toLocaleDateString("en-IN")}</TableCell>
                        <TableCell className="text-xs font-mono">{d.payment_id?.slice(0, 12)}</TableCell>
                      </TableRow>
                    ))}
                    {donations.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">No donations yet</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeView === "members" && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">All Members ({members.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Photo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map(m => (
                    <TableRow key={m.id}>
                      <TableCell>
                        {m.photo_url ? <img src={m.photo_url} className="w-8 h-8 rounded-full object-cover" alt="" /> : <div className="w-8 h-8 rounded-full bg-primary/10" />}
                      </TableCell>
                      <TableCell className="font-medium">{m.full_name}</TableCell>
                      <TableCell className="text-xs">{m.email}</TableCell>
                      <TableCell className="text-xs">{m.mobile}</TableCell>
                      <TableCell><Badge variant={m.member_type === "permanent" ? "default" : "secondary"} className="text-xs">{m.member_type}</Badge></TableCell>
                      <TableCell className="font-semibold">₹{m.amount}</TableCell>
                      <TableCell><Badge variant={m.payment_status === "paid" ? "default" : "destructive"} className="text-xs">{m.payment_status}</Badge></TableCell>
                      <TableCell className="text-xs">{new Date(m.created_at).toLocaleDateString("en-IN")}</TableCell>
                    </TableRow>
                  ))}
                  {members.length === 0 && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">No members yet</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeView === "settings" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Certificate Sign & Seal Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Signatory Name</Label>
                <Input value={signatoryName} onChange={e => setSignatoryName(e.target.value)} placeholder="Secretary, KVK Sanstha" />
              </div>
              <div className="space-y-2">
                <Label>Signatory Designation</Label>
                <Input value={signatoryDesignation} onChange={e => setSignatoryDesignation(e.target.value)} placeholder="Authorized Signatory" />
              </div>
              <div className="space-y-2">
                <Label>Upload Signature</Label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-muted transition-colors text-sm">
                    <Upload className="h-4 w-4" /> Choose File
                    <input type="file" accept="image/*" className="hidden" onChange={e => setSignFile(e.target.files?.[0] || null)} />
                  </label>
                  {(signFile || settings.certificate_sign_url?.file_url) && (
                    <img src={signFile ? URL.createObjectURL(signFile) : settings.certificate_sign_url?.file_url} alt="Sign" className="h-10 object-contain" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Upload Official Seal/Mohar</Label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-muted transition-colors text-sm">
                    <Upload className="h-4 w-4" /> Choose File
                    <input type="file" accept="image/*" className="hidden" onChange={e => setSealFile(e.target.files?.[0] || null)} />
                  </label>
                  {(sealFile || settings.certificate_seal_url?.file_url) && (
                    <img src={sealFile ? URL.createObjectURL(sealFile) : settings.certificate_seal_url?.file_url} alt="Seal" className="h-12 object-contain" />
                  )}
                </div>
              </div>
            </div>
            <Button onClick={handleSaveSettings}><Save className="mr-2 h-4 w-4" /> Save Settings</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
