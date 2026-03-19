import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { GovtHeader } from "@/components/GovtHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Circle } from "lucide-react";
import { StepPersonalDetails } from "@/components/student/steps/StepPersonalDetails";
import { StepAddress } from "@/components/student/steps/StepAddress";
import { StepEducation } from "@/components/student/steps/StepEducation";
import { StepSubjects } from "@/components/student/steps/StepSubjects";
import { StepDocuments } from "@/components/student/steps/StepDocuments";
import { StepPayment } from "@/components/student/steps/StepPayment";
import { toast } from "sonner";

const STEPS = [
  { label: "Personal Details", num: 1 },
  { label: "Address", num: 2 },
  { label: "Education", num: 3 },
  { label: "Subjects", num: 4 },
  { label: "Documents", num: 5 },
  { label: "Fee Payment", num: 6 },
];

export default function ExamApplicationForm() {
  const { examId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exam, setExam] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId || !user) return;
    Promise.all([
      supabase.from("exams").select("*").eq("id", examId).single(),
      supabase.from("exam_applications").select("*").eq("exam_id", examId).eq("user_id", user.id).maybeSingle(),
    ]).then(([{ data: examData }, { data: appData }]) => {
      setExam(examData);
      if (appData) {
        setApplication(appData);
        setCurrentStep(appData.current_step);
      }
      setLoading(false);
    });
  }, [examId, user]);

  const createApplication = async () => {
    if (!user || !examId) return;
    const { data, error } = await supabase.from("exam_applications").insert({
      user_id: user.id,
      exam_id: examId,
      current_step: 1,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    setApplication(data);
  };

  const updateApplication = async (updates: any, nextStep: number) => {
    if (!application) return;
    const { data, error } = await supabase.from("exam_applications")
      .update({ ...updates, current_step: nextStep })
      .eq("id", application.id)
      .select().single();
    if (error) { toast.error(error.message); return; }
    setApplication(data);
    setCurrentStep(nextStep);
  };

  const handleSubmit = async () => {
    if (!application) return;
    await supabase.from("exam_applications").update({
      is_submitted: true,
      submitted_at: new Date().toISOString(),
    }).eq("id", application.id);
    toast.success("Application submitted successfully!");
    navigate("/dashboard");
  };

  if (loading) return <div className="min-h-screen bg-background"><GovtHeader /><p className="text-center py-12">Loading...</p></div>;
  if (!exam) return <div className="min-h-screen bg-background"><GovtHeader /><p className="text-center py-12">Exam not found</p></div>;

  // If no application exists, create one
  if (!application) {
    createApplication();
    return <div className="min-h-screen bg-background"><GovtHeader /><p className="text-center py-12">Initializing application...</p></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <GovtHeader />
      <div className="bg-primary/5 border-b px-4 py-2">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm font-medium">{exam.title} — Application Form</p>
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>← Back to Dashboard</Button>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4 max-w-3xl">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
          {STEPS.map((step, i) => (
            <div key={step.num} className="flex items-center">
              <div className="flex flex-col items-center min-w-[60px]">
                <div className={`step-indicator ${currentStep > step.num ? "step-completed" : currentStep === step.num ? "step-active" : "step-inactive"}`}>
                  {currentStep > step.num ? <Check className="h-4 w-4" /> : step.num}
                </div>
                <span className={`text-xs mt-1 text-center ${currentStep === step.num ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-8 mx-1 ${currentStep > step.num ? "bg-success" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <Card className="border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="text-lg">Step {currentStep}: {STEPS[currentStep - 1].label}</CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <StepPersonalDetails
                data={application.personal_details as any || {}}
                onNext={(data) => updateApplication({ personal_details: data }, 2)}
              />
            )}
            {currentStep === 2 && (
              <StepAddress
                data={application.address_details as any || {}}
                onNext={(data) => updateApplication({ address_details: data }, 3)}
                onBack={() => setCurrentStep(1)}
              />
            )}
            {currentStep === 3 && (
              <StepEducation
                data={application.education_details as any || {}}
                onNext={(data) => updateApplication({ education_details: data }, 4)}
                onBack={() => setCurrentStep(2)}
              />
            )}
            {currentStep === 4 && (
              <StepSubjects
                subjects={(exam.subjects as string[]) || []}
                selected={application.selected_subjects as string[] || []}
                onNext={(data) => updateApplication({ selected_subjects: data }, 5)}
                onBack={() => setCurrentStep(3)}
              />
            )}
            {currentStep === 5 && (
              <StepDocuments
                data={application.documents as any || {}}
                applicationId={application.id}
                onNext={(data) => updateApplication({ documents: data }, 6)}
                onBack={() => setCurrentStep(4)}
              />
            )}
            {currentStep === 6 && (
              <StepPayment
                application={application}
                exam={exam}
                onPaymentSuccess={() => {
                  updateApplication({ fee_status: "paid" }, 6);
                  handleSubmit();
                }}
                onBack={() => setCurrentStep(5)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
