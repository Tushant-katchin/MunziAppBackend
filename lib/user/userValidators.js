
/*#################################            Load modules start            ########################################### */

const usrConst = require('./userConstants')
const jwtHandler = require('../jwtHandler')
const ObjectId = require('mongoose').Types.ObjectId
const mapper = require('./userMapper')
const appUtils = require('../appUtils')

/*#################################            Load modules end            ########################################### */

/**
 * Validate JWT token
 */
function checkToken(req, res, next) {

    let token = req.headers['authorization']
    let { id } = req.params

    if (!token || !id || (!ObjectId.isValid(id))) {

        res.send(mapper.responseMapping(usrConst.CODE.FRBDN, usrConst.MESSAGE.TOKEN_NOT_PROVIDED))

        // return new exceptions.unauthorizeAccess(busConst.MESSAGE.TOKEN_NOT_PROVIDED)
    } else {

        return jwtHandler.verifyUsrToken(token).then((result) => {

            if (result && result._id == id) {
                req.tokenPayload = result;
                next()
            } else {

                res.send(mapper.responseMapping(usrConst.CODE.FRBDN, usrConst.MESSAGE.TOKEN_NOT_PROVIDED))
            }
        })
    }
}

/**
 * Validating register request
 */
function checkRegisterRequest(req, res, next) {

    let error = []
    let details = req.body

    if (!details || Object.keys(details).length == 0) {

        error.push({ responseCode: usrConst.CODE.BadRequest, responseMessage: usrConst.MESSAGE.InvalidDetails })
    } else {

        let { emailId, contactNumber, password, address, walletAddress } = details

        if (!password   || !address || !walletAddress|| (!emailId && !contactNumber)) {

            error.push({ responseCode: usrConst.CODE.BadRequest, responseMessage: usrConst.MESSAGE.InvalidDetails })

        }

        // let { firstName, lastName, emailId, contactNumber, password} = details;
        // if (!firstName || !lastName || !password || (!emailId && !contactNumber)) {
        //     error.push({ responseCode: usrConst.CODE.BadRequest, responseMessage: usrConst.MESSAGE.InvalidDetails })
        // }

    }

    if (error.length > 0) {

        res.json(mapper.responseMapping(usrConst.CODE.BadRequest, usrConst.MESSAGE.InvalidDetails))
    } else {

        next()
    }
}





/**
 * Validating login request
 */
function checkLoginRequest(req, res, next) {

    let error = []
     let { emailId, password} = req.body

     if (!emailId && !password ) {

         error.push({ responseCode: usrConst.CODE.BadRequest, responseMessage: usrConst.MESSAGE.InvalidDetails })
     }


    if (error.length > 0) {

        res.json(mapper.responseMapping(usrConst.CODE.BadRequest, usrConst.MESSAGE.InvalidDetails))
    } else {

        next()
    }
}



/**
 * Validating forgot password request
 */
function checkForgotPasswordRequest(req, res, next) {

    let error = []
    let { emailId } = req.body

    if (!emailId || (!appUtils.isValidEmail(emailId))) {

        error.push({ responseCode: usrConst.CODE.BadRequest, responseMessage: usrConst.MESSAGE.InvalidDetails })
    }

    if (error.length > 0) {

        res.json(mapper.responseMapping(usrConst.CODE.BadRequest, usrConst.MESSAGE.InvalidDetails))
    } else {

        next()
    }

}



/**
 * Validating set new password by recovery link
 */
function checkSetNewPasswordRequest(req, res, next) {

    let error = []
    let { redisId } = req.params
    let { password } = req.body
    console.log(redisId)
    if (!redisId || !password) {

        error.push({ responseCode: usrConst.CODE.BadRequest, responseMessage: usrConst.MESSAGE.InvalidDetails })
    }
    if (error.length > 0) {

        res.json(mapper.responseMapping(usrConst.CODE.BadRequest, usrConst.MESSAGE.InvalidDetails))
    } else {

        next()
    }
}



module.exports = {

    checkToken,

    checkRegisterRequest,

    checkLoginRequest,

    checkForgotPasswordRequest,

    checkSetNewPasswordRequest

}