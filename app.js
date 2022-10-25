require("dotenv").config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/ping', function(req, res, next) {
  res.json({message : 'pong'})
})

app.listen(PORT, () => {console.log(`Listening to request on 127.0.0.1:${PORT}`);});