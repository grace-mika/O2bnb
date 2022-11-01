//routers index.js
const router = require('express').Router();

const reviewRouter = require('./reviewRouter');

router.use('/reviews', reviewRouter);

module.exports = Router;

//reviewRouter.js
const express = require('express');

const { reviewController } = require('../controllers');

const router = express.Router();

router.get('/:productId', reviewController.getReviews);

module.exports = router;

//controllers index.js
const reviewController = require('./reviewController');

module.exports = {
  reviewController
}

//reviewController.js
const { reviewService } = require('../services');
const { catchAsync } = require('../utils/error');

const getReviews = catchAsync(async(req, res) => {
  const productId = req.params.productId;

  const reviews = await reviewService.getReviews(productId);
  res.status(200).json({ data : reviews });
});

module.exports = {
  getReviews
}

//services index.js

const reviewService = require('./reviewService');

module.exports = {
  reviewService
}

//reviewService.js
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

//review.js
const dataSource = require('./dataSource');

const getReviews = async(productId) => {
  let result = {};
  const stars = await dataSource.query(
    `SELECT
      COUNT(id) AS total,
      SUM(clean_star + communication_star + location_star) / (COUNT(id)*3) AS totalAvg,
      AVG(clean_star) as cleanAvg,
      AVG(communication_star) as communicationAvg,
      AVG(location_star) as locationAvg
    FROM product_reviews
    WHERE product_id = ${productId};
    `
  );

  const reviewsByProduct = await dataSource.query(
    `SELECT
      @rownum:=@rownum+1 as id,
      DATE_FORMAT(reviews.created_at, '%Y-%m-%d') as created_at,
      reviews.content,
      users.name,
    FROM product_reviews
    JOIN users ON product_reviews.user_id = users.id
    WHERE reviews.product_id = ${productId} AND (@rownum:=0)=0;
    `
  );
  
  result.stars = stars;
  result.reviews = reviewsByProduct;

  return result;
};

module.exports = {
  getReviews
}