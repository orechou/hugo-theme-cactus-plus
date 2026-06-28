/**
 * Incoming webmentions display.
 *
 * Fetches mentions for the current post from webmention.io and renders the
 * authors. SPA-aware: re-scans for #webmentions after each navigation (the
 * container lives inside .content and is rebuilt by the SPA router).
 */
(function () {
  'use strict';

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function t(key, fallback) {
    var prop = 'webmentions' + key.charAt(0).toUpperCase() + key.slice(1);
    var v = document.documentElement.dataset[prop];
    return v ? v : fallback;
  }

  function init() {
    var container = document.getElementById('webmentions');
    if (!container || container.dataset.loaded) return;
    container.dataset.loaded = '1';

    var target = container.getAttribute('data-target');
    var list = container.querySelector('.webmentions-list');
    if (!target || !list) return;

    fetch('https://webmention.io/api/mentions.jf2?target=' + encodeURIComponent(target) + '&per-page=30', { credentials: 'omit' })
      .then(function (r) { if (!r.ok) throw new Error('bad status'); return r.json(); })
      .then(function (data) {
        var items = (data && data.children) || [];
        if (!items.length) {
          list.innerHTML = '<p class="webmentions-empty">' + escapeHtml(t('empty', 'No mentions yet')) + '</p>';
          return;
        }
        list.innerHTML = items.map(function (it) {
          var name = (it.author && it.author.name) ? it.author.name : (it.title || t('anon', 'Mention'));
          var url = it.url || '#';
          var photo = (it.author && it.author.photo)
            ? '<img class="wm-avatar" src="' + escapeHtml(it.author.photo) + '" alt="" loading="lazy">'
            : '';
          var date = it.published ? ' <span class="wm-date">' + escapeHtml(String(it.published).slice(0, 10)) + '</span>' : '';
          return '<a class="wm-item" href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer nofollow">' +
            photo + '<span class="wm-name">' + escapeHtml(name) + '</span>' + date + '</a>';
        }).join('');
      })
      .catch(function () { list.innerHTML = ''; });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  // Re-scan after SPA navigation rebuilds the post content.
  window.addEventListener('spa-content-loaded', init);
})();
