//routers index.js
const router = require('express').Router();
const productRouter = require('./productRouter.js');

router.use('./products', productRouter);

module.exports = router;


//productRouter.js
const router = require('express').Router;
const { productsController } = require('../controllers');

router.get('/', productsController.getAllProducts);
router.get('/productslist/:productId',productController.getProuct);

module.exports = router;


//controllers index.js
const productsController =require('./productsController');

module.exports = {
  productsController
}


//productsController.js
const { productsService } = require('../services');

const getAllProducts = catchAsync(async (req, res) => {

  const products =await productsService.getAllProducts();

  return res.status(200).json({ data : products });
})

const getProduct = catchAsync(async (req,res) => {
  
  const productId = req.params.productId;

  const products = await productsService.getProduct(productId)

  res.status(200).json({ products })
})

module.exports = {
  getAllProducts,
  getProduct
}


//services index.js
const productsService = require('./productService')

module.exports = {
  productsService
}


//productServer.js.....다시..!
const { productDao } = require('../models');

const getProduct = async (productsId) => {
  return await productDao.getProduct(productsId);
}

const getAllProduct = async () => {
  return await productDao.getAllProduct();
}

module.exports = {
  getProduct,
  getAllProduct
}


//models index.js 
const productDao = require('./productDao.js');

module.exports = {
  productDao
}


//productDao.js
const dateSource = require('./dataSource')

const getProduct = async(productId) => {
  const result = await appDataSource.query(
    `
    SELRCT
      p.id,
      p.name,
      p.price,
      p.address
      p.created_at,
      p.updated_at
      AVG(r.cleanliness_star+r.communication_star+r.location_star)/3 AS reviewStar
    FROM products as p
    JOIN product_images pi ON pi.product_id = p.id
    WHERE p.id =?`, [productId]
  )
}


