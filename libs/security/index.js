const jwt = require('jsonwebtoken');
//el representa 1000 milisegundos
const expiresIn = parseInt(process.env.JWT_AGE_SECONDS) * 1000;
module.exports = { 
  jwtSign : async (payload)=>jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {expiresIn}
  ),
  jwtVerify: async (token)=>jwt.verify(token, process.env.JWT_SECRET)
}