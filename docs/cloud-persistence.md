# Cloud persistence rollout

Status: implemented and locally tested; NOT deployed. Production still uses the old client and its expired Firestore rules. No production user documents or credentials were changed by this implementation.

## Architecture

Browser -> same-origin `/api/decks` -> Clerk session verification -> Firebase Admin SDK -> `users/{verifiedUserId}/decks/deck1`.

The browser sends an account guard (`X-Deck-Owner`) which must equal the verified session user. This guard prevents a request initiated for an old account from being processed under a newly switched session. It never grants access or selects a document path. PUT additionally checks Origin, JSON content type, body size, schema and revision. GET is dynamic/private/no-store. Direct Firestore access remains denied.

The existing `decks` JSON string format is preserved. Successful writes add schemaVersion=1. A Firestore transaction compares the original document's full update timestamp (seconds and nanoseconds). Competing saves receive 409. The first overwrite atomically saves the original document to `users/{userId}/deckBackups/before-server-persistence-v1`. The API cannot read or modify another user's document through client-supplied IDs.

Admin SDK access bypasses Firestore rules. Server authentication/authorization and IAM are therefore essential. Rules are an explicit denial of all mobile/web SDK reads and writes. They are prototypes validated by a compile dry run and local emulator tests, not a claim of exhaustive security certification.

## Local data and recovery

- Guest: `spaced-cards:v1:guest`.
- Signed-in: `spaced-cards:v1:{Clerk user ID}`.
- Each snapshot includes decks, cloud revision and a dirty flag.
- Legacy `decks` is preserved unchanged. It is unattributed and offered for explicit import, never auto-uploaded. Guest imports also require confirmation. Imported IDs are regenerated to prevent collisions.
- Edits are saved locally immediately; cloud requests are debounced and serialized. A failed request keeps the dirty local copy for retry.
- Newer cloud revisions and storage events from another tab stop automatic overwrites. Export edits before choosing the cloud copy. Choosing cloud also keeps a timestamped local backup.
- Account switches cancel queued saves and ignore stale responses. Signed-in cache is not displayed in guest mode or another account. Signing out retains per-account recovery copies on this device.
- Export backup downloads the current visible decks as JSON. Browser storage is not encrypted and should not be treated as protection from someone with access to the same browser profile.

## Required deployment configuration

A Firebase CLI login does not grant the Vercel server access. Configure server credentials before releasing this code:

1. Create a dedicated Google service account for this app in project `spaced-cards`. Grant the Firestore data access role `roles/datastore.user` (not Owner/Editor), scoped to the intended database where supported. The server account can access that database; per-user restrictions are enforced by the API.
2. For this implementation's supported secret-based setup, add the dedicated account's JSON credential directly to Vercel as a **Production-only secret** named `FIREBASE_SERVICE_ACCOUNT_JSON`. Never paste it into chat, commit it, or prefix it `NEXT_PUBLIC_`. Set `FIREBASE_PROJECT_ID=spaced-cards` in Production. Alternatively configure a working Google ADC/workload identity setup; the code uses ADC when the JSON secret is absent.
3. Do not expose production credentials/data to Preview. Use a separate Firebase test project and dedicated test credentials for preview testing. The code rejects the `spaced-cards` project when VERCEL_ENV=preview. Configure a matching Clerk publishable/secret-key pair for Preview as well; the existing Preview publishable key was absent during the initial audit.
4. Keep Clerk's existing keys in Production. Node 24 is already configured on Vercel.
5. Take a controlled cloud export/snapshot before production release if broader disaster recovery is needed. The implementation adds per-user pre-migration backups atomically at first save; it has not performed a project-wide export.
6. Deploy and verify a preview against test data: signed-out requests, two-account ownership isolation, create/edit/delete, review, reload, retry after failure and concurrent-tab conflict. Then stage a production build and verify before promotion.
7. Deploy the explicit deny-all rules with `firebase deploy --only firestore:rules --project spaced-cards` only as part of the reviewed release. The current expired rules already deny clients; do not extend their expiration.

## Tests

`npm test -- --runInBand` runs unit, component, API and sync tests. The emulator suite is intentionally skipped without its environment switch.

With Java 21+ and the Firebase CLI:

```
firebase emulators:exec --only firestore --project demo-spaced-cards 'RUN_FIRESTORE_INTEGRATION=1 npm test -- --runInBand __tests__/firestore.integration.test.js'
```

The integration suite requires a localhost emulator and uses only project `demo-spaced-cards`. It tests real transactional contention, immutable original backup, user-path separation and denied direct reads/writes/queries. It never contacts the production database.

Compile check without deployment:

```
firebase deploy --only firestore:rules --dry-run --project spaced-cards
```

## Remaining limits

- Live two-account Clerk/Vercel verification awaits deployment credentials and test accounts.
- Conflicts are surfaced, not automatically merged. Export/reload is the initial recovery path.
- Deck collections remain a single bounded document (700KB request maximum), preserving compatibility. Large collections need a future per-deck document migration.
- Dependency security upgrades and FSRS migration are separate work. Do not interpret a successful build as a dependency security audit.
