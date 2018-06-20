import express from 'express';
import Ride from '../controllers';
import validate from '../middleware/validate';

const router = express.Router();

router.get('/rides', Ride.getAllRideOffers);
router.get('/rides/:id', Ride.getRideOffer);
router.post('/rides', validate.rideOfferValidator, Ride.createRideOffer);

export default router;
