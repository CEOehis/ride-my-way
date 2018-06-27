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
      });
      it('should check if it is less than two characters long', function () {
      });
      it('should check if it is alphanumeric', function () {
      });
    });

    describe('`to` field validation', function () {
      it('should check if it is empty', function () {
      });
      it('should check if it is less than two characters long', function () {
      });
    });

    describe('`seats` field validation', function () {
      it('should check if it is empty', function () {
      });
      it('should check if it is less than two characters long', function () {
      });
      it('should check if a number was supplied', function () {
      });
    });

    describe('`seats` field validation', function () {
      it('should check if it is empty', function () {
      });
      it('should check if it is less than two characters long', function () {
      });
      it('should check if a number was supplied', function () {
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
    describe('`userId` field validation', function () {
      it('should validate that it is not empty', function () {
      });
      it('should validate that a number was supplied', function () {
      });
      it('should not accept an alphanumeric entry', function () {
      });
    });
    it('should add an `errors` object to the request body', function (done) {
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
});
