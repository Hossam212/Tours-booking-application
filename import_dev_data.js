const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./model/tour_schema');
const User = require('./model/user_schema');
const Review = require('./model/review_schema');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connected succesfully'));

const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours.json', 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync('./dev-data/data/users.json', 'utf-8')
);
const reviews = JSON.parse(
  fs.readFileSync('./dev-data/data/reviews.json', 'utf-8')
);

const importdata = async () => {
  try {
    await Tour.create(tours);
    await Review.create(reviews);
    await User.create(users, { validateBeforeSave: false });
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
const deletedata = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] == '--import') {
  importdata();
} else if (process.argv[2] == '--delete') {
  deletedata();
}
