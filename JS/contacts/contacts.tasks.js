'use strict';

window.ContactsApp = window.ContactsApp || {};

ContactsApp.tasks = {
  async removeContactFromAllTasks(contactId) {
    const { TASKS_PATH } = ContactsApp.config;
    const tasksObj = await ContactsApp.api.get(TASKS_PATH);
    if (!tasksObj) return;

    const updates = {};

    for (const [taskKey, task] of Object.entries(tasksObj)) {
      const patched = this._removeFromTask(task, contactId);
      if (patched) updates[taskKey] = patched;
    }

    if (Object.keys(updates).length === 0) return;
    await ContactsApp.api.patch(TASKS_PATH, updates);
  },

  _removeFromTask(task, contactId) {
    if (!task) return null;

    let changed = false;
    const clone = structuredClone(task);

    if (Array.isArray(clone.assignedTo)) {
      const before = clone.assignedTo.length;
      clone.assignedTo = clone.assignedTo.filter(id => id !== contactId);
      if (clone.assignedTo.length !== before) changed = true;
    }

    if (clone.assignedTo && typeof clone.assignedTo === 'object' && !Array.isArray(clone.assignedTo)) {
      if (clone.assignedTo[contactId] !== undefined) {
        delete clone.assignedTo[contactId];
        changed = true;
      }
    }

    if (Array.isArray(clone.assignedContacts)) {
      const before = clone.assignedContacts.length;
      clone.assignedContacts = clone.assignedContacts.filter(id => id !== contactId);
      if (clone.assignedContacts.length !== before) changed = true;
    }

    return changed ? clone : null;
  },
};
