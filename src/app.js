require("dotenv").config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/ping', function (req, res, next) {
  res.json({ message : 'pong freeeedom!!!!!!!!!' });
});

app.listen(3000, () => { console.log(`Running on port ${PORT}`)});