import Pitchbook from '../models/Pitchbook.js';
import PitchbookSection from '../models/PitchbookSection.js';
import Recommendation from '../models/Recommendation.js';
import { SECTION_KEYS, SECTION_TITLES, generateSection } from './aiService.js';

export async function generateFullPitchbook(pitchbookId) {
  const pitchbook = await Pitchbook.findById(pitchbookId);
  if (!pitchbook) throw Object.assign(new Error('Pitchbook not found'), { status: 404 });

  pitchbook.status = 'generating';
  await pitchbook.save();

  let readyCount = 0;

  for (const key of SECTION_KEYS) {
    try {
      const generated = await generateSection(pitchbook, key);
      await PitchbookSection.findOneAndUpdate(
        { pitchbook: pitchbookId, sectionKey: key },
        {
          pitchbook: pitchbookId,
          sectionKey: key,
          title: SECTION_TITLES[key],
          content: generated.content,
          data: generated.data || {},
          status: 'ready',
        },
        { upsert: true, new: true, runValidators: true }
      );
      readyCount += 1;

      if (key === 'strategicRecommendations') {
        await syncRecommendations(pitchbookId, generated.content);
      }
    } catch (err) {
      console.error(`Failed to generate section ${key}:`, err.message);
      await PitchbookSection.findOneAndUpdate(
        { pitchbook: pitchbookId, sectionKey: key },
        { pitchbook: pitchbookId, sectionKey: key, title: SECTION_TITLES[key], status: 'error', content: { error: err.message } },
        { upsert: true }
      );
    }
  }

  pitchbook.status = 'ready';
  pitchbook.sectionsReady = readyCount;
  await pitchbook.save();

  const sections = await PitchbookSection.find({ pitchbook: pitchbookId }).lean();
  return { pitchbook, sections };
}

export async function regenerateSection(pitchbookId, sectionKey) {
  if (!SECTION_KEYS.includes(sectionKey)) {
    throw Object.assign(new Error(`Invalid section key: ${sectionKey}`), { status: 400 });
  }
  const pitchbook = await Pitchbook.findById(pitchbookId);
  if (!pitchbook) throw Object.assign(new Error('Pitchbook not found'), { status: 404 });

  const generated = await generateSection(pitchbook, sectionKey);
  const section = await PitchbookSection.findOneAndUpdate(
    { pitchbook: pitchbookId, sectionKey },
    {
      pitchbook: pitchbookId,
      sectionKey,
      title: SECTION_TITLES[sectionKey],
      content: generated.content,
      data: generated.data || {},
      status: 'ready',
    },
    { upsert: true, new: true, runValidators: true }
  );

  if (sectionKey === 'strategicRecommendations') {
    await syncRecommendations(pitchbookId, generated.content);
  }

  return section;
}

async function syncRecommendations(pitchbookId, content) {
  const recs = content?.recommendations || [];
  if (!recs.length) return;
  await Recommendation.deleteMany({ pitchbook: pitchbookId });
  const docs = recs.map((r) => ({
    pitchbook: pitchbookId,
    title: r.title,
    description: r.description || r.rationale || '',
    priority: r.priority || 'Medium',
    owner: r.owner || '',
    expectedImpact: r.expectedImpact || 'Medium',
    status: r.status || 'Not started',
  }));
  await Recommendation.insertMany(docs);
}

export { SECTION_KEYS, SECTION_TITLES };
