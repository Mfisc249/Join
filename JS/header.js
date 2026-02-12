document.addEventListener('DOMContentLoaded', () => {
  loadTemplate('./templates/header.html', '#header-slot');
});

async function loadTemplate(url, targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return console.error('Target not found:', targetSelector);

  const res = await fetch(url);
  if (!res.ok) return console.error('Template failed:', url, res.status);

  target.innerHTML = await res.text();
  
  // Setup submenu nach dem Template-Load
  setupSubmenu();
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
  // Hier kannst du die Logout-Logik implementieren
  console.log("User logged out");
  // Beispiel: window.location.href = "./login.html";
}
