const jwt = require('jsonwebtoken');

const { userService } = require('../services');

const signUp = catchAsync(async (req, res) => {
  const { userName, password, email, date_of_birth } = req.body;
  
    await userService.signUp( userName,password,email, date_of_birth);

    res.status(201).json({ message : "signUp success!" });
});

const signIn = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const accessToken = awiait userService.signIn(email, password)

  res.status(200).json( { accessToken })
});

module.exports = {
  signUp,
  signIn
}