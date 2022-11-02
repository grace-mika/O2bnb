const express =require('express');
const { userController } = require('../controllers');

const userRouter = express.Router();

userRouter.post('/signin', userController.signIn);

module.exports = userRouter;