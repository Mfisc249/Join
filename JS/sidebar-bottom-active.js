function markBottomLinkActive() {
  const currentPage = location.pathname.split('/').pop();

  document.querySelectorAll('.sidebar-bottom .sidebar-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkPage = href.split('/').pop();

    if (linkPage === currentPage) {
      link.classList.add('active-bottom');
      link.setAttribute('aria-current', 'page');

      // unklickbar (ohne href zu zerstören)
      link.style.pointerEvents = 'none';
      link.style.cursor = 'default';
    } else {
      // falls du zwischen Seiten navigierst und Sidebar nicht neu geladen würde:
      link.classList.remove('active-bottom');
      link.removeAttribute('aria-current');
      link.style.pointerEvents = '';
      link.style.cursor = '';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const maxWaitMs = 2500;
  const start = Date.now();

  const t = setInterval(() => {
    const linksReady = document.querySelector('.sidebar-bottom .sidebar-link');
    if (linksReady) {
      clearInterval(t);
      markBottomLinkActive();
    }
    if (Date.now() - start > maxWaitMs) clearInterval(t);
  }, 50);
});