'use strict';

window.ContactsApp = window.ContactsApp || {};

/** @namespace ContactsApp.firebase */
ContactsApp.firebase = {
  /**
   * Loads all contacts from Firebase and returns them as an array.
   * @returns {Promise<Array<Object>>} Array of contact objects with IDs.
   */
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

  /**
   * Loads a single contact by its Firebase ID.
   * @param {string} contactId - The contact ID to look up.
   * @returns {Promise<Object|null>} The contact object, or null.
   */
  async loadContactById(contactId) {
    const { CONTACTS_PATH } = ContactsApp.config;
    const c = await ContactsApp.api.get(`${CONTACTS_PATH}/${contactId}`);
    if (!c) return null;

    return {
      id: contactId,
      ...c,
      initials: c.initials || ContactsApp.validation.generateInitials(c.name || ''),
    };
  },

  /**
   * Updates an existing contact with a partial patch.
   * @param {string} contactId - The contact ID to update.
   * @param {Object} patch - Key-value pairs to merge.
   * @returns {Promise<Object>} Updated contact data.
   */
  async updateContact(contactId, patch) {
    const { CONTACTS_PATH } = ContactsApp.config;
    return await ContactsApp.api.patch(`${CONTACTS_PATH}/${contactId}`, patch);
  },

  /**
   * Deletes a contact from Firebase.
   * @param {string} contactId - The contact ID to delete.
   * @returns {Promise<boolean>} True on success.
   */
  async deleteContact(contactId) {
    const { CONTACTS_PATH } = ContactsApp.config;
    return await ContactsApp.api.del(`${CONTACTS_PATH}/${contactId}`);
  },

  /**
   * Calculates the next sequential contact ID (e.g. "c5").
   * @returns {Promise<string>} The next available contact ID.
   */
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

  /**
   * Saves a new contact to Firebase with an auto-generated ID.
   * @param {Object} contact - The contact data to save.
   * @returns {Promise<string>} The generated contact ID.
   */
  async saveNewContact(contact) {
    const { CONTACTS_PATH } = ContactsApp.config;
    const contactId = await this.getNextContactId();

    const now = new Date().toISOString();
    const payload = { ...contact, id: contactId, createdAt: now, updatedAt: now };

    await ContactsApp.api.put(`${CONTACTS_PATH}/${contactId}`, payload);
    return contactId;
  },
};
