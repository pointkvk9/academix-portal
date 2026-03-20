import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { GovtHeader } from "@/components/GovtHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AdmitCardView } from "@/components/student/AdmitCardView";
import { LogOut, FileText, CreditCard, BookOpen, Calendar, Clock, IndianRupee, User, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const { signOut, profile, user } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [admitCards, setAdmitCards] = useState<any[]>([]);

  useEffect(() => {
    if (!user || !profile) return;
    
    supabase.from("exams").select("*").eq("class", profile.class).eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setExams(data || []));

    supabase.from("exam_applications").select("*, exams(title, exam_date, fee_amount, class, duration_minutes, exam_time, exam_type)")
      .eq("user_id", user.id)
      .then(({ data }) => setApplications(data || []));

    supabase.from("admit_cards")
      .select("*, exams(title, exam_date, exam_time, duration_minutes), exam_centers(center_name, center_code, address, city, state, pincode, reporting_time, gate_closing_time)")
      .eq("user_id", user.id)
      .then(({ data }) => setAdmitCards(data || []));
  }, [user, profile]);

  const hasApplied = (examId: string) => applications.some(a => a.exam_id === examId);
  const getApplication = (examId: string) => applications.find(a => a.exam_id === examId);

  return (
    <div className="min-h-screen bg-background">
      <GovtHeader />
      
      {/* Student Info Bar */}
      <div className="bg-primary/5 border-b px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{profile?.full_name}</p>
              <p className="text-xs text-muted-foreground">Class {profile?.class} | {user?.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="mr-1 h-3 w-3" /> Logout
          </Button>
        </div>
      </div>

      {/* Notification */}
      {exams.length > 0 && (
        <div className="bg-info/10 border-b border-info/20 px-4 py-2">
          <p className="container mx-auto text-xs text-center font-medium">
            📋 {exams.length} examination(s) available for your class — Apply before the last date!
          </p>
        </div>
      )}

      <div className="container mx-auto py-6 px-4">
        <Tabs defaultValue="exams">
          <TabsList className="mb-6">
            <TabsTrigger value="exams"><BookOpen className="mr-1 h-4 w-4" /> Available Exams</TabsTrigger>
            <TabsTrigger value="applications"><FileText className="mr-1 h-4 w-4" /> My Applications ({applications.length})</TabsTrigger>
            <TabsTrigger value="admitcards"><CreditCard className="mr-1 h-4 w-4" /> Admit Cards ({admitCards.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="exams">
            {exams.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No examinations available for Class {profile?.class} right now.</p>
                  <p className="text-sm text-muted-foreground mt-1">Check back later for new exam notifications.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exams.map((exam) => {
                  const app = getApplication(exam.id);
                  const isExpired = exam.last_date_to_apply && new Date(exam.last_date_to_apply) < new Date();
                  
                  return (
                    <Card key={exam.id} className={`overflow-hidden hover:shadow-md transition-shadow ${isExpired && !app ? "opacity-60" : ""}`}>
                      <div className={`h-1.5 ${exam.is_active ? "bg-primary" : "bg-muted"}`} />
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{exam.title}</CardTitle>
                            <CardDescription>Class {exam.class} | {exam.academic_year || "—"}</CardDescription>
                          </div>
                          {app?.is_submitted && <Badge className="bg-success text-success-foreground">Submitted</Badge>}
                          {app && !app.is_submitted && <Badge variant="outline">Step {app.current_step}/6</Badge>}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>Date: <strong>{exam.exam_date || "TBD"}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>Time: <strong>{(exam as any).exam_time || "TBD"}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>Duration: <strong>{(exam as any).duration_minutes || 180} min</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <IndianRupee className="h-3 w-3 text-muted-foreground" />
                            <span>Fee: <strong>₹{exam.fee_amount}</strong></span>
                          </div>
                        </div>

                        {exam.last_date_to_apply && (
                          <div className={`text-xs flex items-center gap-1 ${isExpired ? "text-destructive" : "text-warning"}`}>
                            <AlertCircle className="h-3 w-3" />
                            Last Date: {exam.last_date_to_apply} {isExpired ? "(Expired)" : ""}
                          </div>
                        )}

                        {exam.subjects && (exam.subjects as string[]).length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {(exam.subjects as string[]).map((s: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-[10px]">{s}</Badge>
                            ))}
                          </div>
                        )}

                        <Separator />

                        <div>
                          {app ? (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <div className="w-24 bg-muted rounded-full h-2">
                                  <div className="bg-primary rounded-full h-2" style={{ width: `${(app.current_step / 6) * 100}%` }} />
                                </div>
                                <span className="text-xs text-muted-foreground">{app.current_step}/6</span>
                              </div>
                              {!app.is_submitted && (
                                <Button size="sm" onClick={() => navigate(`/apply/${exam.id}`)}>
                                  Continue Application →
                                </Button>
                              )}
                            </div>
                          ) : (
                            <Button size="sm" disabled={!!isExpired} onClick={() => navigate(`/apply/${exam.id}`)}>
                              {isExpired ? "Registration Closed" : "Apply Now →"}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="applications">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No applications yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">Go to "Available Exams" to start applying.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <Card key={app.id} className="overflow-hidden">
                    <div className={`h-1 ${app.is_submitted ? "bg-success" : "bg-warning"}`} />
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <p className="font-semibold text-sm">{(app.exams as any)?.title}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span>Class {(app.exams as any)?.class}</span>
                            <span>•</span>
                            <span>Fee: {app.fee_status === "paid" ? "✓ Paid" : "Pending"}</span>
                            <span>•</span>
                            <span>Progress: {app.current_step}/6</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={app.is_submitted ? "default" : "outline"} className={app.is_submitted ? "bg-success text-success-foreground" : ""}>
                            {app.is_submitted ? "✓ Submitted" : "In Progress"}
                          </Badge>
                          {!app.is_submitted && (
                            <Button size="sm" onClick={() => navigate(`/apply/${app.exam_id}`)}>
                              Continue →
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="admitcards">
            <AdmitCardView admitCards={admitCards} profile={profile} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
