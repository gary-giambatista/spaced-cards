# Dependency modernization — October 27, 2026

Next.js 14.2.3 → 16.4.3, Clerk 5.2.2 → 7.9.21, React 18.3.1 → 19.2.9, Firebase Admin 13.10.0 → 14.5.0. Node is explicitly pinned to the deployed 24.x runtime. Direct dependency versions and the npm lockfile are pinned. SuperMemo remains exactly 2.0.17; no scheduler migration or stored-data migration occurs.

ClerkProvider now lives inside body, SignedIn/SignedOut become Show, and middleware.js becomes proxy.js. ESLint moves from removed next lint to ESLint 9 flat configuration. Browser Firebase is only a test dependency; the unused browser configuration was removed. Firebase emulator SDKs and Jest/Testing Library are upgraded.

The npm audit count fell from 53 (4 critical, 23 high, 23 moderate, 3 low) to zero. This reflects the npm advisory database at verification time, not a guarantee of vulnerability-free software. A gRPC 1.14.6 override repairs the Firebase test SDK's old transitive pin; revisit when upstream updates its dependency.

React lint exposed an existing mutation and misspelled hint field in card editing; edits now copy the card and update hint while preserving scheduling fields. Card filtering derives directly from current props, selection happens in the click handler, and account/deck changes remount the overview to discard stale editor state. Due badges use the existing derived due flag.

Validation: 39 unit/component/API tests plus 9 emulator tests; production build succeeds. Lint has no errors and seven existing effect-state warnings. Those existing hydration/account/card-reset effects remain warnings rather than causing unrelated component rewrites during this dependency migration. The React Compiler is not enabled.

Upgrade references:
- https://nextjs.org/docs/app/guides/upgrading/version-16
- https://clerk.com/docs/react/reference/components/control/show

Live two-account verification and production deployment results are recorded in the release report.
