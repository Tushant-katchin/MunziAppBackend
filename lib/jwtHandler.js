// load all dependencies
var Promise = require('bluebird');
var jwt = Promise.promisifyAll(require('jsonwebtoken'));
var appConstants = require('./constants');
var TOKEN_EXPIRATION_SEC = Math.floor(Date.now() / 1000) + (60 * 60)



var genUsrToken = async function (user) {
  var options = { expiresIn: '24h' };
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
