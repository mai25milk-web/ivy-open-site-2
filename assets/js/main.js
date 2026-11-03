(function () {
  'use strict';

  // ハンバーガーメニュー
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('gnav');

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  }

  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      burger.focus();
    }
  });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !e.target.closest('.hdr')) setMenu(false);
  });

  // 3つの特徴（スマホは横スワイプ）のドット
  var list = document.getElementById('point-list');
  var dots = Array.prototype.slice.call(document.querySelectorAll('#point-dots button'));
  var items = list.querySelectorAll('.point__item');

  function markDot() {
    var left = list.scrollLeft;
    var at = 0, best = Infinity;
    items.forEach(function (it, i) {
      var d = Math.abs(it.offsetLeft - list.offsetLeft - parseInt(getComputedStyle(list).paddingLeft, 10) - left);
      if (d < best) { best = d; at = i; }
    });
    if (left + list.clientWidth >= list.scrollWidth - 2) at = items.length - 1;
    dots.forEach(function (b, i) {
      b.classList.toggle('is-on', i === at);
      if (i === at) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
  }

  list.addEventListener('scroll', markDot, { passive: true });
  dots.forEach(function (b, i) {
    b.addEventListener('click', function () {
      var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      list.scrollTo({ left: items[i].offsetLeft - items[0].offsetLeft, behavior: still ? 'auto' : 'smooth' });
    });
  });
})();

// ヒーローの幕：見終わるか、操作したら片づける。2回目以降は head のスクリプトが出さない
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('splash-on')) return;
  var splash = document.querySelector('.splash');
  var EVENTS = ['pointerdown', 'wheel', 'touchmove', 'keydown'];
  var timer;

  function remember() {
    try { sessionStorage.setItem('ivySplash', '1'); } catch (e) {}
  }
  function stopListening() {
    EVENTS.forEach(function (ev) { window.removeEventListener(ev, skip); });
    clearTimeout(timer);
  }
  function skip() {
    stopListening();
    remember();
    root.classList.add('skip');
  }
  EVENTS.forEach(function (ev) { window.addEventListener(ev, skip, { passive: true }); });
  timer = setTimeout(function () {
    stopListening();
    remember();
    if (splash) splash.style.display = 'none';
  }, 2000);
})();

// Instagram の埋め込みは読み込み後に高さが変わるので、スクロール位置を計算し直す
(function () {
  var box = document.querySelector('.ig-embeds'), t;
  if (!box || !window.ScrollTrigger || !window.ResizeObserver) return;
  new ResizeObserver(function () { clearTimeout(t); t = setTimeout(function () { ScrollTrigger.refresh(); }, 200); }).observe(box);
})();

// スマホ下端の固定ボタンは、ヒーローの「体験を申し込む」が見えている間は隠す（同じボタンを2つ並べない）
(function () {
  var cta = document.querySelector('.hero__cta');
  var fix = document.querySelector('.fixcta');
  if (!cta || !fix || !window.IntersectionObserver) return;
  new IntersectionObserver(function (es) {
    fix.classList.toggle('is-hidden', es[0].isIntersecting);
  }).observe(cta);
})();
