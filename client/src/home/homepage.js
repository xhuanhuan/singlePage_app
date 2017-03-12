import AJAX from '../ajax/AJAX.js';

function comments(comments){
  var str='';
  comments.forEach(function(item){
    // var l=item.split(':');
    // if(l.length>2){
    //   l.splice(0,1);
    //   item=l.join(':');
    // }
    str=str+'<div class="comment_one">'+item+'</div>';
  });
  return str;
}
function block(obj){
    var block=document.createElement('div');
    block.setAttribute('class','block');
    block.innerHTML=`<div class="content_block">
    <p style="color:rgb(234,166,94)">
    <span class="glyphicon glyphicon-user"></span>${obj.username}<span style="float:right;color:gray">${obj.time}</span></p>
    <p><span class="title_block">${obj.title} | </span>${obj.content}</p>
    </div>
    <div class="Interaction">
    <span class="glyphicon glyphicon-share"></span>
    <span class="glyphicon glyphicon-comment"></span>
    <span data-index='${obj._id}' class="glyphicon glyphicon-thumbs-up like" style="color:${obj.like.indexOf(localStorage.username)===-1?'gray':'red'}">${obj.like.length}</span>
    <div class="comment_block">
    <div class="input">
    <input class="comment_input" placeholder="评论"><button data-index='${obj._id}' class="btn btn-warning comment_btn" style="float:right">发送</button>
    </div>
    <span class="comment_warn"></span>
    ${comments(obj.comments)}
    </div>
    </div>`;
    document.getElementsByClassName('container')[0].appendChild(block);
  }

function homePage(){
  //user_head
  document.getElementById('use_name').innerHTML=localStorage.username||'';
  //menu
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

//主页内容
  document.getElementsByClassName('container')[0].innerHTML="";
  var ajax=new AJAX({
    method:"GET",
    url:"http://localhost:8082/",
    callback:function(res){
      var response=JSON.parse(res);
      response.forEach(item=>block(item));

      var container=document.getElementsByClassName('container')[0];
      var timer;

      function like(id){
          var data1={
            '_id':id,
            'username':localStorage.username
          };
          var aj=new AJAX({
          method:"POST",
          url:"http://localhost:8082/like",
          callback:function(res){console.log(res);},
          data:data1
        });
        aj.send();
      }

      var old={};
      container.onclick=function(e){
        //like
        if(e.target.tagName === 'SPAN'&& e.target.dataset.index){
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

        //comment
        if(e.target.className==="glyphicon glyphicon-comment"){
          var target=e.target.parentNode.childNodes[7];
          target.childNodes[1].style.display="block";
          target.style.display=(target.style.display==="flex")?"none":"flex";
        }
        if(e.target.className==="btn btn-warning comment_btn"&&e.target.dataset.index){
          var comment=e.target.parentNode.childNodes[1].value;
          if(comment===""){
            e.target.parentNode.parentNode.childNodes[3].innerHTML="*评论不能为空";
            setTimeout(function(){e.target.parentNode.parentNode.childNodes[3].innerHTML="";},1000);
          }else{
            if(comment.indexOf('回复')===-1){
              comment=localStorage.username+':'+comment;
            }
            var pb=document.createElement('div');
            pb.setAttribute('class','comment_one');
            pb.innerHTML=comment;
            e.target.parentNode.parentNode.appendChild(pb);
            e.target.parentNode.childNodes[1].value='';
            var dt={
              '_id':e.target.dataset.index,
              'comment':comment
            };
            var ajax=new AJAX({
              method:"POST",
              url:"http://localhost:8082/comments",
              callback:function(res){ e.target.parentNode.style.display='none';},
              data:dt
            });
            ajax.send();
          }
        }

        //answer
        if(e.target.className==="comment_one"){
          var asw_target=e.target.innerHTML.split(':')[0];
          if(asw_target.indexOf('回复')!==-1){
            asw_target=asw_target.split('回复')[0];
          }
          if(localStorage.username!==asw_target){
            e.target.parentNode.childNodes[1].style.display='block';
            var str=localStorage.username+'回复'+asw_target+':';
            e.target.parentNode.childNodes[1].childNodes[1].value=str;
          }
        }

      }
    },
    data:'#'
  });
  ajax.send();//发送ajax请求
}
export default homePage;
