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
    this._bindCloseButton(closeBtn);
    this._bindOverlayClose(overlay);
    this._bindFormSubmit(form);
    this._bindEscapeClose();
  },

  /** Binds the modal close button once. */
  _bindCloseButton(closeBtn) {
    if (!closeBtn || closeBtn.dataset.listenerAdded) return;
    closeBtn.addEventListener('click', () => this.close());
    closeBtn.dataset.listenerAdded = 'true';
  },

  /** Binds overlay click-to-close once. */
  _bindOverlayClose(overlay) {
    if (!overlay || overlay.dataset.listenerAdded) return;
    overlay.addEventListener('click', e => {
      if (e.target === overlay) this.close();
    });
    overlay.dataset.listenerAdded = 'true';
  },

  /** Binds form submit once. */
  _bindFormSubmit(form) {
    if (!form || form.dataset.listenerAdded) return;
    form.addEventListener('submit', e => this.onSubmit(e));
    form.dataset.listenerAdded = 'true';
  },

  /** Binds Escape key close once. */
  _bindEscapeClose() {
    if (document.body.dataset.modalEsc) return;
    document.addEventListener('keydown', e => this._closeOnEscape(e));
    document.body.dataset.modalEsc = 'true';
  },

  /** Closes the modal on Escape if it is open. */
  _closeOnEscape(e) {
    const overlay = document.getElementById('contactOverlay');
    if (e.key === 'Escape' && overlay && !overlay.classList.contains('d-none')) this.close();
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
    const elements = this._getModalElements();
    if (mode === 'add') this._setupAddMode(elements);
    else this._setupEditMode(elements, contact);
    elements.overlay.classList.remove('d-none');
    setTimeout(() => elements.nameEl.focus(), 0);
  },

  /** Reads modal DOM references used by add and edit modes. */
  _getModalElements() {
    return {
      title: document.getElementById('contactModalTitle'),
      subtitle: document.getElementById('contactModalSubtitle'),
      deleteBtn: document.getElementById('contactModalDeleteBtn'),
      saveText: document.getElementById('contactModalSaveText'),
      avatar: document.getElementById('contactModalAvatar'),
      initialsEl: document.getElementById('contactModalInitials'),
      avatarIcon: document.getElementById('contactModalAvatarIcon'),
      nameEl: document.getElementById('modalName'), emailEl: document.getElementById('modalEmail'),
      phoneEl: document.getElementById('modalPhone'),
      overlay: document.getElementById('contactOverlay'),
    };
  },

  /** Applies add-contact modal state. */
  _setupAddMode(el) {
    el.title.textContent = 'Add contact';
    el.subtitle.textContent = 'Tasks are better with a team!';
    el.subtitle.classList.remove('d-none');
    el.deleteBtn.classList.toggle('d-none', this._isCompact());
    this._setCancelButton(el.deleteBtn);
    el.saveText.textContent = 'Create contact';
    this._fillForm(el, {});
    this._showAvatarIcon(el);
  },

  /** Applies edit-contact modal state. */
  _setupEditMode(el, contact) {
    el.title.textContent = 'Edit contact';
    el.subtitle.classList.add('d-none');
    el.deleteBtn.classList.remove('d-none');
    el.deleteBtn.textContent = 'Delete';
    el.deleteBtn.onclick = () => this.onDelete();
    el.saveText.textContent = 'Save';
    this._fillForm(el, contact || {});
    this._showAvatarInitials(el, contact || {});
  },

  /** Returns whether the compact modal layout is active. */
  _isCompact() {
    return window.innerWidth <= (ContactsApp.config?.COMPACT_BREAKPOINT || 1024);
  },

  /** Configures the add-mode cancel button. */
  _setCancelButton(button) {
    button.innerHTML = 'Cancel <img src="./assets/img/iconoir_cancel.svg" alt="" class="btn-cancel-x">';
    button.onclick = () => this.close();
  },

  /** Fills modal input fields from contact data. */
  _fillForm(el, contact) {
    el.nameEl.value = contact.name || '';
    el.emailEl.value = contact.email || '';
    el.phoneEl.value = contact.phone || '';
  },

  /** Shows the empty avatar icon. */
  _showAvatarIcon(el) {
    el.avatar.style.background = '#D1D1D1';
    el.initialsEl.textContent = '';
    this._toggleAvatarParts(el, false);
  },

  /** Shows the initials avatar for edit mode. */
  _showAvatarInitials(el, contact) {
    el.initialsEl.textContent = ContactsApp.validation.generateInitials(contact.name || '');
    el.avatar.style.background = contact.color || '#2A3647';
    this._toggleAvatarParts(el, true);
  },

  /** Toggles modal avatar initials and icon state. */
  _toggleAvatarParts(el, showInitials) {
    el.initialsEl.classList.toggle('d-none', !showInitials);
    el.initialsEl.hidden = !showInitials;
    el.initialsEl.style.display = showInitials ? '' : 'none';
    el.avatarIcon.classList.toggle('d-none', showInitials);
    el.avatarIcon.hidden = showInitials;
    el.avatarIcon.style.display = showInitials ? 'none' : 'block';
  },

  /** Closes the modal and resets internal state. */
  close() {
    document.getElementById('contactOverlay').classList.add('d-none');
    ContactsApp.state.modal.mode = null;
    ContactsApp.state.modal.contactId = null;
  },

  /**
   * Handles form submission — validates, persists, and refreshes the list.
   * @param {SubmitEvent} e - The form submit event.
   */
  async onSubmit(e) {
    e.preventDefault();
    const buttons = this._getActionButtons();
    this._setButtonsDisabled(buttons, true);
    try {
      if (!this._validateDraft(buttons)) return;
      await this._saveDraftAndRefresh();
    } catch (err) {
      alert('Speichern fehlgeschlagen.');
    } finally {
      this._setButtonsDisabled(buttons, false);
    }
  },

  /** Returns modal action buttons. */
  _getActionButtons() {
    return {
      saveBtn: document.getElementById('contactModalSaveBtn'),
      delBtn: document.getElementById('contactModalDeleteBtn'),
    };
  },

  /** Enables or disables both modal action buttons. */
  _setButtonsDisabled({ saveBtn, delBtn }, disabled) {
    saveBtn.disabled = disabled;
    delBtn.disabled = disabled;
  },

  /** Validates the current draft and shows errors if needed. */
  _validateDraft(buttons) {
    this._clearErrors();
    const v = ContactsApp.validation.validateContact(this._readDraft());
    if (v.isValid) return true;
    this._showErrors(v.errors, buttons.saveBtn, buttons.delBtn);
    return false;
  },

  /** Persists the draft, refreshes list state, and closes the modal. */
  async _saveDraftAndRefresh() {
    await this._persistDraft(this._readDraft());
    ContactsApp.state.contacts = await ContactsApp.firebase.loadContacts();
    ContactsApp.uiList.renderContactsList(ContactsApp.state.contacts);
    this._afterSuccessfulSave();
    this.close();
  },

  /** Applies post-save UI updates based on modal mode. */
  _afterSuccessfulSave() {
    if (ContactsApp.state.modal.mode === 'edit') this._reselectAfterEdit();
    if (ContactsApp.state.modal.mode === 'add') ContactsApp.page.showContactCreatedNotification();
  },

  /**
   * Shows a custom delete confirmation popup.
   * @param {string} name - Contact name to display.
   * @returns {Promise<boolean>} Resolves true if user confirms, false if cancelled.
   */
  _confirmDelete(name) {
    return new Promise(resolve => {
      const overlay = this._createDeleteConfirmOverlay(name);
      document.body.appendChild(overlay);
      this._bindDeleteConfirmOverlay(overlay, resolve);
    });
  },

  /** Creates the delete confirmation overlay. */
  _createDeleteConfirmOverlay(name) {
    const overlay = document.createElement('div');
    overlay.className = 'delete-confirm-overlay';
    overlay.innerHTML = this._deleteConfirmTemplate(name);
    return overlay;
  },

  /** Returns the delete confirmation markup. */
  _deleteConfirmTemplate(name) {
    return `<div class="delete-confirm-popup"><div class="delete-confirm-inner">
      <p>Do you really want to delete<br><strong>${name}</strong>?</p>
      <div class="delete-confirm-actions">
        <button class="delete-confirm-cancel">Cancel</button>
        <button class="delete-confirm-delete">Delete</button>
      </div></div></div>`;
  },

  /** Binds delete confirmation actions. */
  _bindDeleteConfirmOverlay(overlay, resolve) {
    const close = result => { overlay.remove(); resolve(result); };
    overlay.querySelector('.delete-confirm-cancel').addEventListener('click', () => close(false));
    overlay.querySelector('.delete-confirm-delete').addEventListener('click', () => close(true));
    overlay.addEventListener('click', e => { if (e.target === overlay) close(false); });
  },

  /** Deletes the currently opened contact after user confirmation. */
  async onDelete() {
    const contact = await this._getConfirmedDeleteContact();
    if (!contact) return;
    const buttons = this._getActionButtons();
    this._setButtonsDisabled(buttons, true);
    try {
      await this._deleteContactFromModal(contact);
    } catch (err) {
      alert('Löschen fehlgeschlagen.');
    } finally {
      this._setButtonsDisabled(buttons, false);
    }
  },

  /** Returns the modal contact when deleting was confirmed. */
  async _getConfirmedDeleteContact() {
    const id = ContactsApp.state.modal.contactId;
    if (!id) return null;
    const contact = ContactsApp.state.contacts.find(c => c.id === id);
    if (!contact) return null;
    return await this._confirmDelete(contact.name) ? contact : null;
  },

  /** Deletes the modal contact and applies the correct follow-up state. */
  async _deleteContactFromModal(contact) {
    const isMe = contact.id === sessionStorage.getItem('contactId');
    await ContactsApp.firebase.deleteContact(contact.id);
    await ContactsApp.tasks.removeContactFromAllTasks(contact.id);
    if (isMe) return this._redirectAfterOwnAccountDelete();
    await this._refreshAfterModalDelete();
  },

  /** Clears the session after deleting the current user's contact. */
  _redirectAfterOwnAccountDelete() {
    sessionStorage.clear();
    window.location.href = './index.html';
  },

  /** Refreshes contacts UI after deleting another contact. */
  async _refreshAfterModalDelete() {
    ContactsApp.state.contacts = await ContactsApp.firebase.loadContacts();
    ContactsApp.uiList.renderContactsList(ContactsApp.state.contacts);
    ContactsApp.state.selectedContactId = null;
    this._hideDetailsCard();
    this.close();
  },

  /** Hides the details card if present. */
  _hideDetailsCard() {
    const detailsCard = document.getElementById('detailsCard');
    if (detailsCard) detailsCard.classList.add('hidden');
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
      await this._updateDraft(draft, initials, now);
      return;
    }
    await this._createDraft(draft, initials, now);
  },

  /** Updates an existing contact draft. */
  async _updateDraft(draft, initials, now) {
    const patch = { ...draft, initials, updatedAt: now };
    await ContactsApp.firebase.updateContact(ContactsApp.state.modal.contactId, patch);
  },

  /** Creates a new contact draft. */
  async _createDraft(draft, initials, now) {
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
