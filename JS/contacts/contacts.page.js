'use strict';

window.ContactsApp = window.ContactsApp || {};

/** @namespace ContactsApp.page */
ContactsApp.page = {
  /** Initialises the contacts page — loads data, renders list, binds buttons. */
  async init() {
    if (ContactsApp.state.isInitialized) return;

    try {
      ContactsApp.state.contacts = await ContactsApp.firebase.loadContacts();

      // Ensure current user's contact is present in the list (if applicable)
      await this._ensureCurrentUserContactInList();

      ContactsApp.uiList.renderContactsList(ContactsApp.state.contacts);

      this._bindButtons();
      ContactsApp.uiModal.initModalListeners();

      ContactsApp.state.isInitialized = true;
    } catch (err) {
      this._showListError('Kontakte konnten nicht geladen werden.');
    }
  },

  /** Adds the logged-in user's own contact to the list if missing. */
  async _ensureCurrentUserContactInList() {
    const isGuest = sessionStorage.getItem('isGuest') === 'true';
    const myId = sessionStorage.getItem('contactId');

    if (isGuest || !myId) return;

    const alreadyInList = ContactsApp.state.contacts.some(c => c.id === myId);
    if (alreadyInList) return;

    const me = await ContactsApp.firebase.loadContactById(myId);
    if (!me) return;

    // add to the beginning so the user is visible
    ContactsApp.state.contacts.unshift(me);
  },

  /** Binds click listeners to add, edit, and delete buttons. */
  _bindButtons() {
    const addBtn = document.getElementById('addContactBtn');
    const editBtn = document.getElementById('editBtn');
    const delBtn = document.getElementById('deleteBtn');

    if (addBtn && !addBtn.dataset.listenerAdded) {
      addBtn.addEventListener('click', () => ContactsApp.uiModal.open('add'));
      addBtn.dataset.listenerAdded = 'true';
    }

    if (editBtn && !editBtn.dataset.listenerAdded) {
      editBtn.addEventListener('click', () => this._openEdit());
      editBtn.dataset.listenerAdded = 'true';
    }

    if (delBtn && !delBtn.dataset.listenerAdded) {
      delBtn.addEventListener('click', () => this._deleteSelected());
      delBtn.dataset.listenerAdded = 'true';
    }
  },

  /** Opens the edit modal for the currently selected contact. */
  _openEdit() {
    const id = ContactsApp.state.selectedContactId;
    if (!id) return this._showListError('Kein Kontakt ausgewählt.');

    const contact = ContactsApp.state.contacts.find(c => c.id === id);
    if (!contact) return this._showListError('Kontakt nicht gefunden.');

    ContactsApp.uiModal.open('edit', contact);
  },

  /** Deletes the selected contact after confirmation and refreshes the list. */
  async _deleteSelected() {
    const id = ContactsApp.state.selectedContactId;
    if (!id) return this._showListError('Kein Kontakt ausgewählt.');

    const contact = ContactsApp.state.contacts.find(c => c.id === id);
    if (!contact) return this._showListError('Kontakt nicht gefunden.');

    if (!confirm(`Möchten Sie den Kontakt "${contact.name}" wirklich löschen?`)) return;

    try {
      await ContactsApp.firebase.deleteContact(contact.id);
      await ContactsApp.tasks.removeContactFromAllTasks(contact.id);

      ContactsApp.state.contacts = await ContactsApp.firebase.loadContacts();
      ContactsApp.uiList.renderContactsList(ContactsApp.state.contacts);

      ContactsApp.state.selectedContactId = null;
      const detailsCard = document.getElementById('detailsCard');
      if (detailsCard) detailsCard.classList.add('hidden');
    } catch (err) {
      alert('Kontakt konnte nicht gelöscht werden.');
    }
  },

  /**
   * Displays an error message inside the contacts list container.
   * @param {string} message - The error text to show.
   */
  _showListError(message) {
    const list = document.getElementById('contactsList');
    if (list) list.innerHTML = `<div class="error-message">${message}</div>`;
  },

  /** Shows a brief "Contact created" success notification. */
  showContactCreatedNotification() {
    const n = document.getElementById('contactSuccessNotification');
    if (!n) return;

    n.classList.remove('show');
    n.offsetHeight;
    n.classList.add('show');

    setTimeout(() => n.classList.remove('show'), 2500);
  },
};

document.addEventListener('DOMContentLoaded', () => ContactsApp.page.init());
