---
name: root-design
description: Use this skill to generate well-branded interfaces and assets for ROOT — a SaaS POS for restaurants in Colombia (backoffice, POS, waiter app, KDS, storefront) — either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, the logo/branding, iconography, and UI kit components.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, copy assets and read the rules here to become an expert in designing with the ROOT brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask a few questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation
- **Entry CSS:** link `styles.css` (it `@import`s all tokens + fonts). Every value is a CSS custom property — never hardcode color.
- **Brand:** negro `#0A0A0A` + índigo `#4F46E5`. Logo = faceted "R" in `assets/brand/` + `[ROOT]` wordmark (`.root-wordmark`). Inter for UI, Bebas Neue for display.
- **Signature:** Vercel aesthetic — translucent status badges (never solid fill), 1px borders, soft radii, subtle shadows with a ring in dark mode. Tabular-nums on all money. No emoji. Spanish (Colombia).
- **Icons:** Lucide via CDN.
- **Components:** `components/core/` (Button, Badge, Input, Card, KpiCard, Tabs, Avatar, Switch). Read each `.prompt.md` for usage.
- **UI kits:** `ui_kits/backoffice` (admin dashboard), `ui_kits/mesero` (mobile waiter app), `ui_kits/storefront` (public restaurant site). Open each `index.html` to see real product surfaces.
