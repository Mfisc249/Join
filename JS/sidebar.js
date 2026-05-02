document.addEventListener('DOMContentLoaded', async () => {
  await loadSidebarTemplate('./templates/sidebar.html', '#sidebar-slot');
  markActiveNav();
  handleSidebarAuth();
  handleGuestMobileNav();
});


/**
 * Handles sidebar visibility based on login state.
 * Hides navigation and shows a login button when not authenticated.
 */
function handleSidebarAuth() {
  if (!shouldShowLoggedOutSidebar()) return;
  hideSidebarNavigation();
  insertSidebarLoginButton();
}

function shouldShowLoggedOutSidebar() {
  const isGuest = sessionStorage.getItem("isGuest") === "true";
  const isLoggedIn = !!sessionStorage.getItem("contactId");
  return !isLoggedIn && !isGuest;
}

function hideSidebarNavigation() {
  const nav = document.querySelector(".nav");
  if (nav) nav.style.display = "none";
}

function insertSidebarLoginButton() {
  const sidebarTop = document.querySelector(".sidebar-top");
  if (!sidebarTop || document.querySelector(".sidebar-login")) return;
  sidebarTop.insertAdjacentElement("afterend", createSidebarLoginButton());
}

function createSidebarLoginButton() {
  const loginBtn = document.createElement("a");
  loginBtn.href = "./index.html";
  loginBtn.className = "sidebar-login";
  loginBtn.innerHTML = `<span class="nav-icon"><img src="./assets/img/login.svg" alt="Login"></span><span>Log In</span>`;
  return loginBtn;
}

/**
 * Loads an HTML template file and injects it into the target element.
 * @param {string} url - Path to the HTML template file.
 * @param {string} targetSelector - CSS selector of the container element.
 */
async function loadSidebarTemplate(url, targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  const res = await fetch(url);
  if (!res.ok) return;

  target.innerHTML = await res.text();
}

/**
 * Highlights the active navigation item in desktop sidebar,
 * mobile bottom nav, and sidebar footer links based on the current URL.
 */
function markActiveNav() {
  const currentPage = location.pathname.split('/').pop();
  ['.nav-item', '.mobile-nav-item', '.sidebar-bottom .sidebar-link', '.mobile-nav-guest-item']
    .forEach((selector) => toggleActiveNavLinks(selector, currentPage));
}

function toggleActiveNavLinks(selector, currentPage) {
  document.querySelectorAll(selector).forEach((link) => {
    const linkPage = link.getAttribute('href').split('/').pop();
    link.classList.toggle('active', linkPage === currentPage);
  });
}

/**
 * Shows or hides the guest mobile bottom navigation
 * based on login state. Only visible for non-logged-in, non-guest users.
 */
function handleGuestMobileNav() {
  const isGuest = sessionStorage.getItem("isGuest") === "true";
  const isLoggedIn = !!sessionStorage.getItem("contactId");
  const guestNav = document.getElementById("mobileNavGuest");
  const mainNav = document.getElementById("mobileNav");

  if (!isLoggedIn && !isGuest) {
    if (mainNav) mainNav.style.display = "none";
  } else {
    if (guestNav) guestNav.style.display = "none";
  }
}
