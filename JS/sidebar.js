document.addEventListener('DOMContentLoaded', async () => {
  await loadTemplate('./templates/sidebar.html', '#sidebar-slot');
  markActiveNav();
});

async function loadTemplate(url, targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return console.error('Target not found:', targetSelector);

  const res = await fetch(url);
  if (!res.ok) return console.error('Template failed:', url, res.status);

  target.innerHTML = await res.text();
}

function markActiveNav() {
  const currentPage = location.pathname.split('/').pop();

  document.querySelectorAll('.nav-item').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    link.classList.toggle('active', linkPage === currentPage);
  });
}
