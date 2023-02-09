

/*#################################            Load modules start            ########################################### */
const service = require('./userService')

/*#################################            Load modules end            ########################################### */





/**
 * Register user
 * @param {Object} details user details to get registered
 */
function register(details) {

    return service.register(details).then(data => data)
}

function saveUserDetails(details) {

    return service.saveUserDetails(details).then(data => data)
}

function createUserDetails(details) {

    return service.createUserDetails(details).then(data => data)
}


function setUser(details) {

    return service.setUser(details).then(data => data)
}


function CheckWallet(details){
       
    return service.CheckWallet(details).then(data => data)
}

function getEthBalance(details){
       
    return service.getEthBalance(details).then(data => data)
}

function getMaticBalance(details){
       
    return service.getMaticBalance(details).then(data => data)
}

function getXrpBalance(details){
       
    return service.getXrpBalance(details).then(data => data)
}

/**
 * Verify security code for registeration
 * @param {String} id mongo id of user
 * @param {String} code security code to be verified
 */
 function confirmOtp( details) {

    return service.confirmOtp( details).then(data => data)
}

function getBalance( details) {

    return service.getBalance( details).then(data => data)
}

function getAllBalances( details) {

    return service.getAllBalances( details).then(data => data)
}

function Balance( details) {

    return service.Balance( details).then(data => data)
}


/**
 * Verify security code
 * @param {String} id mongo id of user
 * @param {String} code security code to be verified
 */
function verifySecurityCode(id, details) {

    return service.verifySecurityCode(id, details).then(data => data)
}

/**
 * Resend verification code
 * @param {String} id mongo id of user
 * @param {Object} details email id or contact number on which verification code is to be sent
 */
function resendCode(id, details) {

    return service.resendCode(id, details).then(data => data)
}

/**
 * Login
 * @param {Object} details user details
 */
function login(details) {

    return service.login(details).then(data => data)
}



function generateMnemonics() {

    return service.generateMnemonic().then(data => data)
}

async function sendTransaction(signedTx){
    return service.sendTransaction(signedTx).then(data=>data)
}
async function getNonce(address){
    return service.getNonce(address).then(data=>data)
}

async function getGasPrice(){
    return service.getGasPrice().then(data=>data)
}

async function approveSwap(input){
    return service.approveSwap(input).then(data=>data)
}


async function getTransactions (input){
    return service.getTransactions(input).then(data=>data)
}

async function getAmountsOut(input){
    return service.getAmountsOut(input).then(data=>data)
}

/**
 * Forgot password
 * @param {String} emailId email id of user to send password recovery link
 */
function forgotPassword(emailId) {

    return service.forgotPassword(emailId).then(data => data)
}

/**
 * Set new password
 * @param {string} redisId redis id for recovering password
 * @param {string} password new password to set
 */
function setNewPassword(redisId, password) {

    return service.setNewPassword(redisId, password).then(data => data)
}

/**
 * Reset password
 * @param {String} id mongo id of user to reset password
 * @param {String} oldPassword old password for authentication
 * @param {String} newPassword new password to be set
 */
function resetPassword(id, oldPassword, newPassword) {

    return service.resetPassword(id, oldPassword, newPassword).then(data => data)
}

/**
 * Logout
 * @param {String} id mongo id of user
 * @param {String} activityId mongo id of login activity to be inactivated
 */
function logout(id, activityId) {

    return service.logout(id, activityId).then(data => data)
}



function verifyEmailOrContactNumber(id, details) {

    return service.verifyEmailOrContactNumber(id, details).then(data => data)
}

function verifyOtp(id, details) {

    return service.verifyOtp(id, details).then(data => data)
}

function saveTx(input) {

    return service.saveTx(input).then(data => data)
}

function saveWallet(input) {

    return service.saveWallet(input).then(data => data)
}
async function getAllWallets(input){
console.log(input)
return service.getAllWallets(input)

}

async function getCryptoData(){

    return await service.getCryptoData()
    
    }
    
async function getChart(input){
    return await service.getChart(input)
}

async function checkAllWallets(input){
    return await service.checkAllWallets(input)
}

async function getEtherTokenPrice(input){
    return await service.getEtherTokenPrice(input)
}

async function getLatestTransactions(input){
    return await service.getLatestTransactions(input)
}
module.exports = {

    createUserDetails,

    register,

    verifySecurityCode,

    resendCode,

    login,

    forgotPassword,

    setNewPassword,

    resetPassword,

    logout,

    verifyEmailOrContactNumber,

    verifyOtp,

    CheckWallet,

    generateMnemonics,

    sendTransaction,

    saveTx,

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

    getTransactions,

    getAmountsOut,

    approveSwap,

    saveUserDetails,

    getEthBalance,

    getMaticBalance,

    getXrpBalance,

    getEtherTokenPrice,

    setUser,

    getLatestTransactions


}
//exp://wz-erk.tushant07.munziapp.exp.direct:80