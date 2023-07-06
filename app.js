const path = require('path');
const express = require('express');
const ratelimiter = require('express-rate-limit');
const helmet = require('helmet');
const sanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const appError = require('./utils/newAppError');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const errorHandling = require('./controllers/errorcons');
const reviewsRouter = require('./routes/reviews');
const toursRouter = require('./routes/toursRouters/tours');
const usersRouter = require('./routes/usersRouters/users');
const app = express();

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [
        "'self'",
        'https://*.mapbox.com',
        'https://checkout.stripe.com',
      ],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", 'data:'],
    },
  })
);
app.set('view engine', 'pug');
app.set('views', path.join('views'));
app.use(express.static(path.join(__dirname, 'public')));
const limiter = ratelimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests. Please try again in an hour.',
});
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(sanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
app.use('/api/', limiter);
//ROUTES
app.use('/', viewRouter);
//API ROUTES
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/bookings', bookingRouter);
app.all('*', (req, res, next) => {
  next(
    new appError(`no page for ${req.originalUrl} URL found on the server!`, 404)
  );
});

app.use(errorHandling);
module.exports = app;
