import style from './css/style.scss';
import route from './router/route.js';
import logout from './logout/logout.js';

document.getElementById('menu_btn').onclick=function(){
  var menu_ul=document.getElementById('menu_ul');
  menu_ul.style.visibility=(menu_ul.style.visibility==="visible")?'hidden':'visible';
};
document.getElementById('menu_ul').onclick=function(e){
  if(e.target.id==='logout'){
    logout();
  }
  this.style.visibility='hidden';
};
