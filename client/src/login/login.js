import AJAX from '../ajax/AJAX.js';
import ajax_url from '../config.js';

function login(){
  var container=document.getElementsByClassName('container')[0];
  container.innerHTML=`<div class="login-form"><form role="form">
  <div class="form-group"><label >用户名</label><input class="form-control" id="userName" placeholder="请输入用户名"><span class="user_warn"></span></div>
  <div class="form-group"><label>密码</label><input type="password" class="form-control" id="passWord" placeholder="请输入密码"><span class="passWord_warn"></span></div>
  <div class="form-group"><button id="login_btn" class="btn btn-primary">登录</button></div>
  </form></div>`;

  var login_btn=document.getElementById('login_btn');
  login_btn.onclick=function(e){
  //阻止默认浏览器动作
    if (e && e.preventDefault) {
            e.preventDefault();//阻止默认浏览器动作(W3C)
    }else {
            window.event.returnValue = false;  //IE中阻止函数器默认动作的方式
          }

    var userName=document.getElementById('userName').value;
    var passWord=document.getElementById('passWord').value;
    console.log(userName);
    if(userName===""){//用户名为空
      document.getElementsByClassName('user_warn')[0].innerHTML='*用户名不能为空';
      setTimeout(function(){document.getElementsByClassName('user_warn')[0].innerHTML='';},1000);
    }

    if(passWord===""){//密码为空
      document.getElementsByClassName('passWord_warn')[0].innerHTML='*密码不能为空';
      setTimeout(function(){document.getElementsByClassName('passWord_warn')[0].innerHTML='';},1000);

    }else{//输入没问题，向服务器发送 用户名、密码
      var data={
        'username':userName,
        'password':passWord
      };
      var ajax=new AJAX({
        method:"POST",
        url:ajax_url+"/login",
        callback:function(res){
          var response=JSON.parse(res);
          if(response.right==="no username"){//用户不存在
            document.getElementsByClassName('user_warn')[0].innerHTML='*用户不存在，请先注册';
            setTimeout(function(){document.getElementsByClassName('user_warn')[0].innerHTML='';},1000);
          }else if(response.right==="password wrong"){//密码错误
            document.getElementsByClassName('passWord_warn')[0].innerHTML='*密码错误，请重新输入';
            setTimeout(function(){document.getElementsByClassName('passWord_warn')[0].innerHTML='';},1000);
          }else{//成功登录
            localStorage.username=userName;
            localStorage.token=response.token;
            localStorage.sign_in=true;
            location.hash="#/";
         }
        },
        data:data
      });
      ajax.send();//发送ajax请求
    }

  }
}
export default login;
