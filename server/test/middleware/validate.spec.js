import { expect } from 'chai';
import { spy } from 'sinon';
import validate from '../../middleware/validate';

describe('Validate middleware', function () {
  let req;
  const res = {};
  let next;

  describe('rideOfferValidator method', function () {
    beforeEach(function () {
      req = {
        body: {
          from: '',
          to: '',
          seats: 3,
          pricePerSeat: 240,
        },
      };
      next = (err) => {
        return err;
      };
    });
    describe('`from` field validation', function () {
      it('should check if it is empty', function () {
        req.body.from = '';
        validate.rideOfferValidator(req, res, next);
        expect(req.body.validationErrors.from).to.exist;
        expect(req.body.validationErrors.from).to.equal(
          'Ride offer origin is required',
        );
      });
      it('should check if it is less than two characters long', function () {
        req.body.from = 'a';
        validate.rideOfferValidator(req, res, next);
        expect(req.body.validationErrors.from).to.exist;
        expect(req.body.validationErrors.from).to.equal(
          'Ride offer origin must be 2 characters or more',
        );
      });
      it('should check if it is alphanumeric', function () {
        req.body.from = '$%@#';
        validate.rideOfferValidator(req, res, next);
        expect(req.body.validationErrors.from).to.exist;
        expect(req.body.validationErrors.from).to.equal(
          'Ride offer origin should be alphanumeric',
        );
      });
    });

    describe('`to` field validation', function () {
      it('should check if it is empty', function () {
        req.body.to = '';
        validate.rideOfferValidator(req, res, next);
        expect(req.body.validationErrors.to).to.exist;
        expect(req.body.validationErrors.to).to.equal(
          'Ride offer destination is required',
        );
      });
      it('should check if it is less than two characters long', function () {
        req.body.to = 'a';
        validate.rideOfferValidator(req, res, next);
        expect(req.body.validationErrors.to).to.exist;
        expect(req.body.validationErrors.to).to.equal(
          'Ride offer destination must be 2 characters or more',
        );
      });
      it('should check if it is alphanumeric', function () {
        req.body.to = '$%@#';
        validate.rideOfferValidator(req, res, next);
        expect(req.body.validationErrors.to).to.exist;
        expect(req.body.validationErrors.to).to.equal(
          'Ride offer destination should be alphanumeric',
        );
      });
    });

    describe('`seats` field validation', function () {
      it('should check if it is empty', function () {
        req.body.seats = '';
        validate.rideOfferValidator(req, res, next);
        expect(req.body.validationErrors.seats).to.exist;
        expect(req.body.validationErrors.seats).to.equal(
          'Specify number of available seats',
        );
      });
      it('should check if a number was supplied', function () {
        req.body.seats = 'this is just wrong';
        validate.rideOfferValidator(req, res, next);
        expect(req.body.validationErrors.seats).to.exist;
        expect(req.body.validationErrors.seats).to.equal(
          'Available seats should be a number',
        );
      });
    });

    describe('`pricePerSeat` field validation', function () {
      it('should check if it is empty', function () {
        req.body.pricePerSeat = '';
        validate.rideOfferValidator(req, res, next);
        expect(req.body.validationErrors.pricePerSeat).to.exist;
        expect(req.body.validationErrors.pricePerSeat).to.equal(
          'Price must not be empty',
        );
      });
      it('should check if a number was supplied', function () {
        req.body.pricePerSeat = 'this is just wrong';
        validate.rideOfferValidator(req, res, next);
        expect(req.body.validationErrors.pricePerSeat).to.exist;
        expect(req.body.validationErrors.pricePerSeat).to.equal(
          'Price should be a number',
        );
      });
    });

    it('should add an `validationErrors` object to the request body', function (done) {
      validate.rideOfferValidator(req, res, next);
      expect(req.body.validationErrors).to.exist;
      done();
    });

    it('should call the next middleware', function (done) {
      const nextSpy = spy();
      validate.rideOfferValidator(req, res, nextSpy);
      expect(nextSpy.called).to.equal(true);
      done();
    });
  });

  describe('rideRequestValidator method', function () {
    beforeEach(function () {
      next = (err) => {
        return err;
      };
    });
    describe('`userId` field validation', function () {
      it('should validate that it is not empty', function () {
        req.body.userId = '';
        validate.rideRequestValidator(req, res, next);
        expect(req.body.validationErrors.userId).to.exist;
        expect(req.body.validationErrors.userId).to.equal(
          'User id cannot be empty',
        );
      });
      it('should validate that a number was supplied', function () {
        req.body.userId = 'awesome Number';
        validate.rideRequestValidator(req, res, next);
        expect(req.body.validationErrors.userId).to.exist;
        expect(req.body.validationErrors.userId).to.equal(
          'userId should be a number',
        );
      });
      it('should not accept an alphanumeric entry', function () {
        req.body.userId = '9ga9';
        validate.rideRequestValidator(req, res, next);
        expect(req.body.validationErrors.userId).to.exist;
        expect(req.body.validationErrors.userId).to.equal(
          'userId should be a number',
        );
      });
    });
    it('should add an `errors` object to the request body', function (done) {
      validate.rideRequestValidator(req, res, next);
      expect(req.body.validationErrors).to.exist;
      done();
    });

    it('should call the next middleware', function (done) {
      const nextSpy = spy();
      validate.rideRequestValidator(req, res, nextSpy);
      expect(nextSpy.called).to.equal(true);
      done();
    });
  });

  describe('userSigninValidator method', function () {
    describe('`email` field validation', function () {
      it('should check if it is empty', function () {
        req.body.email = '';
        validate.userSigninValidator(req, res, next);
        expect(req.body.validationErrors.email).to.exist;
        expect(req.body.validationErrors.email).to.equal('email is required');
      });
      it('should check if it is an email', function () {
        req.body.email = 'someinvalidmail';
        validate.userSigninValidator(req, res, next);
        expect(req.body.validationErrors.email).to.exist;
        expect(req.body.validationErrors.email).to.equal(
          'email address supplied is not valid',
        );
      });
    });

    describe('`password` field validation', function () {
      it('should check if it is empty', function () {
        req.body.password = '';
        validate.userSigninValidator(req, res, next);
        expect(req.body.validationErrors.password).to.exist;
        expect(req.body.validationErrors.password).to.equal(
          'password is required',
        );
      });
      it('should check if it less than 6 characters long', function () {
        req.body.password = 'pwd';
        validate.userSigninValidator(req, res, next);
        expect(req.body.validationErrors.password).to.exist;
        expect(req.body.validationErrors.password).to.equal(
          'password supplied is too short',
        );
      });
    });
  });

  describe('userSignupValidator method', function () {
    describe('`fullName` field validation', function () {
      it('should check if it is empty', function () {
        req.body.fullName = '';
        validate.userSignupValidator(req, res, next);
        expect(req.body.validationErrors.fullName).to.exist;
        expect(req.body.validationErrors.fullName).to.equal(
          'fullName is required',
        );
      });
      it('should check if it is less than 2 characters', function () {
        req.body.fullName = 'a';
        validate.userSignupValidator(req, res, next);
        expect(req.body.validationErrors.fullName).to.exist;
        expect(req.body.validationErrors.fullName).to.equal(
          'fullName supplied is too short',
        );
      });
    });

    describe('`email` field validation', function () {
      it('should check if it is empty', function () {
        req.body.email = '';
        validate.userSignupValidator(req, res, next);
        expect(req.body.validationErrors.email).to.exist;
        expect(req.body.validationErrors.email).to.equal('email is required');
      });
      it('should check if it is an email', function () {
        req.body.email = 'someinvalidmail';
        validate.userSignupValidator(req, res, next);
        expect(req.body.validationErrors.email).to.exist;
        expect(req.body.validationErrors.email).to.equal(
          'email address supplied is not valid',
        );
      });
    });

    describe('`password` field validation', function () {
      it('should check if it is empty', function () {
        req.body.password = '';
        validate.userSignupValidator(req, res, next);
        expect(req.body.validationErrors.password).to.exist;
        expect(req.body.validationErrors.password).to.equal(
          'password is required',
        );
      });
      it('should check if it less than 6 characters long', function () {
        req.body.password = 'pwd';
        validate.userSignupValidator(req, res, next);
        expect(req.body.validationErrors.password).to.exist;
        expect(req.body.validationErrors.password).to.equal(
          'password supplied is too short',
        );
      });
    });

    describe('`passwordConfirm` field validation', function () {
      it('should check if it is equal to `password` field', function () {
        req.body.passwordConfirm = '';
        validate.userSignupValidator(req, res, next);
        expect(req.body.validationErrors.passwordConfirm).to.exist;
        expect(req.body.validationErrors.passwordConfirm).to.equal(
          'passwords do not match',
        );
      });
    });
  });
});
