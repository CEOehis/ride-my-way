import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app, { server } from '../../index';
import { RideOffers } from '../../dataStore/RideOffers';

chai.use(chaiHttp);

describe('RIDE CONTROLLER API', function () {
  // empty out ride offers collection, then add one entry
  const rideOffer = {
    id: 1,
    from: 'Reichelchester',
    to: 'Port Liliane',
    seats: 2,
    userId: 5,
    pricePerSeat: 311,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  before(function () {
    RideOffers.length = 0;
    RideOffers.push(rideOffer);
  });

  after(function (done) {
    server.close();
    done();
  });

  describe('GET all ride offers route handler', function () {
    it('should respond with an array of all ride offers', function (done) {
      chai
        .request(app)
        .get('/api/v1/rides')
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(200);
          expect(res.type).to.equal('application/json');
          expect(res.body.status).to.equal('success');
          expect(res.body.rides).to.be.an('array');
          done();
        });
    });
  });

  describe('GET single ride offer route handler', function () {
    it('should respond with a single ride offer', function (done) {
      chai
        .request(app)
        .get('/api/v1/rides/1')
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(200);
          expect(res.type).to.equal('application/json');
          expect(res.body.status).to.equal('success');
          expect(res.body.ride).to.be.an('object');
          expect(res.body.ride).to.eql(rideOffer);
          done();
        });
    });

    it('should respond with a "404" message if resource does not exits', function (done) {
      chai
        .request(app)
        .get('/api/v1/rides/30')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('resource not found');
          done();
        });
    });
  });

  describe('POST ride offer route handler', function () {
    describe('when passed valid data', function () {
      it('should respond with success message along with created ride offer resource', function (done) {
        chai
          .request(app)
          .post('/api/v1/rides')
          .send({
            id: RideOffers.length + 1,
            from: 'Lake Tobinport',
            to: 'East Brianbury',
            seats: 1,
            userId: 1,
            pricePerSeat: 241,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .end((err, res) => {
            expect(err).to.not.exist;
            expect(res.status).to.equal(200);
            expect(res.type).to.equal('application/json');
            expect(res.body.status).to.equal('success');
            expect(res.body.ride).to.be.an('object');
            expect(res.body.ride).to.include.keys(
              'from',
              'to',
              'seats',
              'userId',
              'pricePerSeat',
            );
            done();
          });
      });
    });
  });
});
