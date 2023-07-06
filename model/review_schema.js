const mongoose = require('mongoose');
const Tour = require('./tour_schema');
const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "A review can't be empty"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belong to a tour'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = this.aggregate([
    {
      $match: {
        tour: tourId,
      },
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0)
    await Tour.findByIdAndUpdate(
      tourId,
      { ratingsQuantity: stats[0].nRating },
      { ratingsAverage: stats[1].avgRating }
    );
  else {
    await Tour.findByIdAndUpdate(
      tourId,
      { ratingsQuantity: 0 },
      { ratingsAverage: 4.5 }
    );
  }
};
reviewSchema.index({ user: 1, tour: 1 }, { unique: true });
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.doc = await this.findOne();
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  await this.doc.constructor.calAverageRatings(this.doc.tour);
});
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  this.populate({
    path: 'tour',
  });
  next();
});
module.exports = mongoose.model('review', reviewSchema);
