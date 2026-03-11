'use strict';

window.ContactsApp = window.ContactsApp || {};

/** @namespace ContactsApp.api */
ContactsApp.api = {
  /**
   * Sends a GET request to the Firebase database.
   * @param {string} path - The database path to query.
   * @returns {Promise<Object|null>} Parsed JSON response.
   */
  async get(path) {
    const { DB_URL } = ContactsApp.config;
    const res = await fetch(`${DB_URL}${path}.json`);
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return await res.json();
  },

  /**
   * Sends a PUT request to the Firebase database.
   * @param {string} path - The database path.
   * @param {Object} data - The data to write.
   * @returns {Promise<Object>} Parsed JSON response.
   */
  async put(path, data) {
    const { DB_URL } = ContactsApp.config;
    const res = await fetch(`${DB_URL}${path}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
    return await res.json();
  },

  /**
   * Sends a PATCH request to the Firebase database.
   * @param {string} path - The database path.
   * @param {Object} data - The data to merge.
   * @returns {Promise<Object>} Parsed JSON response.
   */
  async patch(path, data) {
    const { DB_URL } = ContactsApp.config;
    const res = await fetch(`${DB_URL}${path}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`PATCH ${path} failed: ${res.status}`);
    return await res.json();
  },

  /**
   * Sends a DELETE request to the Firebase database.
   * @param {string} path - The database path to delete.
   * @returns {Promise<boolean>} True on success.
   */
  async del(path) {
    const { DB_URL } = ContactsApp.config;
    const res = await fetch(`${DB_URL}${path}.json`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
    return true;
  },
};
