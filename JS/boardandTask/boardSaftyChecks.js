/** Returns a task object by ID or an empty object when it cannot be found. */
function getTaskById(taskID) {
    return TASK?.[0]?.[`Task${taskID}`] || {};
}

/** Converts a value into cleaned text and falls back for empty-like values. */
function safeText(value, fallback = '') {
    if (value === undefined || value === null) {
        return fallback;
    }

    let normalized = String(value).trim();
    if (normalized.toLowerCase() === 'undefined' || normalized.toLowerCase() === 'null') {
        return fallback;
    }

    return normalized;
}

/** Ensures a value is returned as an array and otherwise falls back to an empty array. */
function safeArray(value) {
    return Array.isArray(value) ? value : [];
}

/** Normalizes priority labels into the display format used by the board. */
function normalizePriority(value) {
    let normalized = safeText(value, '').toLowerCase();
    if (normalized === 'low') return 'Low';
    if (normalized === 'medium') return 'Medium';
    if (normalized === 'urgent') return 'Urgent';
    return 'No priority';
}

/** Normalizes a category value for safe display in the UI. */
function normalizeCategory(value) {
    return safeText(value, 'No category');
}

/** Normalizes a due-date value for safe display in the UI. */
function normalizeDueDate(value) {
    return safeText(value, '-');
}
