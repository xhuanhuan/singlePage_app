import AJAX from '../ajax/AJAX.js';
function post(){
  var container=document.getElementsByClassName('container')[0];
  if(localStorage.sign_in==="false"){
      container.innerHTML=`<span class="logout">您还未登录，正在跳转登录页面</span>`;
      setTimeout(function(){location.hash="/login";},2000);
  }else{
  container.innerHTML=`<div class="login-form">
  <form role="form">
  <div class="form-group"><label >title</label><input id="title" class="form-control" placeholder="请输入标题"><span class="title_warn"></span></div>
  <div class="form-group"><label>content</label><textarea  rows="5" id="content" class="form-control" placeholder="请输入内容"></textarea><span class="content_warn"></span></div>
  <div class="form-group"><button id="post_btn" class="btn btn-primary">发布</button><span class="success_note"></span></div>
  </form>
  </div>`;

  var post_btn=document.getElementById('post_btn');
  post_btn.onclick=function(e){
    //阻止默认浏览器动作
    if (e && e.preventDefault) {
            e.preventDefault();//阻止默认浏览器动作(W3C)
    }else {
            window.event.returnValue = false;  //IE中阻止函数器默认动作的方式
    }

    var title=document.getElementById('title').value;
    var content=document.getElementById('content').value;

    if(title===""){
      document.getElementsByClassName('title_warn').innerHTML="*标题不能为空";
      setTimeout(function(){document.getElementsByClassName('title_warn').innerHTML=""},1000);
    }
    if(content===""){
      document.getElementsByClassName('content_warn').innerHTML="*内容不能为空";
      setTimeout(function(){document.getElementsByClassName('content_warn').innerHTML=""},1000);
    }else{
      var data={
        'token':localStorage.token,
        'title':title,
        'info':content,
        'like':0
      };
      var ajax=new AJAX({
        method:"POST",
        url:"http://localhost:8082/post",
        callback:function(res){
          if(res==="yes"){
            console.log(1);
            document.getElementsByClassName('success_note')[0].innerHTML="发布成功！";
            setTimeout(function(){document.getElementsByClassName('success_note').innerHTML="";location.hash="#";},1000);
          }else{
            document.getElementsByClassName('success_note')[0].innerHTML="发布失败，请检查登录状态！";
            setTimeout(function(){document.getElementsByClassName('success_note').innerHTML="";location.hash="#";},1000);
         }
        },
        data:data
      });
      ajax.send();//发送ajax请求

    }
  }
 }
}
export default post;
