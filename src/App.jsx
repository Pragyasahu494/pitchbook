import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  CircleHelp,
  Clock3,
  Copy,
  FileBarChart,
  FileText,
  GripVertical,
  Lightbulb,
  Menu,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Search,
  Send,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { pitchbookService, aiService, marketService } from '@/services';

const SECTION_META = [
  { key: 'executiveSummary', id: 'summary', title: 'Executive Summary', type: 'AI-generated' },
  { key: 'clientSnapshot', id: 'snapshot', title: 'Client Snapshot', type: 'Client intelligence' },
  { key: 'industryOverview', id: 'industry', title: 'Industry Overview', type: 'AI-generated' },
  { key: 'keyTrends', id: 'trends', title: 'Key Trends', type: '6 signals identified' },
  { key: 'competitiveLandscape', id: 'competition', title: 'Competitive Landscape', type: 'AI-generated' },
  { key: 'growthOpportunities', id: 'opportunities', title: 'Growth Opportunities', type: '5 opportunities' },
  { key: 'recentMA', id: 'ma', title: 'Recent M&A', type: '15 transactions analyzed' },
  { key: 'potentialTargets', id: 'targets', title: 'Potential Targets', type: '12 targets identified' },
  { key: 'strategicRecommendations', id: 'recommendations', title: 'Strategic Recommendations', type: '4 actions' },
  { key: 'nextSteps', id: 'nextsteps', title: 'Next Steps', type: 'Roadmap' },
];

const fallbackSections = [
  {
    sectionKey: 'executiveSummary',
    title: 'Executive Summary',
    content: {
      clientOverview: 'ABC National Bank — Financial Services, North America',
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
  },
  {
    sectionKey: 'clientSnapshot',
    title: 'Client Snapshot',
    content: { client: 'ABC National Bank', industry: 'Financial Services', region: 'North America', revenue: '$12.0B', employees: 18000, growth: '+8.4%', engagementObjective: 'Strategic transformation and M&A advisory' },
  },
  {
    sectionKey: 'industryOverview',
    title: 'Industry Overview',
    content: { marketSize: '$1.8T', cagr: '8.7%', growth: '+10.2%', majorPlayers: ['First Meridian', 'Continental', 'Union Financial', 'ABC National'], industryStructure: 'Consolidated mid-cap with room for digital-first disruptors' },
    data: { chart: [42, 48, 45, 57, 68, 82, 94] },
  },
  {
    sectionKey: 'keyTrends',
    title: 'Key Trends',
    content: { trends: [
      { name: 'AI Transformation', impact: 'High', description: 'AI-driven customer service and risk modeling', direction: 'up', confidence: 92 },
      { name: 'Embedded Finance', impact: 'High', description: 'Banking-as-a-service integration into vertical SaaS', direction: 'up', confidence: 88 },
      { name: 'Payments Modernization', impact: 'Medium', description: 'Real-time payments and cross-border infrastructure', direction: 'up', confidence: 84 },
    ]},
  },
  {
    sectionKey: 'competitiveLandscape',
    title: 'Competitive Landscape',
    content: { peers: [
      { name: 'ABC National', revenue: '$12.0B', marketShare: 8.2, growth: '+8.4%' },
      { name: 'First Meridian', revenue: '$9.6B', marketShare: 6.5, growth: '+7.1%' },
      { name: 'Continental', revenue: '$7.3B', marketShare: 5.0, growth: '+6.3%' },
      { name: 'Union Financial', revenue: '$5.7B', marketShare: 3.9, growth: '+5.8%' },
    ], marketPosition: '#3 by total revenue', digitalAdoption: 'Top quartile' },
  },
  {
    sectionKey: 'growthOpportunities',
    title: 'Growth Opportunities',
    content: { opportunities: [
      { name: 'Payments Expansion', potential: '$420M', investment: 'High', expectedImpact: 'High', priority: 'High', rationale: 'Build scale through targeted platform acquisitions' },
      { name: 'Wealth Management', potential: '$310M', investment: 'Medium', expectedImpact: 'High', priority: 'High', rationale: 'Accelerate advisor-led growth with digital tooling' },
      { name: 'Embedded Banking', potential: '$180M', investment: 'Medium', expectedImpact: 'Medium', priority: 'Medium', rationale: 'Partner with high-growth vertical software platforms' },
    ]},
  },
  { sectionKey: 'recentMA', title: 'Recent M&A', content: { transactions: [] } },
  { sectionKey: 'potentialTargets', title: 'Potential Targets', content: { targets: [] } },
  { sectionKey: 'strategicRecommendations', title: 'Strategic Recommendations', content: { recommendations: [] } },
  { sectionKey: 'nextSteps', title: 'Next Steps', content: { stages: ['Discovery', 'Analysis', 'Draft', 'Review', 'Approval', 'Execution'], currentStage: 'Discovery', roadmap: [] } },
];

const fallbackMA = [
  { company: 'Northstar Payments', acquirer: 'Veridian Group', dealSize: '$1.2B', date: 'Jun 2025', industry: 'Payments' },
  { company: 'Atlas Wealth', acquirer: 'Riverton Capital', dealSize: '$640M', date: 'Apr 2025', industry: 'WealthTech' },
  { company: 'Clearline Digital', acquirer: 'First Meridian', dealSize: '$385M', date: 'Mar 2025', industry: 'Digital Banking' },
];

const fallbackTargets = [
  { company: 'FlowPay', industry: 'Payments', revenue: '$320M', fitScore: 94, strategicFit: 'Excellent', recommendation: 'Prioritize outreach' },
  { company: 'Ledgerly', industry: 'WealthTech', revenue: '$190M', fitScore: 88, strategicFit: 'Strong', recommendation: 'Build relationship' },
  { company: 'OpenCurrent', industry: 'Open Banking', revenue: '$90M', fitScore: 81, strategicFit: 'Good', recommendation: 'Monitor' },
];

const fallbackRecommendations = [
  { _id: 'r1', title: 'Launch a focused payments M&A program', priority: 'High', expectedImpact: 'High', owner: 'Corporate Development', status: 'In progress' },
  { _id: 'r2', title: 'Modernize the digital wealth experience', priority: 'High', expectedImpact: 'High', owner: 'Digital Banking', status: 'Not started' },
];

const navItems = [
  { label: 'Home', icon: BriefcaseBusiness },
  { label: 'PitchBooks', icon: FileText, count: 8 },
  { label: 'Clients', icon: Users },
  { label: 'Industries', icon: BarChart3 },
  { label: 'Market Data', icon: Activity },
  { label: 'Analytics', icon: FileBarChart },
  { label: 'Reports', icon: FileText },
];

function renderSectionBody(section, maData, targetsData, recommendations, onRecStatus) {
  const c = section.content;
  switch (section.sectionKey) {
    case 'executiveSummary':
      return (
        <>
          <p>
            <strong>ABC National Bank</strong> is a mid-cap financial services institution with $12B in revenue and 18,000 employees across North America. The bank is seeking a strategic transformation to accelerate digital adoption, expand its wealth management franchise, and pursue selective M&amp;A to build scale in payments and open banking.
          </p>
          <div className="subheading">KEY HIGHLIGHTS</div>
          <ul className="highlight-list">
            {(c.keyFindings || []).map((f, i) => <li key={i}>{f}</li>)}
          </ul>
          <div className="takeaway"><span>KEY TAKEAWAY</span><p>{c.mainOpportunity || 'A focused M&A and partnership strategy across payments, digital banking, and wealth management can unlock an estimated $1.4B in incremental revenue over 3 years.'}</p></div>
        </>
      );
    case 'clientSnapshot':
      return (
        <div className="snapshot-grid">
          <div><span>CLIENT</span><strong>{c.client}</strong></div>
          <div><span>INDUSTRY</span><strong>{c.industry}</strong></div>
          <div><span>REGION</span><strong>{c.region}</strong></div>
          <div><span>REVENUE</span><strong>{c.revenue}</strong></div>
          <div><span>EMPLOYEES</span><strong>{c.employees?.toLocaleString()}</strong></div>
          <div><span>GROWTH</span><strong className="positive">{c.growth}</strong></div>
        </div>
      );
    case 'industryOverview':
      return (
        <div className="industry-content">
          <div className="metric-row"><div><span>MARKET SIZE</span><strong>{c.marketSize}</strong></div><div><span>5-YEAR CAGR</span><strong className="positive">{c.cagr}</strong></div><div><span>2025 GROWTH</span><strong className="positive">{c.growth}</strong></div></div>
          <div className="mini-chart" aria-label="Industry growth chart"><div className="chart-labels"><span>Market growth outlook</span><span>2020 — 2025</span></div><div className="bars">{(section.data?.chart || [42,48,45,57,68,82,94]).map((h, i) => <i key={i} style={{height: `${h}%`}}></i>)}</div><div className="chart-axis"><span>2020</span><span>2021</span><span>2022</span><span>2023</span><span>2024</span><span>2025</span></div></div>
        </div>
      );
    case 'keyTrends':
      return (
        <div className="trend-list">{(c.trends || []).map((t, i) => (
          <div key={i}>
            <span className={`trend-icon ${i === 1 ? 'teal' : i === 2 ? 'blue' : ''}`}>
              {i === 0 ? <Zap size={14}/> : i === 1 ? <TrendingUp size={14}/> : <Activity size={14}/>}
            </span>
            <b>{t.name}</b>
            <small>{t.impact} impact · {t.confidence}% confidence</small>
          </div>
        ))}</div>
      );
    case 'competitiveLandscape':
      return (
        <div className="competition">
          <div className="share-chart">
            <div className="chart-labels"><span>Peer revenue comparison</span><span>$B</span></div>
            <div className="h-bars">{(c.peers || []).map((p, i) => {
              const pct = Math.round((parseFloat(p.revenue) / 12) * 100);
              return <div key={i}><span>{p.name}</span><i style={{width: `${pct}%`}}><em>{p.revenue}</em></i></div>;
            })}</div>
          </div>
          <div className="position-card"><span>MARKET POSITION</span><strong>#3</strong><small>by total revenue</small><div className="position-line"><i></i></div><small>Top quartile digital adoption</small></div>
        </div>
      );
    case 'growthOpportunities':
      return (
        <div className="opportunity-list">{(c.opportunities || []).map((o, i) => (
          <div key={i}>
            <span className={`priority ${o.priority?.toLowerCase()}`}>{o.priority?.toUpperCase()}</span>
            <b>{o.name}</b>
            <strong>{o.potential} potential</strong>
            <small>{o.rationale}</small>
          </div>
        ))}</div>
      );
    case 'recentMA': {
      const txns = c.transactions?.length ? c.transactions : maData;
      return (
        <div className="table-wrap"><table><thead><tr><th>Company</th><th>Acquirer</th><th>Deal size</th><th>Date</th></tr></thead><tbody>{txns.map((t, i) => <tr key={i}><td>{t.company}</td><td>{t.acquirer}</td><td>{t.dealSize}</td><td>{t.date}</td></tr>)}</tbody></table></div>
      );
    }
    case 'potentialTargets': {
      const targets = c.targets?.length ? c.targets : targetsData;
      return (
        <div className="table-wrap"><table><thead><tr><th>Company</th><th>Category</th><th>Fit score</th><th>Recommendation</th></tr></thead><tbody>{targets.map((t, i) => <tr key={i}><td><b>{t.company}</b></td><td>{t.industry}</td><td><span className={`fit ${t.strategicFit?.toLowerCase()}`}>{t.strategicFit} · {t.fitScore}</span></td><td>{t.recommendation}</td></tr>)}</tbody></table></div>
      );
    }
    case 'strategicRecommendations': {
      const recs = c.recommendations?.length ? c.recommendations : recommendations;
      return (
        <div className="recommendation-list">{recs.map((r, i) => (
          <div key={r._id || i}>
            <span className="rec-number">{String(i + 1).padStart(2, '0')}</span>
            <div><b>{r.title}</b><small>Owner: {r.owner} · Impact: {r.expectedImpact}</small></div>
            <button className="status-button" onClick={() => onRecStatus(r)}>{r.status} <ChevronDown size={13}/></button>
          </div>
        ))}</div>
      );
    }
    case 'nextSteps': {
      const stages = c.stages || ['Discovery', 'Analysis', 'Draft', 'Review', 'Approval', 'Execution'];
      return (
        <div className="trend-list">{stages.map((s, i) => (
          <div key={i}><span className="trend-icon"><Activity size={14}/></span><b>{s}</b><small>{i === 0 ? 'Completed' : i === 1 ? 'Active' : 'Pending'}</small></div>
        ))}</div>
      );
    }
    default:
      return <p>Section content unavailable.</p>;
  }
}

function App() {
  const [activeNav, setActiveNav] = useState('Home');
  const [openSections, setOpenSections] = useState(['summary', 'snapshot', 'industry', 'trends', 'competition', 'opportunities', 'ma', 'targets', 'recommendations', 'nextsteps']);
  const [copilotOpen, setCopilotOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [notice, setNotice] = useState('');
  const [pitchbook, setPitchbook] = useState(null);
  const [sections, setSections] = useState(fallbackSections);
  const [recommendations, setRecommendations] = useState(fallbackRecommendations);
  const [maData, setMaData] = useState(fallbackMA);
  const [targetsData, setTargetsData] = useState(fallbackTargets);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);

  const showNotice = useCallback((msg) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(''), 2400);
  }, []);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const pitchbooks = await pitchbookService.list();
      if (pitchbooks && pitchbooks.length) {
        const pb = pitchbooks[0];
        setPitchbook(pb);
        if (pb.sections && pb.sections.length) {
          setSections(pb.sections);
        }
        if (pb.recommendations && pb.recommendations.length) {
          setRecommendations(pb.recommendations);
        }
        try {
          const history = await aiService.history(pb._id);
          if (history && history.length) {
            setMessages(history.map((m) => ({ role: m.role, text: m.content })));
          }
        } catch {}
      }
    } catch (err) {
      console.warn('Backend not available, using fallback data:', err.message);
    }
    try {
      const [ma, targets] = await Promise.all([marketService.ma(), marketService.targets()]);
      if (ma && ma.length) setMaData(ma.slice(0, 5));
      if (targets && targets.length) setTargetsData(targets.slice(0, 3));
    } catch (err) {
      console.warn('Market data not available, using fallback:', err.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const visibleSections = useMemo(() => {
    const meta = SECTION_META.filter((m) => !query || m.title.toLowerCase().includes(query.toLowerCase()));
    return meta.map((m) => {
      const found = sections.find((s) => s.sectionKey === m.key);
      return found ? { ...found, id: m.id, type: m.type } : { ...m, content: {}, sectionKey: m.key };
    });
  }, [query, sections]);

  const toggleSection = (id) => setOpenSections((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const collapseAll = () => setOpenSections(openSections.length ? [] : SECTION_META.map((m) => m.id));

  const sendPrompt = useCallback(async (text) => {
    if (!text.trim() || chatLoading) return;
    setChatLoading(true);
    setMessages((current) => [...current, { role: 'user', text }]);
    try {
      if (pitchbook?._id) {
        const data = await aiService.chat(text, pitchbook._id);
        setMessages((current) => [...current, { role: 'assistant', text: data.assistantMessage.content }]);
      } else {
        setMessages((current) => [...current, { role: 'assistant', text: 'Please generate a pitchbook first so I can answer questions with real context.' }]);
      }
    } catch (err) {
      setMessages((current) => [...current, { role: 'assistant', text: 'I could not reach the AI service. Please make sure the backend is running and try again.' }]);
    }
    setChatLoading(false);
  }, [pitchbook, chatLoading]);

  const generate = useCallback(async () => {
    if (!pitchbook?._id) {
      showNotice('No pitchbook selected');
      return;
    }
    setGenerating(true);
    showNotice('Generating pitchbook sections...');
    try {
      const result = await pitchbookService.generate(pitchbook._id);
      if (result.sections) setSections(result.sections);
      if (result.pitchbook) setPitchbook(result.pitchbook);
      showNotice('Pitchbook updated successfully');
    } catch (err) {
      showNotice('Generation failed — is the backend running?');
    }
    setGenerating(false);
  }, [pitchbook, showNotice]);

  const regenerateSection = useCallback(async (sectionKey, title) => {
    if (!pitchbook?._id) {
      showNotice('No pitchbook selected');
      return;
    }
    showNotice(`Regenerating ${title}...`);
    try {
      const updated = await pitchbookService.regenerateSection(pitchbook._id, sectionKey);
      setSections((current) => current.map((s) => s.sectionKey === sectionKey ? updated : s));
      showNotice(`${title} regenerated`);
    } catch (err) {
      showNotice(`Failed to regenerate ${title}`);
    }
  }, [pitchbook, showNotice]);

  const cycleRecStatus = useCallback(async (rec) => {
    const next = rec.status === 'Not started' ? 'In progress' : rec.status === 'In progress' ? 'Completed' : rec.status === 'Completed' ? 'Reopened' : 'Not started';
    setRecommendations((current) => current.map((r) => r._id === rec._id ? { ...r, status: next } : r));
    try {
      if (pitchbook?._id && rec._id && rec._id !== 'r1' && rec._id !== 'r2') {
        await pitchbookService.updateRecommendation(rec._id, { status: next });
        showNotice('Recommendation updated');
      }
    } catch (err) {
      showNotice('Could not save recommendation');
    }
  }, [pitchbook, showNotice]);

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="mobile-overlay" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
      <aside className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
        <div className="brand"><div className="brand-mark"><Sparkles size={17}/></div><div><strong>CedarBridge</strong><span>AI workspace</span></div><button className="mobile-close" onClick={() => setSidebarOpen(false)}><X size={18}/></button></div>
        <div className="workspace-switch"><div className="workspace-avatar">RS</div><div><b>Rahul Sharma</b><span>Senior Advisor</span></div><ChevronsUpDown size={15}/></div>
        <div className="sidebar-label">WORKSPACE</div>
        <nav>{navItems.map(({ label, icon: Icon, count }) => <button key={label} className={`nav-item ${activeNav === label ? 'active' : ''}`} onClick={() => { setActiveNav(label); setSidebarOpen(false); }}><Icon size={17}/><span>{label}</span>{count && <em>{count}</em>}</button>)}</nav>
        <div className="sidebar-label lower">MANAGE</div>
        <nav><button className="nav-item" onClick={() => setActiveNav('Settings')}><Settings size={17}/><span>Settings</span></button><button className="nav-item" onClick={() => showNotice('Help center is coming soon')}><CircleHelp size={17}/><span>Help center</span></button></nav>
        <div className="sidebar-bottom"><div className="plan-card"><div><span>WORKSPACE USAGE</span><b>68% of monthly credits</b></div><div className="progress"><i></i></div><button>Manage plan <ArrowUpRight size={13}/></button></div><button className="user-row"><div className="user-avatar">RS</div><div><b>Rahul Sharma</b><span>Senior Advisor</span></div><MoreHorizontal size={16}/></button></div>
      </aside>

      <main className="main-area">
        <header className="topbar"><button className="menu-button" onClick={() => setSidebarOpen(true)}><Menu size={20}/></button><div className="breadcrumb"><span>{activeNav === 'Home' ? 'Workspace' : activeNav}</span><ChevronRight size={14}/><b>AI PitchBook Builder</b></div><div className="top-actions"><div className="search-box"><Search size={16}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search clients, pitchbooks, industries..."/><kbd>⌘ K</kbd></div><button className="icon-button"><Bell size={17}/><i></i></button><button className="top-avatar">RS</button></div></header>
        <div className="page-content"><div className="page-heading"><div><div className="eyebrow"><span className="live-dot"></span> WORKSPACE / PITCHBOOKS</div><h1>AI PitchBook Builder</h1><p>Build a decision-ready strategic pitchbook with AI.</p></div><div className="heading-actions"><button className="secondary-button"><Clock3 size={15}/> Save draft</button><button className="primary-button" onClick={generate} disabled={generating}><Sparkles size={15}/>{generating ? 'Generating...' : 'Generate pitchbook'}</button></div></div>
          <div className="context-bar"><div className="context-client"><div className="client-logo">AB</div><div><span>SELECTED CLIENT</span><b>{pitchbook?.clientName || 'ABC National Bank'} <ChevronDown size={14}/></b></div></div><div className="context-divider"></div><div className="context-stat"><span>INDUSTRY</span><b>{pitchbook?.industry || 'Financial Services'}</b></div><div className="context-stat"><span>LAST UPDATED</span><b>{pitchbook?.updatedAt ? new Date(pitchbook.updatedAt).toLocaleDateString() : 'Just now'}</b></div><div className="completion"><span>{pitchbook?.sectionsReady || 9} / 10 sections ready</span><div className="tiny-progress"><i></i></div></div></div>
          {notice && <div className="toast"><Sparkles size={15}/>{notice}</div>}
          {loading && <div className="toast"><Sparkles size={15}/>Loading from backend...</div>}
          <div className="preview-header"><div className="preview-title"><div className="preview-icon"><FileText size={17}/></div><div><h2>PitchBook Preview</h2><p>Live preview of your AI-generated advisory pitchbook.</p></div></div><button className="collapse-button" onClick={collapseAll}>{openSections.length ? 'Collapse all' : 'Expand all'}<ChevronsUpDown size={14}/></button></div>
          <div className="sections-list">{visibleSections.map((section, index) => { const isOpen = openSections.includes(section.id); return <article className={`section-card ${isOpen ? 'is-open' : ''}`} key={section.id}><button className="section-head" onClick={() => toggleSection(section.id)}><GripVertical size={15} className="drag"/><span className="section-number">{String(index + 1).padStart(2, '0')}</span><div className="section-title"><h3>{section.title}</h3><span><i className={section.id === 'summary' || section.id === 'industry' || section.id === 'competition' ? 'ai-status' : 'green-status'}></i>{section.type}</span></div><div className="section-actions"><button onClick={(event) => { event.stopPropagation(); navigator.clipboard?.writeText(JSON.stringify(section.content, null, 2)); showNotice(`${section.title} copied to clipboard`); }} title="Copy"><Copy size={15}/></button><button onClick={(event) => { event.stopPropagation(); regenerateSection(section.sectionKey, section.title); }} title="Regenerate"><RefreshCw size={15}/></button><button onClick={(event) => { event.stopPropagation(); showNotice(`Editing ${section.title}`); }} title="Edit"><Pencil size={15}/></button><ChevronDown size={17} className="section-chevron"/></div></button>{isOpen && <div className="section-body">{renderSectionBody(section, maData, targetsData, recommendations, cycleRecStatus)}</div>}</article>; })}</div>
        </div>
        <footer className="bottom-bar"><div className="ready-state"><i></i><span>PitchBook ready</span><small>All changes saved</small></div><div className="bottom-actions"><button><FileText size={15}/> PDF</button><button><FileBarChart size={15}/> PPT</button><button><ArrowUpRight size={15}/> Share</button><button className="primary-button" onClick={generate}><Sparkles size={15}/> Generate pitchbook</button></div></footer>
      </main>

      <aside className={`copilot ${copilotOpen ? '' : 'closed'}`}><div className="copilot-header"><div className="copilot-title"><div className="bot-icon"><Bot size={18}/><i></i></div><div><h2>CedarBridge Copilot</h2><span><i></i> Online</span></div></div><div className="copilot-controls"><button><span>GPT-4o</span><ChevronDown size={13}/></button><button onClick={() => setCopilotOpen(false)}><X size={16}/></button></div></div>{copilotOpen && <><div className="copilot-body"><div className="copilot-intro"><div className="intro-icon"><Sparkles size={16}/></div><div><b>Hi Rahul</b><p>How can I help with today's pitchbook?</p></div></div><div className="suggestion-label">SUGGESTED PROMPTS</div><div className="suggestions">{['Generate Executive Summary','Analyze Industry','SWOT Analysis','Competitive Landscape','Growth Opportunities','M&A Targets','What should management do next?'].map((prompt) => <button key={prompt} onClick={() => sendPrompt(prompt)} disabled={chatLoading}><span className="suggestion-symbol"><Lightbulb size={14}/></span>{prompt}<ChevronRight size={14}/></button>)}</div>{messages.map((message, index) => <div key={index} className={`chat-message ${message.role}`}>{message.role === 'assistant' && <Bot size={14}/>}<p>{message.text}</p></div>)}{chatLoading && <div className="chat-message assistant"><Bot size={14}/><p>Thinking...</p></div>}</div><div className="copilot-compose"><textarea placeholder="Ask anything about this pitchbook..." onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendPrompt(event.currentTarget.value); event.currentTarget.value = ''; } }} /><button onClick={() => { const field = document.querySelector('.copilot-compose textarea'); sendPrompt(field.value); field.value = ''; }} disabled={chatLoading}><Send size={16}/></button></div><div className="copilot-disclaimer">AI-generated content is illustrative. Verify figures before client delivery.</div></>}</aside>
    </div>
  );
}

export default App;
