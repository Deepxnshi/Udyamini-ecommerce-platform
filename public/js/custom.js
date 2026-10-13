(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var hamburger = document.querySelector('.hamburger-menu');
    var navigation = document.querySelector('.site-navigation');

    if (!hamburger || !navigation) {
      return;
    }

    hamburger.addEventListener('click', function () {
      var isOpen = navigation.classList.toggle('show');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    navigation.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navigation.classList.remove('show');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  });
})();
