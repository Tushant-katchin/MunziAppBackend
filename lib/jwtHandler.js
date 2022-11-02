// load all dependencies
var Promise = require('bluebird');
var jwt = Promise.promisifyAll(require('jsonwebtoken'));
var appConstants = require('./constants');
var TOKEN_EXPIRATION_SEC = appConstants.TOKEN_EXPIRATION_TIME * 60;



var genUsrToken = async function (user) {
  var options = { expiresIn: TOKEN_EXPIRATION_SEC };
  return jwt
    .signAsync(user, process.env.JWTSECRET, options)
    .then(function (jwtToken) {
      return jwtToken;
    })
    .catch(function (err) {
      console.log(error)
    });
};





module.exports = {
  genUsrToken
};
