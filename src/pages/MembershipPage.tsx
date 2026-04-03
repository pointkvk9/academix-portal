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
import { Users, IndianRupee, Crown, Star, CheckCircle, ChevronLeft, Upload } from "lucide-react";
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
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleJoin = async () => {
    if (!fullName || !email || !mobile || !gender) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    const plan = MEMBERSHIP_PLANS.find(p => p.type === selectedPlan)!;

    try {
      // Upload photo if provided
      let photoUrl = "";
      if (photoFile) {
        const ext = photoFile.name.split(".").pop();
        const path = `members/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("documents").upload(path, photoFile);
        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from("documents").getPublicUrl(path);
          photoUrl = urlData.publicUrl;
        }
      }

      // Create Razorpay order
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
          await supabase.from("members").insert({
            full_name: fullName, father_name: fatherName, email, mobile,
            gender, occupation, address, city, pincode,
            photo_url: photoUrl, member_type: selectedPlan,
            amount: plan.price, payment_status: "paid",
            razorpay_order_id: data.order_id,
            razorpay_payment_id: response.razorpay_payment_id,
          });
          setSuccess(true);
          fetchMembers();
          toast.success("Welcome to KVK Sanstha! 🎉");
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

  return (
    <div className="min-h-screen bg-background">
      <GovtHeader />
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 py-12 px-4">
        <div className="relative container mx-auto text-center max-w-2xl">
          <Crown className="h-12 w-12 text-accent mx-auto mb-4" />
          <h1 className="text-3xl md:text-5xl font-black text-primary-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Become a Member
          </h1>
          <p className="text-primary-foreground/80 text-sm md:text-base">
            Join KVK Sanstha and be part of our mission for community development.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8 px-4 max-w-5xl">
        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {MEMBERSHIP_PLANS.map(plan => (
            <Card key={plan.type} className={`cursor-pointer transition-all hover:shadow-xl ${selectedPlan === plan.type ? "ring-2 ring-primary border-primary" : ""}`} onClick={() => setSelectedPlan(plan.type)}>
              <CardContent className="p-6 text-center">
                {plan.type === "permanent" && <Badge className="bg-accent text-accent-foreground mb-3">Recommended</Badge>}
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  {plan.type === "annual" ? <Star className="h-8 w-8 text-primary" /> : <Crown className="h-8 w-8 text-accent" />}
                </div>
                <h3 className="text-xl font-bold mb-1">{plan.label}</h3>
                <p className="text-3xl font-black text-primary mb-1">₹{plan.price}</p>
                <p className="text-sm text-muted-foreground mb-4">{plan.duration}</p>
                <ul className="text-sm text-left space-y-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success flex-shrink-0" /> {f}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {!success ? (
          <Card className="border-t-4 border-t-primary shadow-lg">
            <CardHeader>
              <CardTitle>Member Registration Form</CardTitle>
              <CardDescription>Fill your details to become a {MEMBERSHIP_PLANS.find(p => p.type === selectedPlan)?.label}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" required />
                </div>
                <div className="space-y-2">
                  <Label>Father's Name</Label>
                  <Input value={fatherName} onChange={e => setFatherName(e.target.value)} placeholder="Father's name" />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
                </div>
                <div className="space-y-2">
                  <Label>Mobile *</Label>
                  <Input value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile" maxLength={10} required />
                </div>
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Occupation</Label>
                  <Input value={occupation} onChange={e => setOccupation(e.target.value)} placeholder="Your occupation" />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={city} onChange={e => setCity(e.target.value)} placeholder="Your city" />
                </div>
                <div className="space-y-2">
                  <Label>Pincode</Label>
                  <Input value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6-digit pincode" maxLength={6} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Address</Label>
                  <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Your full address" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Photo (Passport Size)</Label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-muted transition-colors">
                      <Upload className="h-4 w-4" /> Choose Photo
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                    </label>
                    {photoPreview && <img src={photoPreview} alt="Preview" className="w-16 h-16 rounded-md object-cover border" />}
                  </div>
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={handleJoin} disabled={loading}>
                {loading ? "Processing..." : `Pay ₹${MEMBERSHIP_PLANS.find(p => p.type === selectedPlan)?.price} & Join`}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="text-center p-8">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Welcome to KVK Sanstha! 🎉</h2>
            <p className="text-muted-foreground mb-4">Your membership has been activated successfully.</p>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
          </Card>
        )}

        {/* Members Display */}
        {members.length > 0 && (
          <section className="mt-12">
            <div className="text-center mb-6">
              <Badge className="bg-primary/10 text-primary mb-2">Our Members</Badge>
              <h2 className="text-2xl font-bold">Proud Members of KVK Sanstha</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {members.map(m => (
                <Card key={m.id} className="text-center hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden bg-primary/10 flex items-center justify-center">
                      {m.photo_url ? (
                        <img src={m.photo_url} alt={m.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    <h3 className="font-bold text-sm truncate">{m.full_name}</h3>
                    <p className="text-xs text-muted-foreground">{m.city || "Member"}</p>
                    <Badge variant="outline" className="mt-2 text-[10px]">
                      {m.member_type === "permanent" ? "Permanent" : "Annual"} Member
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
