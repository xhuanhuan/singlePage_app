import style from './css/style.scss';
import style1 from './css/style1.css';
import route from './router/route.js';
import logout from './logout/logout.js';
import AJAX from './ajax/AJAX.js';
import ajax_url from './config.js';

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

var container=document.getElementsByClassName('container')[0];
var timer;
var old={};
function like(id){
    var data1={
      '_id':id,
      'username':localStorage.username
    };
    var aj=new AJAX({
    method:"POST",
    url:ajax_url+"/like",
    callback:function(res){console.log(res);},
    data:data1
  });
  aj.send();
}

function Modal(target){
  var m=document.getElementsByClassName('modal_box')[0];
  // console.log('m'+m)
  if(m){
    document.body.removeChild(m);
    document.body.removeChild(document.getElementsByClassName('modal_img')[0]);
  }else{
    var modal_box=document.createElement('div');
    modal_box.setAttribute('class','modal_box');
    var img=document.createElement('img');
    img.setAttribute('class','modal_img');
    img.src=target;
    document.body.appendChild(modal_box);
    document.body.appendChild(img);
  }
}
document.body.onclick=function(e){
  //like
  if(e.target.className === 'glyphicon glyphicon-thumbs-up like'&& e.target.dataset.index){
    if(localStorage.username===""){
      document.getElementsByClassName('container')[0].innerHTML=`<div>您还没有登录,即将跳转到登录页面</div>`;
      setTimeout(function(){location.hash="/login"},2000);
    }else{
    //产生old,改变颜色和数字
    old[e.target.dataset.index]=!old[e.target.dataset.index];
    e.target.style.color=(e.target.style.color==="red")?"gray":"red";
    e.target.innerHTML=e.target.style.color==="red"?parseInt(e.target.innerHTML)+1:parseInt(e.target.innerHTML)-1;
    //定时发送ajax请求
    clearTimeout(timer);
    timer=setTimeout((function(e){
    return function(){
      for(var key in old){
        if(old[key]){
          like(key);
        }
      }
      old={};
    };
    })(e),2000);
   }
  }

  //comment
  if(e.target.className==="glyphicon glyphicon-comment"&&e.target.dataset.index){
    if(localStorage.username===""){
      document.getElementsByClassName('container')[0].innerHTML=`<div>您还没有登录,即将跳转到登录页面</div>`;
      setTimeout(function(){location.hash="/login"},2000);
    }else{
      var index=e.target.dataset.index;
      var target=document.querySelectorAll('.comment_block[data-index="'+index+'"]')[0];
      target.style.display=(target.style.display==="flex")?"none":"flex";
    }
  }
  if(e.target.className==="btn btn-warning comment_btn"&&e.target.dataset.index){
    var index=e.target.dataset.index;
    var target=document.querySelectorAll('.comment_input[data-index="'+index+'"]')[0];
    var value=target.value;
    var placeholder=target.placeholder;
    var comment=placeholder.indexOf('回复')===-1?value:placeholder+value ;
    if(comment===""){
      var warn=document.querySelectorAll('.comment_warn[data-index="'+index+'"]')[0];
      warn.innerHTML="*评论不能为空";
      setTimeout(function(){warn.innerHTML="";},1000);
    }else{
      var _comment;
      if(comment.indexOf('回复')===-1){
        _comment='<span><span class="person">'+localStorage.username+'</span>:'+comment+'</span>';
        comment=localStorage.username+':'+comment;
      }else{
        var t=comment.split(':');
        var c=t.shift().split('回复')[1];
        _comment='<span><span class="person">'+localStorage.username+'</span>回复<span class="person">'+c+'</span>:'+t.join(':')+'</span>';
      }
      var pb=document.createElement('div');
      pb.setAttribute('class','comment_one');
      pb.innerHTML=_comment;
      var comment_block=document.querySelectorAll('.comment_block[data-index="'+index+'"]')[0];
      comment_block.appendChild(pb);
      target.value='';
      target.placeholder='评论';
      var dt={
        '_id':e.target.dataset.index,
        'comment':comment
      };
      var ajax=new AJAX({
        method:"POST",
        url:ajax_url+"/comments",
        callback:function(res){},
        data:dt
      });
      ajax.send();
    }
  }

  //answer
  if(e.target.className==="comment_one"&&e.target.dataset.index){
    var index=e.target.dataset.index;
    var asw_target=e.target.innerHTML.split(':')[0];
    if(asw_target.indexOf('回复')!==-1){
      asw_target=asw_target.split('<span><span class="person">')[1].split('</span>')[0];
    }else{
      asw_target=asw_target.split('<span><span class="person">')[1].split('</span>')[0];
    }
    if(localStorage.username!==asw_target){
      var str=localStorage.username+'回复'+asw_target+':';
      var target=document.querySelectorAll('.comment_input[data-index="'+index+'"]')[0];
      target.placeholder=str;
      target.focus();
    }
  }

  if(e.target.nodeName==="IMG"){
    Modal(e.target.src);
  }
}
