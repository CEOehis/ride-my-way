import { RideOffers } from '../dataStore/RideOffers';
import { RideRequests } from '../dataStore/RideRequests';

export default class RideRequest {
  static createRequest(req, res) {
    const rideId = parseInt(req.params.rideId, 10);
    // rather than loop through entire ride offer collection
    // get their id's and use Array.prototype.includes() to
    // check if rideId exists in collection
    const allRideOffersIds = RideOffers.map((rideOffer) => {
      return rideOffer.id;
    });
    if (!allRideOffersIds.includes(rideId)) {
      return res.status(404).json({
        status: 'error',
        message: 'The requested ride offer does not exist',
      });
    }
    const { userId } = req.body;
    RideRequests.push({
      id: RideRequest.length + 1,
      ride: rideId,
      userId,
    });
    return res.status(200).json({
      status: 'success',
      message: 'request to join ride successful',
    });
  }
}
