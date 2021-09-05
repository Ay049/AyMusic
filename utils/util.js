// 日期
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const ymd = `${[year, month, day].map(formatNumber).join('-')}`
  const hms = `${[hour, minute, second].map(formatNumber).join(':')}`
  return {
    ymd,
    hms
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
// 时间转换
const time = date => {
  const h = parseInt((date % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = parseInt((date % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((date % (1000 * 60)) / 1000)
  const hms = `${[h,m,s].map(formatNumber).join(':')}`
  const ms = `${[m,s].map(formatNumber).join(':')}`
  return {
    hms,
    ms
  }
}
/* 函数节流*/
function throttle(fn, interval) {
  var enterTime = 0; //触发的时间
  var gapTime = interval || 300; //间隔时间，如果interval不	传，则默认300ms
  return function() {
    var context = this;
    var backTime = new Date(); //第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime; //赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}

/*函数防抖*/
function debounce(fn, interval) {
  // console.log(fn, interval);
  var timer;
  var gapTime = interval || 1000; //间隔时间，如果interval传，则默认1000ms
  return function() {
    // console.log(fn, interval,2);
    clearTimeout(timer);
    var context = this;
    var args = arguments; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function() {
      fn.call(context, args);
    }, gapTime);
  };
}

module.exports = {
  formatTime,
  time,
  throttle,
  debounce
}