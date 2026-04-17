const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { email, password, fullName } = await req.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.log("[send-credentials] RESEND_API_KEY missing — skipping email");
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #b91c1c, #dc2626); color: white; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 22px;">KVK Sanstha</h1>
          <p style="margin: 4px 0 0; opacity: 0.9;">Registration Successful</p>
        </div>
        <div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Dear <strong>${fullName || "Student"}</strong>,</p>
          <p>Welcome to KVK Sanstha! Your account has been created successfully. Please save these login credentials for future reference:</p>
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 4px 0;"><strong>User ID (Email):</strong> ${email}</p>
            <p style="margin: 4px 0;"><strong>Password:</strong> ${password}</p>
          </div>
          <p style="color: #6b7280; font-size: 13px;">Keep this email safe. You can use these credentials to log in anytime at our portal.</p>
          <p style="margin-top: 24px;">Best regards,<br/><strong>KVK Sanstha Team</strong></p>
        </div>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "KVK Sanstha <onboarding@resend.dev>",
        to: [email],
        subject: "Your KVK Sanstha Login Credentials",
        html,
      }),
    });

    const responseText = await res.text();
    if (!res.ok) {
      console.error("[send-credentials] Resend failed:", res.status, responseText);
      return new Response(JSON.stringify({ ok: false, error: responseText }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("[send-credentials] sent to", email);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[send-credentials] error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
