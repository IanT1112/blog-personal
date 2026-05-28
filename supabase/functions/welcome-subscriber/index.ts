import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { email } = await req.json();

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "ian? <hola@ianconia.xyz>",
      to: email,
      subject: "Bienvenido a ian?",
      html: `
        <div style="background:#D9D2C8;min-height:100vh;padding:60px 20px;font-family:'Georgia',serif;">
          <div style="max-width:560px;margin:0 auto;">

            <p style="font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(0,0,0,0.30);margin-bottom:48px;">
              ian?
            </p>

            <h1 style="font-size:28px;line-height:1.35;color:rgba(0,0,0,0.80);font-weight:normal;margin:0 0 20px;">
              Gracias por suscribirte.
            </h1>

            <p style="font-size:16px;color:rgba(0,0,0,0.45);font-style:italic;line-height:1.7;margin:0 0 16px;">
              A partir de ahora recibirás una notificación cada vez que publique algo nuevo — un artículo, un libro o un documental que valga la pena.
            </p>

            <p style="font-size:16px;color:rgba(0,0,0,0.45);line-height:1.7;margin:0 0 40px;">
              Mientras tanto, ya puedes explorar lo que hay publicado.
            </p>

            <a href="https://ianconia.xyz"
               style="display:inline-block;padding:12px 28px;background:rgba(0,0,0,0.08);border-radius:999px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(0,0,0,0.55);text-decoration:none;">
              Explorar ian?
            </a>

            <div style="margin-top:60px;padding-top:24px;border-top:1px solid rgba(0,0,0,0.10);">
              <p style="font-size:10px;color:rgba(0,0,0,0.25);letter-spacing:0.15em;text-transform:uppercase;">
                ian? · 
              </p>
            </div>

          </div>
        </div>
      `,
    }),
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});