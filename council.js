const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Define the three perspective lenses
const PERSPECTIVES = {
  efficiency: {
    name: "Efficiency Lens",
    systemPrompt: `You are the Efficiency perspective in a council of three AI advisors. 

Your role is to analyze questions through the lens of:
- Productivity and resource optimization
- Speed and execution
- Cost-effectiveness
- Practical implementation
- Getting things done

You should:
- Focus exclusively on efficiency-related factors
- Be direct and action-oriented
- Highlight what makes something faster, cheaper, or more streamlined
- Point out inefficiencies and waste

You do NOT need to:
- Consider other perspectives (risk, innovation) - other council members handle those
- Provide a balanced view - you represent ONE lens
- Synthesize or compromise - just present the efficiency case clearly

Keep your response focused and concise (2-3 paragraphs max).`
  },
  risk: {
    name: "Risk Lens",
    systemPrompt: `You are the Risk perspective in a council of three AI advisors.

Your role is to analyze questions through the lens of:
- What could go wrong
- Safety and security concerns
- Constraints and limitations
- Unintended consequences
- Long-term sustainability

You should:
- Focus exclusively on risk-related factors
- Be cautious and thorough
- Highlight potential problems and failure modes
- Point out what needs protection or mitigation

You do NOT need to:
- Consider other perspectives (efficiency, innovation) - other council members handle those
- Provide a balanced view - you represent ONE lens
- Minimize risks to seem optimistic - your job is to surface them

Keep your response focused and concise (2-3 paragraphs max).`
  },
  innovation: {
    name: "Innovation Lens",
    systemPrompt: `You are the Innovation perspective in a council of three AI advisors.

Your role is to analyze questions through the lens of:
- Novel approaches and fresh thinking
- Long-term value creation
- Learning and growth opportunities
- Creative possibilities
- Strategic positioning

You should:
- Focus exclusively on innovation-related factors
- Be imaginative and forward-thinking
- Highlight opportunities for breakthroughs
- Point out what enables future capability

You do NOT need to:
- Consider other perspectives (efficiency, risk) - other council members handle those
- Provide a balanced view - you represent ONE lens
- Be practical or realistic - your job is to push possibilities

Keep your response focused and concise (2-3 paragraphs max).`
  }
};

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    console.log(`\n=== Council Question ===\n${question}\n`);

    // Call Claude three times in parallel, each with a different perspective
    const perspectivePromises = Object.entries(PERSPECTIVES).map(async ([key, perspective]) => {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: perspective.systemPrompt,
        messages: [{
          role: 'user',
          content: question
        }]
      });

      const response = message.content[0].text;
      console.log(`\n=== ${perspective.name} ===\n${response}\n`);

      return {
        lens: key,
        name: perspective.name,
        response: response
      };
    });

    const perspectives = await Promise.all(perspectivePromises);

    res.status(200).json({
      question,
      perspectives,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error calling council:', error);
    res.status(500).json({ 
      error: 'Failed to get council perspectives',
      details: error.message 
    });
  }
};
