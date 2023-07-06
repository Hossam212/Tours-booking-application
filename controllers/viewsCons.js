const Tour = require('../model/tour_schema');
const User = require('../model/user_schema');
const appError = require('../utils/newAppError');
const catchAsync = require('../utils/catchAsync');
const booking = require('../model/bookingModel');
exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.tourName }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new appError('There is no tour with that name.', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getMe = (req, res, next) => {
  res.status(200).render('useraccount', {
    title: `My Account`,
    user: req.user,
  });
};

exports.getLoginForm = catchAsync(async (req, res, next) => {
  if (res.locals.user) return next(new appError('You are already logged in!'));
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await booking.find({ user: req.user.id });
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});
