const { userService } = require('../services');
const { asyncWrap } = require('../utils/error');

const signIn = asyncWrap(async (req,res) => {
  const { email,password } = req.body;

  if( !email || !password ) {
    const error = new Error('KEY_ERROR');
    error.statusCode = 400;
    throw error;
  }

  const accessToken = await userService.signIn(email, password);

  res.status(201).json({ accessToken:accessToken });
})

module.exports = {
  signIn
}