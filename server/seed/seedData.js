import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Client from '../models/Client.js';
import Industry from '../models/Industry.js';
import Competitor from '../models/Competitor.js';
import MATransaction from '../models/MATransaction.js';
import PotentialTarget from '../models/PotentialTarget.js';
import Pitchbook from '../models/Pitchbook.js';
import PitchbookSection from '../models/PitchbookSection.js';
import Recommendation from '../models/Recommendation.js';
import ChatMessage from '../models/ChatMessage.js';
import { SECTION_KEYS, SECTION_TITLES, generateSection } from '../services/aiService.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cedarbridge';

const users = [
  { name: 'Rahul Sharma', email: 'rahul@cedarbridge.ai', password: 'password123', role: 'advisor', title: 'Senior Advisor' },
  { name: 'Priya Nair', email: 'priya@cedarbridge.ai', password: 'password123', role: 'manager', title: 'Managing Director' },
  { name: 'James Whitfield', email: 'james@cedarbridge.ai', password: 'password123', role: 'advisor', title: 'VP, Strategy' },
  { name: 'Sofia Mendez', email: 'sofia@cedarbridge.ai', password: 'password123', role: 'advisor', title: 'Associate' },
  { name: 'David Chen', email: 'david@cedarbridge.ai', password: 'password123', role: 'admin', title: 'Head of Advisory' },
];

const clients = [
  { name: 'ABC National Bank', industry: 'Financial Services', region: 'North America', revenue: '$12.0B', employees: 18000, growth: '+8.4%', relationshipManager: 'Rahul Sharma', engagementObjective: 'Strategic transformation and M&A advisory' },
  { name: 'Meridian Financial Group', industry: 'Financial Services', region: 'Europe', revenue: '$9.6B', employees: 14200, growth: '+7.1%', relationshipManager: 'Priya Nair', engagementObjective: 'Digital banking expansion strategy' },
  { name: 'Continental Trust', industry: 'Financial Services', region: 'North America', revenue: '$7.3B', employees: 9800, growth: '+6.3%', relationshipManager: 'James Whitfield', engagementObjective: 'Wealth management growth and M&A screening' },
  { name: 'Union Financial Corp', industry: 'Financial Services', region: 'Asia Pacific', revenue: '$5.7B', employees: 7100, growth: '+5.8%', relationshipManager: 'Sofia Mendez', engagementObjective: 'Payments modernization and open banking' },
  { name: 'Northstar Capital Partners', industry: 'Asset Management', region: 'North America', revenue: '$3.2B', employees: 3200, growth: '+11.2%', relationshipManager: 'Rahul Sharma', engagementObjective: 'Portfolio optimization and target identification' },
];

const industries = [
  {
    name: 'Financial Services',
    marketSize: '$1.8T',
    cagr: '8.7%',
    growth: '+10.2%',
    description: 'A consolidated mid-cap financial services sector with accelerating digital transformation and selective M&A activity.',
    trends: [
      { name: 'AI Transformation', impact: 'High', description: 'AI-driven customer service and risk modeling', direction: 'up', confidence: 92 },
      { name: 'Embedded Finance', impact: 'High', description: 'Banking-as-a-service integration into vertical SaaS', direction: 'up', confidence: 88 },
      { name: 'Payments Modernization', impact: 'Medium', description: 'Real-time payments and cross-border infrastructure', direction: 'up', confidence: 84 },
      { name: 'Open Banking', impact: 'Medium', description: 'API-first banking and data portability', direction: 'up', confidence: 79 },
      { name: 'WealthTech', impact: 'High', description: 'Digital wealth platforms and robo-advisory', direction: 'up', confidence: 86 },
      { name: 'Digital Banking', impact: 'Medium', description: 'Branchless banking and mobile-first experience', direction: 'up', confidence: 81 },
    ],
  },
  {
    name: 'Asset Management',
    marketSize: '$420B',
    cagr: '6.4%',
    growth: '+8.1%',
    description: 'Asset management industry undergoing fee compression and digital platform consolidation.',
    trends: [
      { name: 'Passive-to-Active Rotation', impact: 'Medium', description: 'Shift toward specialized active strategies', direction: 'up', confidence: 75 },
      { name: 'Direct Indexing', impact: 'High', description: 'Customized index portfolios for HNW clients', direction: 'up', confidence: 83 },
      { name: 'ESG Integration', impact: 'Medium', description: 'Regulatory-driven ESG reporting frameworks', direction: 'up', confidence: 71 },
    ],
  },
  {
    name: 'Payments',
    marketSize: '$680B',
    cagr: '11.3%',
    growth: '+14.6%',
    description: 'Rapidly growing payments sector driven by real-time rails, embedded finance, and cross-border modernization.',
    trends: [
      { name: 'Real-Time Payments', impact: 'High', description: 'Instant payment rails adoption', direction: 'up', confidence: 90 },
      { name: 'Embedded Payments', impact: 'High', description: 'Payments integrated into non-financial platforms', direction: 'up', confidence: 87 },
      { name: 'Cross-Border Modernization', impact: 'Medium', description: 'Blockchain and FX optimization', direction: 'up', confidence: 80 },
    ],
  },
  {
    name: 'WealthTech',
    marketSize: '$210B',
    cagr: '9.8%',
    growth: '+12.4%',
    description: 'Technology-driven wealth management platforms reshaping advisor workflows and client experiences.',
    trends: [
      { name: 'Robo-Advisory', impact: 'High', description: 'Automated portfolio management for mass affluent', direction: 'up', confidence: 85 },
      { name: 'Advisor Productivity Tools', impact: 'Medium', description: 'AI-assisted planning and client insights', direction: 'up', confidence: 82 },
    ],
  },
  {
    name: 'Open Banking',
    marketSize: '$95B',
    cagr: '14.2%',
    growth: '+18.7%',
    description: 'API-first banking infrastructure enabling third-party data access and embedded financial products.',
    trends: [
      { name: 'API Standardization', impact: 'High', description: 'Open banking API frameworks', direction: 'up', confidence: 88 },
      { name: 'Data Portability', impact: 'Medium', description: 'Consumer-controlled financial data sharing', direction: 'up', confidence: 79 },
    ],
  },
];

const competitors = [
  { name: 'ABC National', industry: 'Financial Services', marketShare: 8.2, revenue: '$12.0B', growth: '+8.4%', category: 'Mid-cap bank' },
  { name: 'First Meridian', industry: 'Financial Services', marketShare: 6.5, revenue: '$9.6B', growth: '+7.1%', category: 'Mid-cap bank' },
  { name: 'Continental', industry: 'Financial Services', marketShare: 5.0, revenue: '$7.3B', growth: '+6.3%', category: 'Mid-cap bank' },
  { name: 'Union Financial', industry: 'Financial Services', marketShare: 3.9, revenue: '$5.7B', growth: '+5.8%', category: 'Mid-cap bank' },
  { name: 'Riverton Capital', industry: 'Asset Management', marketShare: 4.2, revenue: '$4.1B', growth: '+9.3%', category: 'Asset manager' },
  { name: 'Veridian Group', industry: 'Payments', marketShare: 12.1, revenue: '$18.4B', growth: '+15.2%', category: 'Payments platform' },
  { name: 'Apex Payments', industry: 'Payments', marketShare: 8.7, revenue: '$13.2B', growth: '+13.8%', category: 'Payments processor' },
  { name: 'Swiftline', industry: 'Payments', marketShare: 5.3, revenue: '$8.1B', growth: '+11.6%', category: 'Cross-border payments' },
  { name: 'Ledgerly', industry: 'WealthTech', marketShare: 3.1, revenue: '$1.9B', growth: '+16.4%', category: 'WealthTech platform' },
  { name: 'OpenCurrent', industry: 'Open Banking', marketShare: 2.8, revenue: '$0.9B', growth: '+22.1%', category: 'Open banking platform' },
];

const maTransactions = [
  { company: 'Northstar Payments', acquirer: 'Veridian Group', dealSize: '$1.2B', date: 'Jun 2025', industry: 'Payments' },
  { company: 'Atlas Wealth', acquirer: 'Riverton Capital', dealSize: '$640M', date: 'Apr 2025', industry: 'WealthTech' },
  { company: 'Clearline Digital', acquirer: 'First Meridian', dealSize: '$385M', date: 'Mar 2025', industry: 'Digital Banking' },
  { company: 'PayBridge Solutions', acquirer: 'Apex Payments', dealSize: '$890M', date: 'May 2025', industry: 'Payments' },
  { company: 'FinConnect API', acquirer: 'OpenCurrent', dealSize: '$210M', date: 'Feb 2025', industry: 'Open Banking' },
  { company: 'WealthForge', acquirer: 'Ledgerly', dealSize: '$420M', date: 'Jan 2025', industry: 'WealthTech' },
  { company: 'TransGlobal Payments', acquirer: 'Swiftline', dealSize: '$1.5B', date: 'Dec 2024', industry: 'Payments' },
  { company: 'Heritage Trust', acquirer: 'Continental', dealSize: '$720M', date: 'Nov 2024', industry: 'Financial Services' },
  { company: 'Digital Advisor Pro', acquirer: 'Riverton Capital', dealSize: '$180M', date: 'Oct 2024', industry: 'WealthTech' },
  { company: 'OpenRail Banking', acquirer: 'Union Financial', dealSize: '$295M', date: 'Sep 2024', industry: 'Open Banking' },
  { company: 'MerchantPay', acquirer: 'Veridian Group', dealSize: '$560M', date: 'Aug 2024', industry: 'Payments' },
  { company: 'Crescent Wealth', acquirer: 'Continental', dealSize: '$480M', date: 'Jul 2024', industry: 'WealthTech' },
  { company: 'FastLedger', acquirer: 'Apex Payments', dealSize: '$340M', date: 'Jun 2024', industry: 'Financial Services' },
  { company: 'NextGen Banking', acquirer: 'First Meridian', dealSize: '$610M', date: 'May 2024', industry: 'Digital Banking' },
  { company: 'APIHub Financial', acquirer: 'OpenCurrent', dealSize: '$155M', date: 'Apr 2024', industry: 'Open Banking' },
];

const potentialTargets = [
  { company: 'FlowPay', industry: 'Payments', revenue: '$320M', fitScore: 94, strategicFit: 'Excellent', recommendation: 'Prioritize outreach' },
  { company: 'Ledgerly', industry: 'WealthTech', revenue: '$190M', fitScore: 88, strategicFit: 'Strong', recommendation: 'Build relationship' },
  { company: 'OpenCurrent', industry: 'Open Banking', revenue: '$90M', fitScore: 81, strategicFit: 'Good', recommendation: 'Monitor' },
  { company: 'PayBridge Solutions', industry: 'Payments', revenue: '$280M', fitScore: 86, strategicFit: 'Strong', recommendation: 'Evaluate synergies' },
  { company: 'WealthForge', industry: 'WealthTech', revenue: '$210M', fitScore: 79, strategicFit: 'Good', recommendation: 'Assess valuation' },
  { company: 'FinConnect API', industry: 'Open Banking', revenue: '$75M', fitScore: 76, strategicFit: 'Good', recommendation: 'Monitor' },
  { company: 'Digital Advisor Pro', industry: 'WealthTech', revenue: '$120M', fitScore: 73, strategicFit: 'Moderate', recommendation: 'Watch' },
  { company: 'Swiftline', industry: 'Payments', revenue: '$810M', fitScore: 69, strategicFit: 'Moderate', recommendation: 'Strategic fit limited' },
  { company: 'Clearline Digital', industry: 'Digital Banking', revenue: '$180M', fitScore: 84, strategicFit: 'Strong', recommendation: 'Explore partnership' },
  { company: 'NextGen Banking', industry: 'Digital Banking', revenue: '$240M', fitScore: 78, strategicFit: 'Good', recommendation: 'Evaluate acquisition' },
  { company: 'Crescent Wealth', industry: 'WealthTech', revenue: '$160M', fitScore: 72, strategicFit: 'Moderate', recommendation: 'Monitor' },
  { company: 'APIHub Financial', industry: 'Open Banking', revenue: '$55M', fitScore: 68, strategicFit: 'Moderate', recommendation: 'Early stage' },
];

async function seedDatabase() {
  console.log('Connecting to MongoDB...');
  await connectDB(MONGODB_URI);
  console.log('Connected. Starting seed...\n');

  const existingUsers = await User.countDocuments();
  if (existingUsers > 0) {
    console.log('Database already seeded. Skipping.');
    await mongoose.connection.close();
    return;
  }

  console.log('Creating users...');
  const createdUsers = await User.insertMany(users);
  const rahul = createdUsers[0];

  console.log('Creating clients...');
  const createdClients = await Client.insertMany(clients);
  const abcBank = createdClients[0];

  console.log('Creating industries...');
  await Industry.insertMany(industries);

  console.log('Creating competitors...');
  await Competitor.insertMany(competitors);

  console.log('Creating M&A transactions...');
  await MATransaction.insertMany(maTransactions);

  console.log('Creating potential targets...');
  await PotentialTarget.insertMany(potentialTargets);

  console.log('Creating pitchbooks with sections...');
  const pitchbookData = [
    { title: 'ABC National Bank — Strategic Transformation', clientName: 'ABC National Bank', industry: 'Financial Services', region: 'North America', client: abcBank._id, owner: rahul._id, status: 'ready', currentStage: 'Analysis' },
    { title: 'Meridian Financial — Digital Banking Expansion', clientName: 'Meridian Financial Group', industry: 'Financial Services', region: 'Europe', owner: rahul._id, status: 'ready', currentStage: 'Draft' },
    { title: 'Northstar Capital — Portfolio Optimization', clientName: 'Northstar Capital Partners', industry: 'Asset Management', region: 'North America', owner: rahul._id, status: 'draft', currentStage: 'Discovery' },
  ];

  for (const pb of pitchbookData) {
    const pitchbook = await Pitchbook.create(pb);
    let readyCount = 0;

    for (const key of SECTION_KEYS) {
      try {
        const generated = await generateSection(pitchbook, key);
        await PitchbookSection.create({
          pitchbook: pitchbook._id,
          sectionKey: key,
          title: SECTION_TITLES[key],
          content: generated.content,
          data: generated.data || {},
          status: 'ready',
        });
        readyCount += 1;

        if (key === 'strategicRecommendations' && generated.content?.recommendations) {
          const recDocs = generated.content.recommendations.map((r) => ({
            pitchbook: pitchbook._id,
            title: r.title,
            description: r.description || r.rationale || '',
            priority: r.priority || 'Medium',
            owner: r.owner || '',
            expectedImpact: r.expectedImpact || 'Medium',
            status: r.status || 'Not started',
          }));
          await Recommendation.insertMany(recDocs);
        }
      } catch (err) {
        console.error(`  Section ${key} failed:`, err.message);
      }
    }

    pitchbook.sectionsReady = readyCount;
    await pitchbook.save();
    console.log(`  Created: ${pitchbook.title} (${readyCount}/${SECTION_KEYS.length} sections)`);
  }

  console.log('Creating chat history...');
  const pitchbooks = await Pitchbook.find().lean();
  if (pitchbooks.length) {
    await ChatMessage.insertMany([
      { pitchbook: pitchbooks[0]._id, user: rahul._id, role: 'user', content: 'What are the biggest opportunities?', model: 'demo' },
      { pitchbook: pitchbooks[0]._id, user: rahul._id, role: 'assistant', content: 'The largest opportunities center on payments expansion ($420M), wealth management ($310M), and embedded banking ($180M). A focused M&A strategy can unlock $1.4B over 3 years.', model: 'demo' },
      { pitchbook: pitchbooks[0]._id, user: rahul._id, role: 'user', content: 'Which acquisition target is strongest?', model: 'demo' },
      { pitchbook: pitchbooks[0]._id, user: rahul._id, role: 'assistant', content: 'FlowPay is the strongest target with a 94 fit score (Excellent). It directly addresses the payments revenue gap.', model: 'demo' },
    ]);
  }

  console.log('\nSeed complete!');
  console.log(`  Users: ${await User.countDocuments()}`);
  console.log(`  Clients: ${await Client.countDocuments()}`);
  console.log(`  Industries: ${await Industry.countDocuments()}`);
  console.log(`  Competitors: ${await Competitor.countDocuments()}`);
  console.log(`  M&A: ${await MATransaction.countDocuments()}`);
  console.log(`  Targets: ${await PotentialTarget.countDocuments()}`);
  console.log(`  Pitchbooks: ${await Pitchbook.countDocuments()}`);
  console.log(`  Sections: ${await PitchbookSection.countDocuments()}`);
  console.log(`  Recommendations: ${await Recommendation.countDocuments()}`);
  console.log(`  Chat messages: ${await ChatMessage.countDocuments()}`);
  console.log('\nLogin: rahul@cedarbridge.ai / password123');

  await mongoose.connection.close();
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
