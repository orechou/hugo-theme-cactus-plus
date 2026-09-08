/**
 * Incoming webmentions display.
 *
 * Fetches mentions for the current post from webmention.io and renders the
 * authors. SPA-aware: re-scans for #webmentions after each navigation (the
 * container lives inside .content and is rebuilt by the SPA router).
 */
(function () {
  'use strict';

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
          list.innerHTML = '<p class="webmentions-empty">' + window.cactus.escapeHtml(window.cactus.t('webmentions', 'empty', 'No mentions yet')) + '</p>';
          return;
        }
        list.innerHTML = items.map(function (it) {
          var name = (it.author && it.author.name) ? it.author.name : (it.title || window.cactus.t('webmentions', 'anon', 'Mention'));
          var url = it.url || '#';
          var photo = (it.author && it.author.photo)
            ? '<img class="wm-avatar" src="' + window.cactus.escapeHtml(it.author.photo) + '" alt="" loading="lazy">'
            : '';
          var date = it.published ? ' <span class="wm-date">' + window.cactus.escapeHtml(String(it.published).slice(0, 10)) + '</span>' : '';
          return '<a class="wm-item" href="' + window.cactus.escapeHtml(url) + '" target="_blank" rel="noopener noreferrer nofollow">' +
            photo + '<span class="wm-name">' + window.cactus.escapeHtml(name) + '</span>' + date + '</a>';
        }).join('');
      })
      .catch(function () { list.innerHTML = ''; });
  }

  window.cactus.onReady(init);
  window.cactus.onSpaReinit(init);
})();
