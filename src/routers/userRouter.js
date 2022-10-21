const userRouter = require('express').Router();
const { userController } = require('../controllers');

userRouter.post('/signup', userController.signUp);

module.exports = userRouter;
