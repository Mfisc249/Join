function getTaskById(taskID) {
    return TASK?.[0]?.[`Task${taskID}`] || {};
}

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

function safeArray(value) {
    return Array.isArray(value) ? value : [];
}

function normalizePriority(value) {
    let normalized = safeText(value, '').toLowerCase();
    if (normalized === 'low') return 'Low';
    if (normalized === 'medium') return 'Medium';
    if (normalized === 'urgent') return 'Urgent';
    return 'No priority';
}

function normalizeCategory(value) {
    return safeText(value, 'No category');
}

function normalizeDueDate(value) {
    return safeText(value, '-');
}