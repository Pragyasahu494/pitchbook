import mongoose from 'mongoose';

function isMongooseError(err) {
  return (
    err instanceof mongoose.Error.ValidationError ||
    err instanceof mongoose.Error.CastError ||
    err.code === 11000
  );
}

export function notFound(req, res, next) {
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, _next) {
  let status = err.status || 500;
  let message = err.message || 'Internal server error';
  let details = undefined;

  if (err.name === 'CastError' || err.message?.includes('ObjectId')) {
    status = 400;
    message = 'Invalid resource identifier';
  } else if (err.code === 11000) {
    status = 409;
    message = 'A resource with that value already exists';
    details = err.keyValue;
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation failed';
    details = Object.fromEntries(
      Object.entries(err.errors || {}).map(([k, v]) => [k, v.message])
    );
  } else if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid authentication token';
  }

  if (status >= 500) {
    console.error('[error]', err.stack || err.message || err);
  }

  res.status(status).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(process.env.NODE_ENV !== 'production' && status >= 500 ? { stack: err.stack } : {}),
  });
}

export { isMongooseError };
