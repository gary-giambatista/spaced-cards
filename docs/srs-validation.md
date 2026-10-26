# SRS validation — October 26, 2026

## Result
The installed SuperMemo 2.0.17 scheduler produces expected SM-2 schedules. The surrounding application had reproducible defects. Keep SM-2 for this repair so existing interval, repetition, ease, and due dates remain compatible. FSRS would need an explicit migration and separate validation; replacing the library alone would not fix these defects.

## Reproduced before changes
Three initial regression tests failed against the original production source:
- Study kept the answer visible when advancing to the next card; reviewing a card left its cached due flag true.
- Study accepted future cards when their cached due flag was stale.
- Reload stopped recalculating decks at the first empty deck, and did not count cards due at exactly the current time.

Additional code findings fixed:
- The Hard button used SM-2 grade 1 (failed recall). Ratings now distinguish Again=1, Hard=3, Good=4, Easy=5. Again keeps SM-2's one-day reset, not FSRS-style minute learning steps.
- Ratings could be submitted without revealing the answer.
- New empty decks were not persisted locally.
- Timestamp-only change detection could discard a second update in the same millisecond.
- Due indicators did not advance while the page remained open.

## Changes
Pure functions in library/srs.js handle scheduling, immutable due-state refresh, oldest-due selection, grade validation, and duplicate-review rejection. Due dates, not persisted booleans, determine eligibility. Study resets card presentation and recalculates review counts. Home refreshes due state, loads storage after mounting, and persists deck changes. Existing card fields and JSON format are retained; no data migration or production data writes were performed.

## Automated verification
Run `npm ci` then `npm test -- --runInBand`.

18 tests across five suites cover:
- Easy review sequence: 1, 6, 16 days; JSON round trips preserve scheduler state.
- Failed recall resets repetitions, hard successful recall advances them, ease bottoms at 1.3.
- Invalid grades, duplicate clicks, immutable updates, exact due boundaries, future flags, and empty decks.
- Real Home + Study interaction: reveal, rate, persist, reload, become due again; same-timestamp reviews; empty deck persistence.
- Firestore adapter serialization and read-failure preservation using mocked SDK calls.

These tests validate deterministic scheduling/application behavior, not real-world retention efficacy.

## Database limitations requiring follow-up
Live Firebase inspection is blocked until connector login is completed. The mock tests do not prove production database access or security.
- firebase.js targets project `spaced-cards`, default Firestore database.
- There is no Firebase Auth sign-in or Clerk-to-Firebase token exchange in the repository. A Clerk user ID used in a document path is not Firebase authentication. Deployed rules must be checked before concluding whether access is denied or overly permissive.
- Read/write helpers catch and log errors without surfacing them to the UI. fetchDecks also returns undefined, which is incompatible with a successful TanStack Query v5 result.
- Cloud writes do not consistently cover empty-deck creation, and concurrent full-deck writes can overwrite changes from another device.
- firebase.js references getApp without importing it when an app already exists.
- Local storage uses a shared `decks` key rather than an account-specific key. Account switching and offline/cloud conflict handling need a separate persistence repair.

No Firebase rules were weakened and no existing user documents were changed. This repair should be reviewed before production release. The application's older dependencies also need a separate security update; npm reported vulnerabilities during installation.
