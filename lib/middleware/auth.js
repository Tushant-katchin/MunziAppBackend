const jwt = require("jsonwebtoken");
const config = process.env.JWTSECRET;

const verifyToken = (Token) => {
  const token = Token
    console.log(token)
  if (!token) {
   console.log('no token')
  }
  try {
    const decoded = jwt.verify(token, config);
    
    return {decoded:decoded}
  } catch (err) {
    console.log(error)
  }
  
};

module.exports =  {
  verifyToken
}