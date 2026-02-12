'use strict';

window.ContactsApp = window.ContactsApp || {};

ContactsApp.uiList = {
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

  _renderDetails(contact) {
    const detailsCard = document.getElementById('detailsCard');
    if (detailsCard) detailsCard.classList.remove('hidden');

    const badge = document.getElementById('detailsBadge');
    if (badge) {
      badge.textContent = contact.initials || ContactsApp.validation.generateInitials(contact.name);
      badge.style.background = contact.color || '#2A3647';
    }

    const name = document.getElementById('detailsName');
    if (name) name.textContent = contact.name;

    const emailLink = document.getElementById('detailsEmail');
    if (emailLink) {
      emailLink.textContent = contact.email || 'Keine E-Mail';
      emailLink.href = contact.email ? `mailto:${contact.email}` : '#';
    }

    const phone = document.getElementById('detailsPhone');
    if (phone) phone.textContent = contact.phone || 'Keine Telefonnummer';
  },

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

  _contactItem(contact) {
    const el = document.createElement('div');
    if (!contact || !contact.id) return el;

    el.className = 'contact-item';
    el.dataset.id = contact.id;
    el.tabIndex = 0;
    el.setAttribute('role', 'option');

    const badge = document.createElement('div');
    badge.className = 'badge';
    badge.style.background = contact.color || '#2A3647';
    badge.textContent = contact.initials || ContactsApp.validation.generateInitials(contact.name || '');

    const text = document.createElement('div');
    text.className = 'contact-text';

    const name = document.createElement('div');
    name.className = 'contact-name';
    name.textContent = contact.name || 'Unbekannt';

    const email = document.createElement('div');
    email.className = 'contact-email';
    email.textContent = contact.email || 'Keine E-Mail';

    text.appendChild(name);
    text.appendChild(email);
    el.appendChild(badge);
    el.appendChild(text);

    el.addEventListener('click', () => this.selectContact(contact, el));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.selectContact(contact, el);
      }
    });

    return el;
  },

  _groupHeader(letter) {
    const el = document.createElement('div');
    el.className = 'group-header';
    el.textContent = letter;
    return el;
  },

  _divider() {
    const el = document.createElement('div');
    el.className = 'group-divider';
    return el;
  },

  _showEmptyState() {
    const list = document.getElementById('contactsList');
    if (list) list.innerHTML = '<div class="empty-contacts">Keine Kontakte vorhanden.</div>';
  },
};
