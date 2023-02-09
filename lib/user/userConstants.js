

let messages = {
    InvalidCredentials: 'Please provide valid credentials and try again',
    internalServerError: 'Internal server error. Please try after some time.',
    InvalidDetails: 'Please provide valid details.',
    Success: 'Success',
    TOKEN_NOT_PROVIDED: 'Please provide a valid authorization details',
    InvalidPassword: 'Please provide valid password',
    LoginSuccess: 'Logged in successfully',
    ProfileUpdated: 'Profile updated successfully',
    ResetPasswordMailSent: 'Please reset your password using the link provided in your mail',
    PasswordUpdateSuccess: "Password changed successfully",
    ResetPasswordLinkExpired: "Your reset password link is expired",
    EmailAlreadyExists: 'Account with the same email id is already been created. Please try signIn instead',
    UserNotFound: 'Please provide valid user details',
    // UserRegisteredSuccess: 'Account created successfully',
    SecurityLoginEmail: 'Please verify security code sent to your registered email id',
    SecurityLoginContact: 'Please verify security code sent to your registered contact number',
    TransactionSuccess:'Transaction has been saved successfully',
    TransactionFailure:'Failed to save transaction',
    userNameExists:'Account with the same name already exists'
   
}

let codes = {
    FRBDN: 403,
    INTRNLSRVR: 500,
    Success: 200,
    DataNotFound: 404,
    BadRequest: 400,
    InvalidOtp:405
}

const addresses = {
    BNB :"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    WBNB : "0xae13d989dac2f0debff460ac112a837c89baa7cd",
    BUSD : "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
    USDT :'0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
    DAI :'0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867',
    ETH :"0xd66c6B4F0be8CE5b39D52E0Fd1344c389929B378",
}
    


module.exports = {
    CODE: codes,
    MESSAGE: messages,
    ADDRESSES: addresses
}