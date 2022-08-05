

function responseMapping(code, msg) {
    return {
        responseCode: code,
        responseMessage: msg
    }
}

function responseMappingWithData(code, msg, data) {
    return {
        responseCode: code,
        responseMessage: msg,
        responseData: data
    }
}

function filteredUserResponseFields(obj) {

    let { _id, firstName, lastName, fullName, emailId, contactNumber, profilePicture, createdAt, isLoggedOut, loginActivity, isOTPVerified, isProfileSet, country, city, state, address, bankAccountNumber, swiftCode, walletAddress, document, verified, notifications, deliveryAddress, isIdentityVerified, kycStatus, updateKycStatus, OTP, isEmailVerified, isPhoneVerified } = obj
    return { _id, firstName, lastName, fullName, emailId, contactNumber, profilePicture, createdAt, isLoggedOut, loginActivity, isOTPVerified, isProfileSet, country, city, state, address, bankAccountNumber, swiftCode, walletAddress, document, verified, notifications, deliveryAddress, isIdentityVerified, kycStatus, updateKycStatus, OTP, isEmailVerified, isPhoneVerified }
    
    // let { _id, firstName, lastName, emailId, contactNumber, profilePicture, createdAt, isLoggedOut, loginActivity, isOTPVerified, isProfileSet, verified, isIdentityVerified, kycStatus, updateKycStatus } = obj
    // return { _id, firstName, lastName, emailId, contactNumber, profilePicture, createdAt, isLoggedOut, loginActivity, isOTPVerified, isProfileSet, verified, isIdentityVerified, kycStatus, updateKycStatus }
}

function filteredVerificationResponseFields(obj) {
    let { _id, emailId, contactNumber, OTP, isEmailVerified, isPhoneVerified } = obj;
    return { _id, emailId, contactNumber, OTP, isEmailVerified, isPhoneVerified };
}

module.exports = {
    responseMapping,

    responseMappingWithData,

    filteredUserResponseFields,

    filteredVerificationResponseFields
}
