document.addEventListener('DOMContentLoaded', async () => {
  await loadTemplate('./templates/sidebar.html', '#sidebar-slot');
  markActiveNav();
  handleSidebarAuth();
  handleGuestMobileNav();
});


/**
 * Handles sidebar visibility based on login state.
 * Hides navigation and shows a login button when not authenticated.
 */
function handleSidebarAuth() {
  const nav = document.querySelector(".nav");
  const sidebarTop = document.querySelector(".sidebar-top");
  const isGuest = sessionStorage.getItem("isGuest") === "true";
  const isLoggedIn = !!sessionStorage.getItem("contactId");

  // Nur bei nicht eingeloggt, nicht als Gast: abgespeckte Sidebar mit Login Button
  if (!isLoggedIn && !isGuest) {
    // Navigation ausblenden
    if (nav) nav.style.display = "none";

    // Login Button einfügen
    if (!document.querySelector(".sidebar-login")) {
      const loginBtn = document.createElement("a");
      loginBtn.href = "./index.html";
      loginBtn.className = "sidebar-login";
      loginBtn.innerHTML = `
        <span class="nav-icon">
          <img src="./assets/img/login.svg" alt="Login">
        </span>
        <span>Log In</span>
      `;

      sidebarTop.insertAdjacentElement("afterend", loginBtn);
    }
  }
}


/**
 * Loads an HTML template file and injects it into the target element.
 * @param {string} url - Path to the HTML template file.
 * @param {string} targetSelector - CSS selector of the container element.
 */
async function loadTemplate(url, targetSelector) {
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

  // Mark active for desktop sidebar
  document.querySelectorAll('.nav-item').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    link.classList.toggle('active', linkPage === currentPage);
  });

  // Mark active for mobile bottom nav
  document.querySelectorAll('.mobile-nav-item').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    link.classList.toggle('active', linkPage === currentPage);
  });

  // Mark active for sidebar bottom links
  document.querySelectorAll('.sidebar-bottom .sidebar-link').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    link.classList.toggle('active', linkPage === currentPage);
  });

  // Mark active for guest mobile bottom nav
  document.querySelectorAll('.mobile-nav-guest-item').forEach(link => {
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
