# Diary Module Design

## Overview

Add a new diary content module to the Hugo theme, similar to the existing Books module.

## Requirements Summary

- **Content type**: `diary` (independent from posts)
- **List page**: Simple list with date and title, no sidebar
- **Single page**: Clean display with no comments, share, or post navigation
- **Front matter fields**: `title`, `date`, `weather`, `mood`, `location`
- **Visibility**: Fully public (no password protection)
- **Pagination**: Supported

## File Structure

```
content/diary/
  _index.md
  2024-03-15-my-first-diary.md
  2024-02-10-spring.md

layouts/diary/
  list.html
  single.html

assets/scss/partial/diary.scss

i18n/en.yaml
i18n/zh.yaml
```

## Front Matter

```yaml
---
title: 日记标题
date: 2024-03-15
weather: sunny   # sunny, cloudy, rainy, snowy, night
mood: happy     # happy, neutral, sad, excited, tired
location: 上海
---
正文内容...
```

## List Page Layout

```
┌─────────────────────────────────────────────────┐
│  📔 Diary                          10 entries  │
├─────────────────────────────────────────────────┤
│                                                  │
│  2024-03-15    日记标题                          │
│  2024-03-10    日记标题                          │
│  2024-02-28    日记标题                          │
│                                                  │
│  [Pagination]                                    │
│                                                  │
└─────────────────────────────────────────────────┘
```

- Date format: `2006-01-02` (configurable via `dateFormat`)
- Sorted by date descending
- Pagination via `{{ partial "pagination.html" . }}`
- No sidebar

## Single Page Layout

```
┌─────────────────────────────────────────────────┐
│  日记标题                                        │
│  2024-03-15 · 上海 · ☀️ · 😊                    │
├─────────────────────────────────────────────────┤
│                                                  │
│  正文内容...                                      │
│                                                  │
└─────────────────────────────────────────────────┘
```

- Header: title, date, location, weather icon, mood icon
- Content: rendered markdown
- **No comments** (even if globally enabled)
- **No share buttons**
- **No previous/next post navigation**

## Implementation Details

### 1. Content Structure

- Create `content/diary/_index.md` as the section index
- Diary files named with date prefix: `YYYY-MM-DD-title.md`
- Section defined via `content/diary/_index.md` with `title: Diary`

### 2. List Template (`layouts/diary/list.html`)

- Use `{{ define "main" }}` block
- Query all diary pages: `{{ .Pages }}`
- Sort by date descending
- Render list items with date and title
- Include pagination partial
- No sidebar

### 3. Single Template (`layouts/diary/single.html`)

- Header section with metadata (date, location, weather, mood)
- Weather/mood rendered as icons/text
- No comments partial inclusion
- No share partial inclusion
- No page_nav partial inclusion
- Standard content rendering

### 4. SCSS (`assets/scss/partial/diary.scss`)

- `#diary` container
- `.diary-header` - title and entry count
- `.diary-list` - post list styles
- `.diary-entry` - single entry with date and title
- `.diary-meta` - location, weather, mood display on single page
- Import in `style.scss`

### 5. Internationalization

Add to `i18n/en.yaml`:
```yaml
- id: diary.title
  translation: "Diary"

- id: diary.entries
  translation: "{count} entries"
```

Add to `i18n/zh.yaml`:
```yaml
- id: diary.title
  translation: "日记"

- id: diary.entries
  translation: "{count} 篇"
```

### 6. Configuration

```toml
[[menu.main]]
name = "Diary"
url = "/diary"
weight = 3

[params.diary]
diaryPerPage = 10
```

### 7. Main Sections

Add `diary` to `mainSections` in config so it appears on homepage.

## Files to Create/Modify

### Create
- `layouts/diary/list.html`
- `layouts/diary/single.html`
- `assets/scss/partial/diary.scss`
- `content/diary/_index.md`
- Example diary content file

### Modify
- `assets/scss/style.scss` - add diary import
- `i18n/en.yaml` - add diary translations
- `i18n/zh.yaml` - add diary translations (if exists)
- `exampleSite/config.toml` - add menu and params

## Testing

1. Add diary content files
2. Run `hugo server`
3. Verify `/diary` list page displays correctly
4. Verify diary single page has no comments/share/nav
5. Verify pagination works
6. Verify weather/mood/location display correctly
