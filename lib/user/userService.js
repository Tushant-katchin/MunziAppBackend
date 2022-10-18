
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
const parser = require("pdf-parse");
var CryptoJS = require("crypto-js");
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

                    let token= await jwtHandler.genUsrToken(details)
                    console.log(token)
                    details.token=token 


                   

            
                            
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

                    return mapper.responseMapping(usrConst.CODE.BadRequest, usrConst.MESSAGE.EmailAlreadyExists)

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
                            return mapper.responseMapping(usrConst.CODE.INTRNLSRVR, 'invalid OTP')

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

            query.emailId = details.emailId
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

                    
                    let updateObj = {
                       // isLoggedOut: false,
                        
                    }

                 
                    let token= await jwtHandler.genUsrToken(details)
                    console.log(token)
                   // updateObj.token=token 
                    // If login is attempted by email id, then verification code is to be sent to registered email address
                    // If login is attempted by contact number, then verification code is to be sent to registered contact number

                    if (details.emailId) {

                    
                            
                               // let twilioResponse = Email.sendMessage(details.emailId, )
                               // mailHandler.sendMessage(twilioConfig, usrObj, details.contactNumber)
                              //  console.log({ twilioResponse })
                            }
                        

                    return dao.updateProfile(query, updateObj).then((userUpdated) => {
                        userUpdated=true
                        if (userUpdated) {
                                console.log('success')
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


/**
 * Update profile
 * @param {String} id mongo id of user
 * @param {Object} details details to be updated
 */
async function updateUser(id, details) {
    if (!id || !ObjectId.isValid(id) || !details || Object.keys(details).length == 0) {

        return mapper.responseMapping(usrConst.CODE.BadRequest, usrConst.MESSAGE.InvalidDetails)
    } else {

        // alphabets check
        const regex = /[a-zA-Z]/g;
        // check ethereum address validity
        if(details.walletAddress.length <= 1 || !regex.test(details.walletAddress) || appUtils.verifyEthereumAddress(details.walletAddress) === false) {
            return mapper.responseMapping(usrConst.CODE.BadRequest, usrConst.MESSAGE.InvalidEthereumAddress)
        }

        let query = {
            _id: id,
            status: constants.STATUS.ACTIVE
        }

        return dao.getUserDetails(query).then(async (userDetails) => {

            // check user phone and email verified or not
            if(!userDetails.isEmailVerified || !userDetails.isPhoneVerified) {
                if(!userDetails.isPhoneVerified){
                    return mapper.responseMapping(usrConst.CODE.BadRequest, usrConst.MESSAGE.ContactNumberNotVerified)
                } else {
                    return mapper.responseMapping(usrConst.CODE.BadRequest, usrConst.MESSAGE.EmailIdNotVerified)
                }
            }

            if (userDetails) {

                // If user is setting profile for the first time, need to check below conditions:-
                // 1. If registration is done with contact number, then check email id duplications
                // 2. If registration is done with email id, then check contact number duplications

                if (!userDetails.isProfileSet) {

                    details.isProfileSet = true;

                    if (userDetails.contactNumber) {

                        delete details.contactNumber

                        let emailQuery = {

                            emailId: details.emailId,
                            _id: { $ne: id }
                        }
                        let emailExists = await dao.getUserDetails(emailQuery)
                        if (emailExists) {

                            return mapper.responseMapping(usrConst.CODE.BadRequest, usrConst.MESSAGE.EmailAlreadyExists)
                        }
                    } else {

                        delete details.emailId

                        let contactQuery = {

                            contactNumber: details.contactNumber,
                            _id: { $ne: id }
                        }
                        let contactExists = await dao.getUserDetails(contactQuery)
                        if (contactExists) {

                            return mapper.responseMapping(usrConst.CODE.BadRequest, usrConst.MESSAGE.ContactNumberAlreadyExists)
                        }
                    }

                    
                    // Create bell notification object for admin
                    let notificationQuery = {

                        mailName: constants.EMAIL_TEMPLATES.NOTIFY_FOR_NEW_USER_CREATED,
                        status: constants.STATUS.ACTIVE
                    }
                    let notificationTemplateDetails = await dao.getTemplateDetails(notificationQuery)
                    if (notificationTemplateDetails) {

                        let notificationMessage = notificationTemplateDetails.notificationMessage

                        let obj = {
                            firstName: details.firstName
                        }
                        notificationMessage = mailHandler.convertNotificationMessage(obj, notificationMessage)

                        let adminDetails = await dao.getAdminDetails()

                        let notificationObject = {
                            message: notificationMessage,
                            isRead: false,
                            receiverId: adminDetails._id,
                            createdAt: new Date().getTime(),
                            status: constants.STATUS.ACTIVE,
                            categoryType: constants.NOTIFICATION_CATEGORIES.NEW_USER,
                            refId: id,
                            senderDetails: id
                        }
                        await dao.createNotification(notificationObject)

                        // Call socket method
                    }

                } else {

                    delete details.emailId
                    delete details.contactNumber
                }

                if(details.walletAddress){
                    let walletQuery = {

                           walletAddress: details.walletAddress,
                           _id: { $ne: id }
                       }
                       let walletExists = await dao.getUserDetails(walletQuery)
                       if (walletExists) {

                           return mapper.responseMapping(usrConst.CODE.BadRequest, usrConst.MESSAGE.WalletAddressAlreadyExists)
                       }
                   
               }
              



                details.editedAt = new Date().getTime()

                details.fullName = details.firstName + " " + details.lastName;

                if (details.document) {
                    let newDocs = details.document.map(doc => {
                        let { verified, ...otherDoc } = doc;
                        let existDoc = userDetails.document.find(d => d._id.toString() === doc._id)
                        if (existDoc) {
                            return {
                                ...otherDoc,
                                verified: existDoc.verified
                            }
                        }
                        return {
                            ...otherDoc
                        }
                    })
                    details.document = newDocs;
                }
                return dao.updateProfile(query, details).then((userUpdated) => {

                    if (userUpdated) {
                        let filteredUserResponseFields = mapper.filteredUserResponseFields(userUpdated)
                        return mapper.responseMappingWithData(usrConst.CODE.Success, usrConst.MESSAGE.ProfileUpdated, filteredUserResponseFields)

                    } else {

                        console.log("Failed to update profile")
                        return mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError)

                    }
                }).catch((err) => {

                    console.log({ err })
                    return mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError)
                })
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
    const provider =  new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545'); // TESTNET
    const nonce = await provider.getTransactionCount(address)
    console.log(nonce)
    return {nonce}

}


async function sendTransaction(signedTx){
    console.log(signedTx)
   
    const provider =  new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545'); // TESTNET

   
    const txx = await provider.sendTransaction(signedTx)
    console.log(txx)
    if(txx.hash){
        return mapper.responseMappingWithData(usrConst.CODE.Success, usrConst.MESSAGE.Success, txx.hash) 
    }
    else{
        console.log('failed')
            return mapper.responseMappingWithData(500, 'failed', txx)
    }
    /*const tx = {
        to: recieverAddress,
        value: ethers.utils.parseEther("0.01")
      }

      const wallet = walletPrivateKey.connect(provider)
const balance = await wallet.getBalance();
console.log(balance)
const tcount =await wallet.getTransactionCount();
console.log(tcount)
const txx =await wallet.sendTransaction(tx)
console.log(txx)*/

   /* try{

        const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
       console.log(privateKey) 
        
        //0xb95d6b10ac0a25bd273b02c4a218a73421131c58f93ded639a464664913ecaa5
        const amount=web3.utils.toWei(String(value), 'ether');
        
        const privKey = privateKey;
        const addressTo = recieverAddress;
        const tx = await web3.eth.accounts.signTransaction({
            to: addressTo,
            value: amount,
            gas: 2000000
        }, privKey);
        
        const transaction = await web3.eth.sendSignedTransaction(tx.rawTransaction);
        console.log(transaction)

       

        if(transaction.transactionHash){
            
            return mapper.responseMappingWithData(usrConst.CODE.Success, usrConst.MESSAGE.Success, transaction)
        }
        else{
            console.log('failed')
            return mapper.responseMappingWithData(500, 'failed', transaction)
            
        }
    }catch(e){
        console.log(e)
        return mapper.responseMappingWithData(500, e, e)

    }*/

   /* const privKey = "0x8f9bf6100069b8a670bc26bf517fea21ce6eae3280f949f98a7d05d57d6314e4"//decrypt;
  const addressTo = "0x0E52088b2d5a59ee7706DaAabC880Aaf5A1d9974"//address;

  
const addressFrom = '0x4c817a1aba8069B12859e3249276844feCAE5051';

// const web3 = new Web3(new Web3.providers.HttpProvider('https://apis.ankr.com/cab5b617bccb4c788b2edca558c5e48a/f48360713126550297fef34c3fd1a175/binance/full/test'));
//let provider = new ethers.providers.StaticJsonRpcProvider('https://bsc.getblock.io/testnet/?api_key=a011daa0-3099-4f55-b22c-c3a3d55898d0');
const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'); // TESTNET
    
const wallet = new ethers.Wallet(privKey, provider);

let balance = await provider.getBalance(wallet.address);
console.log('My Initial Balance is:', ethers.utils.formatEther(balance));

const trx = await wallet.sendTransaction({
        to: addressTo, // private key: 0x002d370dbb49f65b232c69852f1148232bafd5c4427c0cf8ee52a1bbb72fe2f8
        value: ethers.utils.parseEther('0.01'), // send 0 BNB
        data: ethers.utils.formatBytes32String('Add Memo Message Here')
});
console.log(trx)*/
        
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
    WBNB: "0xae13d989dac2f0debff460ac112a837c89baa7cd",
    BUSD: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
    USDT:'0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
    DAI:'0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867',
    ETH:"0xd66c6B4F0be8CE5b39D52E0Fd1344c389929B378",
 }
    const web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'));
  let data2
  const data = await web3.eth.getBalance(token.walletAddress)
.then((response)=>{
    data2=response
    console.log(data2)
});
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

const tokenInst = new web3.eth.Contract(abi, address);
const balance = await tokenInst.methods.balanceOf(token.walletAddress).call()
console.log(balance)
const accountBalance = web3.utils.fromWei(balance, 'ether');
console.log(accountBalance)

   return  mapper.responseMappingWithData(usrConst.CODE.Success, usrConst.MESSAGE.Success,accountBalance)

}

async function getAllBalances(input){
    const web3 = createAlchemyWeb3(
        "https://eth-mainnet.g.alchemy.com/v2/rb6DMgwaFbF-uUOR8ztN4ndwaulUfiF4",
    );

    const address = 
    '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'

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
    // testnet
    //wss://data-seed-prebsc-1-s1.binance.org:8545
    const addresses = {
        WBNB: "0xae13d989dac2f0debff460ac112a837c89baa7cd",
        BUSD: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
        USDT:'0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
        DAI:'0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867',
        ETH:"0xd66c6B4F0be8CE5b39D52E0Fd1344c389929B378", 
        factory: "0x182859893230dC89b114d6e2D547BFFE30474a21",
        router: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
        me: "0xA80BA26827a797708b79Ce71164044F7177fA739"
    }
  
    let address1=''
    let address2=''
    if(input.token1==='ETH'){

        address1=addresses.ETH
    }
    if(input.token1==='WBNB'){
    
        address1=addresses.WBNB
    }
    if(input.token1==='BUSD'){
    
        address1=addresses.BUSD
    }
    if(input.token1==='DAI'){
    
        address1=addresses.DAI
    }
    if(input.token1==='USDT'){
    
        address1=addresses.USDT
    }

    if(input.token2==='ETH'){

        address2=addresses.ETH
    }
    if(input.token2==='WBNB'){
    
        address2=addresses.WBNB
    }
    if(input.token2==='BUSD'){
    
        address2=addresses.BUSD
    }
    if(input.token2==='DAI'){
    
        address2=addresses.DAI
    }
    if(input.token2==='USDT'){
    
        address2=addresses.USDT
    }

    console.log(input)
    console.log(address1)
    console.log(address2)
    
    //const PRIVATE_KEY = "b95d6b10ac0a25bd273b02c4a218a73421131c58f93ded639a464664913ecaa5"
    const PRIVATE_KEY = input.privatekey
    
    
   // const web3 = new Web3('wss://apis-sj.ankr.com/wss/f79fd0bff3eb4d81971e486233c0bc6a/f48360713126550297fef34c3fd1a175/binance/full/test');
    
    //const provider = new ethers.providers.JsonRpcProvider('https://bsc.getblock.io/testnet');
   // const prov= new WebSocket('wss://apis-sj.ankr.com/wss/f79fd0bff3eb4d81971e486233c0bc6a/f48360713126550297fef34c3fd1a175/binance/full/test')
    const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s3.binance.org:8545/');
    //wss://stream.binance.com:9443/ws
    //wss://apis.ankr.com/wss/8f82707b543c4923944ea883d917e4f7/f48360713126550297fef34c3fd1a175/binance/full/test
   //const provider=new ethers.providers.StaticJsonRpcProvider('https://data-seed-prebsc-2-s3.binance.org:8545/')
    const wallet = new ethers.Wallet(PRIVATE_KEY);
    const account = wallet.connect(provider);

    const router = new ethers.Contract(
        addresses.router,
        [
            'function getAmountsOut(uint amountIn, address[] memory path) public view returns(uint[] memory amounts)',
            'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
            'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
        ],
        account
    );

    const wbnbContract = new (await ethers).Contract(
        address1,
        [
            'function approve(address guy, uint wad) public returns (bool)'
        ],
        account
    );

    const amountIn = (await ethers).utils.parseUnits(input.amount, "ether");
    const gas = {
        gasPrice: (await ethers).utils.parseUnits('50', 'gwei'),
        gasLimit: '500000'
    };


    const approveTx = await wbnbContract.approve(addresses.router, ethers.utils.parseUnits('1'), gas);
    const approveRecipt = await approveTx.wait();
    console.log(approveRecipt.transactionHash);


    const amounts = await router.getAmountsOut(amountIn, [address1, address2]);
    const amountOutMin = amounts[1].sub(amounts[1].div(10)); 
    
    
    const swapTx = await router.swapExactTokensForTokens(
        amountIn, 
        amountOutMin, 
        [address1, address2], 
        wallet.address,
        Date.now() + 1000 * 60 * 10,
        gas 
    );

    const swapReceipt = await swapTx.wait();
    console.log(swapReceipt);
    console.log("Swap success!!");
    return swapReceipt
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

        const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545'); 
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

       /* response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        , {
            method: "GET",
            headers: {
              
               'Content-Type': 'application/json',
            },
          })
            .then((response) => response.json())
            .then((resp) => {
              
              console.log(resp)
              
               
              return {resp}

            })
            .catch((error) => {
              console.error(error);
            })*/
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
module.exports = {

   

    register,

    login,

    updateUser,

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

    checkAllWallets


}
