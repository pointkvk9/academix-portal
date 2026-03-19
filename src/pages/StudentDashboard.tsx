import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { GovtHeader } from "@/components/GovtHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdmitCardView } from "@/components/student/AdmitCardView";
import { LogOut, FileText, CreditCard, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const { signOut, profile, user } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [admitCards, setAdmitCards] = useState<any[]>([]);

  useEffect(() => {
    if (!user || !profile) return;
    // Fetch exams for student's class
    supabase.from("exams").select("*").eq("class", profile.class).eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setExams(data || []));

    // Fetch student's applications
    supabase.from("exam_applications").select("*, exams(title, exam_date, fee_amount)")
      .eq("user_id", user.id)
      .then(({ data }) => setApplications(data || []));

    // Fetch admit cards
    supabase.from("admit_cards")
      .select("*, exams(title, exam_date), exam_centers(center_name, center_code, address, city, state)")
      .eq("user_id", user.id)
      .then(({ data }) => setAdmitCards(data || []));
  }, [user, profile]);

  const hasApplied = (examId: string) => applications.some(a => a.exam_id === examId);
  const getApplication = (examId: string) => applications.find(a => a.exam_id === examId);

  return (
    <div className="min-h-screen bg-background">
      <GovtHeader />
      <div className="bg-primary/5 border-b px-4 py-2">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              Welcome, {profile?.full_name} — Class {profile?.class}
            </p>
            <p className="text-xs text-muted-foreground">ID: {user?.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="mr-1 h-3 w-3" /> Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4">
        <Tabs defaultValue="exams">
          <TabsList className="mb-6">
            <TabsTrigger value="exams"><BookOpen className="mr-1 h-4 w-4" /> Available Exams</TabsTrigger>
            <TabsTrigger value="applications"><FileText className="mr-1 h-4 w-4" /> My Applications</TabsTrigger>
            <TabsTrigger value="admitcards"><CreditCard className="mr-1 h-4 w-4" /> Admit Cards</TabsTrigger>
          </TabsList>

          <TabsContent value="exams">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exams.length === 0 ? (
                <p className="col-span-full text-center text-muted-foreground py-8">No examinations available for your class right now.</p>
              ) : exams.map((exam) => (
                <Card key={exam.id} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{exam.title}</CardTitle>
                    <CardDescription>Class {exam.class} | {exam.academic_year}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p>Exam Date: <strong>{exam.exam_date || "TBD"}</strong></p>
                      <p>Last Date: <strong>{exam.last_date_to_apply || "TBD"}</strong></p>
                      <p>Fee: <strong>₹{exam.fee_amount}</strong></p>
                      {exam.subjects && (exam.subjects as string[]).length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {(exam.subjects as string[]).map((s: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      {hasApplied(exam.id) ? (
                        <div>
                          <Badge variant={getApplication(exam.id)?.is_submitted ? "default" : "outline"}>
                            {getApplication(exam.id)?.is_submitted ? "Submitted" : `Step ${getApplication(exam.id)?.current_step}/6`}
                          </Badge>
                          {!getApplication(exam.id)?.is_submitted && (
                            <Button size="sm" className="ml-2" onClick={() => navigate(`/apply/${exam.id}`)}>
                              Continue
                            </Button>
                          )}
                        </div>
                      ) : (
                        <Button size="sm" onClick={() => navigate(`/apply/${exam.id}`)}>
                          Apply Now
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications">
            <div className="space-y-3">
              {applications.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No applications yet.</p>
              ) : applications.map((app) => (
                <Card key={app.id}>
                  <CardContent className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{(app.exams as any)?.title}</p>
                      <p className="text-sm text-muted-foreground">Step {app.current_step}/6 | Fee: {app.fee_status}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={app.is_submitted ? "default" : "outline"}>
                        {app.is_submitted ? "Submitted" : "In Progress"}
                      </Badge>
                      {!app.is_submitted && (
                        <Button size="sm" variant="outline" onClick={() => navigate(`/apply/${app.exam_id}`)}>
                          Continue
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="admitcards">
            <AdmitCardView admitCards={admitCards} profile={profile} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
