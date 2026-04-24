import { useState, useEffect } from "react";
import { GovtHeader } from "@/components/GovtHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Users, IndianRupee, Crown, Star, CheckCircle, ChevronLeft, Upload, Shield, Award, Calendar, MapPin, Briefcase, Phone, Mail, User, FileText, Sparkles, Heart, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const MEMBERSHIP_PLANS = [
  { type: "annual", label: "Annual Member", price: 500, duration: "1 Year", features: ["Member ID Card", "Annual Events Access", "Newsletter", "Voting Rights"] },
  { type: "permanent", label: "Permanent Member", price: 1000, duration: "Lifetime", features: ["Lifetime Member ID", "All Events Access", "Priority Support", "Voting Rights", "Special Recognition", "Certificate of Honor"] },
];

export default function MembershipPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>("annual");
  const [fullName, setFullName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [occupation, setOccupation] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    fetchMembers();
    return () => { document.body.removeChild(script); };
  }, []);

  const fetchMembers = async () => {
    const { data } = await supabase.from("members").select("*").eq("payment_status", "paid").order("created_at", { ascending: false });
    if (data) setMembers(data);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Photo size should be less than 2MB");
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleJoin = async () => {
    if (!fullName || !email || !mobile || !gender) {
      toast.error("Please fill all required fields");
      return;
    }
    if (mobile.length !== 10) {
      toast.error("Mobile number must be 10 digits");
      return;
    }
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLoading(true);
    const plan = MEMBERSHIP_PLANS.find(p => p.type === selectedPlan)!;

      try {
      let photoUrl = "";
      if (photoFile) {
          const ext = (photoFile.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
          const path = `members/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("documents").upload(path, photoFile);
        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from("documents").getPublicUrl(path);
          photoUrl = urlData.publicUrl;
        } else {
          toast.error("Photo upload failed, but you can continue without photo");
        }
      }

      const { data, error } = await supabase.functions.invoke("create-donation-order", {
        body: { amount: plan.price, name: fullName, email, mobile, purpose: `${plan.label} Membership`, type: "membership" },
      });
      if (error) throw error;

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: "INR",
        name: "KVK Sanstha",
        description: `${plan.label} Membership`,
        order_id: data.order_id,
        handler: async (response: any) => {
          try {
            const { error: insertError } = await supabase.from("members").insert({
              full_name: fullName, 
              father_name: fatherName, 
              email, 
              mobile,
              gender, 
              occupation, 
              address, 
              city, 
              pincode,
              photo_url: photoUrl, 
              member_type: selectedPlan,
              amount: plan.price, 
              payment_status: "paid",
              razorpay_order_id: data.order_id,
              razorpay_payment_id: response.razorpay_payment_id,
            });
            
            if (insertError) throw insertError;
            
            setSuccess(true);
            fetchMembers();
            toast.success("Welcome to KVK Sanstha! 🎉");
          } catch (insertErr: any) {
            toast.error(insertErr.message || "Failed to save membership details");
          }
        },
        prefill: { name: fullName, email, contact: mobile },
        theme: { color: "#991b1b" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const currentPlan = MEMBERSHIP_PLANS.find(p => p.type === selectedPlan)!;

  return (
    <div className="min-h-screen bg-background">
      <GovtHeader />
      
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-16 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <svg className="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="white" strokeWidth="0.5"/>
              <path d="M20,20 L80,20 L80,80 L20,80 Z" fill="none" stroke="white" strokeWidth="0.5"/>
            </svg>
          </div>
        </div>
        <div className="relative container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-primary-foreground text-sm font-medium">Join Our Family</span>
          </div>
          <Crown className="h-14 w-14 text-accent mx-auto mb-5 animate-bounce" />
          <h1 className="text-4xl md:text-6xl font-black text-primary-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Become a Member
          </h1>
          <p className="text-primary-foreground/90 text-base md:text-lg max-w-2xl mx-auto">
            Join KVK Sanstha and be part of our mission for community development and social welfare.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-12 px-4 max-w-6xl">
        {/* Plans Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="bg-primary/10 text-primary mb-3">Membership Plans</Badge>
            <h2 className="text-3xl font-bold mb-2">Choose Your Membership</h2>
            <p className="text-muted-foreground">Select the plan that best suits your commitment level</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {MEMBERSHIP_PLANS.map(plan => (
              <Card 
                key={plan.type} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  selectedPlan === plan.type 
                    ? "ring-2 ring-primary shadow-lg border-primary" 
                    : "hover:border-primary/50"
                }`} 
                onClick={() => setSelectedPlan(plan.type)}
              >
                <CardContent className="p-6">
                  <div className="relative">
                    {plan.type === "permanent" && (
                      <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground animate-pulse">
                        Most Popular
                      </Badge>
                    )}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      plan.type === "annual" ? "bg-primary/10" : "bg-accent/10"
                    }`}>
                      {plan.type === "annual" ? (
                        <Star className={`h-8 w-8 ${plan.type === "annual" ? "text-primary" : "text-accent"}`} />
                      ) : (
                        <Crown className={`h-8 w-8 ${plan.type === "annual" ? "text-primary" : "text-accent"}`} />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-center mb-2">{plan.label}</h3>
                    <div className="text-center mb-4">
                      <span className="text-4xl font-black text-primary">₹{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.duration === "Lifetime" ? "Lifetime" : "year"}</span>
                    </div>
                    <div className="space-y-3">
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className={`h-4 w-4 flex-shrink-0 ${plan.type === "annual" ? "text-primary" : "text-accent"}`} />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {!success ? (
          <Card className="border-t-4 border-t-primary shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="secondary" className="bg-accent/10 text-accent">{currentPlan.label}</Badge>
              </div>
              <CardTitle className="text-2xl">Member Registration Form</CardTitle>
              <CardDescription>
                Fill your details to become a {currentPlan.label} and pay ₹{currentPlan.price}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" /> Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    value={fullName} 
                    onChange={e => setFullName(e.target.value)} 
                    placeholder="Enter your full name" 
                    className="focus:ring-2 focus:ring-primary/20 transition-all"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" /> Father's Name
                  </Label>
                  <Input 
                    value={fatherName} 
                    onChange={e => setFatherName(e.target.value)} 
                    placeholder="Enter father's name"
                    className="focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" /> Email <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="your@email.com"
                    className="focus:ring-2 focus:ring-primary/20 transition-all"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" /> Mobile <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    value={mobile} 
                    onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} 
                    placeholder="10-digit mobile number" 
                    maxLength={10}
                    className="focus:ring-2 focus:ring-primary/20 transition-all"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Gender <span className="text-destructive">*</span></Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">👨 Male (पुरुष)</SelectItem>
                      <SelectItem value="female">👩 Female (महिला)</SelectItem>
                      <SelectItem value="other">👤 Other (अन्य)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" /> Occupation
                  </Label>
                  <Input 
                    value={occupation} 
                    onChange={e => setOccupation(e.target.value)} 
                    placeholder="Your occupation (Student, Service, Business, etc.)"
                    className="focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" /> City
                  </Label>
                  <Input 
                    value={city} 
                    onChange={e => setCity(e.target.value)} 
                    placeholder="Your city"
                    className="focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Pincode</Label>
                  <Input 
                    value={pincode} 
                    onChange={e => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))} 
                    placeholder="6-digit pincode" 
                    maxLength={6}
                    className="focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" /> Address
                  </Label>
                  <Input 
                    value={address} 
                    onChange={e => setAddress(e.target.value)} 
                    placeholder="Your complete address"
                    className="focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Upload className="h-4 w-4 text-primary" /> Photo (Passport Size)
                  </Label>
                  <div className="flex items-center gap-4 flex-wrap">
                    <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted transition-all group">
                      <Upload className="h-4 w-4 group-hover:scale-110 transition-transform" /> 
                      <span className="text-sm">Choose Photo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                    </label>
                    {photoPreview && (
                      <div className="relative group">
                        <img src={photoPreview} alt="Preview" className="w-20 h-20 rounded-lg object-cover border-2 border-primary shadow-md" />
                        <button
                          onClick={() => { setPhotoFile(null); setPhotoPreview(""); }}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">Max size: 2MB (JPG, PNG)</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Selected Plan:</span>
                  <Badge variant="default">{currentPlan.label}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Amount to Pay:</span>
                  <span className="text-2xl font-bold text-primary">₹{currentPlan.price}</span>
                </div>
              </div>
              
              <Button 
                className="w-full gap-2 group relative overflow-hidden" 
                size="lg" 
                onClick={handleJoin} 
                disabled={loading}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Crown className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      Pay ₹{currentPlan.price} & Become a Member
                    </>
                  )}
                </span>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="text-center p-12 shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/20 mb-6">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Welcome to KVK Sanstha! 🎉
            </h2>
            <p className="text-muted-foreground mb-2">Your membership has been activated successfully.</p>
            <p className="text-sm text-muted-foreground mb-6">You will receive your member ID card within 7-10 business days.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate("/")}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to Home
              </Button>
              <Button onClick={() => { setSuccess(false); setFullName(""); setFatherName(""); setEmail(""); setMobile(""); setGender(""); setOccupation(""); setAddress(""); setCity(""); setPincode(""); setPhotoFile(null); setPhotoPreview(""); }}>
                Register Another Member
              </Button>
            </div>
          </Card>
        )}

        {/* Members Display Section */}
        {members.length > 0 && (
          <section className="mt-16">
            <div className="text-center mb-8">
              <Badge variant="secondary" className="bg-primary/10 text-primary mb-3">Our Community</Badge>
              <h2 className="text-3xl font-bold mb-2">Proud Members of KVK Sanstha</h2>
              <p className="text-muted-foreground">Join our growing family of dedicated members</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {members.slice(0, 10).map(m => (
                <Card key={m.id} className="text-center hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                  <CardContent className="p-4">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full mx-auto mb-3 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/20 group-hover:border-primary transition-all">
                        {m.photo_url ? (
                          <img src={m.photo_url} alt={m.full_name} className="w-full h-full object-cover" />
                        ) : (
                          <Users className="h-10 w-10 text-primary" />
                        )}
                      </div>
                      {m.member_type === "permanent" && (
                        <div className="absolute -top-1 -right-1">
                          <Crown className="h-5 w-5 text-accent" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-sm truncate" title={m.full_name}>{m.full_name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{m.city || "Member"}</p>
                    <Badge variant="outline" className="mt-2 text-[10px]">
                      {m.member_type === "permanent" ? "Permanent" : "Annual"}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
            {members.length > 10 && (
              <div className="text-center mt-6">
                <Button variant="outline" onClick={() => toast.info("View all members feature coming soon!")}>
                  View All {members.length} Members
                </Button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
