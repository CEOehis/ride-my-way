import express from 'express';
import { Ride, RideRequest, User } from '../controllers';
import validate from '../middleware/validate';
import auth from '../middleware/auth';

const router = express.Router();

// authorisation
router.post('/auth/signup', validate.userSignupValidator, User.signup);
router.post('/auth/login', validate.userSigninValidator, User.signin);

// protected routes
router.use(auth.authenticateUser);
router.get('/rides', Ride.getAllRideOffers);
router.get('/rides/:id', Ride.getRideOffer);
router.get('/users/rides/:rideId/requests', RideRequest.getRideRequests);
router.post('/users/rides', validate.rideOfferValidator, Ride.createRideOffer);
router.post('/rides/:rideId/requests', RideRequest.createRequest);
router.put('/users/rides/:rideId/requests/:requestId', RideRequest.respondToRequests);


export default router;
