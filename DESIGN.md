---
version: alpha
name: Voltagent-Inspired-design-analysis
description: An inspired interpretation of Voltagent's design language — a developer-focused AI agent engineering platform whose surface is an unrelenting near-black canvas broken only by a single electric-green brand accent, code-editor mockups inside the hero, and a precise grid of dark feature cards that read like a documentation site dressed as marketing.
colors:
  primary: "#00d992"
  primary-soft: "#2fd6a1"
  primary-deep: "#10b981"
  on-primary: "#101010"
  ink: "#f2f2f2"
  ink-strong: "#ffffff"
  body: "#bdbdbd"
  mute: "#8b949e"
  hairline: "#3d3a39"
  hairline-soft: "#b8b3b0"
  canvas: "#101010"
  canvas-soft: "#1a1a1a"
  canvas-text-soft: "#f5f6f7"
typography:
  display-xl:
    fontFamily: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif
    fontSize: 60px
    fontWeight: 400
    lineHeight: 60px
    letterSpacing: -0.65px
  display-lg:
    fontFamily: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif
    fontSize: 36px
    fontWeight: 400
    lineHeight: 40px
    letterSpacing: -0.9px
  display-md:
    fontFamily: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif
    fontSize: 24px
    fontWeight: 700
    lineHeight: 32px
    letterSpacing: -0.6px
  display-sm:
    fontFamily: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif
    fontSize: 20px
    fontWeight: 600
    lineHeight: 28px
  eyebrow-mono:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: 2.52px
  eyebrow-uppercase:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 18px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: 0.45px
  body-lg:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 18px
    fontWeight: 400
    lineHeight: 28px
  body-md:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 26px
  body-md-strong:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
  body-sm:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  body-sm-strong:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 600
    lineHeight: 23px
  caption:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  caption-strong:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
  code:
    fontFamily: SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18px
  code-strong:
    fontFamily: SFMono-Regular, Menlo, Monaco, Consolas, monospace
    fontSize: 13px
    fontWeight: 550
    lineHeight: 16px
  button-md:
    fontFamily: Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 8px
  pill: 9999px
  full: 9999px
spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 32px
  4xl: 40px
  5xl: 48px
  6xl: 64px
components:
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    padding: "{spacing.md} {spacing.3xl}"
  nav-link:
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
  button-outline-on-dark:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
  button-ghost-green:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary-soft}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
  button-pill-tag:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xs} {spacing.md}"
  text-input:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
  card-feature:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.2xl}"
  card-feature-emphasized:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
  code-mockup:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.code}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
  code-inline-chip:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.canvas-text-soft}"
    typography: "{typography.code}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xxs} {spacing.sm}"
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: "{spacing.5xl} {spacing.3xl}"
  content-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: "{spacing.5xl} {spacing.3xl}"
  green-divider-band:
    backgroundColor: "{colors.canvas}"
    borderColor: "{colors.primary}"
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: "{spacing.4xl} {spacing.3xl}"
---

## Overview

Voltagent is an AI agent engineering platform built for developers, and the brand wears that audience proudly: a near-black `{colors.canvas}` (`#101010`) page background that runs edge-to-edge with no light-mode counterpart, a single electric-green accent (`{colors.primary}` `#00d992`) reserved for CTAs, status pills, and the brand lightning glyph, and a typography system that pairs sentence-case Inter with SF Mono for inline code and command snippets. The whole page reads like polished documentation that decided to also sell something.

**Key Characteristics:**
- A single electric-green accent `{colors.primary}` (`#00d992`) carries every CTA, every status pill, and the brand's lightning logo. No second accent.
- Dark canvas (`{colors.canvas}` `#101010`) is the only page surface — there is no light-mode rhythm; the entire site reads as one continuous dark surface broken by feature-card boundaries.
- Hairline-bordered feature cards (`{colors.hairline}` `#3d3a39`, 1 px solid) are the brand's primary chrome — no shadows, no fills, just precise hairline rectangles.
- Inter + SF Mono pair carries every typographic role. SF Mono is reserved for code blocks, inline command snippets, and metric counters.
- Buttons are tight 6 px rounded rectangles (not pills); only inline status tags use the 9999 px full pill.

## Colors

### Brand & Accent
- **Electric Green** (`{colors.primary}` — `#00d992`): The single brand accent. Every primary CTA, every status pill, every "live" indicator, the brand's lightning glyph itself. Reserved.
- **Primary Soft** (`{colors.primary-soft}` — `#2fd6a1`): A slightly more muted green used inside button-ghost variants and tooltip / focus indicators.
- **Primary Deep** (`{colors.primary-deep}` — `#10b981`): The darker green used for inline link colour in body copy.

### Surface
- **Canvas** (`{colors.canvas}` — `#101010`): The default near-black page background.
- **Canvas Soft** (`{colors.canvas-soft}` — `#1a1a1a`): A slightly lighter dark fill used inside code blocks and form inputs.
- **Hairline** (`{colors.hairline}` — `#3d3a39`): 1 px solid borders — feature cards, buttons, dividers between rows.

### Text
- **Ink** (`{colors.ink}` — `#f2f2f2`): Default text colour on the dark canvas.
- **Ink Strong** (`{colors.ink-strong}` — `#ffffff`): Pure-white text for hero headlines.
- **Body** (`{colors.body}` — `#bdbdbd`): Secondary text — supporting copy.
- **Mute** (`{colors.mute}` — `#8b949e`): Lowest-priority text — captions, footer.

## Typography

### Font Family
1. **Inter** for every display, body, button, and link role. Weights 400 / 500 / 600 / 700.
2. **SF Mono** (`SFMono-Regular` with Menlo / Monaco / Consolas fallbacks) for inline code, command snippets, and numeric counters.

### Hierarchy
| Token | Size | Weight | Letter Spacing | Use |
|---|---|---|---|---|
| `{typography.display-xl}` | 60px | 400 | -0.65px | Hero headline |
| `{typography.display-lg}` | 36px | 400 | -0.9px | Section headlines |
| `{typography.display-md}` | 24px | 700 | -0.6px | Sub-section / card-title |
| `{typography.display-sm}` | 20px | 600 | 0 | Card titles in dense grids |
| `{typography.eyebrow-mono}` | 14px | 600 | 2.52px | UPPERCASE eyebrow tags |
| `{typography.body-lg}` | 18px | 400 | 0 | Lead paragraphs |
| `{typography.body-md}` | 16px | 400 | 0 | Default body |
| `{typography.body-sm}` | 14px | 400 | 0 | Secondary body |
| `{typography.caption}` | 12px | 400 | 0 | Fine print |
| `{typography.code}` | 13px | 400 | 0 | Code blocks, inline command |
| `{typography.button-md}` | 16px | 600 | 0 | Button labels |

## Layout

### Spacing System
- **Base unit**: 2px.
- **Tokens**: `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 20px · `{spacing.2xl}` 24px · `{spacing.3xl}` 32px · `{spacing.4xl}` 40px · `{spacing.5xl}` 48px · `{spacing.6xl}` 64px.
- Card interior padding: `{spacing.2xl}` 24px on feature cards; `{spacing.5xl}` 48px on hero bands.

### Whitespace Philosophy
The dark canvas IS the whitespace. Sections separate by hairline borders and surface-level lifts, not by gaps in white.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow, no border | Default for body type, hero text |
| 1 (hairline) | `{colors.hairline}` 1px border | Default cards, code panels |
| 2 (surface lift) | `{colors.canvas-soft}` background + hairline | Code blocks, form inputs |
| 3 (focus ring) | `{colors.primary}` outline | Focused input, focused button |

The brand resists drop shadows entirely. Depth is carried by hairline borders + surface colour difference.

## Do's and Don'ts

### Do
- Use the single green accent for every CTA, status pill, and brand mark
- Use hairline borders (1px solid `#3d3a39`) as the primary card chrome
- Use Inter regular weight for large display text — don't shout
- Use SF Mono for anything that could be typed at a terminal
- Keep the canvas near-black `#101010` — no gradients, no mesh

### Don't
- Don't introduce a second chromatic accent — green is the only colour
- Don't use drop shadows — depth comes from hairlines and surface lifts
- Don't use pill buttons for primary CTAs — use 6px rounded rectangles
- Don't use decorative gradients or atmospheric backgrounds
- Don't use bold weights for hero headlines — regular weight with negative tracking

## Agent Prompt Guide

### Quick Color Reference
```
Background:  #101010 (canvas) / #1a1a1a (canvas-soft)
Text:        #f2f2f2 (ink) / #bdbdbd (body) / #8b949e (mute)
Accent:      #00d992 (primary green) — CTAs, status, brand only
Border:      #3d3a39 (hairline) — 1px solid on all cards
Font:        Inter (display+body) / SF Mono (code)
```

### Ready-to-use Prompt
```
Build a page using the DESIGN.md in the project root. The design system is:
near-black canvas (#101010), single electric-green accent (#00d992),
Inter font for all text, SF Mono for code. Cards use 1px hairline borders
(#3d3a39), no shadows. Buttons are 6px rounded rectangles. Display type
uses regular weight with negative letter-spacing. No gradients, no second
accent colour.
```
