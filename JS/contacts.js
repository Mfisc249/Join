'use strict';

// Firebase configuration (später zu verwenden)
const FIREBASE_CONFIG = {
  // Hier später Firebase-Konfiguration einfügen
};

// State Management
let contacts = [];
let selectedContactId = null;
let isInitialized = false;

document.addEventListener('DOMContentLoaded', initContacts);

async function initContacts() {
  if (isInitialized) return;
  
  try {
    // Später: Firebase-Kontakte laden
    // contacts = await loadContactsFromFirebase();
    contacts = getDemoContacts();
    
    renderContactsList(contacts);
    setupEventListeners();
    
    isInitialized = true;
  } catch (error) {
    console.error('Fehler beim Initialisieren der Kontakte:', error);
    showErrorMessage('Kontakte konnten nicht geladen werden.');
  }
}

function setupEventListeners() {
  // Event Listeners nur einmal hinzufügen
  const addBtn = document.getElementById('addContactBtn');
  const editBtn = document.getElementById('editBtn');
  const deleteBtn = document.getElementById('deleteBtn');
  
  if (addBtn && !addBtn.dataset.listenerAdded) {
    addBtn.addEventListener('click', onAddContact);
    addBtn.dataset.listenerAdded = 'true';
  }
  
  if (editBtn && !editBtn.dataset.listenerAdded) {
    editBtn.addEventListener('click', onEditContact);
    editBtn.dataset.listenerAdded = 'true';
  }
  
  if (deleteBtn && !deleteBtn.dataset.listenerAdded) {
    deleteBtn.addEventListener('click', onDeleteContact);
    deleteBtn.dataset.listenerAdded = 'true';
  }
}

function renderContactsList(contactsData) {
  try {
    const list = document.getElementById('contactsList');
    if (!list) {
      throw new Error('contactsList Element nicht gefunden');
    }
    
    list.innerHTML = '';
    
    if (!contactsData || contactsData.length === 0) {
      showEmptyState();
      return;
    }

    const grouped = groupContactsByFirstLetter(contactsData);

    Object.keys(grouped).sort().forEach(letter => {
      list.appendChild(createGroupHeader(letter));
      list.appendChild(createDivider());

      grouped[letter].forEach(contact => {
        const item = createContactItem(contact);
        list.appendChild(item);
      });
    });
  } catch (error) {
    console.error('Fehler beim Rendern der Kontaktliste:', error);
    showErrorMessage('Kontakte konnten nicht angezeigt werden.');
  }
}

function showEmptyState() {
  const list = document.getElementById('contactsList');
  list.innerHTML = '<div class="empty-contacts">Keine Kontakte vorhanden.</div>';
}

function showErrorMessage(message) {
  const list = document.getElementById('contactsList');
  list.innerHTML = `<div class="error-message">${message}</div>`;
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
  if (!contact || !contact.id || !contact.name) {
    console.warn('Ungültiger Kontakt:', contact);
    return document.createElement('div');
  }

  const el = document.createElement('div');
  el.className = 'contact-item';
  el.dataset.id = contact.id;
  el.setAttribute('tabindex', '0');
  el.setAttribute('role', 'option');
  el.setAttribute('aria-label', `Kontakt ${contact.name}`);

  const badge = document.createElement('div');
  badge.className = 'badge';
  badge.style.background = contact.color || '#2A3647';
  badge.textContent = contact.initials || contact.name.substring(0, 2).toUpperCase();

  const text = document.createElement('div');
  text.className = 'contact-text';

  const name = document.createElement('div');
  name.className = 'contact-name';
  name.textContent = contact.name;

  const email = document.createElement('div');
  email.className = 'contact-email';
  email.textContent = contact.email || 'Keine E-Mail';

  text.appendChild(name);
  text.appendChild(email);

  el.appendChild(badge);
  el.appendChild(text);

  // Event Listeners für Click und Keyboard
  el.addEventListener('click', () => selectContact(contact, el));
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectContact(contact, el);
    }
  });
  
  return el;
}

function selectContact(contact, element) {
  try {
    // Alle anderen Kontakte deselektieren
    document.querySelectorAll('.contact-item').forEach(i => {
      i.classList.remove('active');
      i.setAttribute('aria-selected', 'false');
    });
    
    // Gewählten Kontakt aktivieren
    element.classList.add('active');
    element.setAttribute('aria-selected', 'true');
    selectedContactId = contact.id;

    // Details anzeigen
    const detailsEmpty = document.getElementById('detailsEmpty');
    const detailsCard = document.getElementById('detailsCard');
    
    if (detailsEmpty) detailsEmpty.classList.add('hidden');
    if (detailsCard) detailsCard.classList.remove('hidden');

    // Badge aktualisieren
    const detailsBadge = document.getElementById('detailsBadge');
    if (detailsBadge) {
      detailsBadge.textContent = contact.initials || contact.name.substring(0, 2).toUpperCase();
      detailsBadge.style.background = contact.color || '#2A3647';
    }

    // Name aktualisieren
    const detailsName = document.getElementById('detailsName');
    if (detailsName) {
      detailsName.textContent = contact.name;
    }

    // E-Mail aktualisieren
    const emailLink = document.getElementById('detailsEmail');
    if (emailLink && contact.email) {
      emailLink.textContent = contact.email;
      emailLink.href = `mailto:${contact.email}`;
    }

    // Telefon aktualisieren
    const phoneElement = document.getElementById('detailsPhone');
    if (phoneElement) {
      phoneElement.textContent = contact.phone || 'Keine Telefonnummer';
    }
  } catch (error) {
    console.error('Fehler beim Auswählen des Kontakts:', error);
  }
}

// Action Functions
function onAddContact() {
  console.log('Neuen Kontakt hinzufügen');
  // TODO: Modal öffnen für neuen Kontakt
  // TODO: Firebase Integration für neuen Kontakt
  showNotImplementedMessage('Kontakt hinzufügen');
}

function onEditContact() {
  if (!selectedContactId) {
    showErrorMessage('Kein Kontakt ausgewählt.');
    return;
  }
  
  const contact = contacts.find(c => c.id === selectedContactId);
  if (!contact) {
    showErrorMessage('Kontakt nicht gefunden.');
    return;
  }
  
  console.log('Kontakt bearbeiten:', contact);
  // TODO: Modal öffnen mit vorausgefüllten Daten
  // TODO: Firebase Integration für Kontakt-Update
  showNotImplementedMessage('Kontakt bearbeiten');
}

function onDeleteContact() {
  if (!selectedContactId) {
    showErrorMessage('Kein Kontakt ausgewählt.');
    return;
  }
  
  const contact = contacts.find(c => c.id === selectedContactId);
  if (!contact) {
    showErrorMessage('Kontakt nicht gefunden.');
    return;
  }
  
  if (confirm(`Möchten Sie den Kontakt "${contact.name}" wirklich löschen?`)) {
    console.log('Kontakt löschen:', contact);
    // TODO: Aus Firebase löschen
    // TODO: Aus Tasks entfernen (Akzeptanzkriterium)
    showNotImplementedMessage('Kontakt löschen');
  }
}

function showNotImplementedMessage(feature) {
  alert(`${feature} ist noch nicht implementiert. Wird mit Firebase-Integration hinzugefügt.`);
}

// Firebase Functions (Placeholder)
async function loadContactsFromFirebase() {
  // TODO: Firebase Integration
  throw new Error('Firebase noch nicht konfiguriert');
}

async function saveContactToFirebase(contact) {
  // TODO: Firebase Integration
  console.log('Speichere Kontakt in Firebase:', contact);
}

async function updateContactInFirebase(contactId, updatedData) {
  // TODO: Firebase Integration
  console.log('Update Kontakt in Firebase:', contactId, updatedData);
}

async function deleteContactFromFirebase(contactId) {
  // TODO: Firebase Integration
  console.log('Lösche Kontakt aus Firebase:', contactId);
}

// Utility Functions
function generateContactId() {
  return 'contact_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function validateContact(contact) {
  const errors = [];
  
  if (!contact.name || contact.name.trim().length < 2) {
    errors.push('Name muss mindestens 2 Zeichen lang sein.');
  }
  
  if (!contact.email || !isValidEmail(contact.email)) {
    errors.push('Gültige E-Mail-Adresse erforderlich.');
  }
  
  if (contact.phone && !isValidPhone(contact.phone)) {
    errors.push('Telefonnummer hat ein ungültiges Format.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{6,}$/;
  return phoneRegex.test(phone);
}

function generateInitials(name) {
  if (!name) return '??';
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function generateRandomColor() {
  const colors = [
    '#FF7A00', '#9327FF', '#6E52FF', '#FC71FF', 
    '#FFBB2B', '#1FD7C1', '#FF5EB3', '#00BEE8',
    '#1FC71F', '#FF745E', '#FFA35E', '#FC71FF'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Demo Data
function getDemoContacts() {
  return [
    { 
      id: 'c1', 
      name: 'Anton Mayer', 
      email: 'antomm@gmail.com', 
      phone: '+49 1111 111 11 1', 
      initials: 'AM', 
      color: '#FF7A00',
      createdAt: new Date('2024-01-15').toISOString(),
      updatedAt: new Date('2024-01-15').toISOString()
    },
    { 
      id: 'c2', 
      name: 'Anja Schulz', 
      email: 'schulz@hotmail.com', 
      phone: '+49 2222 222 22 2', 
      initials: 'AS', 
      color: '#9327FF',
      createdAt: new Date('2024-01-16').toISOString(),
      updatedAt: new Date('2024-01-16').toISOString()
    },
    { 
      id: 'c3', 
      name: 'Benedikt Ziegler', 
      email: 'benedikt@gmail.com', 
      phone: '+49 3333 333 33 3', 
      initials: 'BZ', 
      color: '#6E52FF',
      createdAt: new Date('2024-01-17').toISOString(),
      updatedAt: new Date('2024-01-17').toISOString()
    },
    { 
      id: 'c4', 
      name: 'David Eisenberg', 
      email: 'davidberg@gmail.com', 
      phone: '+49 4444 444 44 4', 
      initials: 'DE', 
      color: '#FC71FF',
      createdAt: new Date('2024-01-18').toISOString(),
      updatedAt: new Date('2024-01-18').toISOString()
    },
    { 
      id: 'c5', 
      name: 'Eva Fischer', 
      email: 'eva@gmail.com', 
      phone: '+49 5555 555 55 5', 
      initials: 'EF', 
      color: '#FFBB2B',
      createdAt: new Date('2024-01-19').toISOString(),
      updatedAt: new Date('2024-01-19').toISOString()
    },
    { 
      id: 'c6', 
      name: 'Emmanuel Mauer', 
      email: 'emmanuelma@gmail.com', 
      phone: '+49 6666 666 66 6', 
      initials: 'EM', 
      color: '#1FD7C1',
      createdAt: new Date('2024-01-20').toISOString(),
      updatedAt: new Date('2024-01-20').toISOString()
    },
  ];
}
