const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  // we extend Error to customAPIError and to bad-request error and unauthenticated error so now we can remove this line of code as we create object ans still functionality will work
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }
  //this is default error we begin with
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  let customError = {
    //set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "something went wrong try again later",
  };
  if (err.code && err.code === 11000) {
    //here customError is object so we look for its key
    //this error is mongoose duplicate error
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field please choose a another value`;
    customError.statusCode = 400;
  }
  if (err.name === "ValidationError") {
    // this error is mongoose validation error when name is required but we don't provide name && object.values give array of values of object just clg(object.values(err.errors))
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }
  if (err.name === "CastError") {
    //this error when single job find id is not matching like id is 234 and we write 2345 not like 233
    customError.msg = `No items found with id ${err.value}`;
    customError.statusCode = 404;
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
