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
