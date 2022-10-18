require("dotenv").config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/ping', function (req, res, next) {
  res.json({ message : 'pong freeeedom!!!!!!!!!' });
});

app.listen(3000, () => {
  console.log(`Listening to request on 127.0.0.1:3000`);
});
