const { userService } = require('../services');
const { asyncWrap } = require('../utils/error');

const signUp = asyncWrap(async (req, res) => {
  const { name, email, password, date_of_birth } = req.body;

  if ( !name || !email || !password || !date_of_birth ) {
      const error = new Error('KEY_ERROR');
      error.statusCode = 400;
      throw error;
  }

  await userService.signUp(name, email, password, date_of_birth);

  res.status(201).json({ message:'User created successfully!' })
});

const signIn = asyncWrap(async (req,res) => {
  const { email,password } = req.body;

  if( !email || !password ) {
    const error = new Error('KEY_ERROR');
    error.statusCode = 400;
    throw error;
  }

  const accessToken = await userService.signIn(email, password);

  res.status(201).json({ accessToken:accessToken });
});

module.exports = {
  signUp,
  signIn
}