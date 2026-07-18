/* chaseroll.com — tiny enhancements
   Loaded with `defer`; the tiny inline <script> in each page's <head> applies
   the initial theme before paint (no flash of wrong theme), and this file
   re-applies it to sync theme-color metas + toggle state. Concerns: theme
   toggling, external-link decoration, and the footer clock. */

(function () {
  /* --- Theme --------------------------------------------------------- */

  var KEY = 'chaseroll-theme';

  function getStored() {
    try {
      var v = localStorage.getItem(KEY);
      if (v === 'dark' || v === 'light') return v;
    } catch (e) {}
    return null;
  }
  function saveStored(t) {
    try { localStorage.setItem(KEY, t); } catch (e) {}
  }

  var mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function sysDark() { return mql ? mql.matches : false; }

  var THEME_COLORS = { light: '#fafafa', dark: '#0a0a0a' };

  function apply(t) {
    if (t === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    /* Keep the UA in agreement with the applied theme: form controls /
       scrollbars (color-scheme), mobile browser chrome (theme-color),
       and the toggle's accessible state. */
    document.documentElement.style.colorScheme = t;
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) {
      metas[i].setAttribute('content', THEME_COLORS[t]);
    }
    syncToggles(t);
  }

  function syncToggles(t) {
    var btns = document.getElementsByClassName('theme-toggle');
    /* action label only — pairing aria-pressed with a state-flipping label
       reads as a contradiction in screen readers */
    var label = 'Switch to ' + (t === 'dark' ? 'light' : 'dark') + ' theme';
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-label', label);
      btns[i].setAttribute('title', label);
    }
  }

  function current() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  /* Re-apply the seed's theme — syncs theme-color metas, color-scheme, toggle state */
  apply(getStored() || (sysDark() ? 'dark' : 'light'));

  /* Click the toggle anywhere on the page */
  document.addEventListener('click', function (e) {
    var t = e.target;
    var btn = t && t.closest ? t.closest('.theme-toggle') : null;
    if (!btn) return;
    /* arm the background crossfade only for real toggles, never page loads */
    document.documentElement.classList.add('theme-anim');
    var next = current() === 'dark' ? 'light' : 'dark';
    apply(next);
    saveStored(next);
  });

  /* If the user changes the theme in another tab, reflect it here */
  window.addEventListener('storage', function (e) {
    if (e.key !== KEY) return;
    if (e.newValue === 'dark' || e.newValue === 'light') apply(e.newValue);
    else apply(sysDark() ? 'dark' : 'light');
  });

  /* If the user hasn't explicitly picked, follow system preference changes */
  if (mql) {
    try {
      mql.addEventListener('change', function (e) {
        if (!getStored()) apply(e.matches ? 'dark' : 'light');
      });
    } catch (err) {}
  }

  /* --- External links → open in new tab ------------------------------ */

  function decorateLinks() {
    var host = window.location.hostname;
    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var href = a.getAttribute('href') || '';
      if (!/^https?:\/\//i.test(href)) continue;
      try {
        var u = new URL(a.href);
        if (u.hostname && u.hostname !== host) {
          if (!a.hasAttribute('target')) a.setAttribute('target', '_blank');
          if (!a.hasAttribute('rel')) a.setAttribute('rel', 'noopener noreferrer');
        }
      } catch (err) {}
    }
  }

  /* --- Live clock (Central Time) ------------------------------------- */

  function startClock() {
    var els = document.getElementsByClassName('clock');
    if (!els.length) return;

    var fmt;
    try {
      fmt = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Chicago',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (e) { return; }

    function render() {
      var label = (fmt.format(new Date()) + ' ct').toLowerCase();
      for (var i = 0; i < els.length; i++) {
        els[i].textContent = label;
      }
    }

    /* tick on the second boundary; pause while the tab is hidden */
    var timer;
    function tick() {
      render();
      timer = setTimeout(tick, 1000 - (Date.now() % 1000));
    }
    document.addEventListener('visibilitychange', function () {
      clearTimeout(timer); /* idempotent restart — never stack a second chain */
      if (!document.hidden) tick();
    });
    if (!document.hidden) tick();
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    syncToggles(current());
    decorateLinks();
    startClock();
  });
})();
