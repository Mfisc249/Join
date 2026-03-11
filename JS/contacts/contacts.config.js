'use strict';

window.ContactsApp = window.ContactsApp || {};

/** @type {Object} Application configuration constants */
ContactsApp.config = {
  /** @type {string} Firebase Realtime Database URL */
  DB_URL: 'https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app',
  /** @type {string} Database path for contacts */
  CONTACTS_PATH: '/Contacts',
  /** @type {string} Database path for tasks */
  TASKS_PATH: '/Tasks',
};

/** @type {Object} Global application state */
ContactsApp.state = {
  contacts: [],
  selectedContactId: null,
  isInitialized: false,
  modal: {
    mode: 'edit', // 'edit' | 'add'
    contactId: null,
  },
};
