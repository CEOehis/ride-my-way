import { RideOffers } from '../dataStore/RideOffers';

export default class Ride {
  static getAllRideOffers(req, res) {
    return res.status(200).json({
      status: 'success',
      rides: RideOffers,
    });
  }
}
