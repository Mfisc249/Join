'use strict';

/**
 * Mobile-specific interactions for Contacts page
 */
window.ContactsApp = window.ContactsApp || {};

ContactsApp.mobile = {
  init() {
    this._bindMobileButtons();
    this._handleMobileResize();
    window.addEventListener('resize', () => this._handleMobileResize());
  },

  _bindMobileButtons() {
    // Mobile back button
    const mobileBackBtn = document.getElementById('mobileBackBtn');
    if (mobileBackBtn) {
      mobileBackBtn.addEventListener('click', () => this.closeMobileDetails());
    }

    // FAB Add button
    const fabAdd = document.getElementById('fabAdd');
    if (fabAdd) {
      fabAdd.addEventListener('click', () => ContactsApp.uiModal.open('add'));
    }

    // FAB Menu button
    const fabMenu = document.getElementById('fabMenu');
    if (fabMenu) {
      fabMenu.addEventListener('click', () => this.toggleMobileOptionsMenu());
    }

    // Mobile Edit button
    const mobileEditBtn = document.getElementById('mobileEditBtn');
    if (mobileEditBtn) {
      mobileEditBtn.addEventListener('click', () => {
        this.closeMobileOptionsMenu();
        const id = ContactsApp.state.selectedContactId;
        if (!id) return;
        const contact = ContactsApp.state.contacts.find(c => c.id === id);
        if (contact) ContactsApp.uiModal.open('edit', contact);
      });
    }

    // Mobile Delete button
    const mobileDeleteBtn = document.getElementById('mobileDeleteBtn');
    if (mobileDeleteBtn) {
      mobileDeleteBtn.addEventListener('click', () => {
        this.closeMobileOptionsMenu();
        ContactsApp.page._deleteSelected();
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      const menu = document.getElementById('contactOptionsMenu');
      const fabMenu = document.getElementById('fabMenu');
      if (menu && !menu.contains(e.target) && !fabMenu.contains(e.target)) {
        this.closeMobileOptionsMenu();
      }
    });
  },

  openMobileDetails() {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    const content = document.querySelector('.content');
    const mobileBackBtn = document.getElementById('mobileBackBtn');
    
    if (content) content.classList.add('mobile-details-open');
    if (mobileBackBtn) mobileBackBtn.classList.remove('hidden');
    
    this._updateFabVisibility();
  },

  closeMobileDetails() {
    const content = document.querySelector('.content');
    const mobileBackBtn = document.getElementById('mobileBackBtn');
    
    if (content) content.classList.remove('mobile-details-open');
    if (mobileBackBtn) mobileBackBtn.classList.add('hidden');
    
    this._updateFabVisibility();
  },

  toggleMobileOptionsMenu() {
    const menu = document.getElementById('contactOptionsMenu');
    if (menu) {
      menu.classList.toggle('active');
    }
  },

  closeMobileOptionsMenu() {
    const menu = document.getElementById('contactOptionsMenu');
    if (menu) {
      menu.classList.remove('active');
    }
  },

  _updateFabVisibility() {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
      // Hide FABs on desktop
      const fabAdd = document.getElementById('fabAdd');
      const fabMenu = document.getElementById('fabMenu');
      if (fabAdd) fabAdd.classList.add('hidden');
      if (fabMenu) fabMenu.classList.add('hidden');
      return;
    }

    const content = document.querySelector('.content');
    const isDetailsOpen = content && content.classList.contains('mobile-details-open');
    
    const fabAdd = document.getElementById('fabAdd');
    const fabMenu = document.getElementById('fabMenu');
    
    if (isDetailsOpen) {
      // Details view: show menu FAB, hide add FAB
      if (fabAdd) fabAdd.classList.add('hidden');
      if (fabMenu) fabMenu.classList.remove('hidden');
    } else {
      // List view: show add FAB, hide menu FAB
      if (fabAdd) fabAdd.classList.remove('hidden');
      if (fabMenu) fabMenu.classList.add('hidden');
    }
  },

  _handleMobileResize() {
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile) {
      // Reset mobile-specific states on desktop
      this.closeMobileDetails();
      this.closeMobileOptionsMenu();
    }
    
    this._updateFabVisibility();
  }
};

// Extend selectContact to handle mobile view
const originalSelectContact = ContactsApp.uiList.selectContact;
ContactsApp.uiList.selectContact = function(contact, element) {
  originalSelectContact.call(this, contact, element);
  
  // Open mobile details view when contact is selected on mobile
  if (window.innerWidth <= 768) {
    ContactsApp.mobile.openMobileDetails();
  }
};

// Initialize mobile features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  ContactsApp.mobile.init();
});
