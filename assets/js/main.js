(function () {
  'use strict';

  // ハンバーガーメニュー
  var hdr = document.querySelector('.hdr');
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('gnav');

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    hdr.classList.toggle('is-open', open);
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

  // ヒーローを過ぎたら、ヘッダーを白い帯で固定。スマホは下端のボタンも出す
  var hero = document.querySelector('.hero');
  var fix = document.querySelector('.fixcta');
  function onScroll() {
    var past = window.scrollY > hero.offsetHeight - 80;
    hdr.classList.toggle('is-fixed', window.scrollY > 0 && past);
    fix.classList.toggle('is-on', past);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ふわっと出る
  var items = document.querySelectorAll('.reveal');
  if (!document.documentElement.classList.contains('motion') || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  items.forEach(function (el) { io.observe(el); });
})();

// Instagramの埋め込みは、その欄に近づいてから読み込む（最初の表示を軽くする）
(function () {
  var sec = document.querySelector('.insta');
  if (!sec) return;
  function load() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.instagram.com/embed.js';
    document.body.appendChild(s);
  }
  if (!('IntersectionObserver' in window)) { load(); return; }
  var io = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) { io.disconnect(); load(); }
  }, { rootMargin: '800px 0px' });
  io.observe(sec);
})();
