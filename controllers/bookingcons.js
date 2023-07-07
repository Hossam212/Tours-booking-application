const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const factory = require('../controllers/factorycons');
const Tour = require('../model/tour_schema');
const User = require('../model/user_schema');
const booking = require('../model/bookingModel');
const catchAsync = require('../utils/catchAsync');
exports.getCheckOutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/my-tours/?alert=booking`,
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
            images: [
              `./public/img/tours/${
                tour.imageCover
              }`,
            ],
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

const createBookingCheckout = async session => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.amount_total / 100;
  await booking.create({ tour, user, price });
};
exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      'whsec_hPeZa7Tg16FXIPHRQFt3azVnQn7VfA0G'
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }
 if (event.type == 'checkout.session.completed')
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};
exports.getAllBookings = factory.getAll(booking);
exports.makeBooking = factory.createOne(booking);
exports.deleteBooking = factory.deleteOne(booking);
exports.getBooking = factory.getOne(booking, { path: 'user' });
exports.updateBooking = factory.updateOne(booking);
