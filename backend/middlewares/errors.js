const ErrorHandler = require('../utils/errorHandler')

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500 //500=> Internal server error

  if (process.env.NODE_ENV.trim() === 'DEVELOPMENT') {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    })
  }

  if (process.env.NODE_ENV.trim() === 'PRODUCTION') {
    let error = { ...err }

    error.message = err.message

    //Wrong mongoose object id error
    if (err.name === 'CastError') {
      const message = `Resouce not found. Invalid:${err.path}`
      error = new ErrorHandler(message, 400)
    }

    //Handle validation error
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map((value) => value.message)
      error = new ErrorHandler(message, 400)
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message || 'Inernal server error',
    })
  }
}
