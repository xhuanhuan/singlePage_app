function logout(){
document.getElementsByClassName('container')[0].innerHTML=`
<span class="logout">正在登出,2s返回主界面</span>
`;

document.getElementById('menu_ul').innerHTML=`
<li class="menu_li"><a href="#/register">注册</a></li>
<li class="menu_li"><a href="#/login">登录</a></li>
<li class="menu_li"><a href="#/post">发布</a></li>`;
localStorage.username="";
localStorage.token="";
localStorage.sign_in=false;

// alert("您已成功登出！");
setTimeout(function(){ location.hash="#";},3000);
}
export default logout;
