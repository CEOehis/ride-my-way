/**
 * validates rest routes inputs
 *
 * @export
 * @class validate
 */
export default class validate {
  /**
   * validate input data for ride offer. Returns an array of middleware validators
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next express next middleware
   * @memberof validate
   */
  static rideOfferValidator(req, res, next) {
    const errors = {};

    let { from, to, seats, pricePerSeat } = req.body;
    from = from && from.toString().trim();
    if (!from) {
      errors.from = 'Ride offer origin is required';
    }
    if (from && from.length < 2) {
      errors.from = 'Ride offer origin must be 2 characters or more';
    }
    if (from) {
      const regex = /^([0-9]|[a-z ])+(\w+)$/i;
      if (!regex.test(from)) {
        errors.from = 'Ride offer origin should be alphanumeric';
      }
    }
    to = to && to.toString().trim();
    if (!to) {
      errors.to = 'Ride offer destination is required';
    }
    if (to && to.length < 2) {
      errors.to = 'Ride offer destination must be 2 characters or more';
    }
    if (to) {
      const regex = /^([0-9]|[a-z ])+(\w+)$/i;
      if (!regex.test(to)) {
        errors.to = 'Ride offer destination should be alphanumeric';
      }
    }
    seats = seats && seats.toString().trim();
    if (!seats) {
      errors.seats = 'Specify number of available seats';
    }
    if (seats && Number.isNaN(parseInt(seats, 10))) {
      errors.seats = 'Available seats should be a number';
    }
    pricePerSeat = pricePerSeat && pricePerSeat.toString().trim();
    if (!pricePerSeat) {
      errors.pricePerSeat = 'Price must not be empty';
    }
    if (pricePerSeat && Number.isNaN(parseInt(pricePerSeat, 10))) {
      errors.pricePerSeat = 'Price should be a number';
    }

    req.body.validationErrors = errors;
    next();
  }

  static rideRequestValidator(req, res, next) {
    const errors = {};

    const { userId } = req.body;

    if (!userId) {
      errors.userId = 'User id cannot be empty';
    }

    if (userId) {
      const regex = /^[a-z0-9]+$/i;
      if (regex.test(userId)) {
        errors.userId = 'userId should be a number';
      }
    }

    if (userId && Number.isNaN(parseInt(userId, 10))) {
      errors.userId = 'userId should be a number';
    }

    req.body.validationErrors = errors;
    next();
  }
}
