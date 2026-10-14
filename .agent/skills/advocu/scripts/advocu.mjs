#!/usr/bin/env node
/**
 * Advocu GDE Personal API CLI Helper
 *
 * Commands:
 *   node .agent/skills/advocu/scripts/advocu.mjs list [--year YYYY] [--type TYPE] [--json]
 *   node .agent/skills/advocu/scripts/advocu.mjs check-talks [--year YYYY]
 *   node .agent/skills/advocu/scripts/advocu.mjs create-draft <type> <json-file-or-inline-json>
 *   node .agent/skills/advocu/scripts/advocu.mjs update <activityId> <json-file-or-inline-json>
 */

import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'https://api.advocu.com/personal-api/v1/gde';

function loadToken() {
  if (process.env.ADVOCU_TOKEN) {
    return process.env.ADVOCU_TOKEN.trim();
  }
  const candidates = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(import.meta.dirname, '../../../../.env'),
  ];
  for (const envPath of candidates) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed.startsWith('ADVOCU_TOKEN=') || trimmed.startsWith('export ADVOCU_TOKEN=')) {
          return trimmed
            .replace(/^(export\s+)?ADVOCU_TOKEN=/, '')
            .trim()
            .replace(/^['"]|['"]$/g, '');
        }
      }
    }
  }
  console.error('Error: ADVOCU_TOKEN not found in environment or .env file.');
  process.exit(1);
}

async function fetchAllActivities(token) {
  const all = [];
  let page = 0;
  const size = 100;
  while (true) {
    const res = await fetch(`${BASE_URL}/activities?page=${page}&size=${size}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`GET /activities failed (${res.status}): ${errText}`);
    }
    const data = await res.json();
    const items = data.content || [];
    all.push(...items);
    if (items.length < size) {
      break;
    }
    page += 1;
  }
  return all;
}

function parseJsonArg(arg) {
  if (!arg) {
    console.error('Error: Missing JSON payload or file path argument.');
    process.exit(1);
  }
  if (fs.existsSync(arg)) {
    return JSON.parse(fs.readFileSync(arg, 'utf8'));
  }
  return JSON.parse(arg);
}

function getFlagValue(args, flag) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) {
    return args[idx + 1];
  }
  return null;
}

function parseTalksFromIndexHtml(htmlPath, targetYear) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const tbodyMatch = html.match(/<tbody id="talks">([\s\S]*?)<\/tbody>/);
  if (!tbodyMatch) {
    throw new Error(`Could not find <tbody id="talks"> in ${htmlPath}`);
  }
  const rows = [...tbodyMatch[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)];
  const talks = [];
  for (const row of rows) {
    const cells = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => m[1].trim());
    if (cells.length < 5) continue;
    const stripTags = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const extractHref = (s) => {
      const m = s.match(/href="([^"]+)"/);
      return m ? m[1] : '';
    };
    const title = stripTags(cells[0]);
    const slidesHref = extractHref(cells[0]);
    const videoUrl = extractHref(cells[1]);
    const conference = stripTags(cells[2]);
    const eventUrl = extractHref(cells[2]);
    const dateRaw = stripTags(cells[3]);
    const location = stripTags(cells[4]);
    const normalizedDate = dateRaw.split(' - ')[0].replace(/\//g, '-');
    if (targetYear && !normalizedDate.startsWith(targetYear)) {
      continue;
    }
    talks.push({
      date: normalizedDate,
      dateRaw,
      title,
      conference,
      location,
      slidesHref,
      videoUrl,
      eventUrl,
    });
  }
  return talks.sort((a, b) => a.date.localeCompare(b.date));
}

async function main() {
  const [, , command, ...args] = process.argv;
  if (!command || command === '--help' || command === '-h') {
    console.log(`Usage:
  node .agent/skills/advocu/scripts/advocu.mjs list [--year YYYY] [--type TYPE] [--json]
  node .agent/skills/advocu/scripts/advocu.mjs check-talks [--year YYYY]
  node .agent/skills/advocu/scripts/advocu.mjs create-draft <type> <json-file-or-inline-json>
  node .agents/skills/advocu/scripts/advocu.mjs update <activityId> <json-file-or-inline-json>`);
    process.exit(0);
  }

  const token = loadToken();

  if (command === 'list') {
    const year = getFlagValue(args, '--year');
    const type = getFlagValue(args, '--type');
    const asJson = args.includes('--json');

    let activities = await fetchAllActivities(token);
    if (year) {
      activities = activities.filter(
        (a) => (a.data?.activityDate || '').startsWith(year) || (a.submissionDate || '').startsWith(year)
      );
    }
    if (type) {
      activities = activities.filter((a) => a.type === type);
    }

    if (asJson) {
      console.log(JSON.stringify(activities, null, 2));
      return;
    }

    console.log(`Found ${activities.length} activities:\n`);
    for (const a of activities) {
      const date = a.data?.activityDate || a.submissionDate?.slice(0, 10) || 'N/A';
      const country = a.data?.country ? ` [${a.data.country}]` : '';
      console.log(`- [${date}] (${a.type}) ${a.data?.title || 'Untitled'}${country} — id: ${a.activityId}`);
    }
    return;
  }

  if (command === 'check-talks') {
    const year = getFlagValue(args, '--year') || new Date().getFullYear().toString();
    const htmlPath = path.resolve(process.cwd(), 'index.html');
    const talks = parseTalksFromIndexHtml(htmlPath, year);
    const activities = await fetchAllActivities(token);
    const speaking = activities.filter((a) => a.type === 'public-speaking');
    const videos = activities.filter((a) => a.type === 'youtube-video');

    const today = new Date().toISOString().slice(0, 10);
    console.log(`=== Advocu Talk Check for ${year} (as of ${today}) ===\n`);

    for (const talk of talks) {
      const isUpcoming = talk.date > today;
      const matchedTalk = speaking.find(
        (s) =>
          s.data?.activityDate === talk.date ||
          (s.data?.activityDate?.startsWith(year) &&
            s.data?.title?.toLowerCase() === talk.title.toLowerCase()) ||
          (talk.eventUrl && s.data?.activityUrl === talk.eventUrl)
      );
      const videoIdMatch = talk.videoUrl.match(/[?&]v=([^&]+)/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      const matchedVideo = videoId
        ? videos.find((v) => v.data?.videoData?.id === videoId || v.data?.activityUrl?.includes(videoId))
        : null;

      const status = matchedTalk
        ? `LOGGED (id: ${matchedTalk.activityId}, attendees: ${matchedTalk.data?.metrics?.attendees ?? '?'})`
        : isUpcoming
          ? 'UPCOMING'
          : 'MISSING';
      const videoStatus = talk.videoUrl
        ? matchedVideo
          ? ` | Video: SYNCED (id: ${matchedVideo.activityId})`
          : ` | Video: NOT SYNCED (${talk.videoUrl})`
        : '';

      console.log(`[${talk.date}] ${talk.conference} (${talk.location})`);
      console.log(`  Title:  ${talk.title}`);
      console.log(`  Status: ${status}${videoStatus}\n`);
    }
    return;
  }

  if (command === 'create-draft') {
    const [type, payloadArg] = args;
    if (!type) {
      console.error('Error: Missing draft type (e.g. public-speaking, content-creation, workshop, mentoring).');
      process.exit(1);
    }
    const payload = parseJsonArg(payloadArg);
    const url = `${BASE_URL}/activity-drafts/${type}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    console.log(`HTTP ${res.status}: ${text}`);
    if (!res.ok) {
      process.exit(1);
    }
    return;
  }

  if (command === 'update') {
    const [activityId, payloadArg] = args;
    if (!activityId) {
      console.error('Error: Missing activityId.');
      process.exit(1);
    }
    const payload = parseJsonArg(payloadArg);
    const url = `${BASE_URL}/activities/${activityId}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    console.log(`HTTP ${res.status}: ${text}`);
    if (!res.ok) {
      process.exit(1);
    }
    return;
  }

  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
