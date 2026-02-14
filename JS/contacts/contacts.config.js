'use strict';

window.ContactsApp = window.ContactsApp || {};

ContactsApp.config = {
  DB_URL: 'https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app',
  CONTACTS_PATH: '/Contacts',
  TASKS_PATH: '/Tasks',
};

ContactsApp.state = {
  contacts: [],
  selectedContactId: null,
  isInitialized: false,
  modal: {
    mode: 'edit', // 'edit' | 'add'
    contactId: null,
  },
};
