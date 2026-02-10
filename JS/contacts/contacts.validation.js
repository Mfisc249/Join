'use strict';

window.ContactsApp = window.ContactsApp || {};

ContactsApp.validation = {
  validateContact(contact) {
    const errors = [];

    if (!contact.name || contact.name.trim().length < 2) {
      errors.push('Name muss mindestens 2 Zeichen lang sein.');
    }
    if (!contact.email || !this.isValidEmail(contact.email)) {
      errors.push('Gültige E-Mail-Adresse erforderlich.');
    }
    if (contact.phone && !this.isValidPhone(contact.phone)) {
      errors.push('Telefonnummer hat ein ungültiges Format.');
    }

    return { isValid: errors.length === 0, errors };
  },

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  isValidPhone(phone) {
    return /^[\+]?[0-9\s\-\(\)]{6,}$/.test(phone);
  },

  generateInitials(name) {
    if (!name) return '??';
    const words = name.trim().split(' ').filter(Boolean);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  },

  generateRandomColor() {
    const colors = [
      '#FF7A00', '#9327FF', '#6E52FF', '#FC71FF',
      '#FFBB2B', '#1FD7C1', '#FF5EB3', '#00BEE8',
      '#1FC71F', '#FF745E', '#FFA35E', '#FC71FF'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  },
};
