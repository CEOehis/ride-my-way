import isEmpty from 'lodash/isEmpty';
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
      .catch(() => {
        return res.status(500).json({
          status: 'error',
          message: 'Unable to fetch rides',
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
      .catch(() => {
        return res.status(500).json({
          status: 'error',
          message: 'Unable to fetch requested resource',
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
  /* eslint-disable-next-line consistent-return */
  static createRideOffer(req, res) {
    // check for validation errors
    const errors = req.body.validationErrors;
    if (!isEmpty(errors)) {
      return res.status(400).json({ errors });
    }
    // get data from request body
    const { origin, destination, seats, date, time } = req.body;
    const { userId } = req;
    pool
      .query(
        'INSERT INTO rides (origin, destination, date, time, seats, userid) values ($1, $2, $3, $4, $5, $6)',
        [origin, destination, date, time, seats, userId],
      )
      .then(() => {
        return pool
          .query('SELECT * FROM rides ORDER BY id DESC LIMIT 1')
          .then((result) => {
            return res.status(201).json({
              status: 'success',
              ride: result.rows[0],
            });
          })
          .catch(() => {
            return res.status(500).json({
              status: 'error',
              message: 'Unable to complete request',
            });
          });
      })
      .catch(() => {
        return res.status(500).json({
          status: 'error',
          message: 'Unable to create ride offer',
        });
      });
  }
}
