import { useState, useEffect } from "react";
import { GovtHeader } from "@/components/GovtHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Heart, IndianRupee, Award, Shield, ChevronLeft, CheckCircle, TrendingUp, Users, GraduationCap, Building2, Clock, Sparkles, HandHeart, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DonationCertificate } from "@/components/DonationCertificate";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function DonationPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("General Donation");
  const [loading, setLoading] = useState(false);
  const [donationComplete, setDonationComplete] = useState(false);
  const [donationData, setDonationData] = useState<any>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const presetAmounts = [100, 251, 501, 1001, 2001, 5001];

  const handleDonate = async () => {
    if (!name || !email || !amount || Number(amount) < 1) {
      toast.error("Please fill name, email and a valid amount");
      return;
    }
    setLoading(true);
    try {
      if (!window.Razorpay) {
        throw new Error("Payment gateway is still loading. Please try again in a moment.");
      }

      const { data, error } = await supabase.functions.invoke("create-donation-order", {
        body: { amount: Number(amount), name, email, mobile, purpose, type: "donation" },
      });
      if (error) throw error;

      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: "INR",
        name: "KVK Sanstha",
        description: purpose,
        order_id: data.order_id,
        handler: async (response: any) => {
          try {
            const donation = {
              name,
              email,
              mobile,
              amount: Number(amount),
              order_id: data.order_id,
              payment_id: response.razorpay_payment_id,
              donor_address: address,
              donor_city: city,
              purpose,
            };

            const { data: savedDonation, error: saveError } = await supabase
              .from("donations")
              .insert(donation)
              .select()
              .single();

            if (saveError) throw saveError;

            setDonationData(savedDonation ?? { ...donation, created_at: new Date().toISOString() });
            setDonationComplete(true);
            toast.success("Donation successful! Thank you for your generosity 🙏");
          } catch (saveError: any) {
            toast.error(saveError.message || "Donation saved nahi ho paya, please contact admin.");
          }
        },
        prefill: { name, email, contact: mobile },
        theme: { color: `hsl(${primaryColor})` },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (donationComplete && donationData) {
    return (
      <div className="min-h-screen bg-background">
        <GovtHeader />
        <div className="container mx-auto py-12 px-4 max-w-4xl">
          <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/20 mb-4">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Thank You for Your Donation!
            </h2>
            <p className="text-muted-foreground mt-2">Your generosity makes a real difference in someone's life.</p>
          </div>
          <DonationCertificate donation={donationData} />
          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
              <ChevronLeft className="h-4 w-4" /> Home
            </Button>
            <Button onClick={() => { setDonationComplete(false); setDonationData(null); setAmount(""); }} className="gap-2">
              <Heart className="h-4 w-4" /> Donate Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GovtHeader />
      
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-16 px-4">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="relative container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
            <span className="text-primary-foreground text-sm font-medium">Support a Cause</span>
          </div>
          <Heart className="h-14 w-14 text-accent mx-auto mb-5 animate-bounce" />
          <h1 className="text-4xl md:text-6xl font-black text-primary-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Make a Difference
          </h1>
          <p className="text-primary-foreground/90 text-base md:text-lg max-w-2xl mx-auto">
            Your contribution transforms lives. Join us in building a better tomorrow for communities in need.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form - Takes 2/3 of space on desktop */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress/Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <HandHeart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">500+</p>
                      <p className="text-xs text-muted-foreground">Donors</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-accent">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <TrendingUp className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-accent">25L+</p>
                      <p className="text-xs text-muted-foreground">Raised</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-success">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-success/10">
                      <Users className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-success">1000+</p>
                      <p className="text-xs text-muted-foreground">Lives Impacted</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-warning">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-warning/10">
                      <Clock className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-warning">24/7</p>
                      <p className="text-xs text-muted-foreground">Support</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Donation Form */}
            <Card className="border-t-4 border-t-primary shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <IndianRupee className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="bg-accent/10 text-accent">Secure Payment</Badge>
                </div>
                <CardTitle className="text-2xl">Donation Details</CardTitle>
                <CardDescription>Fill in your information to complete the donation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Full Name <span className="text-destructive">*</span></Label>
                    <Input 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      placeholder="Enter your full name" 
                      className="focus:ring-2 focus:ring-primary/20 transition-all"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Email <span className="text-destructive">*</span></Label>
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
                    <Label className="text-sm font-semibold">Mobile Number</Label>
                    <Input 
                      value={mobile} 
                      onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} 
                      placeholder="10-digit mobile number" 
                      maxLength={10}
                      className="focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">City</Label>
                    <Input 
                      value={city} 
                      onChange={e => setCity(e.target.value)} 
                      placeholder="Your city"
                      className="focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Address (Optional)</Label>
                  <Textarea 
                    value={address} 
                    onChange={e => setAddress(e.target.value)} 
                    placeholder="Your complete address" 
                    rows={2}
                    className="focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Select Purpose</Label>
                  <Select value={purpose} onValueChange={setPurpose}>
                    <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General Donation">🌟 General Donation</SelectItem>
                      <SelectItem value="Education Fund">📚 Education Fund (शिक्षा कोष)</SelectItem>
                      <SelectItem value="Rural Development">🏡 Rural Development (ग्राम विकास)</SelectItem>
                      <SelectItem value="Women Empowerment">👩 Women Empowerment (महिला सशक्तिकरण)</SelectItem>
                      <SelectItem value="Healthcare">🏥 Healthcare (स्वास्थ्य सेवा)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Select Amount <span className="text-destructive">*</span></Label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {presetAmounts.map(a => (
                      <Button 
                        key={a} 
                        type="button" 
                        variant={amount === String(a) ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setAmount(String(a))}
                        className={`transition-all ${amount === String(a) ? 'scale-105 shadow-md' : ''}`}
                      >
                        ₹{a}
                      </Button>
                    ))}
                  </div>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="number" 
                      value={amount} 
                      onChange={e => setAmount(e.target.value)} 
                      placeholder="Enter custom amount" 
                      min={1}
                      className="pl-8 focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full gap-2 group relative overflow-hidden" 
                  size="lg" 
                  onClick={handleDonate} 
                  disabled={loading}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2">
                    {loading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        Donate ₹{amount || "0"} via Razorpay
                      </>
                    )}
                  </span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Takes 1/3 of space */}
          <div className="space-y-6">
            {/* Certificate Card */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
              <CardContent className="p-6 text-center relative">
                <div className="inline-flex p-3 rounded-full bg-primary/20 mb-4">
                  <Receipt className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Donation Certificate</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Receive an official certificate with sign & seal after successful donation
                </p>
                <Badge variant="outline" className="bg-background/50">Tax Exemption Available</Badge>
              </CardContent>
            </Card>

            {/* Security Card */}
            <Card className="bg-success/5 border-success/20 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="inline-flex p-3 rounded-full bg-success/20 mb-4">
                  <Shield className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-bold text-lg mb-2">100% Secure Payments</h3>
                <p className="text-sm text-muted-foreground">
                  Payments powered by Razorpay with bank-grade security & encryption
                </p>
              </CardContent>
            </Card>

            {/* Impact Card */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  Why Donate?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-3">
                  {[
                    { icon: GraduationCap, text: "Support education for underprivileged children", color: "primary" },
                    { icon: Building2, text: "Fund rural development programs", color: "accent" },
                    { icon: Users, text: "Empower women through skill training", color: "success" },
                    { icon: Heart, text: "Community healthcare initiatives", color: "warning" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 group hover:translate-x-1 transition-transform">
                      <div className={`p-1.5 rounded-lg bg-${item.color}/10 shrink-0 group-hover:scale-110 transition-transform`}>
                        <item.icon className={`h-4 w-4 text-${item.color}`} />
                      </div>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quote Card */}
            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="p-5">
                <p className="text-sm italic text-center text-muted-foreground">
                  "The best way to find yourself is to lose yourself in the service of others."
                </p>
                <p className="text-xs text-center text-accent mt-2">— Mahatma Gandhi</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
