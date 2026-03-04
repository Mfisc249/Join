document.addEventListener('DOMContentLoaded', async () => {
  await loadTemplate('./templates/sidebar.html', '#sidebar-slot');
  markActiveNav();
  handleSidebarAuth();
});

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

async function loadTemplate(url, targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return console.error('Target not found:', targetSelector);

  const res = await fetch(url);
  if (!res.ok) return console.error('Template failed:', url, res.status);

  target.innerHTML = await res.text();
}

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
}
