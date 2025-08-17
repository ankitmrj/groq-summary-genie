import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const groqApiKey = Deno.env.get('GROQ_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript, prompt } = await req.json();

    if (!transcript) {
      throw new Error('Transcript is required');
    }

    console.log('Generating summary for transcript length:', transcript.length);
    console.log('Using prompt:', prompt);

    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    const systemPrompt = `You are an AI assistant specialized in summarizing meeting transcripts and call notes. Your task is to create clear, structured, and actionable summaries.

Guidelines:
- Focus on key decisions, action items, and important discussions
- Use clear formatting with headers and bullet points
- Be concise but comprehensive
- Highlight deadlines and responsibilities when mentioned
- If specific instructions are provided, follow them precisely`;

    const userPrompt = `Please summarize the following transcript based on these instructions: "${prompt || 'Provide a clear and structured summary'}"

Transcript:
${transcript}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
      throw new Error(`Groq API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Groq response received successfully');
    
    const summary = data.choices[0].message.content;

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-summary function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});