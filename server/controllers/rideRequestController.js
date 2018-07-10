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
      .query('SELECT * FROM rides WHERE "rideId" = $1', [rideId])
      .then((result) => {
        if (!result.rowCount) {
          return res.status(404).json({
            status: 'error',
            message: 'The requested ride offer does not exist',
          });
        }
        if (+result.rows[0].userId === +userId) {
          return res.status(400).json({
            status: 'error',
            message: 'You can not request for a ride you offered',
          });
        }
        return pool
          .query('INSERT INTO requests ("userId", "rideId") values ($1, $2)', [
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
            // eslint-disable-next-line
            if (error.code == 23505) {
              // postgres unique violation error means this is a duplicate entry
              return res.status(409).json({
                status: 'error',
                message: 'you have already requested to join this ride',
              });
            }
            return res.status(500).json({
              status: 'error',
              message: 'unable to create request',
            });
          });
      })
      .catch(() => {
        return res.status(500).json({
          status: 'error',
          message: 'Unable to fetch ride details',
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
      .query(
        'SELECT requests."requestId", requests."userId" AS "requesterId", rides."rideId" AS "rideId", rides."userId" AS "creatorId", requests."offerStatus", users."fullName" as "requesterName", requests."createdAt", requests."updatedAt" FROM requests INNER JOIN rides ON (requests."rideId" = rides."rideId") JOIN users ON (requests."userId" = users."userId") WHERE requests."rideId" = $1;',
        [rideId],
      )
      .then((result) => {
        if (result.rowCount !== 0) {
          // also check if the creator of the ride offer
          // is the same as the user in the current session
          if (result.rows[0].creatorId !== userId) {
            return res.status(403).json({
              status: 'error',
              message:
                'you are not allowed to view another users ride offer requests',
            });
          }
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
        message: 'ride request status must be supplied in request body',
      });
    }
    // check if the user is the one who created the ride offer
    return pool
      .query('SELECT * FROM rides WHERE "rideId" = $1', [rideId])
      .then((result) => {
        if (result.rowCount !== 0) {
          const rides = result.rows[0];
          if (rides.userId !== userId) {
            return res.status(400).json({
              status: 'error',
              message:
                'you are not allowed to respond to another users ride requests',
            });
          }
          // the created_at and updated_at columns are set by default on creation of request
          // compare both fields to check if the request has been responded to
          // because, ideally, user is not allowed to modify an already responded to request
          return pool
            .query(
              'SELECT "createdAt", "updatedAt" FROM requests WHERE "requestId" = $1;',
              [requestId],
            )
            .then((selectResult) => {
              if (selectResult.rowCount === 0) {
                return res.status(404).json({
                  status: 'error',
                  message: 'this ride request does not exist',
                });
              }
              const { createdAt, updatedAt } = selectResult.rows[0];
              // use getTime() to compare both columns
              if (
                new Date(createdAt).getTime() !== new Date(updatedAt).getTime()
              ) {
                return res.status(409).json({
                  status: 'error',
                  message: 'this ride request has already been responded to',
                });
              }
              // otherwise it is safe to update
              return pool
                .query(
                  'UPDATE requests SET "offerStatus" = $1, "updatedAt" = NOW() WHERE "requestId" = $2',
                  [`${status}ed`, requestId],
                )
                .then(() => {
                  return res.status(200).json({
                    status: 'success',
                    message: `Successfully ${status}ed ride request`,
                  });
                })
                .catch(() => {
                  return res.status(500).json({
                    status: 'error',
                    message:
                      "unable to update status. Set status value to either 'accept' or 'reject'",
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
