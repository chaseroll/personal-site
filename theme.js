/* chaseroll.com — tiny enhancements
   Loaded synchronously in <head> so the initial theme applies before paint
   (no flash of light content on dark mode / vice versa). */

(function () {
  /* --- Theme --------------------------------------------------------- */

  var KEY = 'chaseroll-theme';

  function getStored() {
    try {
      var v = localStorage.getItem(KEY);
      if (v === 'dark' || v === 'light') return v;
      /* Migrate older un-namespaced key if present */
      var old = localStorage.getItem('theme');
      if (old === 'dark' || old === 'light') {
        localStorage.setItem(KEY, old);
        localStorage.removeItem('theme');
        return old;
      }
    } catch (e) {}
    return null;
  }
  function saveStored(t) {
    try { localStorage.setItem(KEY, t); } catch (e) {}
  }

  var mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function sysDark() { return mql ? mql.matches : false; }

  function apply(t) {
    if (t === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  function current() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  /* Apply initial theme synchronously — before first paint */
  apply(getStored() || (sysDark() ? 'dark' : 'light'));

  /* Click the toggle anywhere on the page */
  document.addEventListener('click', function (e) {
    var t = e.target;
    var btn = t && t.closest ? t.closest('.theme-toggle') : null;
    if (!btn) return;
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

    render();
    setInterval(render, 1000);
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    decorateLinks();
    startClock();
  });
})();
