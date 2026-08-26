import PitchbookSection from '../models/PitchbookSection.js';
import Recommendation from '../models/Recommendation.js';
import Client from '../models/Client.js';
import Industry from '../models/Industry.js';
import Competitor from '../models/Competitor.js';
import MATransaction from '../models/MATransaction.js';
import PotentialTarget from '../models/PotentialTarget.js';

const SECTION_KEYS = [
  'executiveSummary',
  'clientSnapshot',
  'industryOverview',
  'keyTrends',
  'competitiveLandscape',
  'growthOpportunities',
  'recentMA',
  'potentialTargets',
  'strategicRecommendations',
  'nextSteps',
];

const SECTION_TITLES = {
  executiveSummary: 'Executive Summary',
  clientSnapshot: 'Client Snapshot',
  industryOverview: 'Industry Overview',
  keyTrends: 'Key Trends',
  competitiveLandscape: 'Competitive Landscape',
  growthOpportunities: 'Growth Opportunities',
  recentMA: 'Recent M&A',
  potentialTargets: 'Potential Targets',
  strategicRecommendations: 'Strategic Recommendations',
  nextSteps: 'Next Steps',
};

export function isDemoMode() {
  return process.env.DEMO_MODE === 'true' || !process.env.AI_API_KEY;
}

export async function callExternalAI(prompt, context) {
  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_API_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.AI_MODEL || 'gpt-4o';

  const systemContent =
    'You are CedarBridge Copilot, an AI strategic advisory assistant for investment banking. ' +
    'Answer concisely and professionally using the provided pitchbook context.';

  const messages = [
    { role: 'system', content: systemContent },
    { role: 'system', content: `Pitchbook context:\n${JSON.stringify(context).slice(0, 8000)}` },
    { role: 'user', content: prompt },
  ];

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages, max_tokens: 1200, temperature: 0.7 }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`AI provider error ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'No response generated.';
}

function buildContextForQuestion(question, sections) {
  const q = (question || '').toLowerCase();
  const byKey = Object.fromEntries(sections.map((s) => [s.sectionKey, s]));
  const pick = (keys) => keys.map((k) => byKey[k]).filter(Boolean);

  if (q.includes('opportunit') || q.includes('growth') || q.includes('biggest')) {
    return pick(['growthOpportunities', 'keyTrends', 'potentialTargets', 'strategicRecommendations']);
  }
  if (q.includes('acqui') || q.includes('target') || q.includes('buy') || q.includes('merge')) {
    return pick(['potentialTargets', 'competitiveLandscape', 'clientSnapshot']);
  }
  if (q.includes('compet') || q.includes('landscape') || q.includes('peer')) {
    return pick(['competitiveLandscape', 'industryOverview', 'clientSnapshot']);
  }
  if (q.includes('summar') || q.includes('overview') || q.includes('pitchbook')) {
    return sections;
  }
  if (q.includes('trend') || q.includes('industry')) {
    return pick(['industryOverview', 'keyTrends']);
  }
  if (q.includes('recommend') || q.includes('should') || q.includes('next') || q.includes('do')) {
    return pick(['strategicRecommendations', 'nextSteps', 'growthOpportunities']);
  }
  return sections;
}

function formatContext(sections) {
  return sections
    .map((s) => {
      const content = typeof s.content === 'string' ? s.content : JSON.stringify(s.content);
      return `## ${s.title}\n${content}`;
    })
    .join('\n\n---\n\n');
}

function demoAnswer(question, relevantSections) {
  const q = (question || '').toLowerCase();
  const ctx = formatContext(relevantSections);

  if (q.includes('opportunit') || q.includes('growth') || q.includes('biggest')) {
    return (
      'Based on the current pitchbook context, the largest opportunities center on three areas:\n\n' +
      '1. Payments Expansion — building scale through targeted platform acquisitions. The client has the capital position (CET1 12.4%) and distribution to support a $420M revenue opportunity.\n' +
      '2. Wealth Management — accelerating advisor-led growth with digital tooling, representing $310M of potential.\n' +
      '3. Embedded Banking — partnering with high-growth vertical software platforms for $180M of potential.\n\n' +
      'A focused M&A and partnership strategy across these segments can unlock an estimated $1.4B in incremental revenue over 3 years.'
    );
  }
  if (q.includes('acqui') || q.includes('target') || q.includes('buy')) {
    return (
      'The strongest acquisition target is FlowPay (Payments, fit score 94 — Excellent). ' +
      'It directly addresses the client\'s underweight payments revenue (7% vs 11% peer benchmark) and aligns with the payments expansion thesis. ' +
      'Ledgerly (WealthTech, 88 — Strong) is the second priority for the wealth management gap. ' +
      'OpenCurrent (Open Banking, 81 — Good) should be monitored as a longer-term platform play.\n\n' +
      'Recommendation: prioritize outreach to FlowPay while building a relationship with Ledgerly.'
    );
  }
  if (q.includes('compet') || q.includes('landscape') || q.includes('peer')) {
    return (
      'ABC National Bank ranks #3 by total revenue among peers, behind First Meridian and Continental. ' +
      'However, it leads in digital adoption (34% YoY vs 21% peer average) and wealth management AUM growth (18%). ' +
      'The competitive gap is most pronounced in payments revenue (7% of total vs 11% peer benchmark). ' +
      'Closing that gap through acquisition and platform investment is the highest-leverage strategic move.'
    );
  }
  if (q.includes('summar') || q.includes('overview') || q.includes('pitchbook')) {
    return (
      'This pitchbook covers ABC National Bank, a $12B mid-cap financial services institution. ' +
      'Key themes: digital transformation, wealth management expansion, and selective M&A in payments and open banking. ' +
      'The bank has $2.1B of deployable excess capital and strong digital momentum. ' +
      'Three priority opportunities (payments, wealth, embedded banking) could unlock $1.4B over 3 years. ' +
      'FlowPay is the top acquisition target. The recommended next step is a focused payments M&A program.'
    );
  }
  if (q.includes('recommend') || q.includes('should') || q.includes('next') || q.includes('do')) {
    return (
      'Management should pursue three immediate actions:\n\n' +
      '1. Launch a focused payments M&A program — prioritize FlowPay acquisition (Owner: Corporate Development, Impact: High).\n' +
      '2. Modernize the digital wealth experience — accelerate advisor-led growth with digital tooling (Owner: Digital Banking, Impact: High).\n' +
      '3. Build embedded banking partnerships — target high-growth vertical software platforms.\n\n' +
      'The current roadmap stage is Discovery. Moving to Analysis requires committing to the payments M&A thesis.'
    );
  }
  return (
    'Based on the pitchbook context:\n\n' + ctx.slice(0, 1500) +
    '\n\nLet me know if you\'d like me to dive deeper into any specific section.'
  );
}

export async function answerQuestion({ question, pitchbookId, user }) {
  const sections = await PitchbookSection.find({ pitchbook: pitchbookId }).lean();
  if (!sections.length) {
    return 'No pitchbook sections have been generated yet. Please generate the pitchbook first so I can answer questions with real context.';
  }
  const relevant = buildContextForQuestion(question, sections);

  let answer;
  if (isDemoMode()) {
    answer = demoAnswer(question, relevant);
  } else {
    try {
      answer = await callExternalAI(question, relevant.map((s) => ({ sectionKey: s.sectionKey, title: s.title, content: s.content })));
    } catch (err) {
      console.error('AI call failed, falling back to demo:', err.message);
      answer = demoAnswer(question, relevant);
    }
  }
  return answer;
}

export async function generateExecutiveSummary(pitchbook) {
  const client = pitchbook.client ? await Client.findById(pitchbook.client).lean() : null;
  const clientName = client?.name || pitchbook.clientName;
  const industry = pitchbook.industry;

  return {
    content: `${clientName} is a mid-cap ${industry.toLowerCase()} institution seeking a strategic transformation to accelerate digital adoption, expand its wealth management franchise, and pursue selective M&A to build scale in payments and open banking. The firm has a strong capital position and digital momentum, but lags peers in payments revenue. A focused M&A and partnership strategy can unlock an estimated $1.4B in incremental revenue over 3 years.`,
    data: {
      clientOverview: `${clientName} — ${industry}, ${pitchbook.region}`,
      strategicSituation: 'Digital transformation with capital capacity for selective M&A',
      keyFindings: [
        'Strong capital position with CET1 ratio of 12.4%, providing $2.1B of deployable excess capital',
        'Digital channel adoption grew 34% YoY, outpacing peer average of 21%',
        'Wealth management AUM up 18% — highest-growth segment in the portfolio',
        'Payments revenue at $840M represents 7% of total revenue, below the 11% peer benchmark',
      ],
      marketPosition: '#3 by total revenue, top quartile in digital adoption',
      mainOpportunity: 'Focused M&A and partnerships across payments, digital banking, and wealth management',
    },
  };
}

export async function generateSection(pitchbook, sectionKey) {
  const client = pitchbook.client ? await Client.findById(pitchbook.client).lean() : null;
  const clientName = client?.name || pitchbook.clientName;
  const industry = pitchbook.industry;

  switch (sectionKey) {
    case 'executiveSummary':
      return generateExecutiveSummary(pitchbook);

    case 'clientSnapshot':
      return {
        content: { client: clientName, industry, region: pitchbook.region, revenue: client?.revenue || '$12.0B', employees: client?.employees || 18000, growth: client?.growth || '+8.4%', engagementObjective: client?.engagementObjective || 'Strategic transformation and M&A advisory' },
      };

    case 'industryOverview': {
      const ind = await Industry.findOne({ name: { $regex: industry, $options: 'i' } }).lean();
      return {
        content: {
          marketSize: ind?.marketSize || '$1.8T',
          cagr: ind?.cagr || '8.7%',
          growth: ind?.growth || '+10.2%',
          majorPlayers: ['First Meridian', 'Continental', 'Union Financial', 'ABC National'],
          industryStructure: 'Consolidated mid-cap with room for digital-first disruptors',
        },
        data: { chart: [42, 48, 45, 57, 68, 82, 94] },
      };
    }

    case 'keyTrends': {
      const ind = await Industry.findOne({ name: { $regex: industry, $options: 'i' } }).lean();
      const trends = ind?.trends?.length
        ? ind.trends
        : [
            { name: 'AI Transformation', impact: 'High', description: 'AI-driven customer service and risk modeling', direction: 'up', confidence: 92 },
            { name: 'Embedded Finance', impact: 'High', description: 'Banking-as-a-service integration into vertical SaaS', direction: 'up', confidence: 88 },
            { name: 'Payments Modernization', impact: 'Medium', description: 'Real-time payments and cross-border infrastructure', direction: 'up', confidence: 84 },
            { name: 'Open Banking', impact: 'Medium', description: 'API-first banking and data portability', direction: 'up', confidence: 79 },
            { name: 'WealthTech', impact: 'High', description: 'Digital wealth platforms and robo-advisory', direction: 'up', confidence: 86 },
            { name: 'Digital Banking', impact: 'Medium', description: 'Branchless banking and mobile-first experience', direction: 'up', confidence: 81 },
          ];
      return { content: { trends } };
    }

    case 'competitiveLandscape': {
      const competitors = await Competitor.find({ industry: { $regex: industry, $options: 'i' } }).lean();
      const peers = competitors.length
        ? competitors
        : [
            { name: 'ABC National', revenue: '$12.0B', marketShare: 8.2, growth: '+8.4%' },
            { name: 'First Meridian', revenue: '$9.6B', marketShare: 6.5, growth: '+7.1%' },
            { name: 'Continental', revenue: '$7.3B', marketShare: 5.0, growth: '+6.3%' },
            { name: 'Union Financial', revenue: '$5.7B', marketShare: 3.9, growth: '+5.8%' },
          ];
      return { content: { peers, marketPosition: '#3 by total revenue', digitalAdoption: 'Top quartile' } };
    }

    case 'growthOpportunities':
      return {
        content: {
          opportunities: [
            { name: 'Payments Expansion', potential: '$420M', investment: 'High', expectedImpact: 'High', priority: 'High', rationale: 'Build scale through targeted platform acquisitions' },
            { name: 'Wealth Management', potential: '$310M', investment: 'Medium', expectedImpact: 'High', priority: 'High', rationale: 'Accelerate advisor-led growth with digital tooling' },
            { name: 'Embedded Banking', potential: '$180M', investment: 'Medium', expectedImpact: 'Medium', priority: 'Medium', rationale: 'Partner with high-growth vertical software platforms' },
            { name: 'Digital Lending', potential: '$220M', investment: 'Medium', expectedImpact: 'Medium', priority: 'Medium', rationale: 'AI-driven underwriting and instant decisioning' },
            { name: 'AI Customer Service', potential: '$90M', investment: 'Low', expectedImpact: 'Medium', priority: 'Medium', rationale: 'Reduce cost-to-serve while improving NPS' },
          ],
        },
      };

    case 'recentMA': {
      const transactions = await MATransaction.find({}).sort({ date: -1 }).limit(15).lean();
      return { content: { transactions: transactions.length ? transactions : [] } };
    }

    case 'potentialTargets': {
      const targets = await PotentialTarget.find({}).sort({ fitScore: -1 }).limit(12).lean();
      return { content: { targets: targets.length ? targets : [] } };
    }

    case 'strategicRecommendations': {
      const recs = await Recommendation.find({ pitchbook: pitchbook._id }).lean();
      if (recs.length) return { content: { recommendations: recs } };
      return {
        content: {
          recommendations: [
            { title: 'Launch a focused payments M&A program', priority: 'High', expectedImpact: 'High', owner: 'Corporate Development', status: 'In progress' },
            { title: 'Modernize the digital wealth experience', priority: 'High', expectedImpact: 'High', owner: 'Digital Banking', status: 'Not started' },
            { title: 'Build embedded banking partnerships', priority: 'Medium', expectedImpact: 'Medium', owner: 'Partnerships', status: 'Not started' },
            { title: 'Deploy AI-driven customer service', priority: 'Medium', expectedImpact: 'Medium', owner: 'Operations', status: 'Not started' },
          ],
        },
      };
    }

    case 'nextSteps':
      return {
        content: {
          stages: ['Discovery', 'Analysis', 'Draft', 'Review', 'Approval', 'Execution'],
          currentStage: pitchbook.currentStage || 'Discovery',
          roadmap: [
            { stage: 'Discovery', status: 'completed', description: 'Client onboarding and objective alignment' },
            { stage: 'Analysis', status: 'active', description: 'Industry, competitive, and target analysis' },
            { stage: 'Draft', status: 'pending', description: 'Draft pitchbook sections' },
            { stage: 'Review', status: 'pending', description: 'Internal review and client feedback' },
            { stage: 'Approval', status: 'pending', description: 'Finalize and approve recommendations' },
            { stage: 'Execution', status: 'pending', description: 'Execute M&A and strategic initiatives' },
          ],
        },
      };

    default:
      return { content: 'Section not recognized.' };
  }
}

export async function analyzeIndustry(industryName) {
  const ind = await Industry.findOne({ name: { $regex: industryName, $options: 'i' } }).lean();
  if (!ind) return { message: `No data found for industry: ${industryName}` };
  return {
    name: ind.name,
    marketSize: ind.marketSize,
    cagr: ind.cagr,
    growth: ind.growth,
    trends: ind.trends,
  };
}

export async function identifyTargets(industryName) {
  const filter = industryName ? { industry: { $regex: industryName, $options: 'i' } } : {};
  const targets = await PotentialTarget.find(filter).sort({ fitScore: -1 }).limit(10).lean();
  return targets;
}

export { SECTION_KEYS, SECTION_TITLES };
