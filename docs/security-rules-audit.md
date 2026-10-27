# Firestore rules review — October 27, 2026

The proposed firestore.rules denies every direct client read and write, including authenticated users. This is appropriate for the new Clerk-authenticated server API, which uses Firebase Admin. Admin SDK access bypasses these rules; server authorization, validation, IAM and credential protection are separate security boundaries.

Scoped rules assessment: 5/5, no direct-client authorization bypass found. This is not an overall application security score.

## Verification

All 47 tests in 11 suites passed using the local demo-spaced-cards emulator. No production user documents were read or modified.

The added rules suite checks 72 denials: four identities (anonymous, owner, another user, and an admin claim), four paths (owner deck, backup, another user's new deck, and arbitrary nested document), four document operations (read, create/overwrite, update, delete), plus two collection queries per identity.

The existing emulator tests verify real server transactions, concurrent-write conflicts, preservation of the original backup, and isolation of another user's data. API/unit tests separately exercise application authorization and synchronization.

## Mandatory checklist

- Create/update bypass: both unconditionally denied; role or owner edits cannot grant access.
- Authority source: neither user-supplied document fields nor token claims grant direct access.
- Business alignment: supports the new server-only API. It cannot enable the old browser Firebase writer.
- Storage abuse and type safety: every client write is rejected regardless of content. Server payload limits and schema validation remain necessary and are implemented separately.
- Identity-level security: all identities are denied, including owners and administrator claims.

## Deployment and credential observations

The live rules are still the old rule permitting access only before January 6, 2025. That deadline has passed, so they currently deny access. The reviewed replacement rules and server implementation remain in draft PR #2.

Vercel metadata confirms FIREBASE_SERVICE_ACCOUNT_JSON and FIREBASE_PROJECT_ID exist for Production, Preview and Development. Values were not retrieved. If the same production credential was copied to all three environments, remove the Preview/Development copies or replace them with credentials for an isolated test project. The server rejects project spaced-cards in Vercel Preview, but that guard does not protect a credential exposed to preview code.

Whitespace outside JSON strings may be removed. Preserve spaces within strings and the escaped newline sequences (backslash followed by n) in private_key. Do not remove those escapes or wrap the entire JSON object in extra quotes. A JSON-aware minifier is safer than manually editing; alternatively paste the original downloaded JSON intact. Do not paste the credential into chat or commit it.

Presence of an environment variable does not prove that its JSON, PEM key, project pairing, IAM permissions or live connection work. These remain unverified until a controlled server runtime test. CLI login does not supply Vercel runtime credentials.
