# Changelog

## 0.2.0 — 2026-11-04

- Preserve accented, Urdu and other international text instead of deleting non-ASCII characters.
- Add explicit input format, header and company-column controls.
- Parse quoted commas, escaped quotes, multiline values and standard CSV line endings.
- Default to conservative cleaning; descriptor removal is opt in. Preserve brand capitalization and meaningful commas.
- Remove hard-coded company overrides.
- Escape formula-like CSV exports by default.
- Extract a dependency-free reusable JavaScript core and add regression tests, CI and contribution guidance.
- Correct MIT license guidance.

### Migration

Download both index.html and core.js; the browser app is no longer a single-file download. Existing workflows relying on title casing, automatic first-row detection or unconditional descriptor removal must adjust to the explicit controls. Output now favors preserving the original brand over aggressive shortening. No npm registry publication is included in this release.
