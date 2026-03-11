'use strict';

window.ContactsApp = window.ContactsApp || {};

/** @namespace ContactsApp.uiModal */
ContactsApp.uiModal = {
  /**
   * Registers click, overlay-dismiss, submit, and Escape-key listeners for the modal.
   */
  initModalListeners() {
    const overlay = document.getElementById('contactOverlay');
    const closeBtn = document.getElementById('contactModalClose');
    const form = document.getElementById('contactModalForm');

    if (closeBtn && !closeBtn.dataset.listenerAdded) {
      closeBtn.addEventListener('click', () => this.close());
      closeBtn.dataset.listenerAdded = 'true';
    }

    if (overlay && !overlay.dataset.listenerAdded) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.close();
      });
      overlay.dataset.listenerAdded = 'true';
    }

    if (form && !form.dataset.listenerAdded) {
      form.addEventListener('submit', (e) => this.onSubmit(e));
      form.dataset.listenerAdded = 'true';
    }

    if (!document.body.dataset.modalEsc) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !document.getElementById('contactOverlay').classList.contains('d-none')) {
          this.close();
        }
      });
      document.body.dataset.modalEsc = 'true';
    }
  },

  /**
   * Opens the contact modal in add or edit mode.
   * @param {'add'|'edit'} mode - Whether to add a new or edit an existing contact.
   * @param {Object|null} [contact=null] - The contact to edit (null for add).
   */
  open(mode, contact = null) {
    ContactsApp.state.modal.mode = mode;
    ContactsApp.state.modal.contactId = contact ? contact.id : null;

    this._clearErrors();

    const title = document.getElementById('contactModalTitle');
    const subtitle = document.getElementById('contactModalSubtitle');
    const deleteBtn = document.getElementById('contactModalDeleteBtn');
    const saveText = document.getElementById('contactModalSaveText');

    const avatar = document.getElementById('contactModalAvatar');
    const initialsEl = document.getElementById('contactModalInitials');
    const avatarIcon = document.getElementById('contactModalAvatarIcon');

    const nameEl = document.getElementById('modalName');
    const emailEl = document.getElementById('modalEmail');
    const phoneEl = document.getElementById('modalPhone');

    if (mode === 'add') {
      title.textContent = 'Add contact';
      subtitle.classList.remove('d-none');

      if (window.innerWidth <= 768) {
        deleteBtn.classList.add('d-none');
      } else {
        deleteBtn.classList.remove('d-none');
      }
      deleteBtn.innerHTML = 'Cancel <img src="./assets/img/iconoir_cancel.svg" alt="" class="btn-cancel-x">';
      deleteBtn.onclick = () => this.close();

      saveText.textContent = 'Create contact';

      nameEl.value = '';
      emailEl.value = '';
      phoneEl.value = '';

      avatar.style.background = '#D1D1D1';
      initialsEl.classList.add('d-none');
      avatarIcon.classList.remove('d-none');
    } else {
      title.textContent = 'Edit contact';
      subtitle.classList.add('d-none');

      deleteBtn.classList.remove('d-none');
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = () => this.onDelete();

      saveText.textContent = 'Save';

      nameEl.value = contact?.name || '';
      emailEl.value = contact?.email || '';
      phoneEl.value = contact?.phone || '';

      initialsEl.textContent = ContactsApp.validation.generateInitials(contact?.name || '');
      initialsEl.classList.remove('d-none');
      avatarIcon.classList.add('d-none');
      avatar.style.background = contact?.color || '#2A3647';
    }

    document.getElementById('contactOverlay').classList.remove('d-none');
    setTimeout(() => nameEl.focus(), 0);
  },

  /** Closes the modal and resets internal state. */
  close() {
    document.getElementById('contactOverlay').classList.add('d-none');
    ContactsApp.state.modal.mode = 'edit';
    ContactsApp.state.modal.contactId = null;
  },

  /**
   * Handles form submission — validates, persists, and refreshes the list.
   * @param {SubmitEvent} e - The form submit event.
   */
  async onSubmit(e) {
    e.preventDefault();

    const saveBtn = document.getElementById('contactModalSaveBtn');
    const delBtn = document.getElementById('contactModalDeleteBtn');
    saveBtn.disabled = true;
    delBtn.disabled = true;

    try {
      this._clearErrors();

      const draft = this._readDraft();
      const v = ContactsApp.validation.validateContact(draft);
      if (!v.isValid) return this._showErrors(v.errors, saveBtn, delBtn);

      await this._persistDraft(draft);

      ContactsApp.state.contacts = await ContactsApp.firebase.loadContacts();
      ContactsApp.uiList.renderContactsList(ContactsApp.state.contacts);

      if (ContactsApp.state.modal.mode === 'edit') this._reselectAfterEdit();
      if (ContactsApp.state.modal.mode === 'add') ContactsApp.page.showContactCreatedNotification();

      this.close();
    } catch (err) {
      alert('Speichern fehlgeschlagen.');
    } finally {
      saveBtn.disabled = false;
      delBtn.disabled = false;
    }
  },

  /** Deletes the currently opened contact after user confirmation. */
  async onDelete() {
    const id = ContactsApp.state.modal.contactId;
    if (!id) return;

    const contact = ContactsApp.state.contacts.find(c => c.id === id);
    if (!contact) return;

    if (!confirm(`Kontakt "${contact.name}" wirklich löschen?`)) return;

    const saveBtn = document.getElementById('contactModalSaveBtn');
    const delBtn = document.getElementById('contactModalDeleteBtn');
    saveBtn.disabled = true;
    delBtn.disabled = true;
    try {
      const myId = sessionStorage.getItem('contactId');
      const isMe = contact.id === myId;

      await ContactsApp.firebase.deleteContact(contact.id);
      await ContactsApp.tasks.removeContactFromAllTasks(contact.id);

      if (isMe) {
        // clear session and redirect out if user deleted their own account
        sessionStorage.clear();
        window.location.href = './index.html';
        return;
      }

      ContactsApp.state.contacts = await ContactsApp.firebase.loadContacts();
      ContactsApp.uiList.renderContactsList(ContactsApp.state.contacts);

      ContactsApp.state.selectedContactId = null;
      const detailsCard = document.getElementById('detailsCard');
      if (detailsCard) detailsCard.classList.add('hidden');

      this.close();
    } catch (err) {
      alert('Löschen fehlgeschlagen.');
    } finally {
      saveBtn.disabled = false;
      delBtn.disabled = false;
    }
  },

  /**
   * Reads the current form values into a draft object.
   * @returns {{name: string, email: string, phone: string}} Draft data.
   */
  _readDraft() {
    return {
      name: document.getElementById('modalName').value.trim(),
      email: document.getElementById('modalEmail').value.trim(),
      phone: document.getElementById('modalPhone').value.trim(),
    };
  },

  /**
   * Saves or updates a contact in Firebase.
   * @param {{name: string, email: string, phone: string}} draft - The contact data to persist.
   */
  async _persistDraft(draft) {
    const now = new Date().toISOString();
    const initials = ContactsApp.validation.generateInitials(draft.name);

    if (ContactsApp.state.modal.mode === 'edit') {
      const patch = { ...draft, initials, updatedAt: now };
      await ContactsApp.firebase.updateContact(ContactsApp.state.modal.contactId, patch);
      return;
    }

    await ContactsApp.firebase.saveNewContact({
      ...draft,
      initials,
      color: ContactsApp.validation.generateRandomColor(),
      createdAt: now,
      updatedAt: now,
    });
  },

  /** Re-selects the edited contact in the list after a successful save. */
  _reselectAfterEdit() {
    const id = ContactsApp.state.modal.contactId;
    const updated = ContactsApp.state.contacts.find(c => c.id === id);
    const item = document.querySelector(`.contact-item[data-id="${id}"]`);
    if (updated && item) ContactsApp.uiList.selectContact(updated, item);
  },

  /** Clears all validation error messages in the modal. */
  _clearErrors() {
    document.getElementById('modalErrName').textContent = '';
    document.getElementById('modalErrEmail').textContent = '';
    document.getElementById('modalErrPhone').textContent = '';
  },

  /**
   * Displays validation errors next to the corresponding fields.
   * @param {string[]} errors - Array of error messages.
   * @param {HTMLButtonElement} saveBtn - Save button to re-enable.
   * @param {HTMLButtonElement} delBtn - Delete/Cancel button to re-enable.
   */
  _showErrors(errors, saveBtn, delBtn) {
    errors.forEach(msg => {
      const low = msg.toLowerCase();
      if (low.includes('name')) document.getElementById('modalErrName').textContent = msg;
      if (low.includes('mail') || low.includes('e-mail')) document.getElementById('modalErrEmail').textContent = msg;
      if (low.includes('telefon') || low.includes('phone')) document.getElementById('modalErrPhone').textContent = msg;
    });
    saveBtn.disabled = false;
    delBtn.disabled = false;
  },
};
