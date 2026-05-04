'use strict';

window.ContactsApp = window.ContactsApp || {};

/** @namespace ContactsApp.tasks */
ContactsApp.tasks = {
  /**
   * Removes a contact from all tasks that reference it.
   * @param {string} contactId - The contact ID to remove.
   */
  async removeContactFromAllTasks(contactId) {
    const { TASKS_PATH } = ContactsApp.config;
    const tasksObj = await ContactsApp.api.get(TASKS_PATH);
    if (!tasksObj) return;
    const updates = this._collectContactRemovalUpdates(tasksObj, contactId);
    if (Object.keys(updates).length === 0) return;
    await ContactsApp.api.patch(TASKS_PATH, updates);
  },

  /** Collects all task patches needed after removing a contact. */
  _collectContactRemovalUpdates(tasksObj, contactId) {
    return Object.entries(tasksObj).reduce((updates, [taskKey, task]) => {
      const patched = this._removeFromTask(task, contactId);
      if (patched) updates[taskKey] = patched;
      return updates;
    }, {});
  },

  /**
   * Removes a contact ID from a single task's assigned fields.
   * @param {Object} task - The task object to check.
   * @param {string} contactId - The contact ID to remove.
   * @returns {Object|null} Patched task clone, or null if unchanged.
   */
  _removeFromTask(task, contactId) {
    if (!task) return null;
    let changed = false;
    const clone = structuredClone(task);
    changed = this._removeFromAssignedArray(clone, 'assignedTo', contactId) || changed;
    changed = this._removeFromAssignedObject(clone, 'assignedTo', contactId) || changed;
    changed = this._removeFromAssignedArray(clone, 'assignedContacts', contactId) || changed;
    return changed ? clone : null;
  },

  /** Removes a contact from an array-based task assignment field. */
  _removeFromAssignedArray(task, field, contactId) {
    if (!Array.isArray(task[field])) return false;
    const before = task[field].length;
    task[field] = task[field].filter(id => id !== contactId);
    return task[field].length !== before;
  },

  /** Removes a contact from an object-based task assignment field. */
  _removeFromAssignedObject(task, field, contactId) {
    if (!task[field] || Array.isArray(task[field]) || typeof task[field] !== 'object') return false;
    if (task[field][contactId] === undefined) return false;
    delete task[field][contactId];
    return true;
  },
};
