import isEmpty from 'lodash/isEmpty';
import { RideOffers } from '../dataStore/RideOffers';
import pool from '../models/db';

/**
 * controller class to handle REST routes
 *
 * @export
 * @class Ride
 */
export default class Ride {
  /**
   * Get all ride offers
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {json} json object with status and response data
   * @memberof Ride
   */
  static getAllRideOffers(req, res) {
    pool
      .query('SELECT * FROM rides')
      .then((result) => {
        return res.status(200).json({
          status: 'success',
          rides: result.rows,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          status: 'error',
          message: error,
        });
      });
  }

  /**
   * Get single ride offer
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {json} json object with status and ride response
   * @memberof Ride
   */
  static getRideOffer(req, res) {
    // get rideid from request object
    const rideId = parseInt(req.params.id, 10);
    // check within datastore if ride offer with rideid exists
    pool
      .query('SELECT * FROM rides WHERE id=$1', [rideId])
      .then((result) => {
        if (result.rowCount) {
          return res.status(200).json({
            status: 'success',
            ride: result.rows[0],
          });
        }
        return res.status(404).json({
          status: 'error',
          message: 'resource not found',
        });
      })
      .catch((error) => {
        return res.status(500).json({
          status: 'error',
          message: error,
        });
      });
  }

  /**
   * Create new ride offer
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {json} json object with status and ride response
   * @memberof Ride
   */
  static createRideOffer(req, res) {
    // check for validation errors
    const errors = req.body.validationErrors;
    if (!isEmpty(errors)) {
      return res.status(400).json({ errors });
    }
    // get data from request body
    const { from, to, seats, userId, pricePerSeat } = req.body;
    RideOffers.push({
      id: RideOffers.length + 1,
      from,
      to,
      seats,
      userId,
      pricePerSeat,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return res.status(201).json({
      status: 'success',
      ride: RideOffers[RideOffers.length - 1],
    });
  }
}
