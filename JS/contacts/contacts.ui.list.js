'use strict';

window.ContactsApp = window.ContactsApp || {};

/** @namespace ContactsApp.uiList */
ContactsApp.uiList = {
  /**
   * Renders the full contacts list grouped by first letter.
   * @param {Array<Object>} contactsData - Array of contact objects.
   */
  renderContactsList(contactsData) {
    const list = document.getElementById('contactsList');
    if (!list) return;

    list.innerHTML = '';
    if (!contactsData || contactsData.length === 0) return this._showEmptyState();

    const grouped = this._groupByFirstLetter(contactsData);
    Object.keys(grouped).sort().forEach(letter => {
      list.appendChild(this._groupHeader(letter));
      list.appendChild(this._divider());
      grouped[letter].forEach(c => list.appendChild(this._contactItem(c)));
    });
  },

  /**
   * Selects a contact, highlights its list item, and renders details.
   * @param {Object} contact - The contact object to select.
   * @param {HTMLElement} element - The clicked list item element.
   */
  selectContact(contact, element) {
    document.querySelectorAll('.contact-item').forEach(i => {
      i.classList.remove('active');
      i.setAttribute('aria-selected', 'false');
    });

    element.classList.add('active');
    element.setAttribute('aria-selected', 'true');
    ContactsApp.state.selectedContactId = contact.id;

    this._renderDetails(contact);
  },

  /**
   * Renders the selected contact's details in the details panel.
   * @param {Object} contact - The contact to display.
   */
  _renderDetails(contact) {
    const detailsCard = document.getElementById('detailsCard');
    if (detailsCard) detailsCard.classList.remove('hidden');
    this._showDetailsBadge(contact);
    this._setDetailsText('detailsName', contact.name);
    this._setDetailsText('detailsPhone', contact.phone || 'Keine Telefonnummer');
    this._setDetailsEmail(contact.email);
  },

  /** Updates the selected contact badge in the details panel. */
  _showDetailsBadge(contact) {
    const badge = document.getElementById('detailsBadge');
    if (!badge) return;
    badge.textContent = contact.initials || ContactsApp.validation.generateInitials(contact.name);
    badge.style.background = contact.color || '#2A3647';
  },

  /** Updates the details email link. */
  _setDetailsEmail(email) {
    const emailLink = document.getElementById('detailsEmail');
    if (!emailLink) return;
    emailLink.textContent = email || 'Keine E-Mail';
    emailLink.href = email ? `mailto:${email}` : '#';
  },

  /** Updates a text node in the details panel. */
  _setDetailsText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  },

  /**
   * Groups contacts alphabetically by first letter of name.
   * @param {Array<Object>} list - Unsorted contacts array.
   * @returns {Object} Contacts grouped by uppercase letter.
   */
  _groupByFirstLetter(list) {
    const sorted = [...list].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    return sorted.reduce((acc, c) => {
      const name = (c.name || '').trim();
      const letter = (name[0] || '#').toUpperCase();
      acc[letter] = acc[letter] || [];
      acc[letter].push(c);
      return acc;
    }, {});
  },

  /**
   * Creates a clickable contact list item DOM element.
   * @param {Object} contact - The contact data.
   * @returns {HTMLElement} The contact item element.
   */
  _contactItem(contact) {
    const el = document.createElement('div');
    if (!contact || !contact.id) return el;
    this._setupContactItem(el, contact);
    el.appendChild(this._contactBadge(contact));
    el.appendChild(this._contactText(contact, el));
    this._bindContactItem(el, contact);
    return el;
  },

  /** Applies attributes needed for a contact list item. */
  _setupContactItem(el, contact) {
    el.className = 'contact-item';
    el.dataset.id = contact.id;
    el.tabIndex = 0;
    el.setAttribute('role', 'option');
  },

  /** Creates the avatar badge for a contact item. */
  _contactBadge(contact) {
    const badge = document.createElement('div');
    badge.className = 'badge';
    badge.style.background = contact.color || '#2A3647';
    badge.textContent = contact.initials || ContactsApp.validation.generateInitials(contact.name || '');
    return badge;
  },

  /** Creates the text block for a contact item. */
  _contactText(contact, el) {
    const text = document.createElement('div');
    text.className = 'contact-text';
    text.appendChild(this._contactName(contact, el));
    text.appendChild(this._contactEmail(contact));
    return text;
  },

  /** Creates the display name for a contact item. */
  _contactName(contact, el) {
    const name = document.createElement('div');
    const isMe = contact.id === sessionStorage.getItem('contactId');
    name.className = 'contact-name';
    name.textContent = contact.name || 'Unbekannt';
    if (isMe) this._markAsMe(el, name);
    return name;
  },

  /** Adds the current-user marker to a contact item. */
  _markAsMe(el, name) {
    el.classList.add('is-me');
    name.textContent += ' (You)';
  },

  /** Creates the email text for a contact item. */
  _contactEmail(contact) {
    const email = document.createElement('div');
    email.className = 'contact-email';
    email.textContent = contact.email || 'Keine E-Mail';
    return email;
  },

  /** Binds mouse and keyboard selection to a contact item. */
  _bindContactItem(el, contact) {
    el.addEventListener('click', () => this.selectContact(contact, el));
    el.addEventListener('keydown', e => this._selectContactWithKeyboard(e, contact, el));
  },

  /** Selects a contact when Enter or Space is pressed. */
  _selectContactWithKeyboard(e, contact, el) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    this.selectContact(contact, el);
  },

  /**
   * Creates a letter group header element.
   * @param {string} letter - The group letter.
   * @returns {HTMLElement} The header element.
   */
  _groupHeader(letter) {
    const el = document.createElement('div');
    el.className = 'group-header';
    el.textContent = letter;
    return el;
  },

  /**
   * Creates a horizontal divider element.
   * @returns {HTMLElement} The divider element.
   */
  _divider() {
    const el = document.createElement('div');
    el.className = 'group-divider';
    return el;
  },

  /**
   * Displays an empty state message in the contacts list.
   */
  _showEmptyState() {
    const list = document.getElementById('contactsList');
    if (list) list.innerHTML = '<div class="empty-contacts">Keine Kontakte vorhanden.</div>';
  },
};
