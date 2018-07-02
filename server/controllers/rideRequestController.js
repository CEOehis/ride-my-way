import pool from '../models/db';

/**
 * controller class to handle REST routes for ride requests
 *
 * @export
 * @class RideRequest
 */
export default class RideRequest {
  /**
   * create a new ride request
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {json} json object with status and response message
   * @memberof RideRequest
   */
  static createRequest(req, res) {
    const rideId = parseInt(req.params.rideId, 10);
    const { userId } = req;
    pool
      .query('SELECT * FROM rides WHERE id = $1', [rideId])
      .then((result) => {
        if (!result.rowCount) {
          return res.status(404).json({
            status: 'error',
            message: 'The requested ride offer does not exist',
          });
        }
        if (+result.rows[0].userid === +userId) {
          return res.status(400).json({
            status: 'error',
            message: 'You can not request for a ride you offered',
          });
        }
        return pool
          .query('INSERT INTO requests (userid, rideid) values ($1, $2)', [
            userId,
            rideId,
          ])
          .then(() => {
            return res.status(201).json({
              status: 'success',
              message: 'request to join ride successful',
            });
          })
          .catch((error) => {
            return res.status(500).json({
              status: 'error',
              message: error,
            });
          });
      })
      .catch((error) => {
        return res.status(500).json({
          status: 'error',
          message: error,
        });
      });
  }
}
