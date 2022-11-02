
/*#################################            Load modules start            ########################################### */
require('@pancakeswap-libs/sdk')
const dao = require('./userDao')
const usrConst = require('./userConstants')
const mapper = require('./userMapper')
const constants = require('../constants')
const appUtils = require('../appUtils')
const jwtHandler = require('../jwtHandler')
const ObjectId = require('mongoose').Types.ObjectId
const appUtil = require('../appUtils')
const mongoose = require('mongoose');
var WebSocket= require('ws');
const conn = mongoose.connection;
const Email = require('./userEmail')
const Template = require('./emailTemplate')
const ethers = require("ethers");
const Web3 = require('web3')
const Tx = require('ethereumjs-tx').Transaction;
var Common = require('ethereumjs-common').default;
const {ChainId, Token, TokenAmount, Fetcher, Pair, Route, Trade, TradeType, Percent} = require('@pancakeswap-libs/sdk');
const {JsonRpcProvider} = require("@ethersproject/providers");
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const fs = require("fs");
const fetch = require('cross-fetch');
const market = require('../Market/marketDao')

/*#################################            Load modules end            ########################################### */


/**
 * Register user
 * @param {Object} details user details to get registered
 */
function register(details) {

    if (!details || Object.keys(details).length == 0) {

        return mapper.responseMapping(usrConst.CODE.BadRequest, usrConst.MESSAGE.InvalidDetails)
    } else {

        if (details.emailId) {
            let query = {
                emailId: details.emailId
            }

            return dao.getUserDetails(query).then(async (userExists) => {

                if (userExists) {

                    return mapper.responseMapping(usrConst.CODE.BadRequest, usrConst.MESSAGE.EmailAlreadyExists)

                } else {

                    let convertedPass = await appUtil.convertPass(details.password);
                    details.password = convertedPass

                    let verificationCode = Math.floor(Math.random() * (999999 - 100000) + 100000)
                    console.log({ verificationCode })
                    

                   
                    details.OTP = verificationCode
                    details.isEmailVerified=false

                   /*
                    details.otpUpdatedAt = new Date().getTime()
                    details.createdAt = new Date().getTime()
                    details.isIdentityVerified = false
                   
                    let loginActivity = []
                    loginActivity.push({
                       
                        status: 'active'
                    })*/

                   // details.loginActivity = loginActivity

                     


                   

            
                            
                         /*   let mailSent = Email.sendMessage( details.emailId)
                            console.log({ mailSent })*/
                        

                    return dao.createUser(details).then((userCreated) => {

                        if (userCreated) {

                            const EmailTemplate=Template.register(details.OTP)
                //console.log(isExist.emailId)
                           let mailSent = Email.sendMessage2(details.emailId,EmailTemplate)
                            console.log(mailSent)
                            let filteredUserResponseFields = mapper.filteredUserResponseFields(userCreated)
                             console.log(userCreated)
                            return mapper.responseMappingWithData(usrConst.CODE.Success, usrConst.MESSAGE.Success, filteredUserResponseFields)

                        } else {

                            console.log("Failed to save user")
                            return mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError)

                        }
                    }).catch((err) => {

                        console.log({ err })
                        return mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError)
                    })

                }
            }).catch((err) => {

                console.log({ err })
                return mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError)
            })
        } 
    }
}


function confirmOtp(details){
    if (!details ) {

        return mapper.responseMapping(usrConst.CODE.BadRequest, usrConst.MESSAGE.InvalidDetails)
    } else {

        if (details.emailId) {
            let query = {
                emailId: details.emailId
            }

            return dao.getUserDetails(query).then(async (userExists) => {

                if (!userExists) {

                    return mapper.responseMapping(usrConst.CODE.BadRequest,'user does not exist')

                } else{

                
                    

                    console.log(userExists)
                        if (userExists.OTP==details.otp) {
                            let updateObj={
                                isEmailVerified:true
                            }

                            return dao.updateProfile(query, updateObj).then((userUpdated) => {
                               
                                if (userUpdated) {
        
                                    // let usrObj = {
                                    //     _id: userUpdated._id,
                                    //     emailId: userUpdated.emailId,
                                    //     contactNumber: userUpdated.contactNumber
                                    // }
                                    // return jwtHandler.genUsrToken(usrObj).then((token) => {
                                        console.log('success')
                                        return mapper.responseMapping(usrConst.CODE.Success, usrConst.MESSAGE.Success)
        
                                }
                                else{
                                    console.log('error')
                                        return mapper.responseMapping(usrConst.CODE.INTRNLSRVR, 'server error')
        
                                }
                            
                            })        
                        } else {

                            console.log("invalid otp")
                            return mapper.responseMapping(usrConst.CODE.InvalidOtp, 'invalid OTP')

                        }

                }
            }).catch((err) => {

                console.log({ err })
                return mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError)
            })
        } 
    }
}


/**
 * Login
 * @param {Object} details user details
 */
function login(details) {

    if (!details || Object.keys(details).length == 0) {

        return mapper.responseMapping(usrConst.CODE.BadRequest, usrConst.MESSAGE.InvalidDetails)
    } else {

        let query = {
           
        }
        if (details.emailId) {

            query.emailId = details.emailId.toLowerCase()
        }
        if (details.contactNumber) {

            query.contactNumber = details.contactNumber
        }
         
        return dao.getUserDetails(query).then(async (userDetails) => {
            console.log(query)
            console.log(userDetails)

            if (userDetails) {

                if(!userDetails.isEmailVerified){
                    return mapper.responseMapping(401,'Please verify your account first')
                }

               let isValidPassword = await appUtils.verifyPassword(details, userDetails)
       //let isValidPassword = true;  
       console.log( isValidPassword )

                if (isValidPassword) {

                    let token = await jwtHandler.genUsrToken(details)
                    console.log(token)
                    details.token=token
                    let updateObj = {
                       token:token
                        
                    }

                 
                    
                   

                    return dao.updateProfile(query, updateObj).then((userUpdated) => {
                        
                        if (userUpdated) {
                                console.log('success', userUpdated)
                                updateObj.emailId=userUpdated.emailId
                                return mapper.responseMappingWithData(usrConst.CODE.Success, usrConst.MESSAGE.Success, updateObj)

                          
                        } else {

                            console.log("Failed to update verification code")
                            return mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError)
                        }
                    }).catch((err) => {

                        console.log({ err })
                        return mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError)
                    })
                } else {

                    return mapper.responseMapping(405, usrConst.MESSAGE.InvalidPassword)

                }
            } else {

                return mapper.responseMapping(usrConst.CODE.DataNotFound, usrConst.MESSAGE.UserNotFound)
            }
        }).catch((err) => {

            console.log({ err })
            return mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError)
        })

    }
}


/**
 * Forgot password
 * @param {String} emailId email id of user to send password recovery link
 */
function forgotPassword(emailId) {

    if (!emailId) {

        return mapper.responseMapping(usrConst.CODE.BadRequest, usrConst.MESSAGE.InvalidDetails)
    } else {

        let query = {
            emailId: emailId
        }
        return dao.getUserDetails(query).then(async (isExist) => {

            if (isExist) {
               

                console.log(isExist._id)
                const EmailTemplate=Template.forgotPassword(isExist._id)
                //console.log(isExist.emailId)
                let mailSent = Email.sendMessage2(isExist.emailId,EmailTemplate)
                console.log(mailSent)
                //mailHandler.SEND_MAIL(usrObj, templateDetails, serviceDetails)

                return mapper.responseMapping(usrConst.CODE.Success, usrConst.MESSAGE.ResetPasswordMailSent)

            } else {

                return mapper.responseMapping(usrConst.CODE.DataNotFound, usrConst.MESSAGE.InvalidCredentials)
            }
        }).catch((e) => {

            console.log({ e })
            return mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError)
        })
    }
}

/**
 * Set new password
 * @param {string} redisId redis id for recovering password
 * @param {string} password new password to set
 */
async function setNewPassword(redisId, password) {

    if (!redisId || !password) {

        return mapper.responseMapping(usrConst.CODE.BadRequest, usrConst.MESSAGE.InvalidDetails)

    } else {
      console.log(redisId)
        let query = {
            _id: redisId
        }
        
       // let isUserExists = await dao.getUserDetails(query)
       let isUserExists = await dao.getUserDetails(query)
       console.log(isUserExists)
        //redisServer.getRedisDetails(redisId)

        if (isUserExists) {

            let newPass = await appUtils.convertPass(password);

            let query = {
                _id: redisId
            }
            let updateObj = {
                password: newPass
            }
            return dao.updateProfile(query, updateObj).then(async (updateDone) => {

                if (updateDone) {

                   
                    
                    //await dao.getServiceDetails(thirdPartyServiceQuery)
                    let mailConfig = Email.sendMessage(isUserExists.emailId)
                    console.log(mailConfig)
                    //mailHandler.SEND_MAIL(mailBodyDetails, templateDetails, serviceDetails)
                    

                    return mapper.responseMapping(usrConst.CODE.Success, usrConst.MESSAGE.PasswordUpdateSuccess)

                } else {
                    console.log("Failed to reset password");
                    return mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError)
                }

            }).catch((e) => {

                console.log({ e })
                return mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError)
            })

        } else {

            return mapper.responseMapping(usrConst.CODE.DataNotFound, usrConst.MESSAGE.ResetPasswordLinkExpired)
        }
    }
}


async function generateMnemonic(){
    
   /* const mnemonic = bip39.generateMnemonic()
    console.log('mnemonic:', mnemonic)*/

    
const wallet = ethers.Wallet.createRandom();

console.log("address:", wallet.address);
console.log("mnemonic:", wallet.mnemonic.phrase);
console.log("privateKey:", wallet.privateKey);

const accountFromMnemonic = ethers.Wallet.fromMnemonic(wallet.mnemonic.phrase);
console.log("accountFromMnemonic", accountFromMnemonic.address);
return wallet.mnemonic.phrase

}
async function getNonce(address){
    console.log(address)
    const provider =  new ethers.providers.JsonRpcProvider(process.env.BSCRPC); // TESTNET
    const nonce = await provider.getTransactionCount(address)
    console.log(nonce)
    return {nonce}

}

const getGasPrice = async () => {

    const provider = new ethers.providers.JsonRpcProvider(process.env.BSCRPC) // TESTNET
    const gasPrice = await provider.getGasPrice()
    console.log(gasPrice)
    return { gasPrice }
  }

async function sendTransaction(signedTx){
    console.log(signedTx)
   
    const provider =  new ethers.providers.JsonRpcProvider(process.env.BSCRPC); // TESTNET

   
    const txx = await provider.sendTransaction(signedTx)
    console.log(txx)
    if(txx.hash){
        return mapper.responseMappingWithData(usrConst.CODE.Success, usrConst.MESSAGE.Success, txx.hash) 
    }
    else{
        console.log('failed')
            return mapper.responseMappingWithData(500, 'failed', txx)
    }
   
    }
    
    
    
    
async function getBalance(token){
    if(token.walletAddress.length===0){
       return mapper.responseMappingWithData(usrConst.CODE.Success, usrConst.MESSAGE.Success,0)
    }

const abi=[{
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  }]

  const addresses = {
    BNB : usrConst.ADDRESSES.BNB,
    WBNB: usrConst.ADDRESSES.WBNB,
    BUSD: usrConst.ADDRESSES.BUSD,
    USDT: usrConst.ADDRESSES.USDT,
    DAI: usrConst.ADDRESSES.DAI,
    ETH: usrConst.ADDRESSES.ETH,
 }
    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BSCRPC));
  let data2
  
let address

if(token.token==='ETH'){

    address=addresses.ETH
}
if(token.token==='WBNB'){

    address=addresses.WBNB
}
if(token.token==='BUSD'){

    address=addresses.BUSD
}
if(token.token==='DAI'){

    address=addresses.DAI
}
if(token.token==='USDT'){

    address=addresses.USDT
}
if(token.token=='BNB'){
    const balance = await web3.eth.getBalance(token.walletAddress)
  
        // convert a currency unit from wei to ether
        const balanceInEth = ethers.utils.formatEther(balance)
        console.log(`balance: ${balanceInEth} ETH`)
        const accountBalance = balanceInEth
        return  mapper.responseMappingWithData(usrConst.CODE.Success, usrConst.MESSAGE.Success,accountBalance)

}
else{

    
    const tokenInst = new web3.eth.Contract(abi, address);
    const balance = await tokenInst.methods.balanceOf(token.walletAddress).call()
    console.log(balance)
    const accountBalance = web3.utils.fromWei(balance, 'ether');
    console.log(accountBalance)
    
    return  mapper.responseMappingWithData(usrConst.CODE.Success, usrConst.MESSAGE.Success,accountBalance)
}

}

async function getAllBalances(input){
    const web3 = createAlchemyWeb3(
        process.env.ALCHEMY,
    );

    const address = 
    '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'//hardcoded for now for testing

    // Get token balances
    const balances = await 
    web3.alchemy.getTokenBalances(address, 'DEFAULT_TOKENS')

    // Remove tokens with zero balance
    const nonZeroBalances = 
    balances['tokenBalances'].filter(token => {
       return token['tokenBalance'] !== '0'
    })
    
    
    console.log(`Token balances of ${address} \n`)
    
    // Counter for SNo of final output
    let i = 1
    let data=[]
    
    // Loop through all tokens with non-zero balance
    for (token of nonZeroBalances) {
    
       // Get balance of token 
       let balance = token['tokenBalance']
    
       // Get metadata of token
       let metadata = await web3.alchemy.getTokenMetadata(token[
          'contractAddress'
       ]);
       console.log(metadata)
    
       // Compute token balance in human-readable format
       balance = balance/Math.pow(10, metadata['decimals']);
       balance = balance.toFixed(2);
    
       // Print name, balance, and symbol of token
       console.log(`${i++}. ${metadata['name']}: ${balance} 
       ${metadata['symbol']}`)
       metadata.balance=balance
       data.push(metadata)
       console.log(data)
    }
    return data


}

async function swapTokens(input) {
  
try{

    if(input){
        
      const query ={
        emailId:input.emailId
      }
      const updateDetails = {
    
        type:input.type,
        hash:input.hash
    
      }

   let updateTransaction = dao.updateTransaction(query,updateDetails).then((userUpdated)=>{
        
        console.log(userUpdated)
        if(userUpdated){
            return true
        }
        else{
            return false
            
        }
        
        
    }).catch((e)=>{
        console.log(e)
        return mapper.responseMapping(usrConst.CODE.BadRequest,usrConst.MESSAGE.TransactionFailure)
        
    })

    if(updateTransaction){
        return mapper.responseMapping(usrConst.CODE.Success,usrConst.MESSAGE.TransactionSuccess)
     }
     else{
         return mapper.responseMapping(usrConst.CODE.BadRequest,usrConst.MESSAGE.TransactionFailure)

     }

}else{
    return mapper.responseMapping(usrConst.CODE.BadRequest, usrConst.MESSAGE.InvalidDetails)
}
}catch(e){
    return mapper.responseMapping(usrConst.CODE.BadRequest,usrConst.MESSAGE.internalServerError)

}

        }
        
 async function saveWallet(details){
            
            console.log(details)
            if (!details || Object.keys(details).length == 0) {

    return mapper.responseMapping(usrConst.CODE.BadRequest, usrConst.MESSAGE.InvalidDetails)
} else {

    let query = {
       
    }
    if (details.emailId) {

        query.emailId = details.emailId
    }
   
     
    return dao.getUserDetails(query).then(async (userDetails) => {
        console.log(query)
        console.log(userDetails)

        if (userDetails) {

        
            if (userDetails.isEmailVerified) {

                const password = appUtil.encryptText(details.password)
                console.log(password)

               /* const decrypt = appUtil.decryptText(password)
                console.log(decrypt)*/
             let updateObj={
             
                accountName: `${details.name}`,
                filePath: `${details.path}`,
                encryptionPassword: `${password}`,
             
               
               }
                
                
             
             
             
              //  let token= await jwtHandler.genUsrToken(details)
               // console.log(token)
               
                    

                return dao.updateWallet(query,updateObj).then((userUpdated) => {
                    if (userUpdated) {
                            console.log('success')
                            console.log(userUpdated)
                            return mapper.responseMapping(usrConst.CODE.Success, usrConst.MESSAGE.Success)

                      
                    } else {

                        console.log("Failed to update verification code")
                        return mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError)
                    }
                }).catch((err) => {

                    console.log({ err })
                    return mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError)
                })
            } else {

                return mapper.responseMapping(usrConst.CODE.BadRequest, usrConst.MESSAGE.InvalidPassword)

            }
        } else {

            return mapper.responseMapping(usrConst.CODE.DataNotFound, usrConst.MESSAGE.UserNotFound)
        }
    }).catch((err) => {

        console.log({ err })
        return mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError)
    })

}


}
   
async function getAllWallets(input){

    console.log(input)
    let query={

    }
    query.emailId = input.emailId
   const data = await dao.getAllWallets(query)
   
   let accounts=[]
   
   accounts.push(data.accounts)
   
const decryptedAccount= accounts.map((element )=> {
    console.log(element.length)
    let password=[]
    for(i=0;i<element.length;i++ ){
        
        let decrypted=appUtil.decryptText(element[i].encryptionPassword)
        password.push(decrypted)
        console.log(password)
        element[i].encryptionPassword=decrypted
        console.log(element[i].encryptionPassword)
    }
    return element
    

});
console.log(decryptedAccount)
//console.log(newArray);
   //console.log(accounts)
    return {code:200,accounts:decryptedAccount}
   }


async function checkAllWallets(input){

    console.log(input)
    let query={

    }
    query.emailId = input.emailId
   const data = await dao.getAllWallets(query)
   
   let accounts=[]
   
   accounts.push(data.accounts)
   
const AccountValidity = accounts.map((element )=> {
    console.log(element.length)
    let password=[]
    for(i=0;i<element.length;i++ ){
        
        if(input.name===element[i].accountName){
            return{status:400, msg:"already exists"}
        }
        
    }
    return {status:200, msg:"unique"}
    

});
console.log(AccountValidity)
//console.log(newArray);
   //console.log(accounts)
    return {code:200,validity:AccountValidity[0]}
   }


async function Balance(details){

    try{

        const provider = new ethers.providers.JsonRpcProvider(process.env.BSCRPC); 
        if(details.address) {
          const balancee=await provider.getBalance(details.address).then((balance) => {
            // convert a currency unit from wei to ether
            const balanceInEth = ethers.utils.formatEther(balance)
            console.log(`balance: ${balanceInEth} ETH`)
            return {
                status: "success",
                message: "Balance fetched",
                walletBalance: balanceInEth
              };
           })
           console.log(balancee)
         
           return balancee
        }
        else{
          return{
            status:"error",
            message:'failed to fetch balance',
            walletBalance:0
            
          }
        }
      }catch(e)
    {
        return mapper.responseMapping(usrConst.CODE.INTRNLSRVR, e)

    } 

}


async function getCryptoData(){
let response

    try {
        response =  await market.getData()

            } catch (error) {
        console.log(error)
      }
   return response.MarketData
}

async function getChart(input){
    let response
    let name = input.input.toUpperCase()
     console.log(name)
     
    if(name=='USDT'){
        name='USD'
    }
    if(name=='WETH'){
        name='ETH'
    }
 response = await fetch(`https://api.binance.com/api/v1/klines?symbol=${name}USDT&interval=1m&limit=50`, {
      method: 'GET'
    })
    .then(resp => resp.json())
    .then(resp => {
      const trades = resp.map(interval => parseFloat(interval[1]));
  
      const firstTrade = trades[0];
      const lastTrade = trades.slice(-1)[0];
      const percent = (((lastTrade - firstTrade) / firstTrade) * 100).toFixed(2);
  
      
      console.log(trades)
      return {trades, percent}
    })
    .catch(err => {
      console.log(err);
  
   
    });
    return {trades:response.trades, percent:response.percent}
}

const getTransactions = async (input) =>{
try{
    let transactions
if(input){
    let query ={
        emailId:input.emailId
    }
 transactions = await dao.getUserDetails(query).then((user)=>{
    console.log(user.transactions)

    return user.transactions
})


return mapper.responseMappingWithData(usrConst.CODE.Success,usrConst.MESSAGE.Success,transactions)


}else{

    return mapper.responseMapping(usrConst.CODE.BadRequest,usrConst.MESSAGE.InvalidDetails)
}

}catch(e){
    console.log(e)

}

}

module.exports = {

   

    register,

    login,

    forgotPassword,

    setNewPassword,

    generateMnemonic,

    sendTransaction,

    swapTokens,

    confirmOtp,

    getBalance,

    getAllBalances,

    saveWallet,

    getAllWallets,

    Balance,

    getNonce,

    getCryptoData,

    getChart,

    checkAllWallets,  

    getGasPrice,

    getTransactions


}
