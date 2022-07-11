const catchAsyncError = require('./catchAsyncErrors')
//Check if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {})
