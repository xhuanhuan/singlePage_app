import AJAX from '../ajax/AJAX.js';
import ajax_url from '../config.js';

function comments(obj){
  var str='';
  obj.comments.forEach(function(item){
    var l=item.split(':');
    if(l[0].indexOf('回复')!==-1){
      var tp=l.shift().split('回复');
      item=`<span><span class='person'>${tp[0]}</span>回复<span class='person'>${tp[1]}</span>:${l.join(':')}</span>`;
    }else{
        item=`<span><span class='person'>${l.shift()}</span>:${l.join(':')}</span>`;
    }
      str=str+`<div data-index="${obj._id}" class="comment_one">`+item+`</div>`;
  });
  return str;
}
function figs(arr){
  var str='';
  if(arr.length>0){
  str=`<img style="height:100%;" class="myfig_one" src="${arr[0]}">`
  }
  return str;
}
function box(obj){
   var  box=document.createElement('div');
   box.setAttribute('class','box');
   box.innerHTML=`<div class="time">${obj.time.slice(0,-1)}</div>
   <div class="myfig_container">${figs(obj.figs)}</div>`;
   var block=document.createElement('div');
   block.setAttribute('class','block1');
    block.setAttribute('data-index',`${obj._id}`);
   block.innerHTML=`<div class="content_block">
   <p><a href='#/personal/${obj._id}' class="title_block">${obj.title} | </a>${obj.content}</p>
   </div>
   <div class="Interaction">
   <span>${obj.figs.length}张图</span>
   <span>
   <span data-index='${obj._id}' class="glyphicon glyphicon-comment">${obj.comments.length}</span>
   <span data-index='${obj._id}' class="glyphicon glyphicon-thumbs-up like" style="color:${obj.like.indexOf(localStorage.username)===-1?'gray':'red'}">${obj.like.length}</span>
   </span>
   </div>`;
    box.appendChild(block);
    document.getElementsByClassName('container')[0].appendChild(box);
  }
function personal(){
    document.getElementById('use_name').innerHTML=localStorage.username||'';
  if(localStorage.sign_in==="true"){
    document.getElementById('menu_ul').innerHTML=`
    <li class="menu_li"><a href="#">首页</a></li>
    <li class="menu_li"><a id="logout" href="#/logout">登出</a></li>
    <li class="menu_li"><a href="#/post">发布</a></li>
    <li class="menu_li"><a href="#/personal">我的</a></li>`

  }else{
    document.getElementById('menu_ul').innerHTML=`
    <li class="menu_li"><a href="#">首页</a></li>
    <li class="menu_li"><a href="#/register">注册</a></li>
    <li class="menu_li"><a href="#/login">登录</a></li>`
  }

  var container=document.getElementsByClassName('container')[0];
  container.innerHTML='';
  if(localStorage.sign_in==="false"){
      container.innerHTML=`<span class="logout">您还未登录，正在跳转登录页面</span>`;
      setTimeout(function(){location.hash="/login";},2000);
  }else{
    container.innerHTML=`<div style="width:100%">
    <img style="width:100%" src='https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3288731583,2957029988&fm=23&gp=0.jpg'>
    </div>
    <p id="loading"><span id="icon_loading" class="glyphicon glyphicon-asterisk"></span>loading...</p>`;
    var data={'username':localStorage.username};
    var ajax=new AJAX({
        method:"POST",
        url:ajax_url+"/personal",
        callback:function(res){
          var loading=document.getElementById('loading');
          document.getElementsByClassName('container')[0].removeChild(loading);
          var response=JSON.parse(res);
          response.forEach(item=>box(item));
          var box_class=[].slice.call(document.getElementsByClassName('box'));
          box_class.forEach(function(item){item.style.height=item.clientWidth*0.3+'px';});
          var myfig_container=[].slice.call(document.getElementsByClassName('myfig_container'));
          myfig_container.forEach(function(item){if(item.innerHTML===''){item.style.width=0;}});
        },
        data:data
    });
    ajax.send();
  }
}
export default personal;
