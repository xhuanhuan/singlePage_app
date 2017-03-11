var url = require('url');
var user = require('./models/user');
var info = require('./models/info');
var mongoose = require('mongoose');
var sha1 = require('sha1');
var jwt = require('./models/jwt_auth');
var moment = require('moment');
moment.locale('zh-cn');
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://xiaobo:xiaoboma@ds163699.mlab.com:63699/dazhequan');
 mongoose.connect('mongodb://localhost:27017/user')
function register(req,res){
  var post='';
  req.on('data', function (chunk) {
    post += chunk;
  });
  req.on('end', function () {
    post = JSON.parse(post);
    user.find({'username':post.username},function(err,doc){
      if(err) {
        console.log(err);
        return false;
      }else{
        if(doc.length>0){
          res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
          var info = {
            right:'no',
            token:''
          }
          res.write(JSON.stringify(info));
          res.end();
        }else{
          var userinfo = new user({
            username:post.username,
            password:sha1(post.password)
          })
          userinfo.save(function(err,data){
            if(err){
              console.log(err);
            }else {
              console.log('ok');
              // console.log(data);
              res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
              var info = {
                right:'yes',
                token:jwt.encode(data.username)
              }
              res.write(JSON.stringify(info));
              res.end();
            }
          })
        }
      }
    })
  });
}
function login(req,res){
  var post='';
  req.on('data', function (chunk) {
    post += chunk;
  });
  req.on('end', function () {
    post = JSON.parse(post);
    console.log(post);
    // console.log(user.find({'username':post.username}));
    user.findOne({'username':post.username},function(err,doc){
      if(err) {
        console.log(err);
        return false;
      }else{
        console.log(doc);
        if(doc === null){
          res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
          var info = {
            right:'no username',
            token:''
          }
          res.write(JSON.stringify(info));
          res.end();
        }else{
          var userinfo = new user({
            username:post.username,
            password:sha1(post.password)
          })
          if(doc.password === userinfo.password)
          {
            res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
            var info = {
              right:'yes',
              token:jwt.encode(userinfo.username)
            }
            res.write(JSON.stringify(info));
            res.end();
          }else{
            res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
            var info = {
            right:'password wrong',
            token:''
          }
            res.write(JSON.stringify(info));
            res.end();
          }
        }
      }
    })
  });

};

function logout(){};

function homepage(req,res){
  var post='';
  req.on('data', function (chunk) {
    post += chunk;
  });
  req.on('end', function () {
    res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
    var news = '';
    info.find({}).sort({_id:-1}).limit(10).exec(function(err,doc){
      if(err){
        console.log(err);
      }else{
        doc.forEach(function(item){
          item.time = moment(item.time).fromNow();
        })
        news = JSON.stringify(doc);
        res.write(news);
        res.end();
      }
    });
  })

};

function moren(){};

function post(req,res){
  var post='';
  req.on('data', function (chunk) {
    post += chunk;
  });
  req.on('end', function () {
    post = JSON.parse(post);
    if(post.token){
      var result = jwt.decode(post.token);
      if(result!='error'){
        var myinfo = new info({
          username:result.iss,
          title:post.title,
          content: post.info,
          like:post.like,
          time: moment().format()
        });
        myinfo.save(function(err,data){
                if(err){
                  console.log(err);
                }else {
                  console.log('ok');
                }
              })
        res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
        res.write('yes');
        res.end();
      }
    }else {
      res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
      res.write('no');
      res.end();
    }
  })
}

module.exports = function(req,res){
  var pathname = url.parse(req.url).pathname;
  console.log(pathname);
  switch(pathname){
    case '/register':register(req,res);break;
    case '/login':login(req,res);break;
    case '/logout':logout(req,res);break;
    case '/':homepage(req,res);break;
    case '/post':post(req,res);break;
    default: moren();break;
  }
}
