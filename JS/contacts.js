'use strict';

document.addEventListener('DOMContentLoaded', initContacts);

function initContacts() {
  const contacts = getDemoContacts(); // später: aus storage laden
  renderContactsList(contacts);

  document.getElementById('addContactBtn').addEventListener('click', onAddContact);
  document.getElementById('editBtn').addEventListener('click', onEditContact);
  document.getElementById('deleteBtn').addEventListener('click', onDeleteContact);
}

function renderContactsList(contacts) {
  const list = document.getElementById('contactsList');
  list.innerHTML = '';

  const grouped = groupContactsByFirstLetter(contacts);

  Object.keys(grouped).sort().forEach(letter => {
    list.appendChild(createGroupHeader(letter));
    list.appendChild(createDivider());

    grouped[letter].forEach(contact => {
      const item = createContactItem(contact);
      list.appendChild(item);
    });
  });
}

function groupContactsByFirstLetter(contacts) {
  const sorted = [...contacts].sort((a, b) => a.name.localeCompare(b.name));
  return sorted.reduce((acc, c) => {
    const letter = (c.name.trim()[0] || '#').toUpperCase();
    acc[letter] = acc[letter] || [];
    acc[letter].push(c);
    return acc;
  }, {});
}

function createGroupHeader(letter) {
  const el = document.createElement('div');
  el.className = 'group-header';
  el.textContent = letter;
  return el;
}

function createDivider() {
  const el = document.createElement('div');
  el.className = 'group-divider';
  return el;
}

function createContactItem(contact) {
  const el = document.createElement('div');
  el.className = 'contact-item';
  el.dataset.id = contact.id;

  const badge = document.createElement('div');
  badge.className = 'badge';
  badge.style.background = contact.color;
  badge.textContent = contact.initials;

  const text = document.createElement('div');
  text.className = 'contact-text';

  const name = document.createElement('div');
  name.className = 'contact-name';
  name.textContent = contact.name;

  const email = document.createElement('div');
  email.className = 'contact-email';
  email.textContent = contact.email;

  text.appendChild(name);
  text.appendChild(email);

  el.appendChild(badge);
  el.appendChild(text);

  el.addEventListener('click', () => selectContact(contact, el));
  return el;
}

function selectContact(contact, element) {
  document.querySelectorAll('.contact-item').forEach(i => i.classList.remove('active'));
  element.classList.add('active');

  document.getElementById('detailsEmpty').classList.add('hidden');
  document.getElementById('detailsCard').classList.remove('hidden');

  document.getElementById('detailsBadge').textContent = contact.initials;
  document.getElementById('detailsBadge').style.background = contact.color;

  document.getElementById('detailsName').textContent = contact.name;

  const emailLink = document.getElementById('detailsEmail');
  emailLink.textContent = contact.email;
  emailLink.href = `mailto:${contact.email}`;

  document.getElementById('detailsPhone').textContent = contact.phone || '-';

  // merken (für Edit/Delete Aktionen)
  element.closest('.app').dataset.selectedContactId = contact.id;
}

function onAddContact() {
  // TODO: modal öffnen + form validation (ohne HTML5 standard) :contentReference[oaicite:2]{index=2}
}

function onEditContact() {
  // TODO: selected contact laden + modal öffnen
}

function onDeleteContact() {
  // TODO: selected contact entfernen + aus tasks entfernen (Akzeptanzkriterium) :contentReference[oaicite:3]{index=3}
}

function getDemoContacts() {
  return [
    { id: 'c1', name: 'Anton Mayer', email: 'antomm@gmail.com', phone: '+49 1111 111 11 1', initials: 'AM', color: '#FF7A00' },
    { id: 'c2', name: 'Anja Schulz', email: 'schulz@hotmail.com', phone: '+49 2222 222 22 2', initials: 'AS', color: '#9327FF' },
    { id: 'c3', name: 'Benedikt Ziegler', email: 'benedikt@gmail.com', phone: '+49 3333 333 33 3', initials: 'BZ', color: '#6E52FF' },
    { id: 'c4', name: 'David Eisenberg', email: 'davidberg@gmail.com', phone: '+49 4444 444 44 4', initials: 'DE', color: '#FC71FF' },
    { id: 'c5', name: 'Eva Fischer', email: 'eva@gmail.com', phone: '+49 5555 555 55 5', initials: 'EF', color: '#FFBB2B' },
    { id: 'c6', name: 'Emmanuel Mauer', email: 'emmanuelma@gmail.com', phone: '+49 6666 666 66 6', initials: 'EM', color: '#1FD7C1' },
  ];
}
