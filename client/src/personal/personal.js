import AJAX from '../ajax/AJAX.js';

function box(obj){
   var  box=document.createElement('div');
   box.setAttribute('class','box');
   box.innerHTML=`<span class="time">${obj.time}</span>`;
    var block=document.createElement('div');
    block.setAttribute('class','block');
    block.innerHTML=`<div class="content_block">
    <p><span class="title_block">${obj.title} | </span>${obj.content}</p>
    </div>
    <div class="Interaction">
    <span class="glyphicon glyphicon-share"></span>
    <span class="glyphicon glyphicon-comment"></span>
    <span data-index='${obj._id}' class="glyphicon glyphicon-thumbs-up like" style="color:${obj.like.indexOf(localStorage.username)===-1?'gray':'red'}">${obj.like.length}</span>
    </div>`;
    box.appendChild(block);
    document.getElementsByClassName('container')[0].appendChild(box);
  }
function personal(){
  if(localStorage.sign_in==="true"){
    document.getElementById('menu_ul').innerHTML=`
    <li class="menu_li"><a href="/">首页</a></li>
    <li class="menu_li"><a id="logout" href="#/logout">登出</a></li>
    <li class="menu_li"><a href="#/post">发布</a></li>
    <li class="menu_li"><a href="#/personal">我的</a></li>`

  }else{
    document.getElementById('menu_ul').innerHTML=`
    <li class="menu_li"><a href="/">首页</a></li>
    <li class="menu_li"><a href="#/register">注册</a></li>
    <li class="menu_li"><a href="#/login">登录</a></li>`
  }
  
  var container=document.getElementsByClassName('container')[0];
  container.innerHTML="";
  if(localStorage.sign_in==="false"){
      container.innerHTML=`<span class="logout">您还未登录，正在跳转登录页面</span>`;
      setTimeout(function(){location.hash="/login";},2000);
  }else{
    container.innerHTML=`<div><img style="width:100%" src='/img/head.jpg'></div>`;
    var data={'username':localStorage.username};
    var ajax=new AJAX({
        method:"POST",
        url:"http://localhost:8082/personal",
        callback:function(res){
          var response=JSON.parse(res);
          response.forEach(item=>box(item));
        },
        data:data
    });
    ajax.send();
  }
}
export default personal;
