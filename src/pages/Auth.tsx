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
import { Shield, UserPlus, LogIn, Eye, EyeOff, Info } from "lucide-react";
import { GROUPS } from "@/lib/groups";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [mobile, setMobile] = useState("");
  const [studentGroup, setStudentGroup] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      // Sign up the user with all data in metadata
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            full_name: fullName,
            father_name: fatherName,
            mobile: mobile,
            gender: gender,
            class: studentGroup
          },
        },
      });
      
      if (signUpError) {
        toast.error(signUpError.message);
        setLoading(false);
        return;
      }
      
      if (signUpData.user) {
        // Wait a bit for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast.success("Registration successful! You can now login.");
        setMode("login");
        // Clear form
        setEmail("");
        setPassword("");
        setFullName("");
        setFatherName("");
        setMobile("");
        setStudentGroup("");
        setGender("");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <GovtHeader />
      <div className="flex items-center justify-center py-8 px-4">
        <Card className="w-full max-w-lg shadow-lg border-t-4 border-t-primary">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-3 flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <CardTitle className="text-xl">
              {mode === "login" ? "Student / Admin Login" : "Student Registration (पंजीकरण)"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Enter your credentials to access the examination portal"
                : "Create your account to apply for examinations"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-4">
              {mode === "register" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name (पूरा नाम) *</Label>
                      <Input 
                        id="fullName" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)} 
                        placeholder="Enter full name" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fatherName">Father's Name (पिता का नाम)</Label>
                      <Input 
                        id="fatherName" 
                        value={fatherName} 
                        onChange={(e) => setFatherName(e.target.value)} 
                        placeholder="Father's name" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number *</Label>
                      <Input 
                        id="mobile" 
                        value={mobile} 
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} 
                        placeholder="10-digit mobile" 
                        required 
                        maxLength={10} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender (लिंग) *</Label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
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
                        <SelectTrigger>
                          <SelectValue placeholder="Select your group" />
                        </SelectTrigger>
                        <SelectContent>
                          {GROUPS.map((g) => (
                            <SelectItem key={g.value} value={g.value}>
                              {g.label} — {g.classes} ({g.description})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {studentGroup && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Selected: {GROUPS.find(g => g.value === studentGroup)?.label} ({GROUPS.find(g => g.value === studentGroup)?.classes})
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="bg-accent/10 border border-accent/30 rounded-md p-3 text-xs text-muted-foreground flex gap-2">
                    <Info className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Enter your name exactly as it appears on your school records. Select the group based on your current class.</span>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="your.email@example.com" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Minimum 6 characters" 
                    required 
                    minLength={6} 
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading} size="lg">
                {loading ? "Please wait..." : mode === "login" ? (
                  <><LogIn className="mr-2 h-4 w-4" /> Sign In</>
                ) : (
                  <><UserPlus className="mr-2 h-4 w-4" /> Register (पंजीकरण)</>
                )}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              {mode === "login" ? (
                <p>
                  Don't have an account?{" "}
                  <button onClick={() => setMode("register")} className="text-primary font-semibold hover:underline">
                    Register here
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button onClick={() => setMode("login")} className="text-primary font-semibold hover:underline">
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}