(function () {
  const input = document.getElementById('search-input');
  const form = document.getElementById('search-form');
  if (!input || !form) return;

  const onTokensPage = !!document.querySelector('.token-gallery');

  if (onTokensPage) {
    const allItems = Array.from(document.querySelectorAll('.token-gallery-item'));

    const textboxItems = document.querySelector('.token-gallery-textbox-items');

    function filterAndScroll(query) {
      const q = query.trim().toLowerCase();
      let firstMatch = null;

      allItems.forEach(item => {
        const name = item.querySelector('.token-image-text');
        const match = !q || (name && name.textContent.toLowerCase().includes(q));
        item.style.display = match ? '' : 'none';
        if (match && !firstMatch) firstMatch = item;
      });

      if (textboxItems) textboxItems.style.display = q ? 'none' : '';

      if (firstMatch && q) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    input.addEventListener('input', () => filterAndScroll(input.value));
    form.addEventListener('submit', e => e.preventDefault());

    // Apply URL query on arrival from another page — wait for full load so scroll lands correctly
    window.addEventListener('load', () => {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('search') || '';
      if (q) {
        input.value = q;
        filterAndScroll(q);
      }
    });

  } else {
    function redirect() {
      const q = input.value.trim();
      if (q) window.location.href = `./tokens.html?search=${encodeURIComponent(q)}`;
    }
    form.addEventListener('submit', e => { e.preventDefault(); redirect(); });
    input.addEventListener('keydown', e => { if (e.key === 'Enter') redirect(); });
  }
})();
