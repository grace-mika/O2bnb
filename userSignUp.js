//routers index.js
const express = require('express');

const userRouter = require('./userRouter');

const router = express.Router();

module.exports = router;

//userRouter.js
const express = require('express');
const { userController } = require('../controllers');

userRouter = express.Router();

userRouter.post('/signup', userController.signUp);

module.exports = userRouter;

// controllers index.js
const userController = require('./userController');

module.exports = {
  userController
}

//userController.js
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
})

module.exports = {
  signUp
}

//services index.js
const userService = require('./userService');

module.exports = { 
  userService
}

//userService.js
const signUp = async(name, email, password, date_of_birth) => {
  validator.validateEmail(email);
  validator.validatePassword(password);

  const checkOverlap = await userDao.getUserByEmail(email)

  if (checkOverlap) {
    const error = new Error('INVALID_USER')
    error.statusCode = 401;
    throw error;
  }

  const hashedPassword = await hashedPassword(password);

  return await userDao.createUser(name, email, hashedPassword, date_of_birth)
}

module.exports = {
  signUp
}

//model index.js
const userDao = require('./userDao');
const { DataSource } = require('typeorm');

module.exports = {
  userDao
}

//userDao.js
const createUser = async(name, email, hashedPassword, date_of_birth) => {
  const result = await dataSource.query(
    `INSERT INTO users(
      name,
      email,
      password,
      date_of_birth
    ) VALUES(?, ?, ?, ?)
    `, [ name, email, hashedPassword, dateOfBirth ]
  );
  return result;
};

module.exports = {
  createUser
}