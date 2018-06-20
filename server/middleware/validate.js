import { body } from 'express-validator/check';
import { sanitizeBody } from 'express-validator/filter';

const rideOfferValidations = [
  body('from')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Ride offer origin is required'),
  body('to')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Ride offer destination is required'),
  body('seats')
    .isLength({ min: 1 })
    .withMessage('Specify number of available seats')
    .isNumeric()
    .withMessage('Available seats should be a number'),
  body('pricePerSeat')
    .isLength({ min: 1 })
    .withMessage('Price must not be empty')
    .isNumeric()
    .withMessage('Price should be a number'),

  // sanitize body
  sanitizeBody('*').escape(),
];

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
   * @readonly
   * @static
   * @memberof validate
   */
  static get rideOfferValidator() {
    return rideOfferValidations;
  }
}
