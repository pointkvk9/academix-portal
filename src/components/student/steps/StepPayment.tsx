import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CreditCard, CheckCircle, IndianRupee } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Props {
  application: any;
  exam: any;
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export function StepPayment({ application, exam, onPaymentSuccess, onBack }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    // Create Razorpay order via edge function
    const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
      body: {
        amount: exam.fee_amount,
        application_id: application.id,
      },
    });

    if (error || !data?.order_id) {
      toast.error("Failed to create payment order. Please try again.");
      setLoading(false);
      return;
    }

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Failed to load payment gateway");
      setLoading(false);
      return;
    }

    const options = {
      key: data.key_id,
      amount: data.amount,
      currency: "INR",
      name: "National Examination Portal",
      description: `Fee for ${exam.title}`,
      order_id: data.order_id,
      handler: async (response: any) => {
        // Verify payment
        const { error: verifyError } = await supabase.functions.invoke("verify-razorpay-payment", {
          body: {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            application_id: application.id,
          },
        });
        if (verifyError) {
          toast.error("Payment verification failed");
        } else {
          toast.success("Payment successful!");
          onPaymentSuccess();
        }
      },
      prefill: {
        email: user?.email,
      },
      theme: {
        color: "#1e3a5f",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", () => {
      toast.error("Payment failed. Please try again.");
    });
    rzp.open();
    setLoading(false);
  };

  if (application.fee_status === "paid") {
    return (
      <div className="text-center py-8 space-y-4">
        <CheckCircle className="h-16 w-16 text-success mx-auto" />
        <h3 className="text-lg font-semibold">Payment Successful!</h3>
        <p className="text-muted-foreground">Your application fee has been paid. Your application has been submitted.</p>
        <Badge className="bg-success text-success-foreground">Fee Paid — ₹{exam.fee_amount}</Badge>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Payment Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Examination:</span><span className="font-medium">{exam.title}</span></div>
            <div className="flex justify-between"><span>Class:</span><span>Class {exam.class}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2"><span className="font-semibold">Total Fee:</span><span className="font-bold text-lg text-primary">₹{exam.fee_amount}</span></div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-warning/10 border border-warning/30 rounded-md p-4 text-sm">
        <p className="font-semibold mb-1">Important:</p>
        <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
          <li>Fees once paid are non-refundable.</li>
          <li>After payment, your application will be automatically submitted.</li>
          <li>Keep the payment receipt for your records.</li>
        </ul>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>← Back</Button>
        <Button onClick={handlePayment} disabled={loading} size="lg">
          <IndianRupee className="h-4 w-4 mr-1" />
          {loading ? "Processing..." : `Pay ₹${exam.fee_amount}`}
        </Button>
      </div>
    </div>
  );
}
