import express from 'express';
import Ride from '../controllers';

const router = express.Router();

router.get('/rides', Ride.getAllRideOffers);

export default router;
