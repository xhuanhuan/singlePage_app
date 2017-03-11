// var jwt = require('jwt-simple');
// var payload = {
//     "iss": "kkkkkkk",
//     "iat": 1441593502,
//     "exp": 1441594722,
//     "aud": "www.example.com",
//     "sub": "jrocket@example.com",
//     "from_user": "B",
//     "target_user": "A"
// };
// var secret  = 'xiaobnaofihaoifhao';
//
// var token = jwt.encode(payload,secret);
//
// try{
//   var decode = jwt.decode(token, secret, false, 'HS256');
// }catch(e){
//   console.log(e);
// }
// console.log(token);
// console.log(decode);
var jwt = require('./models/jwt_auth');
var token=jwt.encode('woshoxiaobo');
console.log(jwt.decode(token));
