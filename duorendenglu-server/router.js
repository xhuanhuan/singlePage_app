var url = require('url');
var user = require('./models/user');
var info = require('./models/info');
var mongoose = require('mongoose');
var sha1 = require('sha1');
var jwt = require('./models/jwt_auth');
var moment = require('moment');
var uuid = require('node-uuid');
var fs = require("fs") ;
var http=require('http');
var fs=require('fs');
var path=require('path');
var errjpg=require('./errjpg');

//添加MIME类型
var MIME_TYPE = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
};

moment.locale('zh-cn');
mongoose.Promise = global.Promise;
 mongoose.connect('mongodb://chowhound-diary:123456@ds131890.mlab.com:31890/chowhound-diary');
// mongoose.connect('mongodb://localhost:27017/user')
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
    user.findOne({'username':post.username},function(err,doc){
      if(err) {
        console.log(err);
        return false;
      }else{
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
    info.find({}).sort({_id:-1}).exec(function(err,doc){
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
          like:[],
          time: moment().format()
        });
        if(post.fig_info.length===0){
          myinfo.save(function(err,data){
                  if(err){
                    console.log(err);
                  }else {
                    console.log('ok');
                  }
                });
                res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
                res.write('yes.no fig');
                res.end();
        }else{
                 var promises=post.fig_info.map(function(item){
                  return new Promise(function(resolve,reject){
                    item=item.split(',')[1];
                    var name=uuid.v1()+'.jpg';
                    fs.writeFile(`./upload/${name}`,new Buffer(item,'base64'),function(err){
                      if(err){
                        reject(err);
                      }else{
                      resolve(name);
                      }
                    });
                  });
                });
                Promise.all(promises).then(function(posts){
                  myinfo.figs=posts;
                  myinfo.save(function(err,data){
                          if(err){
                            console.log(err);
                          }else {
                            console.log('ok');
                          }
                        })
                  res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
                  res.write('yes,get fig');
                  res.end();
               }).catch(function(err){console.log(err)})
              }

      }else {
        res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
        res.write('no');
        res.end();
      }
   }
 });
}
function like(req,res){
  var post='';
  req.on('data', function (chunk) {
    post += chunk;
  });
  req.on('end', function () {
    post = JSON.parse(post);
    info.findOne({_id:post._id},function(err,doc){
      if(err){
        console.log(err);
      }else{
        var index=doc.like.indexOf(post.username);
        res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
        if(index===-1){
          doc.like.push(post.username);
          doc.save();
          res.write('like');
        }else{
            doc.like.splice(index,1);
            doc.save();
            res.write("not-like");
        }
       res.end();
      }
    });
  });
}

function personal(req,res){
  var post='';
  req.on('data', function (chunk) {
    post += chunk;
  });
  req.on('end', function () {
    post=JSON.parse(post)
    info.find({username:post.username},function(err,doc){
      if(err){
        console.log(err);
      }else{
        res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
        doc.forEach(function(item){
          item.time = moment(item.time).format("MMM Do");
        });
        res.write(JSON.stringify(doc));
        res.end();
      }
    }).sort({_id:-1});
  });
}
function comments(req,res){
  var post='';
  req.on('data', function (chunk) {
    post += chunk;
  });
  req.on('end', function () {
    post=JSON.parse(post)
    info.findOne({_id:post._id},function(err,doc){
      if(err){
        console.log(err);
      }else{
        res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
        doc.comments.push(post.comment);
        doc.save();
        res.write('succeed');
        res.end();
      }
    });
  });
}

function serverStatic(req,res){
  var filePath="./";
  if(/^\/upload/.test(req.url)){
      filePath = "./" + url.parse(req.url).pathname;
  }
  fs.exists(filePath,function(err){
      if(!err){
        res.writeHead(200,{'content-type':contentType});
        res.end(errjpg);
      //   console.log('no such file')
      }else{
          var ext = path.extname(filePath);
          ext = ext?ext.slice(1) : 'unknown';
          var contentType = MIME_TYPE[ext] || "text/plain";
          fs.readFile(filePath,function(err,data){
              if(err){
                  res.end("<h1>500</h1>服务器内部错误！");
              }else{
                  res.writeHead(200,{'content-type':contentType});
                  console.log(contentType);
                  res.end(data);
              }
          });//fs.readfile
      }
  })//path.exists
}

function postId(req,res){
  var post='';
  req.on('data', function (chunk) {
    post += chunk;
  });
  req.on('end', function () {
    post=JSON.parse(post);
    info.findOne({_id:post.id},function(err,doc){
      if(err){
        console.log(err);
      }else{
        res.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin":"*"});
        doc.time = moment(doc.time).format("MMM Do");
        res.write(JSON.stringify(doc));
        res.end();
      }
    });
   });
}
module.exports = function(req,res){
  var pathname = url.parse(req.url).pathname;console.log(pathname)
  switch(pathname){
    case '/register':register(req,res);break;
    case '/login':login(req,res);break;
    case '/logout':logout(req,res);break;
    case '/':homepage(req,res);break;
    case '/post':post(req,res);break;
    case '/like':like(req,res);break;
    case '/comments':comments(req,res);break;
    case '/personal':personal(req,res);break;
    case '/postId':postId(req,res);break;
    default: serverStatic(req,res);break;
  }
}
