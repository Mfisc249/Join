'use strict';

window.ContactsApp = window.ContactsApp || {};

ContactsApp.uiModal = {
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

      deleteBtn.classList.remove('d-none');
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
      avatar.style.background = contact?.color || ContactsApp.validation.generateRandomColor();
    }

    document.getElementById('contactOverlay').classList.remove('d-none');
    setTimeout(() => nameEl.focus(), 0);
  },

  close() {
    document.getElementById('contactOverlay').classList.add('d-none');
    ContactsApp.state.modal.mode = 'edit';
    ContactsApp.state.modal.contactId = null;
  },

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
      console.error(err);
      alert('Speichern fehlgeschlagen (siehe Console).');
    } finally {
      saveBtn.disabled = false;
      delBtn.disabled = false;
    }
  },

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
      await ContactsApp.firebase.deleteContact(contact.id);
      await ContactsApp.tasks.removeContactFromAllTasks(contact.id);

      ContactsApp.state.contacts = await ContactsApp.firebase.loadContacts();
      ContactsApp.uiList.renderContactsList(ContactsApp.state.contacts);

      ContactsApp.state.selectedContactId = null;
      const detailsCard = document.getElementById('detailsCard');
      if (detailsCard) detailsCard.classList.add('hidden');

      this.close();
    } catch (err) {
      console.error(err);
      alert('Löschen fehlgeschlagen (siehe Console).');
    } finally {
      saveBtn.disabled = false;
      delBtn.disabled = false;
    }
  },

  _readDraft() {
    return {
      name: document.getElementById('modalName').value.trim(),
      email: document.getElementById('modalEmail').value.trim(),
      phone: document.getElementById('modalPhone').value.trim(),
    };
  },

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

  _reselectAfterEdit() {
    const id = ContactsApp.state.modal.contactId;
    const updated = ContactsApp.state.contacts.find(c => c.id === id);
    const item = document.querySelector(`.contact-item[data-id="${id}"]`);
    if (updated && item) ContactsApp.uiList.selectContact(updated, item);
  },

  _clearErrors() {
    document.getElementById('modalErrName').textContent = '';
    document.getElementById('modalErrEmail').textContent = '';
    document.getElementById('modalErrPhone').textContent = '';
  },

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
