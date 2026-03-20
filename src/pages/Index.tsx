import { GovtHeader } from "@/components/GovtHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, BookOpen, CreditCard, FileText, ArrowRight, Clock, Users, Award, CheckCircle2, Phone, Mail } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <GovtHeader />
      
      {/* Notification Bar */}
      <div className="bg-warning/10 border-b border-warning/30 py-2 px-4">
        <div className="container mx-auto">
          <p className="text-xs text-center font-medium text-warning animate-pulse">
            📢 New Exam Registrations Open — Apply before the last date!
          </p>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-foreground/10 mb-6">
            <Shield className="h-10 w-10" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
            National Examination Portal
          </h2>
          <p className="text-lg opacity-80 mb-2">
            Online Examination Registration, Application & Admit Card Portal
          </p>
          <p className="text-sm opacity-60 mb-8">
            Govt. of India Initiative — Secure & Transparent Examination System
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button size="lg" variant="secondary" onClick={() => navigate("/auth")} className="font-semibold">
              Student Login <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 font-semibold" onClick={() => navigate("/auth")}>
              New Registration
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 px-4 border-b bg-card">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { num: "50+", label: "Exams Conducted", icon: BookOpen },
            { num: "1,00,000+", label: "Students Registered", icon: Users },
            { num: "500+", label: "Exam Centers", icon: Award },
            { num: "24/7", label: "Support Available", icon: Clock },
          ].map((s, i) => (
            <div key={i} className="py-3">
              <s.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-primary">{s.num}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h3 className="text-xl font-bold text-center mb-2">How It Works</h3>
          <p className="text-sm text-muted-foreground text-center mb-8">Follow these simple steps to complete your exam registration</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: FileText, title: "1. Register", desc: "Create your account with basic details and verify via email OTP", color: "text-info" },
              { icon: BookOpen, title: "2. Fill Application", desc: "Complete the multi-step form with personal, education, and document details", color: "text-primary" },
              { icon: CreditCard, title: "3. Pay Fee", desc: "Pay examination fee securely through Razorpay payment gateway", color: "text-warning" },
              { icon: CheckCircle2, title: "4. Get Admit Card", desc: "Download your admit card with exam center and roll number details", color: "text-success" },
            ].map((item, i) => (
              <Card key={i} className="text-center border-t-4 border-t-primary/30 hover:border-t-primary hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6 pb-4">
                  <div className={`mx-auto mb-3 flex items-center justify-center w-14 h-14 rounded-full bg-primary/5`}>
                    <item.icon className={`h-7 w-7 ${item.color}`} />
                  </div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Important Info */}
      <section className="py-10 px-4 bg-muted/50">
        <div className="container mx-auto max-w-3xl">
          <h3 className="text-xl font-bold text-center mb-6">Important Instructions</h3>
          <div className="space-y-3">
            {[
              "Keep your email and mobile number active for OTP verification.",
              "Upload clear passport-size photo and signature in prescribed format.",
              "Pay the exam fee online only — no offline payments accepted.",
              "Take a printout of your Admit Card and carry it to the exam center.",
              "Carry a valid government-issued photo ID along with Admit Card.",
              "Report at the exam center 30 minutes before the scheduled time.",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3 bg-card p-3 rounded-md border">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">{i + 1}</span>
                <p className="text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-2 text-sm">National Examination Portal</h4>
              <p className="text-xs text-muted-foreground">A Government of India Initiative for transparent and efficient examination management across the country.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm">Quick Links</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li><button onClick={() => navigate("/auth")} className="hover:text-primary">Student Login</button></li>
                <li><button onClick={() => navigate("/auth")} className="hover:text-primary">New Registration</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm">Contact</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="flex items-center gap-1"><Phone className="h-3 w-3" /> Helpline: 1800-XXX-XXXX</p>
                <p className="flex items-center gap-1"><Mail className="h-3 w-3" /> support@examportal.gov.in</p>
              </div>
            </div>
          </div>
          <div className="border-t pt-4 text-center text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} National Examination Portal. All Rights Reserved.</p>
            <p className="mt-1">Designed & Developed under Digital India Programme</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
