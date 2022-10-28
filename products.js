//routers index.js
const router = require('express').Router();

const productRouter = require('./productRouter');

router.use('/product',productRouter);

module.exports = router;

//productRouter.js
const productRouter = require('express').Router();
const { productController } = require("../controllers");
const ( checkUserId ) = require('../utils/auth');

productRouter.get('',productController.getProducts);
productRouter.get('/:productId', checkUserId, productController.getDetail);

module.exports = productRouter;

//controllers index.js
const productController = require('./productController');

module.exports = {
  productController
}

//productController.js
const { productService } = require('../services');
const { catchAsync } = require('../utils/error');

const getProducts = catchAsync(async (req,res) => {
  
  const userId = req.userId;

  const category = req.params.category;

  const products = await productService.getProducts(userId, category);

  return res.status(200).json({ message : products })
});

const getProductDetail = catchAsync(async (req,res) => {
   
  const userId = req.userId;

  const productId = req.params.productId;

  const productInfo = await productService.getProductDetail(userId, productId);

  return res.status(200).json({ message : productInfo });
})

//service index.js
const productService = require('./userService');

module.exports = {
  productService
}

// productService.js 

const { productDao } = require('../models');

const getProducts = async(userId, category) => {
  
  const productId = await productDao.getProducts(userId, category);

  return productInfo
}

onst getProductDetail = async (userId, productId) => {

  const product = await productDao.getProductDetail(userId, productId);
  product.option = await productDao.getProductOption(productId);
  product.notAvailableDate = await productDao.getAvailableDate(productId);
  product.hostInfo = await productDao.getHostInfo(productId);

  return product;
}

module.exports = {
  getProducts,
  getProductDetail
}

//error index.js

const productDao = require('./productDao.js');

module.exports = {
  productDao
}

//productDao.js 고민...