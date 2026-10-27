import { validateDecks } from './deck-validation';
export const storageKey = userId => `spaced-cards:v1:${userId || 'guest'}`;
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
export class DeckSync {
  constructor({userId, storage, load, save, changed}) {
    Object.assign(this, {userId, storage, load, save, changed});
    this.key = storageKey(userId);
    this.state = {decks: [], version: null, dirty: false, status: 'Loading', ready: false, conflict: false, error: ''};
    this.closed = false;
    this.loadedCloud = false;
    this.saving = false;
    this.localBlocked = false;
  }
  emit() { if (!this.closed) this.changed({...this.state}); }
  persist() {
    try {
      if (this.localBlocked) throw new Error('Local data could not be read. Export or recover it before editing.');
      this.storage.setItem(this.key, JSON.stringify({decks: this.state.decks, version: this.state.version, dirty: this.state.dirty}));
      return true;
    } catch { this.state.error = 'Local save failed. Export your decks before closing this page.'; this.state.status = 'Save failed'; return false; }
  }
  async start(readLocal = true) {
    try {
      const raw = readLocal ? this.storage.getItem(this.key) : null;
      if (raw) {
        const cached = JSON.parse(raw);
        validateDecks(cached.decks);
        Object.assign(this.state, {decks: cached.decks, version: cached.version ?? null, dirty: !!cached.dirty});
      }
    } catch { this.localBlocked = true; this.state.error = 'Local data could not be read. It has not been overwritten.'; this.state.status = 'Recovery required'; this.emit(); return; }
    this.state.ready = true;
    this.state.status = this.userId ? 'Loading cloud' : 'Saved on this device';
    this.emit();
    if (!this.userId) return;
    try {
      const cloud = await this.load();
      if (this.closed) return;
      validateDecks(cloud.decks);
      this.loadedCloud = true;
      if (this.state.dirty && equal(this.state.decks, cloud.decks)) {
        Object.assign(this.state, {version: cloud.version, dirty: false, status: 'Saved to cloud'});
        this.persist();
      }
      if (this.state.dirty && this.state.version !== cloud.version) {
        this.state.conflict = true; this.state.status = 'Conflict'; this.state.error = 'Cloud decks changed. Export local edits, then load the cloud copy.';
      } else if (!this.state.dirty) {
        Object.assign(this.state, {decks: cloud.decks, version: cloud.version, status: 'Saved to cloud'});
        this.persist();
      }
      this.emit();
      if (this.state.dirty && !this.state.conflict) this.queue();
    } catch { if (!this.closed) { this.state.status = 'Cloud unavailable'; this.state.error = 'Cloud load failed. Local edits are retained; retry when connected.'; this.emit(); } }
  }
  edit(update) {
    if (this.closed || !this.state.ready || this.localBlocked) return;
    const decks = typeof update === 'function' ? update(this.state.decks) : update;
    validateDecks(decks);
    if (equal(decks, this.state.decks)) return;
    this.state.decks = decks;
    this.state.dirty = !!this.userId;
    this.state.status = this.userId ? 'Unsaved changes' : 'Saved on this device';
    if (this.persist() && this.userId && this.loadedCloud && !this.state.conflict) this.queue();
    this.emit();
  }
  queue() { clearTimeout(this.timer); this.timer = setTimeout(() => this.flush(), 300); }
  async flush() {
    if (this.closed || this.saving || !this.loadedCloud || !this.state.dirty || this.state.conflict) return;
    this.saving = true;
    const decks = this.state.decks;
    const version = this.state.version;
    this.state.status = 'Saving'; this.state.error = ''; this.emit();
    try {
      const saved = await this.save(decks, version);
      if (this.closed) return;
      if (!equal(saved.decks, decks)) { const error = new Error(); error.status = 409; throw error; }
      this.state.version = saved.version;
      this.state.dirty = !equal(this.state.decks, decks);
      this.state.status = this.state.dirty ? 'Unsaved changes' : 'Saved to cloud';
      const persisted = this.persist();
      this.emit();
      if (persisted && this.state.dirty) this.queue();
    } catch (error) {
      if (!this.closed) {
        this.state.conflict = error.status === 409;
        this.state.status = this.state.conflict ? 'Conflict' : 'Save failed';
        this.state.error = this.state.conflict ? 'Another session changed these decks. Export local edits, then load the cloud copy.' : 'Cloud save failed. Your local edits are retained. Retry when connected.';
        this.emit();
      }
    } finally { this.saving = false; }
  }
  async retry() { if (!this.loadedCloud) return this.start(false); return this.flush(); }
  async useCloud() {
    if (this.closed || this.saving) return;
    try {
      // Preserve the user's current copy before replacing it, even when they choose cloud.
      const cloud = await this.load();
      if (this.closed) return;
      validateDecks(cloud.decks);
      this.storage.setItem(`${this.key}:backup:${Date.now()}`, JSON.stringify(this.state));
      Object.assign(this.state, {decks: cloud.decks, version: cloud.version, dirty: false, conflict: false, error: '', status: 'Saved to cloud'});
      this.loadedCloud = true; this.localBlocked = false; this.persist(); this.emit();
    } catch { this.state.error = 'Could not back up local edits or load cloud data. Nothing was replaced.'; this.emit(); }
  }
  externalChange() {
    if (this.closed) return;
    this.localBlocked = true;
    this.state.conflict = true; this.state.status = 'Conflict';
    this.state.error = 'Another tab changed local decks. Export edits before reloading this page.';
    clearTimeout(this.timer); this.emit();
  }
  close() { this.closed = true; clearTimeout(this.timer); }
}
