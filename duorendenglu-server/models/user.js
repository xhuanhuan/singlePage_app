var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
  username: {type: String, index: {unique: true}},
  password: String
});
var user = mongoose.model('user',userSchema);
module.exports = user;
