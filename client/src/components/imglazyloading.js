var imgnodes=[];
var visualHeight=getWindowHeight()+100;
var first=0;
var res=[];
function imgLazyLoading(response){
  res=response;
  imgnodes=document.getElementsByTagName('img');
  if(imgnodes.length>0){
    imgnodes=[].slice.call(imgnodes);

    if(first===0){
    scroll();
    window.addEventListener('scroll',throttle(scroll,300));
    first++;
  }
  }
}
function throttle(fn, threshhold, scope){
  threshhold || (threshhold = 250);
  var deferTimer;
  return function () {
    var context = scope || this;
    var args = arguments;
    clearTimeout(deferTimer);
    deferTimer = setTimeout(function () {
      fn.apply(context, args);
    }, threshhold);
  };
}
function scroll(){
  imgnodes=[].slice.call(document.getElementsByTagName('img'));
  imgnodes.forEach(function(img,index){
    var pos=img.getBoundingClientRect();
    if(pos.top>-50&&pos.bottom<visualHeight&&img.src==="http://localhost:8080/"){
        img.src=res[index];
    }
  });
}
function getWindowHeight(){
　　var windowHeight = 0;
　　if(document.compatMode == "CSS1Compat"){
　　　　windowHeight = document.documentElement.clientHeight;
　　}else{
　　　　windowHeight = document.body.clientHeight;
　　}
　　return windowHeight;
}
export default imgLazyLoading;
