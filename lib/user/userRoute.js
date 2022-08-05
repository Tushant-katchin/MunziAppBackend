const router = require("express").Router();
const facade = require('./userFacade');
const validators = require('./userValidators');
const usrConst = require('./userConstants');
const mapper = require('./userMapper');
const { genUsrToken } = require('../jwtHandler');
const auth  = require('../middleware/auth')




router.route('/register').post( (req, res) => {

    let details = req.body
    console.log(req.body)
    facade.register(details).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError))
    })
})

router.route('/getbalance').post( (req, res) => {

    let details = req.body
    console.log(req.body)
    facade.getBalance(details).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError))
    })
})

router.route('/confirmotp').post( (req, res) => {

    let details = req.body
    console.log(req.body)
    facade.confirmOtp(details).then((result) => {
        console.log(result)
        if(result.responseCode===200){

            res.send(mapper.responseMapping(usrConst.CODE.Success, usrConst.MESSAGE.Success))
        }
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError))
    })
})




router.route('/login').post( (req, res) => {

    let details = req.body

    facade.login(details).then((result) => {
        console.log(result)
        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError))
    })
})




router.route('/forgotPassword').post([validators.checkForgotPasswordRequest], (req, res) => {

    let { emailId } = req.body

    facade.forgotPassword(emailId).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError))
    })
})

router.route('/setNewPassword/:redisId').post([validators.checkSetNewPasswordRequest], (req, res) => {

    let { redisId } = req.params
    let { password } = req.body
    console.log(redisId)

    facade.setNewPassword(redisId, password).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError))
    })
})

router.route('/generateMnemonic').get((req, res) => {

    
    facade.generateMnemonics().then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError))
    })
})

router.route('/sendTransaction').post((req, res) => {
console.log(req.body.amount)
const value=req.body.amount
    facade.sendTransaction(req.body.recieverAddress, req.body.privateKey, value).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError))
    })
})

router.route('/swapTokens').post((req, res) => {

    const input=req.body
    facade.swapTokens(input).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError))
    })
})

router.route('/getAllBalances').post((req, res) => {

    const input=req.body
    console.log(input)
    facade.getAllBalances(input).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError))
    })
})












module.exports = router
