---
name: advocu
description: >-
  Interact with the Advocu GDE Personal API to list reported activities, reconcile
  presentations in this repository against Advocu, create activity drafts (public
  speaking, content creation, workshops, mentoring, product feedback, interactions
  with Googlers, stories), and update existing activities. Use this skill whenever
  the user mentions Advocu, GDE activity reporting, checking if talks/presentations
  are logged in Advocu, or creating/updating Advocu drafts.
---

# Advocu GDE Activity Reporting Skill

This skill connects to the **Advocu GDE Personal API** (`https://api.advocu.com/personal-api/v1/gde`) using the `ADVOCU_TOKEN` environment variable or `.env` file.

## Quick Reference

- **Helper CLI:** [advocu.mjs](./scripts/advocu.mjs)
- **Full API Schema & Verified Tag Enums:** [api-reference.md](./references/api-reference.md)

---

## Core Rules

1. **Drafts Are Not Auto-Submitted:** `POST /activity-drafts/{type}` creates a **draft** in Advocu and returns `{"id": "<draftId>"}`. Always remind the user to review and submit the draft in the [Advocu portal](https://app.advocu.com/).
2. **Never Invent Metrics or Fields:** Do not fabricate attendee counts, view counts, countries, or URLs. Omit any optional field the user or source files did not provide.
3. **Never Log or Expose `ADVOCU_TOKEN`:** [advocu.mjs](./scripts/advocu.mjs) automatically loads `ADVOCU_TOKEN` from `process.env.ADVOCU_TOKEN` or `.env`. Do not echo the token in terminal commands.
4. **Use Verified Tag Enums:** Some legacy display tags returned by `GET /activities` (such as `"AI - Agents"` or `"AI - Generative AI"`) are rejected by the draft validator (`HTTP 400`). Check [api-reference.md](./references/api-reference.md) for verified tag strings (e.g. `"AI"`, `"AI - Gemini"`, `"Cloud - Serverless & Containers"`, `"Open Source"`, `"DevFest"`).

---

## Workflows

### 1. Check Which Presentations Are in Advocu

To compare a year's talks in `index.html` against submitted Advocu `public-speaking` and `youtube-video` activities:

```bash
node .agent/skills/advocu/scripts/advocu.mjs check-talks --year 2026
```

### 2. List Existing Advocu Activities

To list all activities (optionally filtered by `--year` or `--type`, or `--json` for raw output):

```bash
node .agent/skills/advocu/scripts/advocu.mjs list --year 2026
node .agent/skills/advocu/scripts/advocu.mjs list --type public-speaking
```

### 3. Create an Activity Draft

1. Gather metadata from the presentation folder (`index.md`, `README.md`), `index.html`, or user input.
2. Consult [api-reference.md](./references/api-reference.md) for the target `<type>` (`public-speaking`, `content-creation`, `workshop`, `mentoring`, `interaction-with-googlers`, `product-feedback-given`, `stories`).
3. Create the draft using [advocu.mjs](./scripts/advocu.mjs):

```bash
node .agent/skills/advocu/scripts/advocu.mjs create-draft public-speaking '{
  "title": "Talk Title",
  "description": "Talk abstract...",
  "tags": ["AI", "AI - Gemini", "Cloud - Serverless & Containers", "Open Source"],
  "eventFormat": "In-Person",
  "country": "Japan",
  "activityDate": "2026-07-29",
  "activityUrl": "https://example.com/session",
  "additionalInfo": "Video: https://...\nSlides: https://...",
  "private": false
}'
```

*(Or write the JSON payload to a scratch file and pass the file path as the second argument.)*

### 4. Update an Existing Activity

1. Run `list` first to find the exact `activityId`.
2. Patch the activity:

```bash
node .agent/skills/advocu/scripts/advocu.mjs update <activityId> '{"metrics":{"attendees":150}}'
```
