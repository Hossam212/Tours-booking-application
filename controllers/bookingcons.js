const stripe = require('stripe')(
  'sk_test_51NQgLnAMjq2DeMy9A7xS45xOW9szVuI7Szxl3rp1EiBdHkyygkLydVNsqMjYiLI50iGb75S9cJ8DzVytRqMiSMGr00ZVjYUqa3'
);
const factory = require('../controllers/factorycons');
const Tour = require('../model/tour_schema');
const booking = require('../model/bookingModel');
const catchAsync = require('../utils/catchAsync');
exports.getCheckOutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
        },
        quantity: 1,
      },
    ],
  });
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  //TEMPORARY, UNSECURE.
  const { tour, user, price } = req.query;
  if (!tour && !user && !price) return next();
  await booking.create({ tour, user, price });
  res.redirect(req.originalUrl.split('?')[0]);
});

exports.getAllBookings = factory.getAll(booking);
exports.makeBooking = factory.createOne(booking);
exports.deleteBooking = factory.deleteOne(booking);
exports.getBooking = factory.getOne(booking, { path: 'user' });
exports.updateBooking = factory.updateOne(booking);
