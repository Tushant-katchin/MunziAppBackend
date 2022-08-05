

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

function CheckWallet(details){
       
    return service.CheckWallet(details).then(data => data)
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

/**
 * Get user profile
 * @param {String} id mongo id of user
 */
function getProfile(id) {

    return service.getProfile(id).then(data => data)
}

function generateMnemonics() {

    return service.generateMnemonic().then(data => data)
}

async function sendTransaction(recieverAddress, privateKey, value){
    return service.sendTransaction(recieverAddress, privateKey, value).then(data=>data)
}

/**
 * Update profile
 * @param {String} id mongo id of user
 * @param {Object} details details to be updated
 */
function updateProfile(id, details) {

    return service.updateProfile(id, details).then(data => data)
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

function swapTokens(input) {

    return service.swapTokens(input).then(data => data)
}


module.exports = {


    register,

    verifySecurityCode,

    resendCode,

    login,

    getProfile,

    updateProfile,

    forgotPassword,

    setNewPassword,

    resetPassword,

    logout,

    verifyEmailOrContactNumber,

    verifyOtp,

    CheckWallet,

    generateMnemonics,

    sendTransaction,

    swapTokens,

    confirmOtp,

    getBalance,

    getAllBalances


}