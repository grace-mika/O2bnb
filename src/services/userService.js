const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { userDao } = require('../models');
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
  signUp,
  getUserById,
  signIn
}
