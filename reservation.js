//routers index.js
const express = require('express');
const router = express.Router();
const bookRouter = require('./bookRouter');

router.use('/book', bookRouter);

module.exports = router;

//bookRouter.js
const express = require('express');

const { }