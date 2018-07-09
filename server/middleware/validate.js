import trimmer from '../utils/trimmer';

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

    let { origin, destination, seats, date, time } = req.body;
    origin = origin && origin.toString().trim();
    if (!origin) {
      errors.origin = 'Ride offer origin is required';
    }
    if (origin && origin.length < 2) {
      errors.origin = 'Ride offer origin must be 2 characters or more';
    }
    if (origin) {
      const regex = /^([0-9]|[a-z,. ])+(\w+(\.|,)?)$/i;
      if (origin.length >= 2 && !regex.test(origin)) {
        errors.origin = 'Ride offer origin should be alphanumeric';
      }
    }
    destination = destination && destination.toString().trim();
    if (!destination) {
      errors.destination = 'Ride offer destination is required';
    }
    if (destination && destination.length < 2) {
      errors.destination =
        'Ride offer destination must be 2 characters or more';
    }
    if (destination) {
      const regex = /^([0-9]|[a-z,. ])+(\w+(\.|,)?)$/i;
      if (destination.length >= 2 && !regex.test(destination)) {
        errors.destination = 'Ride offer destination should be alphanumeric';
      }
    }
    seats = seats && seats.toString().trim();
    if (!seats) {
      errors.seats = 'Specify number of available seats';
    }
    if (seats && Number.isNaN(Number(seats))) {
      errors.seats = 'Available seats should be a number';
    }
    date = date && date.toString().trim();
    if (!date) {
      errors.date = 'specify ride offer date';
    }
    if (date) {
      const regex = /^\d{4}-(\d{2}){1}-\d{2}$/;
      if (!regex.test(date)) {
        errors.date = 'Invalid date format';
      }
    }
    time = time && time.toString().trim();
    if (!time) {
      errors.time = 'Specify take off time';
    }
    if (time) {
      const regex = /^\d{2}:\d{2}$/;
      if (!regex.test(time)) {
        errors.time = 'Invalid time format';
      }
    }

    req.validationErrors = errors;
    // trim req body
    req.body = { ...req.body, ...trimmer(req.body) };
    next();
  }

  static userSigninValidator(req, res, next) {
    const errors = {};

    let { email } = req.body;
    const { password } = req.body;
    email = email && email.toString().trim();
    if (!email) {
      errors.email = 'email is required';
    }
    if (email) {
      const emailRegex = /^\S+@{1}\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        errors.email = 'email address supplied is not valid';
      }
    }
    if (!password) {
      errors.password = 'password is required';
    }
    if (password && password.length < 6) {
      errors.password = 'password supplied is too short';
    }
    req.validationErrors = errors;
    req.body = { ...req.body, ...trimmer({ email }) };
    next();
  }

  static userSignupValidator(req, res, next) {
    const errors = {};

    let { fullName, email } = req.body;
    const { password, passwordConfirm } = req.body;
    email = email && email.toString().trim();
    if (!email) {
      errors.email = 'email is required';
    }
    if (email) {
      const emailRegex = /^\S+@{1}\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        errors.email = 'email address supplied is not valid';
      }
    }
    fullName = fullName && fullName.toString().trim();
    if (!fullName) {
      errors.fullName = 'fullName is required';
    }
    if (fullName && fullName.length < 2) {
      errors.fullName = 'fullName supplied is too short';
    }
    if (!password) {
      errors.password = 'password is required';
    }
    if (password && password.length < 6) {
      errors.password = 'password supplied is too short';
    }
    if (password !== passwordConfirm) {
      errors.passwordConfirm = 'passwords do not match';
    }
    req.validationErrors = errors;
    req.body = { ...req.body, ...trimmer({ fullName, email }) };
    next();
  }
}
