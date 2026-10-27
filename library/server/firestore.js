import 'server-only';
import { cert, getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
export function database() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error('Firebase project is not configured');
  // Production credentials must never be made available to untrusted previews.
  if (process.env.VERCEL_ENV === 'preview' && projectId === 'spaced-cards') throw new Error('Production database is disabled for preview deployments');
  let app = getApps().find(app => app.name === 'deck-storage');
  if (!app) {
    const credentials = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    const serviceAccount = credentials ? JSON.parse(credentials) : null;
    if (serviceAccount && serviceAccount.project_id !== projectId) throw new Error('Firebase credential/project mismatch');
    app = initializeApp({projectId, credential: serviceAccount ? cert(serviceAccount) : applicationDefault()}, 'deck-storage');
  }
  return getFirestore(app);
}
