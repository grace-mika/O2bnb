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