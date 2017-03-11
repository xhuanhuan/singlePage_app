function AJAX(obj){
  this.method=obj.method||'';
  this.url=obj.url||'';
  this.callback=obj.callback||function(){};
  this.data=obj.data||{};
 }
AJAX.prototype.send=function(){
  var method = this.method;
  var data = this.data;
  var url = this.url;
  var callback = this.callback;

  var xmlhttp;
	if (window.XMLHttpRequest)
	{
		xmlhttp=new XMLHttpRequest();	//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
	}
	else
	{
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");// IE6, IE5 浏览器执行代码
	}
	xmlhttp.onreadystatechange=function()
	{
    if(xmlhttp.readyState===4){
		if (xmlhttp.status>=200&&xmlhttp.status<300||xmlhttp.status==304)
		{
     callback(xmlhttp.responseText);
   }
 }
	}

  if(method==="GET"){
    // var data_send='?';
    // if(typeof data==='object'){
    //   for(let key in data){
    //     data_send=data_send+key+'='+data[key]+'&';
    //   }
    // data_send=data_send.slice(0,-1);
    // }
    xmlhttp.open(method,url,true);
    xmlhttp.send();
  }else if(method==="POST"){
	xmlhttp.open(method,url,true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send(JSON.stringify(data));
  }else{
    console.log('wrong');
  }
}
export default AJAX;
