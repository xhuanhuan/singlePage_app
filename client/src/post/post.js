import AJAX from '../ajax/AJAX.js';
import ajax_url from '../config.js';

function post(){
    document.getElementById('use_name').innerHTML=localStorage.username||'';
  //menu
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
  //post
  var container=document.getElementsByClassName('container')[0];
  if(localStorage.sign_in==="false"){
      container.innerHTML=`<span class="logout">您还未登录，正在跳转登录页面</span>`;
      setTimeout(function(){location.hash="/login";},2000);
  }else{
  //post页面
  container.innerHTML=`<div class="login-form">
  <form role="form">
  <div id="post_control" class="form-group">
  <button id="post_btn" class="btn btn-primary">发布</button>
  <span id="figure_btn" class="glyphicon glyphicon-camera"></span>
  <input id="figure_btn_hide" multiple="multiple" type="file" name="pic" accept="image/*">
  </div><span class="success_note"></span>
  <div class="form-group"><label >title</label><input id="title" class="form-control" placeholder="起个名字吧~"><span class="title_warn"></span></div>
  <div class="form-group"><label>content</label><textarea  rows="5" id="content" class="form-control" placeholder="说点什么呢..."></textarea><span class="content_warn"></span></div>
  </form>
  <div class="fig_container">
  </div>
  </div>`;
  var post_btn=document.getElementById('post_btn');
  var i;
  var html='';
  var figure_btn_hide=document.getElementById("figure_btn_hide");
  var fig_container=document.getElementsByClassName("fig_container")[0];
  var fig_info=[];

  post_btn.onclick=function(e){
    //阻止默认浏览器动作
    if (e && e.preventDefault) {
            e.preventDefault();//阻止默认浏览器动作(W3C)
    }else {
            window.event.returnValue = false;  //IE中阻止函数器默认动作的方式
    }
    var title=document.getElementById('title').value;
    var content=document.getElementById('content').value;

    if(title===""){//console.log(title);
      document.getElementsByClassName('title_warn')[0].innerHTML="*标题不能为空";
      setTimeout(function(){document.getElementsByClassName('title_warn')[0].innerHTML=""},1000);
    }
    if(content===""){
      document.getElementsByClassName('content_warn')[0].innerHTML="*内容不能为空";
      setTimeout(function(){document.getElementsByClassName('content_warn')[0].innerHTML=""},1000);
    }
    // if(fig_info.length===0){
    //   document.getElementsByClassName('success_note')[0].innerHTML="上传图片中,请稍后...";
    //   setTimeout(function(){document.getElementsByClassName('success_note')[0].innerHTML=""},1000);
    // }
    if(title!==""&&content!==""){
      document.getElementsByClassName('success_note')[0].innerHTML=`<p id="loading"><span id="icon_loading" class="glyphicon glyphicon-asterisk"></span>loading...</p>`;
      var data={
        'token':localStorage.token,
        'title':title,
        'info':content,
        'fig_info':fig_info
      };
      var ajax=new AJAX({
        method:"POST",
        url:ajax_url+"/post",
        callback:function(res){
          if(res.indexOf('yes')!==-1){
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
  //image upload
  figure_btn_hide.addEventListener('change',function(e){
    var files=e.target.files;
    var promises=[].map.call(files,function(item){
      return new Promise(function(resolve,reject){
        var type="default";
        var reader=new FileReader();
        reader.readAsDataURL(item);
        type="image";
        reader.onerror=function(){
          reject(reader.error.code);
        }
        reader.onload=function(){
            // var save_info=reader.result.split(',')[1];
            resolve(reader.result);
        }
      });
    });
    Promise.all(promises).then(function(posts){
      posts.forEach(function(item){
        var img=document.createElement('img');
        img.setAttribute('class','post_fig');
        img.src=item;
        img.style.height=fig_container.clientWidth/3+'px';
        fig_container.appendChild(img);
      })
      fig_info=posts;
    }).catch(function(err){
      console.log('err'+err)
    })

  });

 }
}
export default post;
