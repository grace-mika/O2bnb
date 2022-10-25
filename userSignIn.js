//routers index.js
const express = require('express');

const userRouter = require('./userRouter');

const router = express.Router();

router.use('/users', userRouter);

module.exports = router;

//userRouter.js
const express =require('express');
const { userController } = require('../controllers');

const userRouter = express.Router();

userRouter.post('/signin', userController.signIn);

module.exports = userRouter;

//controllers index.js
const userController = require('./userController');

module.exports = {
  userController
}

//userController.js
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

//services index.js
const userService = require('./userService');

module.exports = {
  userService
}

//userService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { userDao } = require('../models');

const signIn = async (email, password) => {
  
  const user = await userDao.getUserByEmail(email)

    if(!user) {
      const error = new Error('WRONG_EMAIL')
    error.statusCode = 200
    throw error
    }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    const error = new Error('WRONG_PASSWORD')
    error.statusCode = 200
    throw error
  }

  const accessToken = jwt.sign({ user_id : user.id }, process.env.KEY)

  return accessToken

}

module.exports = {
  signIn
}

//model index.js
const userDao = require('./userDao');
const { DataSource } = require('typeorm');

module.exports = {
  userDao
}

//userDao.js

const checkUser = async (email) => {
  
  const [result] = await DataSource.query(
    `SELECT EXISTS (
      SELECT *
      FROM users
      WHERE email = ?) AS boolean`,
      [email]
  )
  console.log(result.boolean)
  return result;
}

const getUserByEmail = async(email) => {
const [user] = await dataSource.query (
    `SELECT
      id,
      name,
      email,
      password
    FROM users
    WHERE email = ? ` , [email]
  )
}
