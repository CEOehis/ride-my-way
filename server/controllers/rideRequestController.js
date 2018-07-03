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

  /**
   * get requests to users' ride offer
   *
   * @static
   * @param {*} req express request object
   * @param {*} res express response object
   * @returns {json} json object with status and array of request or response message
   * @memberof RideRequest
   */
  static getRideRequests(req, res) {
    const rideId = parseInt(req.params.rideId, 10);
    const { userId } = req;
    pool
      .query('SELECT requests.id, requests.userid AS requester_id, rides.id AS ride_id, rides.userid AS creator_id, users.fullname, requests.created_at, requests.updated_at FROM requests INNER JOIN rides ON (requests.rideid = rides.id) JOIN users ON (requests.userid = users.id) WHERE requests.rideid = $1 AND rides.userid = $2;', [rideId, userId])
      .then((result) => {
        if (!result.rowCount) {
          return res.status(404).json({
            status: 'error',
            message: 'No ride requests found for this ride offer',
          });
        }
        return res.status(200).json({
          status: 'success',
          requests: result.rows,
        });
      });
  }

  /**
   * accept or reject a ride request
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @memberof RideRequest
   */
  static respondToRequests(req, res) {
    const { status } = req.body;
    const { requestId, rideId } = req.params;
    const { userId } = req;
    // check if the user is the one who created the ride offer
    pool
      .query('SELECT * FROM rides WHERE id = $1', [rideId])
      .then((result) => {
        if (result.rowCount) {
          if (result.rows[0].userid !== userId) {
            return res.status(400).json({
              status: 'error',
              message: 'You are not allowed to respond to another users ride requests',
            });
          }
          return pool
            .query('UPDATE requests SET offerstatus = $1, updated_at = NOW() WHERE id = $2', [status, requestId])
            .then((updateResult) => {
              if (updateResult.rowCount) {
                return res.status(200).json({
                  status: 'success',
                  message: `Successfully ${status} ride request`,
                });
              }
              return res.status(500).json({
                status: 'error',
                message: 'Unable to respond to ride request',
              });
            })
            .catch(() => {
              return res.status(500).json({
                status: 'error',
                message: 'Unable to respond to ride request',
              });
            });
        }
        return res.status(404).json({
          status: 'error',
          message: 'The requested ride was not found',
        });
      })
      .catch((error) => {
        // could not retrieve ride
        return res.status(500).json({
          status: 'error',
          message: error,
        });
      });
  }
}
