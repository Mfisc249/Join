document.addEventListener('DOMContentLoaded', () => {
  loadTemplate('./templates/header.html', '#header-slot');
});

async function loadTemplate(url, targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return console.error('Target not found:', targetSelector);

  const res = await fetch(url);
  if (!res.ok) return console.error('Template failed:', url, res.status);

  target.innerHTML = await res.text();
}
