import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const HF_API_KEY = Deno.env.get("HF_API_KEY");
    if (!HF_API_KEY) throw new Error("HF_API_KEY is not configured");

    const systemPrompt =
      "You are Brokod, a friendly and knowledgeable banking support assistant for Kodbank. " +
      "Help users with banking questions, account inquiries, transaction guidance, and general support. " +
      "Be concise, professional, and helpful. If you don't know something, say so honestly.";

    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/Mistral-7B-Instruct-v0.2",
          messages: chatMessages,
          max_tokens: 512,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HuggingFace API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `AI service error: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "I'm sorry, I couldn't generate a response. Please try again.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("brokod-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
