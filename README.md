# WE-AI Council Mode Prototype

A working demonstration of WE-AI (collaborative AI) principles: presenting multiple perspectives instead of singular synthesis.

## What This Does

Instead of asking AI for "the answer," this prototype presents a **council of three perspectives**:

- **Efficiency Lens** ⚡ - Productivity, resources, speed
- **Risk Lens** 🛡️ - Safety, constraints, what could go wrong  
- **Innovation Lens** 💡 - Novel approaches, long-term value, creativity

Each perspective runs independently (doesn't see the others) and presents its view without compromise or synthesis.

**The user sees the tensions and decides.**

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.

**Quick deploy to Vercel:**
1. Push code to GitHub
2. Import to Vercel
3. Add `ANTHROPIC_API_KEY` environment variable
4. Deploy

Your council will be live at `your-project.vercel.app` in ~5 minutes.

## Local Development

### 1. Prerequisites

- Node.js 18+ installed
- Anthropic API key ([get one here](https://console.anthropic.com/))

### 2. Install Dependencies

```bash
cd we-ai-prototype
npm install
```

### 3. Configure API Key

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your actual API key
# ANTHROPIC_API_KEY=sk-ant-api03-...
```

### 4. Start the Backend

```bash
npm start
```

The API server will run on http://localhost:3001

### 5. Open the Frontend

Open `public/index.html` in your browser. The interface will connect to the backend automatically.

## Usage

1. Type a question where multiple perspectives matter
2. Click "Ask Council" (or press Ctrl+Enter)
3. Wait ~10-15 seconds for all three perspectives to generate
4. See how different lenses surface different priorities and tensions

## Example Questions

- "Should we launch this feature next week or wait another month?"
- "How should we respond to our competitor's price cut?"
- "Should we hire specialists or generalists?"
- "Is remote work or office-first better for our team?"

## Architecture

### Backend (`server.js`)
- Express API server
- Three parallel calls to Claude API
- Each call uses different system prompt (perspective lens)
- Returns all three responses without synthesis

### Frontend (`public/index.html`)
- React-based interface
- Shows all three perspectives side-by-side
- No synthesis, no "winning" perspective
- User sees tensions clearly

## Key Design Decisions

### Why Three Perspectives?

Three is minimum for genuine plurality:
- Two feels like "pro vs con"  
- Three creates actual multi-dimensionality
- More than three gets overwhelming for v1

### Why These Specific Lenses?

- **Efficiency** = what most organizations default to
- **Risk** = what they forget until it's too late
- **Innovation** = what gets lost in compromise

These three consistently surface real tensions in decision-making.

### Why Independent Calls?

Each Claude instance truly doesn't know what the others will say. This creates genuine plurality, not simulated disagreement.

## Extending This Prototype

### Add More Lenses

Edit `PERSPECTIVES` in `server.js`:

```javascript
equity: {
  name: "Equity Lens",
  systemPrompt: `You analyze through fairness and distribution...`
}
```

### Add Synthesis Option

Add a fourth API call that sees all three perspectives and attempts integration. This shows users what synthesis looks like vs. raw plurality.

### Save & Share Sessions

Add database to store council sessions, let users share links to deliberations.

### Team Mode

Multiple users submit questions, council responds to all, team discusses together.

## Cost Estimate

Each council query = 3 API calls to Claude Sonnet 4

Approximate cost: $0.03-0.05 per question (depending on length)

For 100 test queries: ~$3-5

## What This Proves

1. **Plurality is technically simple** - just multiple API calls with different prompts
2. **The UX is the innovation** - presenting without synthesis  
3. **Tensions become visible** - users immediately see trade-offs
4. **No individual discipline required** - council is the default

## Next Steps

- [ ] Deploy to Vercel/Railway for public demo
- [ ] Add user authentication
- [ ] Implement session history
- [ ] Create shareable council links
- [ ] Add more perspectives (equity, user experience, legal, etc.)
- [ ] Build "synthesis mode" to show contrast
- [ ] Measure: do users make different decisions with council vs singular AI?

## Philosophy

This prototype embodies the core WE-AI principle:

**Make harnessing collective intelligence easier than the alternative.**

Council mode should feel MORE useful and LESS cognitively demanding than getting one synthesized answer — because you see the landscape instead of just one path through it.

## License

MIT - Use this, extend it, deploy it, learn from it.

## Questions?

This is a proof of concept for "The Adolescence of Humanity" essay by Georgi Kamov.

Read the full thesis: [link to your essay]
