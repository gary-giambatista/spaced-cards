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

## Persistence follow-up
Firebase login now works. The deployed rules expired January 6, 2025, explaining rejected client access. The subsequent authenticated-server persistence implementation and remaining deployment requirements are documented in [cloud-persistence.md](cloud-persistence.md). The original Firestore adapter mocks were replaced with API and synchronization tests; the original 18-test count above records the initial SRS repair, not the expanded suite. The source still uses SM-2 and retains existing schedules.
