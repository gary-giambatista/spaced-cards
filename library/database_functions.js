// Same-origin session cookies authenticate requests. No user ID is accepted from the client.
async function request(options) {
  const response = await fetch('/api/decks', {credentials: 'same-origin', cache: 'no-store', ...options});
  const data = await response.json();
  if (!response.ok) { const error = new Error(data.error || 'Cloud request failed'); error.status = response.status; throw error; }
  return data;
}
export const loadCloudDecks = userId => request({headers: {'X-Deck-Owner': userId}});
export const saveCloudDecks = (decks, version, userId) => request({method: 'PUT', headers: {'Content-Type': 'application/json', 'X-Deck-Owner': userId}, body: JSON.stringify({decks, version})});
