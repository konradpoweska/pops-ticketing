class HttpError extends Error {}

class BadRequestError extends HttpError {
  constructor(msg) { super(msg); }
}
BadRequestError.prototype.name = "BadRequestError";
BadRequestError.prototype.httpCode = 400;


class ForbiddenError extends HttpError {
  constructor(msg) { super(msg); }
}
ForbiddenError.prototype.name = "ForbiddenError";
ForbiddenError.prototype.httpCode = 403;


class NotFoundError extends HttpError {
  constructor(msg) { super(msg); }
}
NotFoundError.prototype.name = "NotFoundError";
NotFoundError.prototype.httpCode = 404;


class InternalServerError extends HttpError {
  constructor(msg) { super(msg); }
}
InternalServerError.prototype.name = "InternalServerError";
InternalServerError.prototype.httpCode = 500;


module.exports = {
  HttpError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
};
