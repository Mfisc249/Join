'use strict';

window.ContactsApp = window.ContactsApp || {};

ContactsApp.firebase = {
  async loadContacts() {
    const { CONTACTS_PATH } = ContactsApp.config;
    const data = await ContactsApp.api.get(CONTACTS_PATH);
    if (!data) return [];

    return Object.entries(data).map(([id, c]) => ({
      id,
      ...c,
      initials: c.initials || ContactsApp.validation.generateInitials(c.name || ''),
    }));
  },

  async updateContact(contactId, patch) {
    const { CONTACTS_PATH } = ContactsApp.config;
    return await ContactsApp.api.patch(`${CONTACTS_PATH}/${contactId}`, patch);
  },

  async deleteContact(contactId) {
    const { CONTACTS_PATH } = ContactsApp.config;
    return await ContactsApp.api.del(`${CONTACTS_PATH}/${contactId}`);
  },

  async getNextContactId() {
    const { CONTACTS_PATH } = ContactsApp.config;
    const data = (await ContactsApp.api.get(CONTACTS_PATH)) || {};

    const numbers = Object.keys(data)
      .map(k => k.match(/^c(\d+)$/))
      .filter(Boolean)
      .map(m => Number(m[1]));

    const next = numbers.length ? Math.max(...numbers) + 1 : 1;
    return `c${next}`;
  },

  async saveNewContact(contact) {
    const { CONTACTS_PATH } = ContactsApp.config;
    const contactId = await this.getNextContactId();

    const now = new Date().toISOString();
    const payload = { ...contact, id: contactId, createdAt: now, updatedAt: now };

    await ContactsApp.api.put(`${CONTACTS_PATH}/${contactId}`, payload);
    return contactId;
  },
};
