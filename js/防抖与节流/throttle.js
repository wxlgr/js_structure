/**
 * 节流，持续触发的回调，一定频率执行一次
 */
function throttle(fn, frequency = 500) {
  let timer = 0;
  return function (...args) {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer=0
    }, frequency);
  };
}

window.addEventListener(
  "resize",
  throttle((e) => {
    let size = window.innerWidth/750*16+'px'
    console.log(size)
    
    document.documentElement.style.fontSize = size;
  })
);
