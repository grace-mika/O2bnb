const { reviewDao } = require('../models');

const getReviews = async(productId) => {
  return await reviewDao.getReviews(productId);
};

module.exports = {
  getReviews
}

//models index.js

const reviewDao = require('./reviewDao');

module.exports = {
  reviewDao
}