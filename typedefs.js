/**
 * @namespace typedefs
 */

/**
 * @typedef card
 * @property {number} id
 * @property {string} question
 * @property {string} answer
 * @property {string} hint
 * @property {string} note
 * @property {number} interval
 * @property {number} repetition
 * @property {number} efactor
 * @property {number} due_date
 * @property {boolean} review_due
 * @property {number | null} last_answer
 * @property {number | null} last_practiced
 * @memberof typedefs
 */

/**
 * @typedef deck
 * @property {string} name
 * @property {number} id
 * @property {number} last_modified
 * @property {number | null} last_reviewed
 * @property {number} reviews_due
 * @property {card[]} cards
 * @memberof typedefs
 */
// Add Below properties:
// is_shared: false,
// author: userName ? userName : "anonymous",

export {};