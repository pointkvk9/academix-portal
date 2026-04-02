import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { GovtHeader } from "@/components/GovtHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateExamForm } from "@/components/admin/CreateExamForm";
import { ExamList } from "@/components/admin/ExamList";
import { ExamSubmissions } from "@/components/admin/ExamSubmissions";
import { ManageCenters } from "@/components/admin/ManageCenters";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { LogOut, FileText, Users, MapPin, ClipboardList, LayoutDashboard, BookOpen, BarChart3 } from "lucide-react";
import { getGroupLabel } from "@/lib/groups";

export default function AdminDashboard() {
  const { signOut, profile } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({ totalExams: 0, totalApplications: 0, totalPaid: 0, totalCenters: 0 });

  const fetchExams = async () => {
    const { data } = await supabase.from("exams").select("*").order("created_at", { ascending: false });
    if (data) setExams(data);
  };

  const fetchStats = async () => {
    const [{ count: exCount }, { count: appCount }, { count: paidCount }, { count: centerCount }] = await Promise.all([
      supabase.from("exams").select("*", { count: "exact", head: true }),
      supabase.from("exam_applications").select("*", { count: "exact", head: true }),
      supabase.from("exam_applications").select("*", { count: "exact", head: true }).eq("fee_status", "paid"),
      supabase.from("exam_centers").select("*", { count: "exact", head: true }),
    ]);
    setStats({ totalExams: exCount || 0, totalApplications: appCount || 0, totalPaid: paidCount || 0, totalCenters: centerCount || 0 });
  };

  useEffect(() => { fetchExams(); fetchStats(); }, []);

  return (
    <div className="min-h-screen bg-background">
      <GovtHeader />
      <div className="bg-primary/5 border-b px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Admin Control Panel</p>
            <p className="text-xs text-muted-foreground">Welcome, {profile?.full_name || "Administrator"}</p>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}><LogOut className="mr-1 h-3 w-3" /> Logout</Button>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="dashboard"><LayoutDashboard className="mr-1 h-4 w-4" /> Overview</TabsTrigger>
            <TabsTrigger value="analytics"><BarChart3 className="mr-1 h-4 w-4" /> Analytics</TabsTrigger>
            <TabsTrigger value="exams"><BookOpen className="mr-1 h-4 w-4" /> Exams</TabsTrigger>
            <TabsTrigger value="create"><ClipboardList className="mr-1 h-4 w-4" /> Create Exam</TabsTrigger>
            <TabsTrigger value="submissions"><Users className="mr-1 h-4 w-4" /> Submissions</TabsTrigger>
            <TabsTrigger value="centers"><MapPin className="mr-1 h-4 w-4" /> Centers</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Exams", value: stats.totalExams, icon: BookOpen, color: "text-primary", bg: "bg-primary/5" },
                { label: "Applications", value: stats.totalApplications, icon: FileText, color: "text-info", bg: "bg-info/10" },
                { label: "Fee Paid", value: stats.totalPaid, icon: Users, color: "text-success", bg: "bg-success/10" },
                { label: "Exam Centers", value: stats.totalCenters, icon: MapPin, color: "text-accent", bg: "bg-accent/10" },
              ].map((s, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className={`p-4 ${s.bg}`}>
                    <s.icon className={`h-6 w-6 ${s.color} mb-2`} />
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-3">Recent Exams</h3>
                  {exams.slice(0, 5).map(e => (
                    <div key={e.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="text-sm font-medium">{e.title}</p>
                        <p className="text-xs text-muted-foreground">{getGroupLabel(e.class)}</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => { setSelectedExam(e.id); setActiveTab("submissions"); }}>View →</Button>
                    </div>
                  ))}
                  {exams.length === 0 && <p className="text-sm text-muted-foreground">No exams created yet</p>}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("create")}><ClipboardList className="h-4 w-4 mr-2" /> Create New Exam</Button>
                    <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("centers")}><MapPin className="h-4 w-4 mr-2" /> Manage Centers</Button>
                    <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("analytics")}><BarChart3 className="h-4 w-4 mr-2" /> View Analytics</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="exams">
            <ExamList exams={exams} onRefresh={fetchExams} onSelect={(id) => { setSelectedExam(id); setActiveTab("submissions"); }} />
          </TabsContent>

          <TabsContent value="create">
            <CreateExamForm onCreated={() => { fetchExams(); fetchStats(); setActiveTab("exams"); }} />
          </TabsContent>

          <TabsContent value="submissions">
            <ExamSubmissions exams={exams} selectedExamId={selectedExam} onSelectExam={setSelectedExam} />
          </TabsContent>

          <TabsContent value="centers">
            <ManageCenters exams={exams} selectedExamId={selectedExam} onSelectExam={setSelectedExam} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
