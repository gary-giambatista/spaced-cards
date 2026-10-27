import {defineConfig, globalIgnores} from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
export default defineConfig([
  ...nextVitals,
  // Existing hydration and account/card reset effects are retained during the
  // dependency migration. Flag them for follow-up without weakening other rules.
  {rules: {'react-hooks/set-state-in-effect': 'warn'}},
  globalIgnores(['.next/**', 'coverage/**']),
]);
