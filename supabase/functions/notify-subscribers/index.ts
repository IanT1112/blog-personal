import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const { title, desc, category, post_id } = await req.json();

  const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers?select=email`, {
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
  });
  const subscribers = await res.json();

  if (!subscribers.length) {
    return new Response(JSON.stringify({ message: "No hay suscriptores" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const categoryLabel = category === "article" ? "Artículo" : category === "book" ? "Libro" : "Documental";
  const postUrl = `https://ianconia.xyz/post/${post_id}`;

  for (let i = 0; i < subscribers.length; i++) {
    const s = subscribers[i];
    if (i > 0) await new Promise(resolve => setTimeout(resolve, 300));
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ian? <hola@ianconia.xyz>",
        to: s.email,
        subject: `Nuevo ${categoryLabel}: ${title}`,
        html: `
          <div style="background:#D9D2C8;min-height:100vh;padding:60px 20px;font-family:'Georgia',serif;">
            <div style="max-width:560px;margin:0 auto;">
              <p style="font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(0,0,0,0.35);margin-bottom:40px;">
                ian? · ${categoryLabel}
              </p>
              <h1 style="font-size:32px;line-height:1.3;color:rgba(0,0,0,0.82);font-weight:normal;margin:0 0 16px;">
                ${title}
              </h1>
              <p style="font-size:16px;color:rgba(0,0,0,0.45);font-style:italic;line-height:1.6;margin:0 0 40px;">
                ${desc}
              </p>
              <a href="${postUrl}"
                 style="display:inline-block;padding:12px 28px;background:rgba(0,0,0,0.08);border-radius:999px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(0,0,0,0.55);text-decoration:none;">
                Leer ahora
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
  }

  return new Response(
    JSON.stringify({ message: `Enviado a ${subscribers.length} suscriptores` }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});