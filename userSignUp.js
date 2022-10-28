//routers index.js
const express = require('express');

const userRouter = require('./userRouter');

const router = express.Router();

router.use('./users', userRouter);

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
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { userDao } = require("../models");
const validator = require('../utils/validator');

const hashedPassword = async(password) => {
  const saltRoung = 10;
  const salt = await bcrypt.genSalt(saltRound);

  return await bcrypt.hash(password, salt)
}

const getUserById = async(id) => {
  const result = await userDao.getUserById(id)

  return result;
}

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
  signUp,
  getUserById
}

//model index.js
const userDao = require('./userDao');
const { DataSource } = require('typeorm');

module.exports = {
  userDao
}

//userDao.js
const { dataSource } = require('./data-source');

const getUserByEmail = async(email) => {
  const [ result ] = await dataSource.query (
    `SELECT
      id,
      name,
      email,
      password,
      date_of_birth
    FROM users
    WHERE email = ?
    `, [email]
  );

  return result;
}

const getUserById =async(id) => {
  const [ result ] = await dataSource.query(
    `SELECT
      id,
      name,
      email,
      password,
      date_of_brith
    FROM users
    WHERE id = ?
    `, [ id ]
  );

  return result;
} ;

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
  getUserByEmail,
  getUserById,
  createUser
}