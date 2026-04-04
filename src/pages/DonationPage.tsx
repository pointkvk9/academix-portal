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
import { Heart, IndianRupee, Award, Shield, ChevronLeft, CheckCircle } from "lucide-react";
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
        <div className="container mx-auto py-8 px-4 max-w-3xl">
          <div className="text-center mb-6">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-3" />
            <h2 className="text-2xl font-bold">Thank You for Your Donation! 🙏</h2>
            <p className="text-muted-foreground">Your generosity makes a real difference.</p>
          </div>
          <DonationCertificate donation={donationData} />
          <div className="flex justify-center gap-3 mt-6">
            <Button variant="outline" onClick={() => navigate("/")}><ChevronLeft className="mr-1 h-4 w-4" /> Home</Button>
            <Button onClick={() => { setDonationComplete(false); setDonationData(null); setAmount(""); }}>
              <Heart className="mr-1 h-4 w-4" /> Donate Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GovtHeader />
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 py-12 px-4">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 3.33l6.67 13.34L40 20l-13.33 3.33L20 36.67l-6.67-13.34L0 20l13.33-3.33z' fill='%23fff' fill-opacity='0.3'/%3E%3C/svg%3E\")" }} />
        <div className="relative container mx-auto text-center max-w-2xl">
          <Heart className="h-12 w-12 text-accent mx-auto mb-4 animate-pulse" />
          <h1 className="text-3xl md:text-5xl font-black text-primary-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Make a Donation
          </h1>
          <p className="text-primary-foreground/80 text-sm md:text-base">
            Your contribution supports rural development, education & community welfare.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Form */}
          <div className="md:col-span-2">
            <Card className="border-t-4 border-t-primary shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-primary" /> Donation Details
                </CardTitle>
                <CardDescription>Fill your details and donate via Razorpay</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Mobile</Label>
                    <Input value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile" maxLength={10} />
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input value={city} onChange={e => setCity(e.target.value)} placeholder="Your city" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Your address (optional)" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>Purpose</Label>
                  <Select value={purpose} onValueChange={setPurpose}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General Donation">General Donation</SelectItem>
                      <SelectItem value="Education Fund">Education Fund (शिक्षा कोष)</SelectItem>
                      <SelectItem value="Rural Development">Rural Development (ग्राम विकास)</SelectItem>
                      <SelectItem value="Women Empowerment">Women Empowerment (महिला सशक्तिकरण)</SelectItem>
                      <SelectItem value="Healthcare">Healthcare (स्वास्थ्य सेवा)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount (₹) *</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {presetAmounts.map(a => (
                      <Button key={a} type="button" variant={amount === String(a) ? "default" : "outline"} size="sm" onClick={() => setAmount(String(a))}>
                        ₹{a}
                      </Button>
                    ))}
                  </div>
                  <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter custom amount" min={1} />
                </div>
                <Button className="w-full" size="lg" onClick={handleDonate} disabled={loading}>
                  {loading ? "Processing..." : `Donate ₹${amount || "0"} via Razorpay`}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="bg-primary/5">
              <CardContent className="p-4 text-center">
                <Award className="h-10 w-10 text-accent mx-auto mb-2" />
                <h3 className="font-bold text-sm mb-1">Donation Certificate</h3>
                <p className="text-xs text-muted-foreground">Receive an official certificate with sign & seal after donation</p>
              </CardContent>
            </Card>
            <Card className="bg-success/5">
              <CardContent className="p-4 text-center">
                <Shield className="h-10 w-10 text-success mx-auto mb-2" />
                <h3 className="font-bold text-sm mb-1">100% Secure</h3>
                <p className="text-xs text-muted-foreground">Payments powered by Razorpay with bank-grade security</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-bold text-sm mb-2">Why Donate?</h3>
                <ul className="text-xs text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2"><CheckCircle className="h-3 w-3 text-success mt-0.5 flex-shrink-0" /> Support education for underprivileged children</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-3 w-3 text-success mt-0.5 flex-shrink-0" /> Fund rural development programs</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-3 w-3 text-success mt-0.5 flex-shrink-0" /> Empower women through skill training</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-3 w-3 text-success mt-0.5 flex-shrink-0" /> Community healthcare initiatives</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
