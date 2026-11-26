// Language behaviour: the start page follows the visitor's saved choice, otherwise the
// browser language (German browsers stay on /, all others go to /en/).
(function () {
  var key = 'dwm-lang';
  var supported = ['de', 'en'];

  function read() {
    try {
      var stored = localStorage.getItem(key);
      return supported.indexOf(stored) >= 0 ? stored : null;
    } catch {
      return null;
    }
  }

  function store(lang) {
    try {
      localStorage.setItem(key, lang);
    } catch {
      // Ignore storage failures (private mode / disabled storage).
    }
  }

  var asked = new URLSearchParams(location.search).get('lang');
  if (supported.indexOf(asked) < 0) asked = null;
  if (asked) store(asked);

  // Only the start page redirects: /en/ is an explicit choice. Crawlers keep the German page.
  var isStart = location.pathname === '/' || location.pathname === '/index.html';
  var isCrawler = /bot|crawl|spider|slurp|facebookexternalhit/i.test(navigator.userAgent);
  if (isStart && !isCrawler) {
    var browser = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
    var wanted = asked || read() || (browser.toLowerCase().indexOf('de') === 0 ? 'de' : 'en');
    if (wanted === 'en') {
      location.replace('/en/' + location.search + location.hash);
      return;
    }
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[data-set-lang]');
    if (link) store(link.getAttribute('data-set-lang'));
  });
})();
