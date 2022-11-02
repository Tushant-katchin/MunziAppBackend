'use strict';

//========================== Load Modules Start ===========================

//========================== Load External Module =========================

var promise = require('bluebird');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')
var ethereum_address = require('ethereum-address')
var CryptoJS = require("crypto-js");
const fetch = require('cross-fetch');

//========================== Load Modules End =============================

//========================== Export Module Start ===========================



/**
 * returns if email is valid or not
 * @returns {boolean}
 */
function isValidEmail(email) {
    var pattern = /(([a-zA-Z0-9\-?\.?]+)@(([a-zA-Z0-9\-_]+\.)+)([a-z]{2,3}))+$/;
    return new RegExp(pattern).test(email);
}



async function convertPass(password) {
    let pass = await bcrypt.hash(password, 10)
    // req.body.password = pass;
    return pass
}

function verifyPassword(user, isExist) {
    return bcrypt.compare(user.password, isExist.password);
}


function createToken(user){
    
    const token = jwt.sign(
        { user_id: user._id, email: user.email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );

    return token;
}
function encryptText(input){
    var ciphertext = CryptoJS.AES.encrypt(input, process.env.SECRETKEY).toString();
    console.log(ciphertext)
    return ciphertext

    
   

}
function decryptText(input){
var bytes  = CryptoJS.AES.decrypt(input, 'xxxyyyzzz');
var originalText = bytes.toString(CryptoJS.enc.Utf8);
console.log(originalText)
return originalText

}

async function getCryptoData (){
    let response

    try {
        response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        , {
            method: "GET",
            headers: {
              
               'Content-Type': 'application/json',
            },
          })
            .then((response) => response.json())
            .then((resp) => {
              
              //console.log(resp)
              
               
              return {resp}

            })
            .catch((error) => {
              console.error(error);
            })
      } catch (error) {
        console.log(error)
      }
   return response

}



//========================== Export Module Start ===========================

module.exports = {

    
    verifyPassword,

    isValidEmail,

    convertPass,

    createToken,

    encryptText,

    decryptText,

    getCryptoData
    
};

//========================== Export Module End===========================
