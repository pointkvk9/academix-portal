import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GovtHeader } from "@/components/GovtHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Shield, UserPlus, LogIn, Eye, EyeOff, Info, Mail } from "lucide-react";
import { GROUPS } from "@/lib/groups";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register" | "verify">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [mobile, setMobile] = useState("");
  const [studentGroup, setStudentGroup] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  // LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Login successful!");
      navigate("/dashboard");
    }

    setLoading(false);
  };

  // REGISTER
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !studentGroup || !mobile || !gender) {
      toast.error("Please fill all required fields");
      return;
    }

    if (mobile.length !== 10) {
      toast.error("Mobile number must be 10 digits");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // IMPORTANT -> No email link redirect
        data: {
          full_name: fullName,
          father_name: fatherName,
          mobile: mobile,
          gender: gender,
          class: studentGroup,
        },
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("OTP sent to your email!");
      setMode("verify");
    }

    setLoading(false);
  };

  // VERIFY OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "signup",
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Email verified! Now login.");
      setMode("login");
      setOtp("");
    }

    setLoading(false);
  };

  // RESEND OTP
  const handleResendOtp = async () => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) toast.error(error.message);
    else toast.success("OTP resent to your email!");
  };

  return (
    <div className="min-h-screen bg-background">
      <GovtHeader />
      <div className="flex items-center justify-center py-8 px-4">
        <Card className="w-full max-w-lg shadow-lg border-t-4 border-t-primary">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-3 flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
              {mode === "verify" ? <Mail className="w-7 h-7 text-primary" /> : <Shield className="w-7 h-7 text-primary" />}
            </div>
            <CardTitle className="text-xl">
              {mode === "login" ? "Student / Admin Login" : mode === "register" ? "Student Registration" : "Verify Email OTP"}
            </CardTitle>
            <CardDescription>
              {mode === "verify"
                ? `Enter the 6-digit OTP sent to ${email}`
                : "Enter your credentials"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {mode === "verify" ? (
              <div className="space-y-4">
                <Label>Enter OTP</Label>
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                />

                <Button className="w-full" onClick={handleVerifyOtp}>
                  Verify OTP
                </Button>

                <div className="text-center">
                  <button onClick={handleResendOtp} className="text-primary">
                    Resend OTP
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-4">
                {mode === "register" && (
                  <>
                    <Input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    <Input placeholder="Father Name" value={fatherName} onChange={(e) => setFatherName(e.target.value)} />
                    <Input placeholder="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                  </>
                )}

                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <Button type="submit" className="w-full">
                  {mode === "login" ? "Login" : "Register & Get OTP"}
                </Button>
              </form>
            )}

            <div className="text-center mt-4">
              {mode === "login" ? (
                <button onClick={() => setMode("register")}>Register here</button>
              ) : (
                <button onClick={() => setMode("login")}>Already have account?</button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
