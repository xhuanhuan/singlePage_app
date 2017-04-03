import postid from '../postid/postid.js';
  var Router= function(){
  this.currentUrl='';
  this.routes={};
  }
  Router.prototype.route = function(path,callback){
    this.routes[path] = callback || function(){}
  }
  Router.prototype.refresh = function(){
    this.currentUrl = location.hash.slice(1) || '/';
    console.log(this.currentUrl)
    if(this.routes[this.currentUrl]){
      this.routes[this.currentUrl]();
    }else{
       var id=this.currentUrl.match(/^\/personal\/([a-fA-F0-9]{24})$/)[1];
       postid(id);
    }
  }
  Router.prototype.init = function(){
    window.addEventListener('load',this.refresh.bind(this),false);
    window.addEventListener('hashchange',this.refresh.bind(this),false);
  }
export default Router;
