var container=document.getElementsByClassName('container')[0];
var top=container.offsetTop;
var start;
var end;
var threshold=40;
function touch_start(e){
  start=e.touches[0].pageY;
  end=start;
  if(location.hash===''&&document.body.scrollTop===0){
    container.addEventListener('touchmove',touch_move);
  }else{
      container.removeEventListener('touchstart',touch_start);
      container.removeEventListener('touchend',touch_end);
  }
}
function touch_move(e){
    end=e.touches[0].pageY;
    if(end-start>0){
      e.preventDefault();
    }
    var down=(end-start<50)?end-start:50;
    container.style.marginTop=top+down+'px';
}
function touch_end(e){
  if(end-start>threshold){
    location.reload();
  }
  container.style.marginTop=top+'px';
  container.removeEventListener('touchmove',touch_move);
}
function refresh(){
  container.addEventListener('touchstart',touch_start);
  container.addEventListener('touchend',touch_end);
}
export default refresh;
