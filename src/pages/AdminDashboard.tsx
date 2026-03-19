import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { GovtHeader } from "@/components/GovtHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateExamForm } from "@/components/admin/CreateExamForm";
import { ExamList } from "@/components/admin/ExamList";
import { ExamSubmissions } from "@/components/admin/ExamSubmissions";
import { ManageCenters } from "@/components/admin/ManageCenters";
import { LogOut, FileText, Users, MapPin, ClipboardList } from "lucide-react";

export default function AdminDashboard() {
  const { signOut, profile } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("exams");

  const fetchExams = async () => {
    const { data } = await supabase.from("exams").select("*").order("created_at", { ascending: false });
    if (data) setExams(data);
  };

  useEffect(() => { fetchExams(); }, []);

  return (
    <div className="min-h-screen bg-background">
      <GovtHeader />
      <div className="bg-primary/5 border-b px-4 py-2">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">
            Admin Panel — Welcome, {profile?.full_name || "Administrator"}
          </p>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="mr-1 h-3 w-3" /> Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="exams"><FileText className="mr-1 h-4 w-4" /> Exams</TabsTrigger>
            <TabsTrigger value="create"><ClipboardList className="mr-1 h-4 w-4" /> Create Exam</TabsTrigger>
            <TabsTrigger value="submissions"><Users className="mr-1 h-4 w-4" /> Submissions</TabsTrigger>
            <TabsTrigger value="centers"><MapPin className="mr-1 h-4 w-4" /> Centers & Admit Cards</TabsTrigger>
          </TabsList>

          <TabsContent value="exams">
            <ExamList exams={exams} onRefresh={fetchExams} onSelect={(id) => { setSelectedExam(id); setActiveTab("submissions"); }} />
          </TabsContent>

          <TabsContent value="create">
            <CreateExamForm onCreated={() => { fetchExams(); setActiveTab("exams"); }} />
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
