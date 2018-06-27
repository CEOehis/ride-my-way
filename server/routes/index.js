import express from 'express';
import { Ride, RideRequest } from '../controllers';
import validate from '../middleware/validate';

const router = express.Router();

router.get('/rides', Ride.getAllRideOffers);
router.get('/rides/:id', Ride.getRideOffer);
router.post('/rides', validate.rideOfferValidator, Ride.createRideOffer);
router.post(
  '/rides/:rideId/requests',
  validate.rideRequestValidator,
  RideRequest.createRequest,
);

export default router;
