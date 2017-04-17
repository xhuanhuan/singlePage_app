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
  var len=arr.length;
  if(len===0){
    return '';
  }else if(len===1){
    str=`<div class="fig_container1"><img class="post_fig" src="${arr[0]}"></div>`
  }
  else if(len===2){
    str=`<div class="fig_container1">`;
    arr.forEach(function(item){
      str=str+`<img  class="post_fig" src="${item}">`
    });
    str+=`</div>`;
  }
  else{
    str=`<div class="fig_container1">`;
    arr.forEach(function(item,index){
      str=str+`<img class="post_fig" src="${item}">`
      if((index+1)%3===0){
        str=str+`</div><div class="fig_container1">`
      }
    });
    str=str+`</div>`;
  }

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
    <div class="fig_container">
    ${figs(obj.figs)}
    </div>
    <div class="Interaction">
    <span class="glyphicon glyphicon-share"></span>
    <span data-index='${obj._id}' class="glyphicon glyphicon-comment">${obj.comments.length}</span>
    <span data-index='${obj._id}' class="glyphicon glyphicon-thumbs-up like" style="color:${obj.like.indexOf(localStorage.username)===-1?'gray':'red'}">${obj.like.length}</span>
    <div data-index='${obj._id}' class="comment_block">
    <div class="input">
    <input data-index='${obj._id}' class="comment_input" placeholder="评论"><button data-index='${obj._id}' class="btn btn-warning comment_btn" >发送</button>
    </div>
    <span data-index='${obj._id}' class="comment_warn"></span>
    ${comments(obj)}
    </div>
    </div>`;
    document.getElementsByClassName('container')[0].appendChild(block);
  }
function postid(id){
  document.getElementById('use_name').innerHTML=localStorage.username||'';
  var data={
    id:id
  };
  document.getElementsByClassName('container')[0].innerHTML=`<p id="loading"><span id="icon_loading" class="glyphicon glyphicon-asterisk"></span>loading...</p>`;
  var ajax=new AJAX({
    method:"POST",
    url:ajax_url+"/postId",
    callback:function(res){
      var loading=document.getElementById('loading');
      document.getElementsByClassName('container')[0].removeChild(loading);
      var response=JSON.parse(res);
      block(response);
      var figc1=document.getElementsByClassName('fig_container1')[0];
      if(figc1){
        figc1.style.height=figc1.clientWidth/3+'px';
      }
    },
    data:data
  });
  ajax.send();//发送ajax请求

}
export default postid;
