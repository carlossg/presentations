# Advocu GDE Personal API Reference

## Base Configuration

| Setting | Value |
| :--- | :--- |
| **Base URL** | `https://api.advocu.com/personal-api/v1/gde` |
| **Authentication** | `Authorization: Bearer <ADVOCU_TOKEN>` |
| **Content-Type** | `application/json` |
| **Rate Limit** | 30 requests per minute per IP (`HTTP 429` when exceeded) |
| **Token Settings URL** | `https://app.advocu.com/settings/integrations/personal-api` |

---

## Endpoints

| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/activities` | Returns a pageable list of submitted activities (`{ "content": [...] }`), sorted by `submissionDate` ascending. |
| `PATCH` | `/activities/{activityId}` | Updates an existing activity. |
| `POST` | `/activity-drafts/public-speaking` | Creates a Public Speaking draft (`201 Created` returns `{"id":"..."}`). |
| `POST` | `/activity-drafts/content-creation` | Creates a Content Creation draft. |
| `POST` | `/activity-drafts/workshop` | Creates a Workshop draft. |
| `POST` | `/activity-drafts/mentoring` | Creates a Mentoring draft. |
| `POST` | `/activity-drafts/interaction-with-googlers` | Creates an Interaction with Googlers draft. |
| `POST` | `/activity-drafts/product-feedback-given` | Creates a Product Feedback draft. |
| `POST` | `/activity-drafts/stories` | Creates a Story draft. |

> **Important Notes:**
> - Draft endpoints create **drafts** in the Advocu portal (`{"id": "<draftId>"}`). They do **not** auto-submit; the user reviews and submits them in the Advocu portal.
> - `github-repository` and `youtube-video` appear in `GET /activities` (synced via Advocu integrations), but cannot be created or updated via draft endpoints.

---

## `GET /activities` Query Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `from` | string (ISO-8601) | — | Filter by `submissionDate` from (inclusive), e.g. `2026-01-01T00:00:00Z` |
| `to` | string (ISO-8601) | — | Filter by `submissionDate` to (exclusive) |
| `updatedAfter` | string (ISO-8601) | — | Filter activities updated after this timestamp |
| `page` | integer | `0` | 0-indexed page number |
| `size` | integer | `10` | Page size (`1`–`100`) |

> **Tip:** `from` and `to` filter by `submissionDate`, not `data.activityDate`. To filter by `activityDate` (the date the talk/content actually happened), fetch with `size=100` and filter client-side on `item.data.activityDate`.

---

## Draft Payload Schemas (`POST /activity-drafts/{type}`)

All draft fields are optional unless noted, but omit any field you do not have a value for (do not send empty strings `""` or `null`).

### 1. `public-speaking` & `workshop` & `mentoring`
- `POST /activity-drafts/public-speaking`
- `POST /activity-drafts/workshop`
- `POST /activity-drafts/mentoring`

| Field | Type | Rules / Enums |
| :--- | :--- | :--- |
| `title` | string | 3 to 200 characters |
| `description` | string | Max 2000 characters (plain text or basic HTML) |
| `tags` | string[] | Valid tag enum strings (see below) |
| `metrics` | object | `{ "attendees": <integer >= 1> }` |
| `eventFormat` | string | Enum: `"In-Person"`, `"Virtual"`, `"Hybrid"` |
| `country` | string | Country name (e.g., `"Japan"`, `"Netherlands"`, `"Spain"`, `"United States of America"`, `"Belgium"`). Send only for `"In-Person"` or `"Hybrid"`. |
| `inPersonAttendees` | integer | Integer `>= 0`. Send **only** when `eventFormat` is `"Hybrid"`. |
| `activityDate` | string | `YYYY-MM-DD` |
| `activityUrl` | string | Valid `http(s)://` URL, max 500 chars |
| `additionalInfo` | string | Max 2000 chars (e.g. slides & video links) |
| `private` | boolean | `false` (default) or `true` |

### 2. `content-creation`
- `POST /activity-drafts/content-creation`

| Field | Type | Rules / Enums |
| :--- | :--- | :--- |
| `contentType` | string | Enum: `"Articles"`, `"Books"`, `"Code contribution"`, `"Demos"`, `"Newsletters"`, `"Podcasts"`, `"Videos"` |
| `title` | string | 3 to 200 characters |
| `description` | string | Max 2000 characters |
| `tags` | string[] | Valid tag enum strings |
| `metrics` | object | `{ "readers": <integer >= 1> }` |
| `activityDate` | string | `YYYY-MM-DD` |
| `activityUrl` | string | Valid `http(s)://` URL, max 500 chars |
| `additionalInfo` | string | Max 2000 chars |
| `private` | boolean | `false` or `true` |

### 3. `interaction-with-googlers`
- `POST /activity-drafts/interaction-with-googlers`

| Field | Type | Rules / Enums |
| :--- | :--- | :--- |
| `title` | string | 3 to 200 characters |
| `description` | string | Max 2000 characters |
| `format` | string | Enum: `"Survey"`, `"Video feedback"`, `"In-person feedback sessions"`, `"Online feedback sessions"`, `"Feedback summits"`, `"User study / focus group"`, `"Feedback submissions"`, `"Other"` |
| `interactionType` | string | Enum: `"Product feedback (research studies, roadmap input, Customer Advisory Boards, EAP)"`, `"File bugs / help out with finding bugs"`, `"GitHub"`, `"Stack Overflow"`, `"Industry"`, `"Other interactions with Google Product Teams"` |
| `tags` | string[] | Valid tag enum strings |
| `metrics` | object | `{ "timeSpent": <integer minutes >= 1> }` |
| `activityDate` | string | `YYYY-MM-DD` |
| `additionalInfo` | string | Max 2000 chars |
| `additionalLinks` | string | Max 2000 chars |
| `private` | boolean | `false` or `true` |

---

## Verified Tag Enums

> **Warning:** Some tags returned by `GET /activities` from older portal submissions (such as `"AI - Agents"` or `"AI - Generative AI"`) are rejected by the `POST /activity-drafts/*` validator with `HTTP 400`. Stick to verified API enum values below, or if a tag fails with `400`, remove the offending tag reported in `details.error`.

Commonly used verified tags:
- `"AI"`
- `"AI - Gemini"`
- `"Cloud - AI Tools"`
- `"Cloud - App Development"`
- `"Cloud - Operations & Management"`
- `"Cloud - Serverless & Containers"`
- `"Cloud Build"`
- `"Cloud Functions (GCF)"`
- `"Cloud Run"`
- `"Containers"`
- `"Dev Ops"`
- `"DevFest"`
- `"Docker"`
- `"Golang"`
- `"Google Cloud"`
- `"Istio"`
- `"Java"`
- `"Kubernetes"`
- `"Kubernetes Engine (GKE)"`
- `"Open Source"`
- `"Security & Networking"`
- `"Web"`
- `"Web - AI for Web Developers"`
