'use strict';

window.ContactsApp = window.ContactsApp || {};

/** @namespace ContactsApp.validation */
ContactsApp.validation = {
  /**
   * Validates a contact object for required fields and format.
   * @param {Object} contact - The contact to validate.
   * @returns {{isValid: boolean, errors: string[]}} Validation result.
   */
  validateContact(contact) {
    const errors = [];
    this._validateName(contact, errors);
    this._validateEmail(contact, errors);
    this._validatePhone(contact, errors);
    return { isValid: errors.length === 0, errors };
  },

  /** Adds a name validation error when needed. */
  _validateName(contact, errors) {
    if (!contact.name || contact.name.trim().length < 2) {
      errors.push('Name muss mindestens 2 Zeichen lang sein.');
    }
  },

  /** Adds an email validation error when needed. */
  _validateEmail(contact, errors) {
    if (!contact.email || !this.isValidEmail(contact.email)) {
      errors.push('Gültige E-Mail-Adresse erforderlich.');
    }
  },

  /** Adds a phone validation error when needed. */
  _validatePhone(contact, errors) {
    if (contact.phone && !this.isValidPhone(contact.phone)) {
      errors.push('Telefonnummer hat ein ungültiges Format.');
    }
  },

  /**
   * Checks whether an email address has a valid format.
   * @param {string} email - The email to validate.
   * @returns {boolean} True if the format is valid.
   */
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  /**
   * Checks whether a phone number has a valid format.
   * @param {string} phone - The phone number to validate.
   * @returns {boolean} True if the format is valid.
   */
  isValidPhone(phone) {
    return /^[\+]?[0-9\s\-\(\)]{6,}$/.test(phone);
  },

  /**
   * Generates uppercase initials from a full name.
   * @param {string} name - The full name.
   * @returns {string} One or two uppercase initials.
   */
  generateInitials(name) {
    if (!name) return '??';
    const words = name.trim().split(' ').filter(Boolean);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  },

  /**
   * Returns a random color from a predefined palette.
   * @returns {string} A hex color string.
   */
  generateRandomColor() {
    const colors = [
      '#FF7A00', '#9327FF', '#6E52FF', '#FC71FF',
      '#FFBB2B', '#1FD7C1', '#FF5EB3', '#00BEE8',
      '#1FC71F', '#FF745E', '#FFA35E', '#FC71FF'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  },
};
