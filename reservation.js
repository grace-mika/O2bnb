//routers index.js
const express = require('express');
const router = express.Router();
const bookRouter = require('./bookRouter');

router.use('/book', bookRouter);

module.exports = router;

//bookRouter.js ...보류....
const express = require('express');

const { bookController } = require('../controllers');
const { validToken } = require('../utils/auth');

const router = express.Router();

//controllers index.js
const bookController = require('./bookController');

module.exports = {
  bookController
}

//bookController.js
const { bookService } = require('../services');
const { catchAsync } = require('../utils/error');

const createReservation = catchAsync(async (req, res) => {
  const userId = req.userId;
  const productId = req.params.productId;
  const { checkIn, checkOut, price_per_day, tax_paid, amountPaid, guest } = req.body;

  if ( !checkIn || !checkOut || !price_per_day || !tax_paid || !amountPaid || !guest ) {
    const error = new Error('KEY_ERROR');
    error.statusCode = 400;
    throw error;
  };

  await bookService.createReservation(checkIn, checkOut, price_per_day, tax_paid, amountPaid, guest);

  res.status(201).json({ message : "PROCEED"});
});

const getAllReservation =catchAsync(async(req, res) => {
  const userId = req.userId;
  const bookings = await bookService.getAllBookigns(userId);

  return res.status(200).json({ data : bookings });
});

const checkReservationInfo = catchAsync(async(req, res) => {
 const userId = req.userId;
 const reservationInfo = await bookService.checkReservationInfo(userId);
 
 return res.status(200).json({ data : reservationInfo });
})

const confirmReservation = catchAsync(async(req,res) => {
  const userId = 1;
  const { amountPaid, checkIn, checkOut, guest } = req.body;

  if ( !amountPaid || !checkIn || !checkOut || !guest ) {
    const error = new Error('KEY_ERROR');
    error.statusCode = 400;
    throw error;
  };

  await bookService.confirmReservation(userId, amountPaid, checkIn, checkOut, guest);

  res.status(200).json({ message : 'CONFIRMED' });
});

const cancelReservation = catchAsync(async(req, res) => {
  const userId = req.userId;
  const productId = req.params.productId;
  const checkIn = req.body['check_in'];
  const checkOut = req.body['check_out'];

  if ( !productId || !checkIn || !checkOut ) {
    const error = new Error('KEY_ERROR');
    error.statusCode = 400;
    throw error;
  }

  await bookService.cancelReservation(userId, productId, checkIn, checkOut);

  res.status(200).json({ message : 'CANCELED' });
})

const completeReservation = catchAsync(async(req,res) => {
  const userId = req.userId;
  const takeReservations = await bookService.finalReservation(userId);

  return res.status(200).json({ data :  takeReservations });
})

module.exports = {
  createReservation,
  getAllReservation,
  cancelReservation,
  confirmReservation,
  cancelReservation,
  completeReservation
}

// services index.js

const bookService = require('./bookService');

module.exports = {
  bookService
}

//bookService.js

const { bookDao } = require('../models');

const createReservation = async(userId, productId, checkIn, checkOut, amountPaid, guest) => {
  return await bookDao.createReservation(userId, productId, checkIn, checkOut, amountPaid, guest);
};

const getAllReservation = async(userId) => {
  return await bookDao.getAllReservation(userId);
};

const checkReservationInfo = async(userId) => {
  return await bookDao.cancelReservation(userId);
}

const confirmReservation = async(userId, checkIn, checkOut, amountPaid, guest) => {
  const checkAvailableDate = await bookDao.checkAvailableDate(checkIn, checkOut);
  const checkValidReservation = await bookDao.checkAvailableDate(amountPaid, guest, checkIn, checkOut);

  if (checkAvailableDate === "1" || checkAvailableDate === "0") {
    const error = new Error('NOT AVAILABLE!')
    error.statusCode = 404;
    throw error;
  }

  return await bookDao.confirmReservation(userId, amountPaid, guest, checkIn, checkOut);
};

const cancelReservation = async(userId, productId, checkIn, checkOut) => {
  const reservationList = await bookDao.checkReservationList (userId, productId, checkIn, checkOut);

  if(reservationList === "0") {
    const error = new Error('INVALID')
    error.statusCode = 404;
    throw error;
  }

  return await bookDao.cancelReservation(userId, productId, checkIn, checkOut);
};

const completeReservation = async(userId) => {
  return await bookDao.completeReservation(userId);
};

module.exports = {
  createReservation,
  getAllReservation,
  checkReservationInfo,
  confirmReservation,
  cancelReservation,
  completeReservation
}

//models index.js

const bookDao = require('./bookDao');

module.exports = {
  bookDao
}

//bookDao.js
const dataSource = require('./datasource');

const createReservation = async(userId, productId, amountPaid, guest, checkIn, checkOut) => {
  const result = await dataSource.query(
    `INSERT INTO bookings(
      user_id,
      product_id,
      check_in,
      check_out,
      price_per_day,
      tax_paid,
      amount_paid,
      guest
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [userId, productId, checkInm checkOut, pricePerDay, taxPaid, amountPaid, guest]
  );

  return result;
};

const getAllReservation = async(userId) => {
  return await dataSource.query(
    `SELECT
    products.name as product_name,
    users.name as host_id,
    bookings.check_in,
    bookings.check_out,
    products.address,
    (SELECT product_image_url FROM product_images JOIN products ON product_images.product_id = products.id LIMIT 1) as img
    FROM products
    JOIN hosts ON hosts.id = products.host_id
    JOIN users ON users.id = hosts.user_id
    JOIN bookings ON bookings.product_id = products.id
    WHERE bookings.user_id = ?
    AND bookings.bokking_status_id = 1
    `, [userId]
  );
};

const checkReservationInfo = async(userId) => {
  return await dataSource.query(
    `SELECT
      bookings.price as amount_paid,
      bookings.guest,
      bookings.check_in,
      bookings.check_out,
      (bookings.check_in - bookings.check_out) as nights,
      (SELECT product_images.image_url FROM product_images JOIN products ON product_images.product_id = products.id LIMIT 1) as img,
      products.name,
      products.description,
      products.price
    FROM bookings
    JOIN products ON products.id = bookings.product_id
    WHERE bookings.user_id = ?
    AND bookings.booking_status_id = 3
    ORDER BY bookings.created_at DESC
    LIMIT 1
    `, [userId]
  )
}

const checkAvailableDate = async(checkIn, checkOut) => {
  const result = await dataSource.query(
  `SELECT EXISTS (
    SELECT *
    FROM bookings
    WHERE
      (? BETWEEN check_in and DATE_SUB(check_out, INTERVAL 1 DAY)
      OR ? BETWEEN DATE_ADD(check_in, INTERVAL 1 DAY) and check_out)
      AND booking_status_id = 1
      ORDER BY bookings.created_at DESC
      LIMIT 1
  ) AS trueORfalse
    `, [checkIn, checkOut]
  )

  return result[0].trueORfalse;
};

const checkValidReservation = async(price, guest, checkIn, checkOut) => {
  const result = await dataSource.query(
  `SELECT EXISTS (
    SELECT *
    FROM bookings
    WHERE price = ?
      AND guest = ?
      AND check_in = ?
      AND check_out = ?
      AND booking_status_id = 3
  ) AS trueORfalse
    `, [price, guest, checkIn, checkOut]
  )

  return result[0].trueORfalse;
};

const confirmReservation = async(userId, price, guest, checkIn, checkOut) => {
  return await dataSource.query(
    `UPDATE bookings
    SET booking_status_id = 1
    WHERE user_id = ?
      AND price = ?
      AND guest = ?
      AND check_in = ?
      AND check_out = ?
      AND booking_status_id = 3
    `, [userId, price, guest, checkIn, checkOut]
  );
};

const checkReservationList = async(userId, productId, checkIn, checkOut) => {
  const result = await dataSource.query(
    `SELECT EXISTS (
      SELECT *
      FROM bookings
      WHERE user_id = ?
        AND product_id = ?
        AND check_in = ?
        AND check_out = ?
        AND booking_status_id = 1
      ) AS trueORfalse
      `, [userId, productId, checkIn, checkOut]
  );

  return result[0].trueORfalse;
};


const completeReservation = async(userId) => {
  return await dataSource.query(
    `SELECT
      amount_paid,
      guest,
      check_in,
      check_out
    FROM bookings
    WHERE user_id = ?
    AND booking_status_id = 1
    ORDER BY bookings.created_at DESC
    LIMIT 1
    `, [userId]
  );
};    

module.exports = {
  createReservation,
  getAllReservation,
  checkReservationInfo,
  checkAvailableDate,
  checkValidReservation,
  checkReservationList,
  confirmReservation,
  cancelReservation,
  completeReservation
}