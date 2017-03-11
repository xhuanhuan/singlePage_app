import AJAX from '../ajax/AJAX.js';

function block(obj){
    var block=document.createElement('div');
    block.setAttribute('class','block');
    block.innerHTML=`<div class="content_block">
    <p style="color:rgb(234,166,94)">
    <span class="glyphicon glyphicon-user"></span>${obj.username}<span style="float:right;color:gray">${obj.time}</span></p>
    <p><span class="title_block">#${obj.title}#</span>${obj.content}</p>
    </div>
    <div class="Interaction">
    <span class="glyphicon glyphicon-share-alt"></span>
    <span class="glyphicon glyphicon-comment"></span>
    <span class="glyphicon glyphicon-thumbs-up"><span class="like"> ${obj.like}</span></span>
    </div>`;
    document.getElementsByClassName('container')[0].appendChild(block);
  }

function homePage(){
  //user_head
  document.getElementById('use_name').innerHTML=localStorage.username||'';
  //menu
  if(localStorage.sign_in==="true"){
    document.getElementById('menu_ul').innerHTML=`
    <li class="menu_li"><a href="/">主页</a></li>
    <li class="menu_li"><a id="logout" href="#/logout">登出</a></li>
    <li class="menu_li"><a href="#/post">发布</a></li>`
  }else{
    document.getElementById('menu_ul').innerHTML=`
    <li class="menu_li"><a href="/">主页</a></li>
    <li class="menu_li"><a href="#/register">注册</a></li>
    <li class="menu_li"><a href="#/login">登录</a></li>`
  }

//主页内容
  document.getElementsByClassName('container')[0].innerHTML="";
  var ajax=new AJAX({
    method:"GET",
    url:"http://localhost:8082/",
    callback:function(res){
      var response=JSON.parse(res);
      response.forEach(item=>block(item));
    },
    data:'#'
  });
  ajax.send();//发送ajax请求


document.getElementsByClassName('Interaction').onclick=function(e){
  if(e.target.class="like"){
    
  }
}
}
export default homePage;
