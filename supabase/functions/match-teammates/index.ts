import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MatchRequest {
  projectId: string;
  projectRequirements: {
    title: string;
    description: string;
    category: string;
    requiredSkills: string[];
  };
  candidateProfiles: Array<{
    id: string;
    username: string;
    full_name: string;
    bio: string | null;
    headline: string | null;
    experience_level: string;
    availability_status: string;
    skills: string[];
    interests: string[];
  }>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Verify user authorization
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { projectId, projectRequirements, candidateProfiles }: MatchRequest = await req.json();

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

    // If Gemini AI API is configured in Supabase environment secrets
    if (geminiApiKey) {
      const prompt = `You are an expert developer recruitment and technical matchmaking engine for DevConnect.
Analyze the following project and candidates. Evaluate compatibility percentage (0-100) and articulate specific, technical reasons.

PROJECT DETAILS:
Title: ${projectRequirements.title}
Category: ${projectRequirements.category}
Required Skills: ${projectRequirements.requiredSkills.join(", ")}
Description: ${projectRequirements.description}

CANDIDATES:
${JSON.stringify(candidateProfiles, null, 2)}

Return strict JSON only in this exact format:
{
  "matches": [
    {
      "candidateId": "<id>",
      "matchScore": <number between 0 and 100>,
      "matchingSkills": ["<skill1>", "<skill2>"],
      "missingSkills": ["<skill3>"],
      "reasons": ["<concise reason 1>", "<concise reason 2>"]
    }
  ]
}`;

      const aiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        }
      );

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        const text = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return new Response(
            JSON.stringify({
              calculatedVia: "ai",
              matches: parsed.matches,
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
    }

    // Transparent algorithmic fallback if AI provider is unconfigured or unavailable
    const algorithmicMatches = candidateProfiles.map((candidate) => {
      const candidateSkillsSet = new Set(candidate.skills.map((s) => s.toLowerCase()));
      const reqSkills = projectRequirements.requiredSkills;

      const matchingSkills = reqSkills.filter((req) =>
        candidateSkillsSet.has(req.toLowerCase())
      );
      const missingSkills = reqSkills.filter(
        (req) => !candidateSkillsSet.has(req.toLowerCase())
      );

      // Skill overlap component (60%)
      const skillScore = reqSkills.length > 0 ? (matchingSkills.length / reqSkills.length) * 60 : 30;

      // Experience level component (20%)
      const expLevels: Record<string, number> = {
        Junior: 10,
        "Mid-Level": 16,
        Senior: 20,
        Lead: 20,
        Architect: 20,
      };
      const expScore = expLevels[candidate.experience_level] || 12;

      // Availability component (20%)
      const availScore = candidate.availability_status === "available" || candidate.availability_status === "open_to_collaborate" ? 20 : 5;

      const totalScore = Math.min(Math.round(skillScore + expScore + availScore), 100);

      const reasons: string[] = [];
      if (matchingSkills.length > 0) {
        reasons.push(`Possesses required skills: ${matchingSkills.join(", ")}`);
      }
      if (candidate.availability_status === "open_to_collaborate" || candidate.availability_status === "available") {
        reasons.push(`Actively open for team collaboration`);
      }
      if (candidate.experience_level === "Senior" || candidate.experience_level === "Lead") {
        reasons.push(`${candidate.experience_level} background aligns with project architecture`);
      }

      return {
        candidateId: candidate.id,
        matchScore: totalScore,
        matchingSkills,
        missingSkills,
        reasons,
      };
    });

    algorithmicMatches.sort((a, b) => b.matchScore - a.matchScore);

    return new Response(
      JSON.stringify({
        calculatedVia: "algorithmic",
        matches: algorithmicMatches,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
