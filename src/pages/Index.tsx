import { GovtHeader } from "@/components/GovtHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, BookOpen, CreditCard, FileText, ArrowRight, Clock, Users, Award, CheckCircle2, Phone, Mail, Trophy, Star } from "lucide-react";
import { GROUPS } from "@/lib/groups";

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
      <div className="bg-accent/10 border-b border-accent/30 py-2 px-4">
        <div className="container mx-auto">
          <p className="text-xs text-center font-bold text-accent">
            📢 रजिस्ट्रेशन तिथी — 24 मार्च 2026 से 24 अप्रैल 2026 तक | Registration Open — Apply Now!
          </p>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative py-16 px-4">
          <div className="container mx-auto text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 rounded-full px-4 py-1.5 mb-6">
              <Trophy className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold text-primary-foreground">सामान्य ज्ञान प्रतियोगिता सन्‌ 2026-27</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight text-primary-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
              K.V.K Sanstha
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-2 font-medium">
              सामान्य ज्ञान प्रतियोगिता — ऑनलाइन परीक्षा पंजीकरण पोर्टल
            </p>
            <p className="text-sm text-primary-foreground/60 mb-8">
              परीक्षा शुल्क 50/रु मात्र | Secure & Transparent Examination System
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-base px-8" onClick={() => navigate("/auth")}>
                Student Login <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            <Button
  size="lg"
  variant="outline"
  className="border-primary-foreground/40 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/10 font-semibold"
  onClick={() => navigate("/auth")}
>
                नया पंजीकरण (New Registration)
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Prize Section */}
      <section className="py-8 px-4 border-b bg-accent/5">
        <div className="container mx-auto">
          <h3 className="text-center font-bold text-lg mb-4">🏆 पुरस्कार विवरण (Prize Details)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { place: "प्रथम पुरस्कार", amount: "₹3,001", color: "bg-accent text-accent-foreground", icon: "🥇" },
              { place: "द्वितीय पुरस्कार", amount: "₹2,001", color: "bg-muted text-foreground", icon: "🥈" },
              { place: "तृतीय पुरस्कार", amount: "₹1,001", color: "bg-primary/10 text-primary", icon: "🥉" },
            ].map((p, i) => (
              <Card key={i} className="text-center border-2 border-accent/20 hover:border-accent/50 transition-colors">
                <CardContent className="pt-6 pb-4">
                  <span className="text-3xl mb-2 block">{p.icon}</span>
                  <Badge className={p.color + " text-sm px-3 py-1 mb-2"}>{p.place}</Badge>
                  <p className="text-2xl font-black text-primary">{p.amount}</p>
                  <p className="text-xs text-muted-foreground mt-1">FOR ALL GROUPS</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm mt-4 text-muted-foreground">
            सांत्वना पुरस्कार — प्रत्येक ग्रुप में 11 नम्बर तक
          </p>
        </div>
      </section>

      {/* Groups */}
      <section className="py-10 px-4">
        <div className="container mx-auto">
          <h3 className="text-xl font-bold text-center mb-6">परीक्षा समूह (Examination Groups)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GROUPS.map((g, i) => (
              <Card key={i} className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-black text-primary">{i + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-base">{g.label}</h4>
                      <p className="text-sm text-primary font-semibold">{g.classes}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{g.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h3 className="text-xl font-bold text-center mb-2">कैसे आवेदन करें (How to Apply)</h3>
          <p className="text-sm text-muted-foreground text-center mb-8">Follow these simple steps to complete your exam registration</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: FileText, title: "1. पंजीकरण", desc: "Create your account with basic details and verify via email", color: "text-info" },
              { icon: BookOpen, title: "2. फॉर्म भरें", desc: "Complete the multi-step form with personal, education & document details", color: "text-primary" },
              { icon: CreditCard, title: "3. शुल्क भुगतान", desc: "Pay examination fee ₹50 securely through Razorpay", color: "text-accent" },
              { icon: CheckCircle2, title: "4. एडमिट कार्ड", desc: "Download your admit card with exam center and roll number", color: "text-success" },
            ].map((item, i) => (
              <Card key={i} className="text-center border-t-4 border-t-primary/30 hover:border-t-primary hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6 pb-4">
                  <div className="mx-auto mb-3 flex items-center justify-center w-14 h-14 rounded-full bg-primary/5">
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
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-3xl">
          <h3 className="text-xl font-bold text-center mb-6">महत्वपूर्ण निर्देश (Important Instructions)</h3>
          <div className="space-y-3">
            {[
              "Keep your email and mobile number active for OTP verification.",
              "Upload clear passport-size photo and signature in prescribed format.",
              "परीक्षा शुल्क 50/रु मात्र — Pay online only.",
              "Take a printout of your Admit Card and carry it to the exam center.",
              "Carry a valid government-issued photo ID along with Admit Card.",
              "Report at the exam center 30 minutes before the scheduled time.",
              "कक्षा 9-12 तक के सरकारी विद्यालय में पढ़ने वाले बच्चों को प्रथम पुरस्कार के स्थान पर एक वर्ष के लिए फिस ड्रेस व पुस्तक प्राप्त करने का विकल्प है।",
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
      <footer className="bg-primary text-primary-foreground py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h4 className="font-bold mb-2 text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>K.V.K Sanstha</h4>
              <p className="text-xs text-primary-foreground/70">आयोजक कर्ता — रविन्द्र कुमार (रवि पटेल)</p>
              <p className="text-xs text-primary-foreground/70">अध्यक्ष — संदीप कुमार पटेल</p>
              <p className="text-xs text-primary-foreground/70 mt-1">Director Of Sankalpbhoomi MFI Foundation</p>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-sm">Quick Links</h4>
              <ul className="text-xs text-primary-foreground/70 space-y-1">
                <li><button onClick={() => navigate("/auth")} className="hover:text-accent">Student Login</button></li>
                <li><button onClick={() => navigate("/auth")} className="hover:text-accent">New Registration</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-sm">Contact</h4>
              <div className="text-xs text-primary-foreground/70 space-y-1">
                <p className="flex items-center gap-1"><Phone className="h-3 w-3" /> 7651818346, 9695313984, 8840009334</p>
                <p className="flex items-center gap-1"><Mail className="h-3 w-3" /> info@kvksanstha.in</p>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-4 text-center text-xs text-primary-foreground/50">
            <p>© {new Date().getFullYear()} K.V.K Sanstha — www.kvksanstha.in. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
