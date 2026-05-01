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
  const badge = document.getElementById("circleBadge");
  const menu = document.getElementById("submenu");
  if (!badge || !menu) return;
  if (badge.dataset.submenuInitialized === "true") return;
  badge.dataset.submenuInitialized = "true";

  const open = () => {
    menu.classList.remove("hidden");
    badge.setAttribute("aria-expanded", "true");
  };

  const close = () => {
    menu.classList.add("hidden");
    badge.setAttribute("aria-expanded", "false");
  };

  const toggle = () => {
    menu.classList.contains("hidden") ? open() : close();
  };

  badge.addEventListener("click", (e) => {
    e.stopPropagation();
    toggle();
  });

  menu.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("hidden") && !e.target.closest(".user-menu")) {
      close();
    }
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
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
  const initials = sessionStorage.getItem('userInitials');
  const color = sessionStorage.getItem('userColor');
  const isGuest = sessionStorage.getItem('isGuest');

  const badge = document.getElementById('circleBadge');
  if (!badge) return;
  const badgeSpan = badge.querySelector('span');
  if (!badgeSpan) return;

  if (isGuest === "true") {
    badgeSpan.textContent = "G";
    return;
  }

  if (initials) {
    badgeSpan.textContent = initials;
  }

  // Do not change badge background color here; keep styling in CSS.
}
