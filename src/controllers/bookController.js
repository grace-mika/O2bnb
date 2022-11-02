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
