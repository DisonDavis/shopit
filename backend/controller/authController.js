const User = require('../models/user')

const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncErrors')
const sendToken = require('../utils/jwtToken')

//Register  a user => /api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: 'avatars/unr_sample_161118_2054_ynlrg',
      url: 'https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png',
    },
  })

  sendToken(user, 200, res)
})

//Login User => /api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body
  //Check if email and password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler('Please enter email & password', 400))
  }

  //Finding user in database
  const user = await await User.findOne({ email }).select('+password')

  if (!user) {
    return next(new ErrorHandler('Invalid Email or Password'), 401)
  }

  //Check if password is correct or not
  const isPasswordMatched = await user.comparePassword(password)
  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid Email or Password'), 401)
  }

  const token = user.getJwtToken()

  sendToken(user, 200, res)
})
