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
    console.log(location.hash)
    this.routes[this.currentUrl]();
  }
  Router.prototype.init = function(){
    window.addEventListener('load',this.refresh.bind(this),false);
    window.addEventListener('hashchange',this.refresh.bind(this),false);
  }
export default Router;
