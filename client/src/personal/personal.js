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
  if(arr.length===1||arr.length===2){
    str=`<img style="height:100%;" class="myfig_one" src="${ajax_url}/upload/${arr[0]}">`
  }else{
    arr.forEach(function(item,index){
      if(index<4){
            str+=`<img class="myfig_one" src="${ajax_url}/upload/${item}">`
      }
    });
  }
  return str;
}
function box(obj){
   var  box=document.createElement('div');
   box.setAttribute('class','box');
   box.innerHTML=`<span class="time">${obj.time.slice(0,-1)}</span>
   <div class="myfig_container">${figs(obj.figs)}</div>`;
   var block=document.createElement('div');
   block.setAttribute('class','block1');
   block.innerHTML=`<div class="content_block">
   <p><span class="title_block">${obj.title} | </span>${obj.content}</p>
   </div>
   <div class="Interaction">
   <span>${obj.figs.length}张图</span>
   <span>
   <span data-index='${obj._id}' class="glyphicon glyphicon-comment">${obj.comments.length}</span>
   <span data-index='${obj._id}' class="glyphicon glyphicon-thumbs-up like" style="color:${obj.like.indexOf(localStorage.username)===-1?'gray':'red'}">${obj.like.length}</span>
   </span>
   <div data-index='${obj._id}' class="comment_block">
   <div class="input">
   <input data-index='${obj._id}' class="comment_input" placeholder="评论"><button data-index='${obj._id}' class="btn btn-warning comment_btn" >发送</button>
   </div>
   <span data-index='${obj._id}' class="comment_warn"></span>
   ${comments(obj)}
   </div>
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
    container.innerHTML=`<div style="width:100%"><img style="width:100%" src='/img/head.jpg'></div>`;
    var data={'username':localStorage.username};
    var ajax=new AJAX({
        method:"POST",
        url:ajax_url+"/personal",
        callback:function(res){
          var response=JSON.parse(res);
          response.forEach(item=>box(item));

                //
                // var container=document.getElementsByClassName('container')[0];
                // var timer;
                //
                // function like(id){
                //     var data1={
                //       '_id':id,
                //       'username':localStorage.username
                //     };
                //     var aj=new AJAX({
                //     method:"POST",
                //     url:"http://localhost:8082/like",
                //     callback:function(res){console.log(res);},
                //     data:data1
                //   });
                //   aj.send();
                // }
                //
                // var old={};
                // container.onclick=function(e){
                //   //like
                //   if(e.target.className === 'glyphicon glyphicon-thumbs-up like'&& e.target.dataset.index){
                //     if(localStorage.username===""){
                //       document.getElementsByClassName('container')[0].innerHTML=`<div>您还没有登录,即将跳转到登录页面</div>`;
                //       setTimeout(function(){location.hash="/login"},2000);
                //     }else{
                //     //产生old,改变颜色和数字
                //     old[e.target.dataset.index]=!old[e.target.dataset.index];
                //     e.target.style.color=(e.target.style.color==="red")?"gray":"red";
                //     e.target.innerHTML=e.target.style.color==="red"?parseInt(e.target.innerHTML)+1:parseInt(e.target.innerHTML)-1;
                //     //定时发送ajax请求
                //     clearTimeout(timer);
                //     timer=setTimeout((function(e){
                //     return function(){
                //       for(var key in old){
                //         if(old[key]){
                //           like(key);
                //         }
                //       }
                //       old={};
                //     };
                //     })(e),2000);
                //    }
                //   }
                //
                //   //comment
                //   if(e.target.className==="glyphicon glyphicon-comment"&&e.target.dataset.index){
                //     if(localStorage.username===""){
                //       document.getElementsByClassName('container')[0].innerHTML=`<div>您还没有登录,即将跳转到登录页面</div>`;
                //       setTimeout(function(){location.hash="/login"},2000);
                //     }else{
                //       var index=e.target.dataset.index;
                //       var target=document.querySelectorAll('.comment_block[data-index="'+index+'"]')[0];
                //       target.style.display=(target.style.display==="flex")?"none":"flex";
                //     }
                //   }
                //   if(e.target.className==="btn btn-warning comment_btn"&&e.target.dataset.index){
                //     var index=e.target.dataset.index;
                //     var target=document.querySelectorAll('.comment_input[data-index="'+index+'"]')[0];
                //     var value=target.value;
                //     var placeholder=target.placeholder;
                //     var comment=placeholder.indexOf('回复')===-1?value:placeholder+value ;
                //     if(comment===""){
                //       var warn=document.querySelectorAll('.comment_warn[data-index="'+index+'"]')[0];
                //       warn.innerHTML="*评论不能为空";
                //       setTimeout(function(){warn.innerHTML="";},1000);
                //     }else{
                //       var _comment;
                //       if(comment.indexOf('回复')===-1){
                //         _comment='<span><span class="person">'+localStorage.username+'</span>:'+comment+'</span>';
                //         comment=localStorage.username+':'+comment;
                //       }else{
                //         var t=comment.split(':');
                //         var c=t.shift().split('回复')[1];
                //         _comment='<span><span class="person">'+localStorage.username+'</span>回复<span class="person">'+c+'</span>:'+t.join(':')+'</span>';
                //       }
                //       var pb=document.createElement('div');
                //       pb.setAttribute('class','comment_one');
                //       pb.innerHTML=_comment;
                //       var comment_block=document.querySelectorAll('.comment_block[data-index="'+index+'"]')[0];
                //       comment_block.appendChild(pb);
                //       target.value='';
                //       target.placeholder='评论';
                //       var dt={
                //         '_id':e.target.dataset.index,
                //         'comment':comment
                //       };
                //       var ajax=new AJAX({
                //         method:"POST",
                //         url:"http://localhost:8082/comments",
                //         callback:function(res){},
                //         data:dt
                //       });
                //       ajax.send();
                //     }
                //   }
                //
                //   //answer
                //   if(e.target.className==="comment_one"&&e.target.dataset.index){
                //     var index=e.target.dataset.index;
                //     var asw_target=e.target.innerHTML.split(':')[0];
                //     if(asw_target.indexOf('回复')!==-1){console.log(asw_target)
                //       asw_target=asw_target.split('<span><span class="person">')[1].split('</span>')[0];
                //     }else{
                //       asw_target=asw_target.split('<span><span class="person">')[1].split('</span>')[0];
                //     }
                //     if(localStorage.username!==asw_target){
                //       var str=localStorage.username+'回复'+asw_target+':';
                //       var target=document.querySelectorAll('.comment_input[data-index="'+index+'"]')[0];
                //       target.placeholder=str;
                //       target.focus();
                //     }
                //   }
                //
                // }

        },
        data:data
    });
    ajax.send();
  }
}
export default personal;
