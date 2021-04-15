(function () {
  p;
  q;

  p = 0;

  window.p; // undefined
  window.q; // undefined

  var p;
  var q = 4;

  p = 5;

  window.p = 6;
  window.q = 7;

  p; // 5
  q; // 4
})();
