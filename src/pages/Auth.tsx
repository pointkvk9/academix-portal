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
  const [pendingRegistration, setPendingRegistration] = useState<{
    fullName: string;
    fatherName: string;
    mobile: string;
    studentGroup: string;
    gender: string;
    password: string;
  } | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Login successful!");
      navigate("/dashboard");
    }
    setLoading(false);
  };

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
    
    try {
      const registrationMetadata = {
        full_name: fullName,
        father_name: fatherName,
        mobile,
        gender,
        class: studentGroup,
      };

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          data: registrationMetadata,
        },
      });
      
      if (otpError) {
        toast.error(otpError.message);
        setLoading(false);
        return;
      }

      setPendingRegistration({
        fullName,
        fatherName,
        mobile,
        studentGroup,
        gender,
        password,
      });
      setMode("verify");
      toast.success("OTP sent to your email! Please check your inbox.");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }
    if (!pendingRegistration) {
      toast.error("Please register again to receive a fresh OTP.");
      setMode("register");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });
      if (error) {
        toast.error(error.message);
      } else {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: pendingRegistration.password,
          data: {
            full_name: pendingRegistration.fullName,
            father_name: pendingRegistration.fatherName,
            mobile: pendingRegistration.mobile,
            gender: pendingRegistration.gender,
            class: pendingRegistration.studentGroup,
          },
        });

        if (passwordError) {
          toast.error(passwordError.message);
          return;
        }

        if (data.user) {
          const { data: existingProfile } = await supabase
            .from("profiles")
            .select("id")
            .eq("user_id", data.user.id)
            .maybeSingle();

          const profilePayload = {
            user_id: data.user.id,
            email,
            full_name: pendingRegistration.fullName,
            father_name: pendingRegistration.fatherName,
            mobile: pendingRegistration.mobile,
            gender: pendingRegistration.gender,
            class: pendingRegistration.studentGroup,
            updated_at: new Date().toISOString(),
          };

          if (existingProfile?.id) {
            await supabase.from("profiles").update(profilePayload).eq("id", existingProfile.id);
          } else {
            await supabase.from("profiles").insert(profilePayload as any);
          }
        }

        toast.success("Email verified successfully!");
        setOtp("");
        setFullName("");
        setFatherName("");
        setMobile("");
        setStudentGroup("");
        setGender("");
        setPassword("");
        setPendingRegistration(null);
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        data: pendingRegistration
          ? {
              full_name: pendingRegistration.fullName,
              father_name: pendingRegistration.fatherName,
              mobile: pendingRegistration.mobile,
              gender: pendingRegistration.gender,
              class: pendingRegistration.studentGroup,
            }
          : undefined,
      },
    });
    if (error) toast.error(error.message);
    else toast.success("OTP resent to your email!");
    setLoading(false);
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
              {mode === "login" ? "Student / Admin Login" : mode === "register" ? "Student Registration (पंजीकरण)" : "Verify Email (OTP)"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Enter your credentials to access the examination portal"
                : mode === "register"
                ? "Create your account to apply for examinations"
                : `Enter the 6-digit OTP sent to ${email}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mode === "verify" ? (
              <div className="space-y-4">
                <div className="bg-info/10 border border-info/30 rounded-md p-4 text-center">
                  <Mail className="h-8 w-8 text-info mx-auto mb-2" />
                  <p className="text-sm font-medium">OTP sent to <span className="text-primary font-bold">{email}</span></p>
                  <p className="text-xs text-muted-foreground mt-1">Check your inbox and enter the 6-digit code sent for verification</p>
                </div>
                <div className="space-y-2">
                  <Label>Enter OTP *</Label>
                  <Input 
                    value={otp} 
                    onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} 
                    placeholder="Enter 6-digit OTP" 
                    maxLength={6}
                    className="text-center text-2xl tracking-[0.5em] font-bold"
                  />
                </div>
                <Button className="w-full" size="lg" onClick={handleVerifyOtp} disabled={loading}>
                  {loading ? "Verifying..." : "Verify OTP & Complete Registration"}
                </Button>
                <div className="text-center text-sm">
                  <button onClick={handleResendOtp} disabled={loading} className="text-primary font-semibold hover:underline">
                    Resend OTP
                  </button>
                  <span className="mx-2 text-muted-foreground">|</span>
                  <button onClick={() => setMode("register")} className="text-muted-foreground hover:underline">
                    Back to Registration
                  </button>
                </div>
              </div>
            ) : (
              <>
                <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-4">
                  {mode === "register" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name (पूरा नाम) *</Label>
                          <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter full name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fatherName">Father's Name (पिता का नाम)</Label>
                          <Input id="fatherName" value={fatherName} onChange={e => setFatherName(e.target.value)} placeholder="Father's name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mobile">Mobile Number *</Label>
                          <Input id="mobile" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile" required maxLength={10} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender (लिंग) *</Label>
                          <Select value={gender} onValueChange={setGender}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male (पुरुष)</SelectItem>
                              <SelectItem value="female">Female (महिला)</SelectItem>
                              <SelectItem value="other">Other (अन्य)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label htmlFor="group">Group (समूह) *</Label>
                          <Select value={studentGroup} onValueChange={setStudentGroup}>
                            <SelectTrigger><SelectValue placeholder="Select your group" /></SelectTrigger>
                            <SelectContent>
                              {GROUPS.map(g => (
                                <SelectItem key={g.value} value={g.value}>
                                  {g.label} — {g.classes} ({g.description})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {studentGroup && (
                            <p className="text-xs text-success mt-1">
                              ✓ Selected: {GROUPS.find(g => g.value === studentGroup)?.label} ({GROUPS.find(g => g.value === studentGroup)?.classes})
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="bg-accent/10 border border-accent/30 rounded-md p-3 text-xs text-muted-foreground flex gap-2">
                        <Info className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>After registration, a 6-digit OTP will be sent to your email for verification.</span>
                      </div>
                    </>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your.email@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 characters" required minLength={6} />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading} size="lg">
                    {loading ? "Please wait..." : mode === "login" ? (
                      <><LogIn className="mr-2 h-4 w-4" /> Sign In</>
                    ) : (
                      <><UserPlus className="mr-2 h-4 w-4" /> Register & Get OTP</>
                    )}
                  </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                  {mode === "login" ? (
                    <p>
                      Don't have an account?{" "}
                      <button onClick={() => setMode("register")} className="text-primary font-semibold hover:underline">Register here</button>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{" "}
                      <button onClick={() => setMode("login")} className="text-primary font-semibold hover:underline">Sign in</button>
                    </p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
