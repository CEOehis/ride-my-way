import { RideOffers } from '../dataStore/RideOffers';

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
    return res.status(200).json({
      status: 'success',
      rides: RideOffers,
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
    for (let i = 0; i < RideOffers.length; i += 1) {
      if (RideOffers[i].id === rideId) {
        // ride offer found.
        return res.status(200).json({
          status: 'success',
          ride: RideOffers[i],
        });
      }
    }
    // ride offer not found.
    return res.status(404).json({
      status: 'error',
      message: 'resource not found',
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
    return res.status(200).json({
      status: 'success',
      ride: RideOffers[RideOffers.length - 1],
    });
  }
}
