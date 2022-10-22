const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userService = require('../services/userService');

const signIn = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const accessToken = await userService.signIn(email, password)

  res.status(200).json( { accessToken })
});

module.exports = {
  signUp,
  signIn
}