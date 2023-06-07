/**
 * 防抖：连续触发的回调，只执行一次
 */

function debance(fn, wait=200) {
  let timer = 0;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      fn.apply(this, args);
    }, wait);
  };
}
//test code 

let boxEl = document.querySelector(".box");
window.addEventListener(
  "mousemove",
  debance((e) => {
    boxEl.style.setProperty("left", e.clientX - boxEl.clientWidth / 2 + "px");
    boxEl.style.setProperty("top", e.clientY - boxEl.clientHeight / 2 + "px");
  }, 300)
);
