//layered 나누기 전

//routers index.js
const router = require('express').Router();

const userRouter = require('./userRouter');

router.use('/user', userRouter);

module.exports = router;


//userRouter.js
const router = require('express').Router();
const { userController } = require('../controllers');

userRouter.post('/signup', userController.signUp);
/*userRouter.post('/signin', userController.signIn);*/

module.exports = userRouter;


//controllers index.js
const userController = require('./userController');

module.exports = {
  userController
}


//userController.js
const userService = require();

const signUp = catchAsync(async (req, res) => {
  const { email, password, name, date_of_birth } = req.body;
  await userService.signUp(email, password, name, date_of_birth);
  res.status(201).json({message : "Sign up success"});
})

/* const signIn = catchAsync(async (req, res) => {
  ??
})*/

//services index.js
const userService = require('./userService');

module.exports = {
  userService
}

//userService.js
으ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ

//modles index.js
const userDao = require('./userDao.js')
module.exports = {
  userDao
}

//userDao.js 일단 query 만...ㅠㅠ
const database = require('./dataSource');

const signUp  = async (userName, password, email, date_of_birth) => {
  try {
    return await database.query (
      `INSERT INTO users(
        userName,
        password,
        email,
        date_of_birth
      ) VALUES (?, ?, ?, ?)
      `,
      [userName, password, email, date_of_birth]
    );
  } catch(err) {
    const error = new Error('INVAILD_DATA_INPUT');
    error.statusCode = 500;
    throw error;
  }
};

const getUserById = async (id) => {
  const [user] = await database.query(
    `SELECT
        username,
        password,
        email,
        date_of_birth
    FROM users
    WHERE id = ?
    `,
    [id]
  );
  return user;
};

