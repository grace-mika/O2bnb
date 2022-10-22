const bcrypt = require('bcrypt');
const { userDao } = require('../models');

const validator = require('../utils/validator')

const hashPassword = async (password) => {
  const saltRound = 10;
  const salt = await bcrypt.genSalt(saltRound);

  return await bcrypt.hash(password, salt)
}

const signUp = async( userName, password, email, date_of_bith ) => {
    validator.validateEmail(email);
    validator.validatePassword(password);

    const checkOverlap = await userDao.getUserByEmail(email)

    if (checkOverlap) {
        const error = new Error('INVALID_USER')
        error.statusCode = 401;
        throw error;
    }

    const hashedPassword = await hashPassword(password);

    return await userDao.createUser( userName, password, email, date_of_bith )
}


module.exports = {
  signUp
}