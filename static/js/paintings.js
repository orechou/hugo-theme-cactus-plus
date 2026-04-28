(function () {
  var container = document.getElementById('paintings');
  if (!container) return;

  var masonry = container.querySelector('.paintings-masonry');
  var loader = container.querySelector('.paintings-loader');
  var filterBar = container.querySelector('.paintings-filter');
  var loading = false;
  var activeFilter = '';

  function getNextPage() {
    return container.getAttribute('data-next-page');
  }

  function showLoader() {
    loader.style.display = 'flex';
  }

  function hideLoader() {
    loader.style.display = 'none';
  }

  function cleanup() {
    window.removeEventListener('scroll', onScroll);
    hideLoader();
  }

  function getColumns() {
    return Array.prototype.slice.call(
      masonry.querySelectorAll('.paintings-column')
    ).filter(function (col) {
      return getComputedStyle(col).display !== 'none';
    });
  }

  function getShortestColumn() {
    var cols = getColumns();
    if (cols.length === 0) return null;
    var shortest = cols[0];
    var minCount = shortest.children.length;
    for (var i = 1; i < cols.length; i++) {
      if (cols[i].children.length < minCount) {
        minCount = cols[i].children.length;
        shortest = cols[i];
      }
    }
    return shortest;
  }

  function contentFillsViewport() {
    var docHeight = document.documentElement.scrollHeight;
    var windowHeight = window.innerHeight;
    return docHeight > windowHeight + 300;
  }

  function waitForImages(parent) {
    var images = parent.querySelectorAll('img');
    var pending = [];
    images.forEach(function (img) {
      if (img.complete) return;
      pending.push(new Promise(function (resolve) {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      }));
    });
    return pending.length > 0 ? Promise.all(pending) : Promise.resolve();
  }

  function filterCards() {
    var cards = masonry.querySelectorAll('.painting-card');
    cards.forEach(function (card) {
      if (!activeFilter) {
        card.style.display = '';
        return;
      }
      var tags = (card.getAttribute('data-tags') || '').split(',');
      card.style.display = tags.indexOf(activeFilter) !== -1 ? '' : 'none';
    });
  }

  if (filterBar) {
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.painting-filter-tag');
      if (!btn) return;

      var tag = btn.getAttribute('data-filter');

      if (tag && tag === activeFilter) {
        btn.classList.remove('active');
        var allBtn = filterBar.querySelector('[data-filter=""]');
        if (allBtn) allBtn.classList.add('active');
        activeFilter = '';
        filterCards();
        return;
      }

      filterBar.querySelectorAll('.painting-filter-tag').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      activeFilter = tag;
      filterCards();
    });
  }

  function loadMore() {
    if (loading) return;

    var nextUrl = getNextPage();
    if (!nextUrl) {
      cleanup();
      return;
    }

    loading = true;
    showLoader();

    fetch(nextUrl)
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');

        var newCards = doc.querySelectorAll('.painting-card');
        // Append each card to the shortest column
        newCards.forEach(function (card) {
          var col = getShortestColumn();
          if (col) col.appendChild(card);
        });

        var newContainer = doc.getElementById('paintings');
        if (newContainer) {
          var newNext = newContainer.getAttribute('data-next-page');
          container.setAttribute('data-next-page', newNext || '');
        }

        loading = false;
        hideLoader();

        filterCards();

        if (!getNextPage()) {
          cleanup();
          return;
        }

        waitForImages(masonry).then(function () {
          if (!contentFillsViewport()) {
            loadMore();
          }
        });
      })
      .catch(function () {
        loading = false;
        hideLoader();
      });
  }

  function onScroll() {
    if (loading || !getNextPage()) return;

    var scrollY = window.scrollY || window.pageYOffset;
    var windowHeight = window.innerHeight;
    var docHeight = document.documentElement.scrollHeight;

    if (scrollY + windowHeight >= docHeight - 300) {
      loadMore();
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  waitForImages(masonry).then(function () {
    if (!contentFillsViewport() && getNextPage()) {
      loadMore();
    }
  });
})();
