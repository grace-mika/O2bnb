const router = require('express').Router();

const productRouter = require('./productRouter'); 
const userRouter = require('./userRouter');
const reviewRouter = require('./reviewRouter');
const bookRouter = require('./bookRouter');

router.use('/products', productRouter);
router.use('/user', userRouter);
router.use('/reviews', reviewRouter);
router.use('/book', bookRouter);

module.exports = router;