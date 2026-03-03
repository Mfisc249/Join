function isLoggedIn() {
  return !!sessionStorage.getItem("contactId");
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadTemplate('./templates/header.html', '#header-slot');
  handleHeaderAuth();
});

function handleHeaderAuth() {
  const isLoggedIn_now = !!sessionStorage.getItem("contactId");
  const isGuest = sessionStorage.getItem("isGuest") === "true";
  
  // guest-mode: nur bei NICHT eingeloggt UND NICHT als Gast
  if (!isLoggedIn_now && !isGuest) {
    document.body.classList.add("guest-mode");
  } else {
    document.body.classList.remove("guest-mode");
  }
}

async function loadTemplate(url, targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return console.error('Target not found:', targetSelector);

  const res = await fetch(url);
  if (!res.ok) return console.error('Template failed:', url, res.status);

  target.innerHTML = await res.text();
  
  // Setup submenu nach dem Template-Load
  setupSubmenu();
  // Initialize header user badge (initials / color / guest) after template load
  initHeaderUser();
}

function setupSubmenu() {
  const badge = document.getElementById("circleBadge");
  const menu = document.getElementById("submenu");
  if (!badge || !menu) return;

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

  // Klick außerhalb schließt
  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("hidden") && !e.target.closest(".user-menu")) {
      close();
    }
  });

  // ESC schließt
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function logout() {
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = "./index.html"; // oder "./login.html"
}

// Set user initials and color in header badge from sessionStorage
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
