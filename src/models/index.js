const dataSource = require('./dataSource');
const userDao = require('./userDao.js')
const productDao = require('./productDao.js')
const reviewDao = require('./reviewDao');
const bookDao = require('./bookDao')

module.exports = {
  userDao,
  productDao,
  dataSource,
  reviewDao,
  bookDao
}