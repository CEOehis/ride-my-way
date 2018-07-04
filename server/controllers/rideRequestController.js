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
    const { body, params, userId } = req;
    const { status } = body;
    const { requestId, rideId } = params;
    // status can't be allowed to be undefined, otherwise pg will pass that value
    // to the sql query where it is required without an error
    if (typeof status === 'undefined') {
      return res.status(400).json({
        status: 'error',
        message: 'Ride request status must be supplied in request body',
      });
    }
    // check if the user is the one who created the ride offer
    return pool
      .query('SELECT * FROM rides WHERE id = $1', [rideId])
      .then((result) => {
        if (result.rowCount !== 0) {
          const rides = result.rows[0];
          const { userid } = rides;
          if (userid !== userId) {
            return res.status(400).json({
              status: 'error',
              message: 'You are not allowed to respond to another users ride requests',
            });
          }
          // the created_at and updated_at columns are set by default on creation of request
          // compare both fields to check if the request has been responded to
          // because, ideally, user is not allowed to modify an already responded to request
          return pool
            .query('SELECT created_at, updated_at FROM requests WHERE id = $1 and created_at = updated_at;', [requestId])
            .then((selectResult) => {
              if (selectResult.rowCount === 0) {
                // the query successfully compared both columns
                // which happen to be equal
                return res.status(400).json({
                  status: 'error',
                  message: 'This request does not exist or has already been responded to',
                });
              }
              // otherwise it is safe to update
              return pool
                .query('UPDATE requests SET offerstatus = $1, updated_at = NOW() WHERE id = $2', [status, requestId])
                .then(() => {
                  return res.status(200).json({
                    status: 'success',
                    message: `Successfully ${status} ride request`,
                  });
                })
                .catch(() => {
                  return res.status(500).json({
                    status: 'error',
                    message: 'Unable to respond to ride request, make sure status value is either accepted or rejected',
                  });
                });
            })
            .catch(() => {
              return res.status(500).json({
                status: 'error',
                message: 'Error fetching ride offer request',
              });
            });
        }
        return res.status(404).json({
          status: 'error',
          message: 'The requested ride was not found',
        });
      })
      .catch(() => {
        // could not retrieve ride
        return res.status(500).json({
          status: 'error',
          message: 'Unable to fetch original ride offer',
        });
      });
  }
}
