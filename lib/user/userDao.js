
const mongoose = require('mongoose')
let BaseDao = require('../dao/BaseDao')
const constants = require('../constants')

const User = require('../generic/models/userModel')

const usrDao = new BaseDao(User);




/*#################################            Load modules end            ########################################### */


/**
 * Get user details
 * @param {Object} query query to find user details
 */
function getUserDetails(query) {
    

    return usrDao.findOne(query)
}

/**
 * Create user
 * @param {Object} obj user details to be registered
 */
function createUser(obj) {

    let userObj = new User(obj)
    return usrDao.save(userObj)
}




/**
 * Update user profile
 * @param {Object} query mongo query to find user to update
 * @param {Object} updateDetails details to be updated
 */
function updateProfile(query, updateDetails) {

    let update = {}
    update['$set'] = updateDetails

    let options = {
        new: true
    }
    
    return usrDao.findOneAndUpdate(query, update, options)
}
async function updateWallet(query, updateDetails) {

    let update = {}
    update['$push'] = updateDetails

    let options = {
        new: true
    }
    
    
    return usrDao.findOneAndUpdate(query, {$push:{accounts:updateDetails}},{safe: true, upsert: true, new : true})
    
}

async function getAllWallets(details){
  const data = await usrDao.findOne(details)
  //console.log(data)
  return data
}

function getWalletdetail(query){

    return usrDao.Find({
        $and: [
            { "_id": { $ne: `${query._id}` } },
          { "walletAddress":`${query.walletAddress}`} ,
          
        ]
      })
}

/**
 * Get ticket details
 * @param {Object} query mongo query to find support ticket
 */


function updateProfileMultipleFields(query, updateObj) {

    let update = {}
    update['$set'] = updateObj
    let options = {
        new: true,
        multi: true
    }
    return usrDao.findOneAndUpdate(query, update, options)
}

/**
 * Get third party service details
 * @param {Object} query mongo query to find third party service details
 */
function getServiceDetails(query) {

    return thirdPartyDao.findOne(query)
}


 
function createNotification(obj) {

    return notificationDao.save(obj)
}


function findLocalUser(query) {
    return usrDao.findOne(query);
}

function findLocalUserByEmailId(query) {
    return usrDao.findOne(query);
}

function registerLocalUser(obj) {
    let localUserObj = new LocalUser(obj);
    return usrDao.save(localUserObj)
}

async function updateLocalUser(query, updateDetails) {
    let update = {}
    update['$set'] = updateDetails

    let options = {
        new: true
    }

    await usrDao.findOneAndUpdate(query, update, options);
    return usrDao.findOne(query);
}





// All the funtions related to RFID users---------------------------------------------------


module.exports = {

 
    getUserDetails,

    createUser,

   
    updateWallet,
    updateProfile,

    

    updateProfileMultipleFields,

    getServiceDetails,

    
    createNotification,

    
    getWalletdetail,

    // local user functions
    findLocalUser,

    findLocalUserByEmailId,

    registerLocalUser,

    updateLocalUser,

    getAllWallets
    

}