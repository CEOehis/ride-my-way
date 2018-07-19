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
      .query('SELECT rides."rideId", rides."origin", rides."destination", rides."departureDate", rides."departureTime", rides."seats", users."fullName" as "rideCreator", rides."createdAt", rides."updatedAt"  FROM rides INNER JOIN users on (rides."userId" = users."userId");')
      .then((result) => {
        return res.status(200).json({
          status: 'success',
          rides: result.rows,
        });
      })
      .catch(() => {
        return res.status(500).json({
          status: 'error',
          message: 'unable to fetch rides',
        });
      });
  }

  /**
   * Get users ride offers
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {json} json object with status and response data
   * @memberof Ride
   */
  static getUsersRideOffers(req, res) {
    const { userId } = req;
    pool
      .query('SELECT rides."rideId", rides."origin", rides."destination", rides."departureDate", rides."departureTime", rides."seats", users."fullName" as "rideCreator", rides."createdAt", rides."updatedAt"  FROM rides INNER JOIN users on (rides."userId" = users."userId") WHERE rides."userId" = $1;', [userId])
      .then((result) => {
        return res.status(200).json({
          status: 'success',
          rides: result.rows,
        });
      })
      .catch(() => {
        return res.status(500).json({
          status: 'error',
          message: 'unable to fetch users rides',
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
      .query('SELECT rides."rideId", rides."origin", rides."destination", rides."departureDate", rides."departureTime", rides."seats", users."fullName" as "rideCreator", users."phone", users."email", rides."createdAt", rides."updatedAt"  FROM rides INNER JOIN users on (rides."userId" = users."userId") WHERE rides."rideId" = $1', [rideId])
      .then((result) => {
        if (result.rowCount !== 0) {
          return res.status(200).json({
            status: 'success',
            ride: result.rows[0],
          });
        }
        return res.status(404).json({
          status: 'error',
          message: 'requested ride offer was not found',
        });
      })
      .catch(() => {
        return res.status(500).json({
          status: 'error',
          message: 'unable to fetch requested ride offer',
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
  /* eslint-disable-next-line */
  static createRideOffer(req, res) {
    // check for validation errors
    const errors = req.validationErrors;
    if (!isEmpty(errors)) {
      return res.status(400).json({ errors });
    }
    // get data from request body
    const { origin, destination, seats, date, time } = req.body;
    const { userId } = req;
    pool
      .query(
        'INSERT INTO rides ("origin", "destination", "departureDate", "departureTime", "seats", "userId") values ($1, $2, $3, $4, $5, $6)',
        [origin, destination, date, time, seats, userId],
      )
      .then(() => {
        return pool
          .query('SELECT "origin", "destination", "departureDate", "departureTime", "seats", "userId", "createdAt", "updatedAt" FROM rides ORDER BY "rideId" DESC LIMIT 1')
          .then((result) => {
            return res.status(201).json({
              status: 'success',
              ride: result.rows[0],
            });
          })
          .catch(() => {
            return res.status(500).json({
              status: 'error',
              message: 'unable to complete request',
            });
          });
      })
      .catch((error) => {
        // eslint-disable-next-line
        if (error.code == 23505) {
          // postgres unique violation error means this is a duplicate entry
          return res.status(409).json({
            status: 'error',
            message: 'you have already created this ride offer',
          });
        }
        return res.status(500).json({
          status: 'error',
          message: 'unable to create ride offer',
        });
      });
  }
}
