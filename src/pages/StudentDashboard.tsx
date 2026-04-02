import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { GovtHeader } from "@/components/GovtHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdmitCardView } from "@/components/student/AdmitCardView";
import { ApplicationReceipt } from "@/components/student/ApplicationReceipt";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  LogOut, 
  FileText, 
  CreditCard, 
  BookOpen, 
  Calendar, 
  Clock, 
  IndianRupee, 
  User, 
  AlertCircle, 
  Eye, 
  ArrowUpDown,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getGroupLabel, getGroupClasses, getGroupDetails } from "@/lib/groups";
import { toast } from "sonner";

export default function StudentDashboard() {
  const { signOut, profile, user } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [admitCards, setAdmitCards] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [receiptApp, setReceiptApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user || !profile) {
      if (user && !profile) {
        const timer = setTimeout(() => {
          window.location.reload();
        }, 2000);
        return () => clearTimeout(timer);
      }
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: examsData, error: examsError } = await supabase
          .from("exams")
          .select("*")
          .eq("class", profile.class)
          .eq("is_active", true)
          .order("created_at", { ascending: false });
        
        if (examsError) {
          console.error("Error fetching exams:", examsError);
          toast.error("Failed to load exams");
        } else {
          setExams(examsData || []);
        }

        const { data: appsData, error: appsError } = await supabase
          .from("exam_applications")
          .select("*, exams(title, exam_date, fee_amount, class, duration_minutes, exam_time, exam_type, subjects, total_marks, instructions, last_date_to_apply)")
          .eq("user_id", user.id);
        
        if (appsError) {
          console.error("Error fetching applications:", appsError);
        } else {
          setApplications(appsData || []);
        }

        const { data: admitData, error: admitError } = await supabase
          .from("admit_cards")
          .select("*, exams(title, exam_date, exam_time, duration_minutes, subjects, total_marks, exam_type, exam_pattern, instructions), exam_centers(center_name, center_code, address, city, state, pincode, reporting_time, gate_closing_time)")
          .eq("user_id", user.id);
        
        if (admitError) {
          console.error("Error fetching admit cards:", admitError);
        } else {
          setAdmitCards(admitData || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, profile]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const { data: admitData, error: admitError } = await supabase
        .from("admit_cards")
        .select("*, exams(title, exam_date, exam_time, duration_minutes, subjects, total_marks, exam_type, exam_pattern, instructions), exam_centers(center_name, center_code, address, city, state, pincode, reporting_time, gate_closing_time)")
        .eq("user_id", user?.id);
      
      if (admitError) {
        console.error("Error refreshing admit cards:", admitError);
        toast.error("Failed to refresh");
      } else {
        setAdmitCards(admitData || []);
        toast.success("Refreshed successfully!");
      }
    } catch (error) {
      console.error("Error refreshing:", error);
      toast.error("Failed to refresh");
    } finally {
      setRefreshing(false);
    }
  };

  const hasApplied = (examId: string) => applications.some(a => a.exam_id === examId);
  const getApplication = (examId: string) => applications.find(a => a.exam_id === examId);

  const sortedApplications = [...applications].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortBy === "submitted") return (b.is_submitted ? 1 : 0) - (a.is_submitted ? 1 : 0);
    if (sortBy === "pending") return (a.is_submitted ? 1 : 0) - (b.is_submitted ? 1 : 0);
    return 0;
  });

  const getGroupDisplay = (classValue: string) => {
    if (!classValue) return "Not Assigned";
    const groupDetails = getGroupDetails(classValue);
    if (groupDetails) {
      return `${groupDetails.label} (${groupDetails.classes})`;
    }
    return classValue;
  };

  const studentGroupDetails = getGroupDetails(profile?.class || "");

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <GovtHeader />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GovtHeader />

      <div className="bg-primary/5 border-b px-4 py-3">
        <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
              {profile?.photo_url ? (
                <img src={profile.photo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{profile?.full_name}</p>
              <p className="text-xs text-muted-foreground">
                {getGroupDisplay(profile?.class || "")} | {user?.email}
              </p>
              {profile?.class && (
                <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                  Group: {studentGroupDetails?.label} ({studentGroupDetails?.classes})
                </p>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="mr-1 h-3 w-3" /> Logout
          </Button>
        </div>
      </div>

      {exams.length > 0 && (
        <div className="bg-accent/10 border-b border-accent/20 px-4 py-2">
          <p className="container mx-auto text-xs text-center font-bold text-accent">
            📋 {exams.length} examination(s) available for {studentGroupDetails?.label || "your group"} — Apply before the last date!
          </p>
        </div>
      )}

      <div className="container mx-auto py-6 px-4">
        <Tabs defaultValue="exams">
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="exams"><BookOpen className="mr-1 h-4 w-4" /> Available Exams</TabsTrigger>
            <TabsTrigger value="applications"><FileText className="mr-1 h-4 w-4" /> My Applications ({applications.length})</TabsTrigger>
            <TabsTrigger value="admitcards"><CreditCard className="mr-1 h-4 w-4" /> Admit Cards ({admitCards.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="exams">
            {exams.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">
                    No examinations available for {studentGroupDetails?.label || "your group"} right now.
                  </p>
                  {profile?.class && studentGroupDetails && (
                    <div className="mt-4 p-3 bg-muted/30 rounded-md max-w-md mx-auto">
                      <p className="text-xs font-medium">Your Group Information:</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Group: {studentGroupDetails.label}<br />
                        Classes: {studentGroupDetails.classes}<br />
                        Description: {studentGroupDetails.description}
                      </p>
                    </div>
                  )}
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
                            <CardDescription>
                              {getGroupLabel(exam.class)} | {exam.academic_year || "2024-25"}
                            </CardDescription>
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
                            <span>Time: <strong>{exam.exam_time || "TBD"}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>Duration: <strong>{exam.duration_minutes || 180} min</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <IndianRupee className="h-3 w-3 text-muted-foreground" />
                            <span>Fee: <strong>₹{exam.fee_amount}</strong></span>
                          </div>
                        </div>
                        {exam.last_date_to_apply && (
                          <div className={`text-xs flex items-center gap-1 ${isExpired ? "text-destructive" : "text-accent"}`}>
                            <AlertCircle className="h-3 w-3" /> Last Date: {exam.last_date_to_apply} {isExpired ? "(Expired)" : ""}
                          </div>
                        )}
                        <Separator />
                        <div>
                          {app ? (
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2 flex-1">
                                <div className="w-24 bg-muted rounded-full h-2">
                                  <div className="bg-primary rounded-full h-2" style={{ width: `${(app.current_step / 6) * 100}%` }} />
                                </div>
                                <span className="text-xs text-muted-foreground">{app.current_step}/6</span>
                              </div>
                              {!app.is_submitted ? (
                                <Button size="sm" onClick={() => navigate(`/apply/${exam.id}`)}>Continue →</Button>
                              ) : (
                                <Button size="sm" variant="outline" onClick={() => setReceiptApp(app)}>
                                  <Eye className="h-3 w-3 mr-1" /> View Receipt
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
                  <p className="text-xs text-muted-foreground mt-2">Apply for available exams to get started.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-sm text-muted-foreground">Showing {applications.length} application(s)</p>
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[160px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="submitted">Submitted First</SelectItem>
                        <SelectItem value="pending">Pending First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-3">
                  {sortedApplications.map((app) => (
                    <Card key={app.id} className="overflow-hidden">
                      <div className={`h-1 ${app.is_submitted ? "bg-success" : "bg-accent"}`} />
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{(app.exams as any)?.title}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
                              <span>{getGroupLabel((app.exams as any)?.class)}</span>
                              <span>•</span>
                              <span>Fee: {app.fee_status === "paid" ? "✓ Paid" : "Pending"}</span>
                              <span>•</span>
                              <span>Progress: {app.current_step}/6</span>
                              {app.submitted_at && (
                                <>
                                  <span>•</span>
                                  <span>Submitted: {new Date(app.submitted_at).toLocaleDateString("en-IN")}</span>
                                </>
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                              App ID: {app.id.slice(0, 8).toUpperCase()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={app.is_submitted ? "default" : "outline"} 
                              className={app.is_submitted ? "bg-success text-success-foreground" : ""}
                            >
                              {app.is_submitted ? "✓ Submitted" : "In Progress"}
                            </Badge>
                            {app.is_submitted ? (
                              <Button size="sm" variant="outline" onClick={() => setReceiptApp(app)}>
                                <Eye className="h-3 w-3 mr-1" /> Receipt
                              </Button>
                            ) : (
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
              </div>
            )}
          </TabsContent>

          <TabsContent value="admitcards">
            {admitCards.length === 0 ? (
              <Card className="border-dashed border-2 border-accent/30">
                <CardContent className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                    <CreditCard className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Coming Soon!</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Admit cards will be available here once released by the examination authority.
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    Please check back after completing your application. You will be notified when your admit card is ready.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-6 gap-2"
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
                    {refreshing ? "Checking..." : "Check for Updates"}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <AdmitCardView admitCards={admitCards} profile={profile} />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!receiptApp} onOpenChange={() => setReceiptApp(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Confirmation Receipt</DialogTitle>
          </DialogHeader>
          {receiptApp && <ApplicationReceipt application={receiptApp} profile={profile} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}