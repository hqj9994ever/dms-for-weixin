const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//时:分:秒
function myFormatTime(date){
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [hour, minute, second].map(formatNumber).join(':')
}
//年-月-日
function myFormatDate(date){
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}
//json格式转成form格式
function json2Form(json) {  
  var str = [];  for (var p in json) {  
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));  
  }  
  return str.join("&");
 } 
//时间戳转成字符串
function timeStamp2String(time){
  var datetime = new Date();
  datetime.setTime(time);
  var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();
  var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
  var second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
  return hour+":"+minute+":"+second;
}
//地图转换
function qqMapTransBMap(lng, lat) {
  let lngs = lng-0.0004;
  let lats = lat-0.00032;
  return {
    lng: lngs,
    lat: lats
  };
}
//随机
function randNum(min,max) {
  return Math.floor(Math.random()*(max-min))+min;
}
//补0
function fixNum	(number, n){
  return ( new Array(n).join('0') + number ).slice(-n);
}

module.exports = {   
  formatTime: formatTime,
  myFormatTime:myFormatTime,
  myFormatDate:myFormatDate,
  timeStamp2String:timeStamp2String,
  json2Form: json2Form,
  qqMapTransBMap:qqMapTransBMap,
  randNum:randNum,
  fixNum:fixNum
} 

