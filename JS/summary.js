/**
 * Summary page logic:
 * - Counts tasks per column (field1..field4) from Firebase
 * - Counts urgent tasks
 * - Finds closest upcoming due date
 * - Shows greeting by time + username
 */

const SUMMARYURLBASE = 'https://join-6f9cc-default-rtdb.europe-west1.firebasedatabase.app/';

document.addEventListener('DOMContentLoaded', async () => {
  await initSummary();
});

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

  renderGreeting();
  wireSummaryNavigation();
}

async function DataGET(path = '') {
  const res = await fetch(SUMMARYURLBASE + path + '.json');
  return await res.json();
}

function countTasks(tasks) {
  const c = { todo: 0, inprogress: 0, feedback: 0, done: 0, board: 0, urgent: 0 };

  for (const t of tasks) {
    const col = t?.field?.field;
    if (col === 'field1') c.todo++;
    if (col === 'field2') c.inprogress++;
    if (col === 'field3') c.feedback++;
    if (col === 'field4') c.done++;

    if (String(t?.priority).toLowerCase() === 'urgent') c.urgent++;
    c.board++;
  }
  return c;
}

/** dueDate ist bei euch dd/mm/yyyy (z.B. "27/01/2026") */
function getUpcomingDeadline(tasks) {
  const today = startOfDay(new Date());
  const dates = [];

  for (const t of tasks) {
    const d = parseJoinDate(t?.dueDate);
    if (d && d >= today) dates.push(d);
  }

  dates.sort((a, b) => a - b);
  return dates[0] || null;
}

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

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatDateLong(d) {
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = String(value);
}

function renderGreeting() {
  const hour = new Date().getHours();
  let line = 'Good morning!';

  if (hour >= 12 && hour <= 17) line = 'Good afternoon!';
  else if (hour >= 18 && hour <= 21) line = 'Good evening!';
  else if (hour >= 22 || hour <= 4) line = 'Good night!';

  const name = getUserName();
  document.getElementById('greet-line').textContent = name ? `${line},` : line;
  document.getElementById('greet-name').textContent = name || '';
}

function getUserName() {
  // anpassen, falls ihr euren Login anders speichert
  return localStorage.getItem('userName') || '';
}

/** Summary-Karten -> Board navigieren */
function wireSummaryNavigation() {
  document.querySelectorAll('[data-nav]').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.location.href = 'board.html';
    });
  });
}
