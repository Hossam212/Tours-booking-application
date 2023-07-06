const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
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
const server = app.listen('3000', () => {
  console.log('Listening for requests on port 3000....');
});

process.on('unhandledRejection', (err) => {
  server.close(() => {
    process.exit(1);
  });
});
