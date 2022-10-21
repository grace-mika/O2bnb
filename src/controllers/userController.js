const { userService } = require('../services');

const signUp = catchAsync(async (req, res) => {
  const { userName, password, email, date_of_birth } = req.body;
  
    await userService.signUp( userName,password,email, date_of_birth);

    res.status(201).json({ message : "signUp success!" });
})