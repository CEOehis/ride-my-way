import express from 'express';
import { Ride, RideRequest, User } from '../controllers';
import validate from '../middleware/validate';
import auth from '../middleware/auth';

const router = express.Router();

// authorisation
router.post('/users/signup', validate.userSignupValidator, User.signup);
router.post('/users/login', validate.userSigninValidator, User.signin);

// protected routes
router.use('/rides', auth.authenticateUser);
router.get('/users', auth.authenticateUser, User.getUserProfile);
router.get('/rides', Ride.getAllRideOffers);
router.get('/rides/user', Ride.getUsersRideOffers);
router.get('/rides/:id', Ride.getRideOffer);
router.get('/rides/:rideId/requests', RideRequest.getRideRequests);
router.post('/rides', validate.rideOfferValidator, Ride.createRideOffer);
router.post('/rides/:rideId/requests', RideRequest.createRequest);
router.put('/rides/:rideId/requests/:requestId', RideRequest.respondToRequests);
router.get('/requests', auth.authenticateUser, RideRequest.getRequestsByRideId);

export default router;
