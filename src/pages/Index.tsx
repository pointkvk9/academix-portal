import { GovtHeader } from "@/components/GovtHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, BookOpen, CreditCard, FileText, ArrowRight } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (!loading && user) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <GovtHeader />
      
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <Shield className="h-16 w-16 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold mb-3">National Examination Portal</h2>
          <p className="text-lg opacity-80 mb-6">
            Online Examination Registration, Application & Admit Card Portal
          </p>
          <div className="flex gap-3 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
              Student Login <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/20" onClick={() => navigate("/auth")}>
              New Registration
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h3 className="text-xl font-bold text-center mb-8">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: FileText, title: "Register", desc: "Create your account with basic details and verify via email OTP" },
              { icon: BookOpen, title: "Apply", desc: "Fill the application form step-by-step with all required details" },
              { icon: CreditCard, title: "Pay Fee", desc: "Pay examination fee securely through Razorpay payment gateway" },
              { icon: Shield, title: "Get Admit Card", desc: "Download your admit card with exam center details" },
            ].map((item, i) => (
              <Card key={i} className="text-center border-t-4 border-t-primary/30 hover:border-t-primary transition-colors">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-3 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t py-6 px-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} National Examination Portal. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
