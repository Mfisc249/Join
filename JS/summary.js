/**
 * Summary page logic:
 * - Counts tasks per column (field1..field4) from Firebase
 * - Counts urgent tasks
 * - Finds closest upcoming due date
 * - Shows greeting by time + username
 */

/** @type {string} Firebase Realtime Database base URL */
const SUMMARYURLBASE = 'https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/';

document.addEventListener('DOMContentLoaded', async () => {
  await initSummary();
});


/**
 * Initializes the summary page by loading tasks, rendering counts,
 * deadline, greeting, and navigation wiring.
 */
async function initSummary() {
  const tasksObj = await DataGET('Tasks');
  const tasks = tasksObj ? Object.values(tasksObj) : [];

  const counts = countTasks(tasks);

  setText('sum-todo', counts.todo);
  setText('sum-inprogress', counts.inprogress);
  setText('sum-feedback', counts.feedback);
  setText('sum-done', counts.done);
  setText('sum-board', counts.board);
  setText('sum-urgent', counts.urgent);

  const nextDeadline = getUpcomingDeadline(tasks);
  setText('sum-deadline-date', nextDeadline ? formatDateLong(nextDeadline) : '—');
  // Optional: redirect to login if no session info (set to true to enable)
  const ENABLE_REDIRECT_IF_NO_SESSION = false;
  if (ENABLE_REDIRECT_IF_NO_SESSION && !sessionStorage.getItem('userName')) {
    window.location.href = 'login.html';
    return;
  }

  initGreeting();
  wireSummaryNavigation();
  
  // Show mobile greeting overlay after login
  showMobileGreetingIfNeeded();
}


/**
 * Fetches JSON data from Firebase Realtime Database.
 * @param {string} path - The database path to query.
 * @returns {Promise<Object|null>} The parsed JSON response.
 */
async function DataGET(path = '') {
  const res = await fetch(SUMMARYURLBASE + path + '.json');
  return await res.json();
}


/**
 * Counts tasks by status and priority.
 * @param {Array<Object>} tasks - Array of task objects from Firebase.
 * @returns {{todo:number, inprogress:number, feedback:number, done:number, board:number, urgent:number}}
 */
function countTasks(tasks) {
  const c = { todo: 0, inprogress: 0, feedback: 0, done: 0, board: 0, urgent: 0 };

  for (const t of tasks) {
    const col = t?.field?.field;
    if (col === 'field1') c.todo++;
    else if (col === 'field2') c.inprogress++;
    else if (col === 'field3') c.feedback++;
    else if (col === 'field4') c.done++;
    else continue;

    if (String(t?.priority).toLowerCase() === 'urgent') c.urgent++;
  }
  c.board = c.todo + c.inprogress + c.feedback + c.done;
  return c;
}

/**
 * Finds the closest upcoming deadline from all tasks.
 * @param {Array<Object>} tasks - Array of task objects.
 * @returns {Date|null} The nearest future due date, or null.
 */
function getUpcomingDeadline(tasks) {
  const today = startOfDay(new Date());
  const dates = [];

  for (const t of tasks) {
    if (String(t?.priority).toLowerCase() !== 'urgent') continue;
    const d = parseJoinDate(t?.dueDate);
    if (d && d >= today) dates.push(d);
  }

  dates.sort((a, b) => a - b);
  return dates[0] || null;
}


/**
 * Parses a dd/mm/yyyy date string into a Date object.
 * @param {string|null} value - Date string in dd/mm/yyyy format.
 * @returns {Date|null} Parsed date at start of day, or null if invalid.
 */
function parseJoinDate(value) {
  if (!value) return null;
  const m = String(value).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;

  const dd = Number(m[1]);
  const mm = Number(m[2]);
  const yyyy = Number(m[3]);

  const d = new Date(yyyy, mm - 1, dd);
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return null;
  return startOfDay(d);
}


/**
 * Strips time from a Date, returning midnight of that day.
 * @param {Date} d - The date to normalize.
 * @returns {Date} A new Date set to 00:00:00.
 */
function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}


/**
 * Formats a Date as a long English string (e.g. "January 27, 2026").
 * @param {Date} d - The date to format.
 * @returns {string} Formatted date string.
 */
function formatDateLong(d) {
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}


/**
 * Sets the text content of an element by its ID.
 * @param {string} id - The DOM element ID.
 * @param {string|number} value - The value to display.
 */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = String(value);
}


/**
 * Displays a time-based greeting and the logged-in username.
 */
function initGreeting() {
  const greetLine = document.getElementById("greet-line");
  const greetName = document.getElementById("greet-name");

  const userName = sessionStorage.getItem("userName");
  const isGuest = sessionStorage.getItem("isGuest");

  const hour = new Date().getHours();

  let greeting = "Hello";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";
  else greeting = "Good evening";

  if (greetLine) greetLine.textContent = greeting + "!";

  // For guest logins or missing session, show no name; only show name for logged-in users
  if (isGuest === "true" || !userName) {
    if (greetName) greetName.textContent = "";
  } else {
    if (greetName) greetName.textContent = userName;
  }
}

/**
 * Returns the current user's name from session storage.
 * @returns {string} The username, or empty string if not set.
 */
function getUserName() {
  return sessionStorage.getItem('userName') || '';
}

/**
 * Wires click handlers on summary cards to navigate to the board page.
 */
function wireSummaryNavigation() {
  document.querySelectorAll('[data-nav]').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.location.href = 'board.html';
    });
  });
}

/**
 * Shows a full-screen greeting overlay on mobile after the first login.
 * Fades out automatically after 2 seconds.
 */
function showMobileGreetingIfNeeded() {
  // Only on mobile (max-width: 768px)
  if (window.innerWidth > 768) return;
  
  // Check if this is the first visit to summary after login
  const summaryVisited = sessionStorage.getItem('summaryVisited');
  if (summaryVisited) return;
  
  // Mark as visited so it doesn't show again
  sessionStorage.setItem('summaryVisited', 'true');
  
  // Get greeting text
  const userName = sessionStorage.getItem("userName");
  const isGuest = sessionStorage.getItem("isGuest");
  
  const hour = new Date().getHours();
  let greeting = "Hello";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";
  else greeting = "Good evening";
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'greeting-overlay';
  
  const greetLine = document.createElement('div');
  greetLine.className = 'greetLine';
  greetLine.textContent = greeting + ',';
  
  const greetName = document.createElement('div');
  greetName.className = 'greetName';
  greetName.textContent = (isGuest === "true" || !userName) ? "" : userName;
  
  overlay.appendChild(greetLine);
  overlay.appendChild(greetName);
  document.body.appendChild(overlay);
  
  // Fade out after 2 seconds, remove after animation
  setTimeout(() => {
    overlay.classList.add('fade-out');
    setTimeout(() => {
      overlay.remove();
    }, 500); // Match CSS transition duration
  }, 2000);
}
