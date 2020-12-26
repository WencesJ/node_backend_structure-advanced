const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      _logger.error(err.stack)
      next(err);
    });
  };
};

module.exports = catchAsync;
