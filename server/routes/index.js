import express from 'express';
import Ride from '../controllers';

const router = express.Router();

router.get('/rides', Ride.getAllRideOffers);
router.get('/rides/:id', Ride.getRideOffer);
router.post('/rides', Ride.createRideOffer);

export default router;
