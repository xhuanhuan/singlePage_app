var http = require('http');
var router = require('./router');
// 创建服务器
http.createServer(router).listen(process.env.PORT || 8082);

// 控制台会输出以下信息
console.log('Server is running');
