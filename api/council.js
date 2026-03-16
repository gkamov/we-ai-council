const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const FORMAT_INSTRUCTION = `

FORMAT YOUR RESPONSE like this — no title at the top, no preamble:
- Use ALL CAPS lines for major section headings (e.g. KEY CONCERNS, OPPORTUNITIES, RECOMMENDATION)
- Use "Subheading:" style (title case + colon) for sub-points within sections
- Use bullet points (- ) for lists
- Keep paragraphs short (2-3 sentences)
- Do NOT start with a title or restate the lens name`;

const PERSPECTIVES = [
  {
    key: 'strategic',
    name: 'Strategic Lens',
    icon: '🎯',
    color: '#6366f1',
    prompt: `You are the Strategic perspective in a WE-AI council. Analyze through the lens of long-term positioning, competitive advantage, mission alignment, and strategic coherence. Be direct, specific, and avoid hedging. Focus ONLY on strategic considerations.` + FORMAT_INSTRUCTION
  },
  {
    key: 'human',
    name: 'Human Lens',
    icon: '🤝',
    color: '#ec4899',
    prompt: `You are the Human perspective in a WE-AI council. Analyze through the lens of people impact — morale, culture, fairness, wellbeing, trust, and relationships. Be direct and specific. Focus ONLY on human/people considerations.` + FORMAT_INSTRUCTION
  },
  {
    key: 'risk',
    name: 'Risk Lens',
    icon: '🛡️',
    color: '#f59e0b',
    prompt: `You are the Risk perspective in a WE-AI council. Analyze through the lens of what could go wrong — financial, reputational, operational, and unintended consequences. Be direct and specific. Focus ONLY on risk considerations.` + FORMAT_INSTRUCTION
  },
  {
    key: 'innovation',
    name: 'Innovation Lens',
    icon: '💡',
    color: '#10b981',
    prompt: `You are the Innovation perspective in a WE-AI council. Analyze through the lens of creative possibilities, novel approaches, learning opportunities, and future capability. Be direct and specific. Focus ONLY on innovation considerations.` + FORMAT_INSTRUCTION
  }
];

const SYNTHESIS_PROMPT = `You are the synthesis layer of a WE-AI council. You have received analysis from four perspectives on a question. Your job is to produce a structured JSON synthesis.

Return ONLY valid JSON with this exact structure:
{
  "consensus": <number 0-100 representing overall agreement level>,
  "conclusion": "<2-3 sentence synthesis of where perspectives align>",
  "perspectives": [
    {
      "key": "<perspective key>",
      "support": <number 0-100>,
      "summary": "<2-3 sentence focused summary of this perspective's view>"
    }
  ],
  "tensions": ["<tension 1>", "<tension 2>", "<tension 3>"],
  "cruxes": [
    {
      "question": "<the key question that determines the answer>",
      "ifYes": "<what follows if yes>",
      "ifNo": "<what follows if no>"
    }
  ],
  "recommendation": "<concrete actionable recommendation, or null if no consensus>",
  "honesty": "<what this question cannot be answered without — values clarification, missing data, etc>"
}

Rules:
- consensus below 50 means real disagreement — be honest about it
- tensions should be genuine unresolved conflicts between perspectives, not just observations
- cruxes should be the 1-2 pivotal questions where different answers lead to different conclusions
- recommendation should be null if consensus is below 40
- honesty should name what the asker needs to decide or discover before acting
- Return ONLY the JSON object, no markdown, no explanation`;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });

    console.log(`\n=== Council Question ===\n${question}\n`);

    // Get all 4 perspectives in parallel
    const perspectiveResponses = await Promise.all(
      PERSPECTIVES.map(async (p) => {
        const message = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 600,
          system: p.prompt,
          messages: [{ role: 'user', content: question }]
        });
        return { key: p.key, text: message.content[0].text };
      })
    );

    // Build synthesis prompt with all perspectives
    const perspectivesText = perspectiveResponses.map(pr => {
      const meta = PERSPECTIVES.find(p => p.key === pr.key);
      return `=== ${meta.name} ===\n${pr.text}`;
    }).join('\n\n');

    const synthesisMessage = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYNTHESIS_PROMPT,
      messages: [{
        role: 'user',
        content: `Question: "${question}"\n\nPerspectives:\n\n${perspectivesText}`
      }]
    });

    let synthesis;
    try {
      synthesis = JSON.parse(synthesisMessage.content[0].text);
    } catch (e) {
      console.error('Failed to parse synthesis JSON:', synthesisMessage.content[0].text);
      synthesis = {
        consensus: 50,
        conclusion: "The council reached mixed views on this question.",
        perspectives: PERSPECTIVES.map(p => ({ key: p.key, support: 50, summary: "" })),
        tensions: [],
        cruxes: [],
        recommendation: null,
        honesty: "Further clarification needed."
      };
    }

    // Merge perspective metadata with synthesis summaries
    const enrichedPerspectives = PERSPECTIVES.map(meta => {
      const synthP = synthesis.perspectives?.find(p => p.key === meta.key) || {};
      const rawP = perspectiveResponses.find(p => p.key === meta.key) || {};
      return {
        key: meta.key,
        name: meta.name,
        icon: meta.icon,
        color: meta.color,
        support: synthP.support ?? 50,
        summary: synthP.summary || '',
        fullResponse: rawP.text || ''
      };
    });

    res.status(200).json({
      question,
      consensus: synthesis.consensus,
      conclusion: synthesis.conclusion,
      perspectives: enrichedPerspectives,
      tensions: synthesis.tensions || [],
      cruxes: synthesis.cruxes || [],
      recommendation: synthesis.recommendation || null,
      honesty: synthesis.honesty || null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error calling council:', error);
    res.status(500).json({ error: 'Failed to get council perspectives', details: error.message });
  }
};
