const fs = require('fs');
const User = require('../model/user_schema');
const sharp = require('sharp');
const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/newAppError');
const factory = require('../controllers/factorycons');
let allusers = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);
const filterObj = (body, ...fieldstofilter) => {
  const filteredObj = {};
  Object.keys(body).forEach((el) => {
    if (fieldstofilter.includes(el)) filteredObj[el] = body[el];
  });
  return filteredObj;
};
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new appError('Please upload only images.', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadUserPhoto = upload.single('photo');
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new appError(
        'You are not allowed to update your password on this route.',
        401
      )
    );
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    state: 'success',
    updatedUser: user,
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'succeed',
    data: null,
  });
});
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
//CRUD operations
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
//DON'T update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
