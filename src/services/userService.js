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
