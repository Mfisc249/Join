/**
 * Checks whether a user is currently logged in via session storage.
 * @returns {boolean} True if contactId is stored in session.
 */
function isLoggedIn() {
  return !!sessionStorage.getItem("contactId");
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadHeaderTemplate('./templates/header.html', '#header-slot');
  handleHeaderAuth();
});


/**
 * Applies or removes the guest-mode class on the body
 * depending on the user's login and guest status.
 */
function handleHeaderAuth() {
  const isLoggedIn_now = !!sessionStorage.getItem("contactId");
  const isGuest = sessionStorage.getItem("isGuest") === "true";
  
  // Guest mode: only when not logged in and not using guest access
  if (!isLoggedIn_now && !isGuest) {
    document.body.classList.add("guest-mode");
  } else {
    document.body.classList.remove("guest-mode");
  }
}

/**
 * Loads an HTML template file and injects it into the target element.
 * @param {string} url - Path to the HTML template file.
 * @param {string} targetSelector - CSS selector of the container element.
 */
async function loadHeaderTemplate(url, targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  const res = await fetch(url);
  if (!res.ok) return;

  target.innerHTML = await res.text();
  
  // Set up submenu after the template has loaded
  setupSubmenu();
  // Initialize header user badge (initials / color / guest) after template load
  initHeaderUser();
}

/**
 * Initializes the header submenu toggle, outside-click close,
 * and Escape key handling.
 */
function setupSubmenu() {
  const submenu = getSubmenuElements();
  if (!submenu || submenu.badge.dataset.submenuInitialized === "true") return;
  submenu.badge.dataset.submenuInitialized = "true";
  registerSubmenuHandlers(submenu);
}

function getSubmenuElements() {
  const badge = document.getElementById("circleBadge");
  const menu = document.getElementById("submenu");
  return badge && menu ? { badge, menu } : null;
}

function setSubmenuState({ badge, menu }, isOpen) {
  menu.classList.toggle("hidden", !isOpen);
  badge.setAttribute("aria-expanded", String(isOpen));
}

function toggleSubmenu(submenu) {
  setSubmenuState(submenu, submenu.menu.classList.contains("hidden"));
}

function registerSubmenuHandlers(submenu) {
  submenu.badge.addEventListener("click", (e) => handleSubmenuBadgeClick(e, submenu));
  submenu.menu.addEventListener("click", stopSubmenuEventPropagation);
  document.addEventListener("click", (e) => closeSubmenuOnOutsideClick(e, submenu));
  document.addEventListener("keydown", (e) => closeSubmenuOnEscape(e, submenu));
}

function handleSubmenuBadgeClick(event, submenu) {
  event.stopPropagation();
  toggleSubmenu(submenu);
}

function stopSubmenuEventPropagation(event) {
  event.stopPropagation();
}

function closeSubmenuOnOutsideClick(event, submenu) {
  if (!submenu.menu.classList.contains("hidden") && !event.target.closest(".user-menu")) {
    setSubmenuState(submenu, false);
  }
}

function closeSubmenuOnEscape(event, submenu) {
  if (event.key === "Escape") setSubmenuState(submenu, false);
}

/**
 * Logs the user out by clearing session and local storage,
 * then redirects to the login page.
 */
function logout() {
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = "./index.html"; // or "./login.html"
}

/**
 * Sets the user's initials in the header badge from session storage.
 * Displays "G" for guest users.
 */
function initHeaderUser() {
  const badgeSpan = getHeaderBadgeSpan();
  if (!badgeSpan) return;
  badgeSpan.textContent = getHeaderBadgeText();
}

function getHeaderBadgeSpan() {
  return document.getElementById('circleBadge')?.querySelector('span') || null;
}

function getHeaderBadgeText() {
  if (sessionStorage.getItem('isGuest') === "true") return "G";
  return sessionStorage.getItem('userInitials') || "";
}
