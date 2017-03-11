//encode(text)
var jwt = require('jwt-simple');
var moment = require('moment');
var jwt_auth ={};
var secret = 'xiaoboma';
jwt_auth.encode = function(text){
  var payload = {
      "iss": text,
      "iat": moment().unix(),
      "exp": moment().add(7,'days').unix(),
      "aud": "www.xiaoboma.com",
      "sub": "heroku",
      "from_user": "herokuxiaoboma",
      "target_user": "user"
  };
  return jwt.encode(payload,secret);
};
jwt_auth.decode = function(token){
  try{
    return jwt.decode(token,secret);
  }
  catch(e)
  {
    return 'error';
  }
}

module.exports = jwt_auth;
