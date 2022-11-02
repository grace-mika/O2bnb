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
