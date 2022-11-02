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
