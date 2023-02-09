const jwt = require("jsonwebtoken");
const config = process.env.JWTSECRET;

const verifyToken = (Token) => {
  const token = Token
    console.log(token)
  try {
    const decoded = jwt.verify(token, config);
    console.log(decoded)
    
    return {decoded:decoded}
  } catch (err) {
    console.log(err)
    return{err:err}
  }
  
};

module.exports =  {
  verifyToken
}