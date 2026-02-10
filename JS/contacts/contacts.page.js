'use strict';

window.ContactsApp = window.ContactsApp || {};

ContactsApp.page = {
  async init() {
    if (ContactsApp.state.isInitialized) return;

    try {
      ContactsApp.state.contacts = await ContactsApp.firebase.loadContacts();
      ContactsApp.uiList.renderContactsList(ContactsApp.state.contacts);

      this._bindButtons();
      ContactsApp.uiModal.initModalListeners();

      ContactsApp.state.isInitialized = true;
    } catch (err) {
      console.error('Fehler beim Initialisieren der Kontakte:', err);
      this._showListError('Kontakte konnten nicht geladen werden.');
    }
  },

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

  _openEdit() {
    const id = ContactsApp.state.selectedContactId;
    if (!id) return this._showListError('Kein Kontakt ausgewählt.');

    const contact = ContactsApp.state.contacts.find(c => c.id === id);
    if (!contact) return this._showListError('Kontakt nicht gefunden.');

    ContactsApp.uiModal.open('edit', contact);
  },

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
      console.error(err);
      alert('Kontakt konnte nicht gelöscht werden.');
    }
  },

  _showListError(message) {
    const list = document.getElementById('contactsList');
    if (list) list.innerHTML = `<div class="error-message">${message}</div>`;
  },

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
