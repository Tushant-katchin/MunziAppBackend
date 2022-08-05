

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
    SecurityLoginContact: 'Please verify security code sent to your registered contact number'
   
}

let codes = {
    FRBDN: 403,
    INTRNLSRVR: 500,
    Success: 200,
    DataNotFound: 404,
    BadRequest: 400,
}

module.exports = {
    CODE: codes,
    MESSAGE: messages
}