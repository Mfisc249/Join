'use strict';

window.ContactsApp = window.ContactsApp || {};

ContactsApp.api = {
  async get(path) {
    const { DB_URL } = ContactsApp.config;
    const res = await fetch(`${DB_URL}${path}.json`);
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return await res.json();
  },

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

  async del(path) {
    const { DB_URL } = ContactsApp.config;
    const res = await fetch(`${DB_URL}${path}.json`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
    return true;
  },
};
