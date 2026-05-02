/**
 * Summary page logic:
 * - Counts tasks per column (field1..field4) from Firebase
 * - Counts urgent tasks
 * - Finds closest upcoming due date
 * - Shows greeting by time + username
 */

/** @type {string} Firebase Realtime Database base URL */
const SUMMARYURLBASE = 'https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/';
const SUMMARY_COMPACT_BREAKPOINT = 1024;

document.addEventListener('DOMContentLoaded', async () => {
  await initSummary();
});


/**
 * Initializes the summary page by loading tasks, rendering counts,
 * deadline, greeting, and navigation wiring.
 */
async function initSummary() {
  const tasks = await getAllTasks();
  renderTaskCounts(tasks);
  renderNextDeadline(tasks);
  handleSessionRedirect();
  initGreeting();
  wireSummaryNavigation();
  showMobileGreetingIfNeeded();
}

async function getAllTasks() {
  const tasksObj = await DataGET('Tasks');
  return tasksObj ? Object.values(tasksObj) : [];
}

function renderTaskCounts(tasks) {
  const counts = countTasks(tasks);
  setText('sum-todo', counts.todo);
  setText('sum-inprogress', counts.inprogress);
  setText('sum-feedback', counts.feedback);
  setText('sum-done', counts.done);
  setText('sum-board', counts.board);
  setText('sum-urgent', counts.urgent);
}

function renderNextDeadline(tasks) {
  const nextDeadline = getUpcomingDeadline(tasks);
  setText('sum-deadline-date', nextDeadline ? formatDateLong(nextDeadline) : '—');
}

function handleSessionRedirect() {
  const ENABLE_REDIRECT_IF_NO_SESSION = false;
  if (ENABLE_REDIRECT_IF_NO_SESSION && !sessionStorage.getItem('userName')) {
    window.location.href = 'login.html';
  }
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
  tasks.forEach(t => updateTaskCounts(t, c));
  c.board = c.todo + c.inprogress + c.feedback + c.done;
  return c;
}

function updateTaskCounts(t, c) {
  const col = t?.field?.field;
  if (col === 'field1') c.todo++;
  else if (col === 'field2') c.inprogress++;
  else if (col === 'field3') c.feedback++;
  else if (col === 'field4') c.done++;
  else return;
  if (String(t?.priority).toLowerCase() === 'urgent') c.urgent++;
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
 * Parses a task due-date string into a Date object.
 * Supports both yyyy-mm-dd and dd/mm/yyyy.
 * @param {string|null} value - Due-date string from stored task data.
 * @returns {Date|null} Parsed date at start of day, or null if invalid.
 */
function parseJoinDate(value) {
  if (!value) return null;
  const normalized = String(value).trim();
  const isoMatch = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) return createValidatedDate(isoMatch[1], isoMatch[2], isoMatch[3]);

  const slashMatch = normalized.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) return createValidatedDate(slashMatch[3], slashMatch[2], slashMatch[1]);

  return null;
}

function createValidatedDate(year, month, day) {
  const yyyy = Number(year);
  const mm = Number(month);
  const dd = Number(day);
  const date = new Date(yyyy, mm - 1, dd);
  if (date.getFullYear() !== yyyy || date.getMonth() !== mm - 1 || date.getDate() !== dd) return null;
  return startOfDay(date);
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
  if (greetLine) greetLine.textContent = `${getGreetingText()}!`;
  if (greetName) greetName.textContent = getGreetingUserName();
}

function getGreetingText() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getGreetingUserName() {
  const userName = sessionStorage.getItem("userName");
  return sessionStorage.getItem("isGuest") === "true" || !userName ? "" : userName;
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
  document.querySelectorAll('[data-nav]').forEach(bindSummaryNavButton);
}

function bindSummaryNavButton(button) {
  const clearPressedState = () => button.classList.remove('is-pressed');
  button.addEventListener('pointerdown', () => addPressedStateOnCompact(button));
  ['pointerup', 'pointerleave', 'pointercancel', 'blur']
    .forEach((eventName) => button.addEventListener(eventName, clearPressedState));
  button.addEventListener('click', () => handleSummaryNavigation(button));
}

function addPressedStateOnCompact(button) {
  if (window.innerWidth <= SUMMARY_COMPACT_BREAKPOINT) button.classList.add('is-pressed');
}

function handleSummaryNavigation(button) {
  if (window.innerWidth > SUMMARY_COMPACT_BREAKPOINT) return goToBoard();
  button.classList.add('is-pressed');
  setTimeout(goToBoard, 140);
}

function goToBoard() {
  window.location.href = 'board.html';
}

/**
 * Shows a full-screen greeting overlay on mobile after the first login.
 * Fades out automatically after 2 seconds.
 */
function showMobileGreetingIfNeeded() {
  if (!shouldShowMobileGreeting()) return;
  sessionStorage.setItem('summaryVisited', 'true');
  const overlay = createGreetingOverlay();
  document.body.appendChild(overlay);
  fadeOutGreetingOverlay(overlay);
}

function shouldShowMobileGreeting() {
  return window.innerWidth <= SUMMARY_COMPACT_BREAKPOINT && !sessionStorage.getItem('summaryVisited');
}

function createGreetingOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'greeting-overlay';
  overlay.append(createGreetingTextNode('greetLine', `${getGreetingText()},`));
  overlay.append(createGreetingTextNode('greetName', getGreetingUserName()));
  return overlay;
}

function createGreetingTextNode(className, text) {
  const element = document.createElement('div');
  element.className = className;
  element.textContent = text;
  return element;
}

function fadeOutGreetingOverlay(overlay) {
  setTimeout(() => {
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 500);
  }, 2000);
}
