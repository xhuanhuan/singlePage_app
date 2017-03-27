import AJAX from '../ajax/AJAX.js';
import ajax_url from '../config.js';
;
function register(){
  var container=document.getElementsByClassName('container')[0];
  container.innerHTML=`<div class="login-form"><form role="form">
  <div class="form-group"><label >用户名</label><input class="form-control" id="userName" placeholder="请输入用户名"><span class="user_warn"></span></div>

  <div class="form-group"><label>密码</label><input type="password" class="form-control" id="passWord" placeholder="请输入密码"></div>
  <div class="form-group"><label>密码</label><input type="password" class="form-control" id="passWord1" placeholder="请再次输入密码">  <span class="passWord_warn"></span></div>
  <div class="form-group"><button id="register_btn" type="submit" class="btn btn-primary">注册</button><span id="success_note"></span></div>
  </form></div>`;

  var register_btn=document.getElementById('register_btn');

  register_btn.onclick=function(e){
    //阻止默认浏览器动作
    if (e && e.preventDefault) {
            e.preventDefault();//阻止默认浏览器动作(W3C)
    }else {
            window.event.returnValue = false;  //IE中阻止函数器默认动作的方式
    }

    var userName=document.getElementById('userName').value;
    var passWord=document.getElementById('passWord').value;
    var passWord1=document.getElementById('passWord1').value;

    if(userName===""){//用户名为空
      document.getElementsByClassName('user_warn')[0].innerHTML='*用户名不能为空';
      setTimeout(function(){document.getElementsByClassName('user_warn')[0].innerHTML='';},1000);
    }

    if(passWord===""||passWord1===""){//密码为空
      document.getElementsByClassName('passWord_warn')[0].innerHTML='*密码不能为空';
      setTimeout(function(){document.getElementsByClassName('passWord_warn')[0].innerHTML='';},1000);

    }else if(passWord!==passWord1){//两次密码不一致
      document.getElementsByClassName('passWord_warn')[0].innerHTML='*两次密码输入不一致';
      setTimeout(function(){document.getElementsByClassName('passWord_warn')[0].innerHTML='';},1000);

    }else{//输入没问题，向服务器发送 用户名、密码
      document.getElementById('success_note').innerHTML=`<p id="loading"><span id="icon_loading" class="glyphicon glyphicon-asterisk"></span>注册中...</p>`;
      var data={
        'username':userName,
        'password':passWord
      };
      var ajax=new AJAX({
        method:"POST",
        url:ajax_url+"/register",
        callback:function(res){
          var response=JSON.parse(res);
          if(response.right==="no"){//用户名已存在
            document.getElementsByClassName('user_warn')[0].innerHTML='*用户名已存在';
            setTimeout(function(){document.getElementsByClassName('user_warn')[0].innerHTML='';},1000);
          }else{//用户存在，设置登录状态、路由回主页
            document.getElementById('success_note').innerHTML='注册成功！'
            localStorage.token=response.token;
            localStorage.sign_in=true;
            localStorage.username=userName;
            location.hash="#";
         }
        },
        data:data
      });
      ajax.send();//发送ajax请求
    }

  }

}
export default register;
