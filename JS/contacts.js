'use strict';

// Firebase configuration
const DB_URL = 'https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app'; // endet ohne slash
const CONTACTS_PATH = '/Contacts';
const TASKS_PATH = '/Tasks';

// State Management
let contacts = [];
let selectedContactId = null;
let isInitialized = false;

// Modal State
let contactModalMode = 'edit'; // 'edit' | 'add'
let contactModalContactId = null;

document.addEventListener('DOMContentLoaded', initContacts);

async function initContacts() {
  if (isInitialized) return;
  
  try {
    contacts = await loadContactsFromFirebase();
    if (!contacts.length) contacts = getDemoContacts(); // optional für ersten Start
    
    renderContactsList(contacts);
    setupEventListeners();
    setupContactModalListeners();
    
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
  openContactModal('add');
}

function onEditContact() {
  if (!selectedContactId) return showErrorMessage('Kein Kontakt ausgewählt.');

  const contact = contacts.find(c => c.id === selectedContactId);
  if (!contact) return showErrorMessage('Kontakt nicht gefunden.');

  openContactModal('edit', contact);
}

async function onDeleteContact() {
  if (!selectedContactId) {
    showErrorMessage('Kein Kontakt ausgewählt.');
    return;
  }

  const contact = contacts.find(c => c.id === selectedContactId);
  if (!contact) {
    showErrorMessage('Kontakt nicht gefunden.');
    return;
  }

  if (!confirm(`Möchten Sie den Kontakt "${contact.name}" wirklich löschen?`)) return;

  try {
    setDetailsButtonsLoading(true);

    // 1) Kontakt in Firebase löschen
    await deleteContactFromFirebase(contact.id);

    // 2) Kontakt aus Tasks entfernen (Akzeptanzkriterium US4)
    await removeContactFromAllTasks(contact.id);

    // 3) lokaler State + UI
    contacts = contacts.filter(c => c.id !== contact.id);
    selectedContactId = null;

    renderContactsList(contacts);

    // Details rechts wieder in "leer" setzen
    const detailsEmpty = document.getElementById('detailsEmpty');
    const detailsCard = document.getElementById('detailsCard');
    if (detailsCard) detailsCard.classList.add('hidden');
    if (detailsEmpty) detailsEmpty.classList.remove('hidden');

  } catch (err) {
    console.error(err);
    alert('Kontakt konnte nicht gelöscht werden.');
  } finally {
    setDetailsButtonsLoading(false);
  }
}

function showNotImplementedMessage(feature) {
  alert(`${feature} ist noch nicht implementiert. Wird mit Firebase-Integration hinzugefügt.`);
}

// Modal Functions
function openContactModal(mode, contact = null) {
  contactModalMode = mode;
  contactModalContactId = contact ? contact.id : null;

  const title = document.getElementById('contactModalTitle');
  const subtitle = document.getElementById('contactModalSubtitle');

  const deleteBtn = document.getElementById('contactModalDeleteBtn'); // wird bei Add als Cancel benutzt
  const saveText = document.getElementById('contactModalSaveText');

  const avatar = document.getElementById('contactModalAvatar');
  const initialsEl = document.getElementById('contactModalInitials');
  const avatarIcon = document.getElementById('contactModalAvatarIcon');

  const nameEl = document.getElementById('modalName');
  const emailEl = document.getElementById('modalEmail');
  const phoneEl = document.getElementById('modalPhone');

  clearModalErrors();

  if (mode === 'add') {
    title.textContent = 'Add contact';
    subtitle.classList.remove('d-none');

    // Button links: Cancel ✕
    deleteBtn.classList.remove('d-none');
    deleteBtn.innerHTML = 'Cancel <img src="./assets/img/iconoir_cancel.svg" alt="" class="btn-cancel-x">';
    deleteBtn.onclick = closeContactModal;

    // Button rechts
    saveText.textContent = 'Create contact';

    // Inputs leer
    nameEl.value = '';
    emailEl.value = '';
    phoneEl.value = '';

    // Avatar grau + Person-Icon
    avatar.style.background = '#D1D1D1';
    initialsEl.classList.add('d-none');
    avatarIcon.classList.remove('d-none');

  } else {
    title.textContent = 'Edit contact';
    subtitle.classList.add('d-none');

    // Button links: Delete
    deleteBtn.classList.remove('d-none');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = onDeleteFromModal;

    saveText.textContent = 'Save';

    // Inputs füllen
    nameEl.value = contact?.name || '';
    emailEl.value = contact?.email || '';
    phoneEl.value = contact?.phone || '';

    // Avatar farbig + Initials
    const initials = generateInitials(contact?.name || '');
    initialsEl.textContent = initials;

    initialsEl.classList.remove('d-none');
    avatarIcon.classList.add('d-none');

    avatar.style.background = contact?.color || generateRandomColor();
  }

  document.getElementById('contactOverlay').classList.remove('d-none');
  setTimeout(() => nameEl.focus(), 0);
}

function closeContactModal() {
  document.getElementById('contactOverlay').classList.add('d-none');
  contactModalContactId = null;
  contactModalMode = 'edit';
}

function clearModalErrors() {
  document.getElementById('modalErrName').textContent = '';
  document.getElementById('modalErrEmail').textContent = '';
  document.getElementById('modalErrPhone').textContent = '';
}

function showModalErrors(errors) {
  // sehr simple Zuordnung
  for (const msg of errors) {
    const low = msg.toLowerCase();
    if (low.includes('name')) document.getElementById('modalErrName').textContent = msg;
    if (low.includes('mail') || low.includes('e-mail')) document.getElementById('modalErrEmail').textContent = msg;
    if (low.includes('telefon') || low.includes('phone')) document.getElementById('modalErrPhone').textContent = msg;
  }
}

function setupContactModalListeners() {
  const overlay = document.getElementById('contactOverlay');
  const closeBtn = document.getElementById('contactModalClose');
  const form = document.getElementById('contactModalForm');
  const deleteBtn = document.getElementById('contactModalDeleteBtn');

  // Close Button - mehrere Methoden für maximale Kompatibilität
  if (closeBtn) {
    if (!closeBtn.dataset.listenerAdded) {
      closeBtn.addEventListener('click', closeContactModal);
      closeBtn.onclick = closeContactModal; // Zusätzlicher onclick Handler
      closeBtn.dataset.listenerAdded = 'true';
    }
  }

  // Klick auf Overlay (außerhalb Modal) schließt
  if (overlay && !overlay.dataset.listenerAdded) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeContactModal();
    });
    overlay.dataset.listenerAdded = 'true';
  }

  if (form && !form.dataset.listenerAdded) {
    form.addEventListener('submit', onSubmitContactModal);
    form.dataset.listenerAdded = 'true';
  }

  if (deleteBtn && !deleteBtn.dataset.listenerAdded) {
    deleteBtn.addEventListener('click', onDeleteFromModal);
    deleteBtn.dataset.listenerAdded = 'true';
  }

  // ESC schließt
  if (!document.body.dataset.modalEsc) {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !document.getElementById('contactOverlay').classList.contains('d-none')) {
        closeContactModal();
      }
    });
    document.body.dataset.modalEsc = 'true';
  }
}

async function onSubmitContactModal(e) {
  e.preventDefault();

  const saveBtn = document.getElementById('contactModalSaveBtn');
  const deleteBtn = document.getElementById('contactModalDeleteBtn');
  saveBtn.disabled = true;
  deleteBtn.disabled = true;

  try {
    clearModalErrors();

    const draft = {
      name: document.getElementById('modalName').value.trim(),
      email: document.getElementById('modalEmail').value.trim(),
      phone: document.getElementById('modalPhone').value.trim(),
    };

    const validation = validateContact(draft);
    if (!validation.isValid) {
      showModalErrors(validation.errors);
      saveBtn.disabled = false;
      deleteBtn.disabled = false;
      return;
    }

    const now = new Date().toISOString();

    if (contactModalMode === 'edit') {
      const patch = {
        ...draft,
        initials: generateInitials(draft.name),
        updatedAt: now
      };

      await updateContactInFirebase(contactModalContactId, patch);
    } else {
      // add: nutzt deine bestehende saveNewContact() / oder die PUT-Variante mit cX
      await saveNewContact({
        ...draft,
        initials: generateInitials(draft.name),
        color: generateRandomColor(),
        createdAt: now,
        updatedAt: now
      });
      
      // Show success notification for new contact
      showContactCreatedNotification();
    }

    // neu laden & UI updaten
    contacts = await loadContactsFromFirebase();
    renderContactsList(contacts);

    // falls edit: wieder auswählen (Details rechts aktualisieren)
    if (contactModalMode === 'edit') {
      const updated = contacts.find(c => c.id === contactModalContactId);
      const item = document.querySelector(`.contact-item[data-id="${contactModalContactId}"]`);
      if (updated && item) selectContact(updated, item);
    }

    closeContactModal();

  } catch (err) {
    console.error(err);
    alert('Speichern fehlgeschlagen (siehe Console).');
  } finally {
    saveBtn.disabled = false;
    deleteBtn.disabled = false;
  }
}

async function onDeleteFromModal() {
  if (!contactModalContactId) return;

  const contact = contacts.find(c => c.id === contactModalContactId);
  if (!contact) return;

  if (!confirm(`Kontakt "${contact.name}" wirklich löschen?`)) return;

  const saveBtn = document.getElementById('contactModalSaveBtn');
  const deleteBtn = document.getElementById('contactModalDeleteBtn');
  saveBtn.disabled = true;
  deleteBtn.disabled = true;

  try {
    await deleteContactFromFirebase(contact.id);
    await removeContactFromAllTasks(contact.id);

    contacts = await loadContactsFromFirebase();
    renderContactsList(contacts);

    selectedContactId = null;

    const detailsEmpty = document.getElementById('detailsEmpty');
    const detailsCard = document.getElementById('detailsCard');
    if (detailsCard) detailsCard.classList.add('hidden');
    if (detailsEmpty) detailsEmpty.classList.remove('hidden');

    closeContactModal();
  } catch (err) {
    console.error(err);
    alert('Löschen fehlgeschlagen (siehe Console).');
  } finally {
    saveBtn.disabled = false;
    deleteBtn.disabled = false;
  }
}

// Firebase REST Helper Functions
async function fbGet(path) {
  const res = await fetch(`${DB_URL}${path}.json`);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return await res.json();
}

async function fbPut(path, data) {
  const res = await fetch(`${DB_URL}${path}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
  return await res.json();
}

async function fbPatch(path, data) {
  const res = await fetch(`${DB_URL}${path}.json`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`PATCH ${path} failed: ${res.status}`);
  return await res.json();
}

async function fbDelete(path) {
  const res = await fetch(`${DB_URL}${path}.json`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
  return true;
}

// Firebase Functions (Realtime DB via REST)
async function loadContactsFromFirebase() {
  const res = await fetch(`${DB_URL}${CONTACTS_PATH}.json`);
  const data = await res.json();

  if (!data) return [];

  // Firebase liefert ein Objekt: { c1:{...}, c2:{...} }
  return Object.entries(data).map(([id, c]) => ({
    id,
    ...c,
    // falls in DB mal kein initials gespeichert ist:
    initials: c.initials || generateInitials(c.name || ''),
  }));
}

async function updateContactInFirebase(contactId, updatedData) {
  const res = await fetch(`${DB_URL}${CONTACTS_PATH}/${contactId}.json`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) throw new Error('Kontakt-Update fehlgeschlagen');
  return await res.json();
}

async function deleteContactFromFirebase(contactId) {
  const res = await fetch(`${DB_URL}${CONTACTS_PATH}/${contactId}.json`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('Kontakt-Löschen fehlgeschlagen');
}

async function getNextContactId() {
  const res = await fetch(`${DB_URL}/Contacts.json`);
  const data = await res.json() || {};

  const numbers = Object.keys(data)
    .map(k => k.match(/^c(\d+)$/))
    .filter(Boolean)
    .map(m => Number(m[1]));

  const next = numbers.length ? Math.max(...numbers) + 1 : 1;
  return `c${next}`;
}

async function saveNewContact(contact) {
  const contactId = await getNextContactId();

  const payload = {
    ...contact,
    id: contactId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await fetch(`${DB_URL}/Contacts/${contactId}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return contactId;
}

async function createContactFirebase(draft) {
  const contact = {
    name: draft.name,
    email: draft.email,
    phone: draft.phone || '',
    initials: generateInitials(draft.name),
    color: generateRandomColor(),
    isMe: false,
  };

  await saveNewContact(contact);
}

async function removeContactFromAllTasks(contactId) {
  const res = await fetch(`${DB_URL}${TASKS_PATH}.json`);
  const tasksObj = await res.json();
  if (!tasksObj) return;

  const updates = {};

  for (const [taskKey, task] of Object.entries(tasksObj)) {
    if (!task) continue;

    let changed = false;

    // Fall A: assignedTo ist Array mit IDs (["c1","c2"])
    if (Array.isArray(task.assignedTo)) {
      const before = task.assignedTo.length;
      task.assignedTo = task.assignedTo.filter(id => id !== contactId);
      if (task.assignedTo.length !== before) changed = true;
    }

    // Fall B: assignedTo ist Objekt-Map ({c1:true, c2:true})
    if (task.assignedTo && typeof task.assignedTo === 'object' && !Array.isArray(task.assignedTo)) {
      if (task.assignedTo[contactId] !== undefined) {
        delete task.assignedTo[contactId];
        changed = true;
      }
    }

    // Fall C: assignedContacts (manche speichern so)
    if (Array.isArray(task.assignedContacts)) {
      const before = task.assignedContacts.length;
      task.assignedContacts = task.assignedContacts.filter(id => id !== contactId);
      if (task.assignedContacts.length !== before) changed = true;
    }

    if (changed) {
      updates[taskKey] = task;
    }
  }

  // nur patchen, wenn nötig
  if (Object.keys(updates).length === 0) return;

  await fetch(`${DB_URL}${TASKS_PATH}.json`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
}

// Utility Functions
function setDetailsButtonsLoading(isLoading) {
  const editBtn = document.getElementById('editBtn');
  const deleteBtn = document.getElementById('deleteBtn');

  if (editBtn) editBtn.disabled = isLoading;
  if (deleteBtn) deleteBtn.disabled = isLoading;

  if (editBtn) editBtn.style.opacity = isLoading ? '0.6' : '1';
  if (deleteBtn) deleteBtn.style.opacity = isLoading ? '0.6' : '1';
}

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

/**
 * Shows the success notification with slide-in animation
 * Slides in from the right, stays visible for 2 seconds, then slides back out
 */
function showContactCreatedNotification() {
  const notification = document.getElementById('contactSuccessNotification');
  if (!notification) return;
  
  // Reset position (in case it was still visible)
  notification.classList.remove('show');
  
  // Force reflow to ensure the reset takes effect
  notification.offsetHeight;
  
  // Show notification with slide-in animation
  notification.classList.add('show');
  
  // Hide notification after 2.5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2500);
}

