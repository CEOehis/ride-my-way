import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app, { server } from '../../index';
import { RideOffers } from '../../dataStore/RideOffers';
import Token from '../../utils/Token';

const token = `Bearer ${Token.generateToken(1)}`;

chai.use(chaiHttp);

describe('RIDE REQUEST CONTROLLER API', function () {
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

  describe('POST ride offer request route handler', function () {
    describe('when passed valid data', function () {
      it('should create a new request to an existing ride offer', function (done) {
        chai
          .request(app)
          .post('/api/v1/rides/1/requests')
          .set('Authorization', token)
          .send({
            userId: 3,
          })
          .end((err, res) => {
            expect(err).to.not.exist;
            expect(res.status).to.equal(201);
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.equal(
              'request to join ride successful',
            );
            done();
          });
      });

      it('should not create a request for a non-existing ride offer', function (done) {
        chai
          .request(app)
          .post('/api/v1/rides/500/requests')
          .set('Authorization', token)
          .send({
            userId: 3,
          })
          .end((err, res) => {
            expect(err).to.not.exist;
            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal(
              'The requested ride offer does not exist',
            );
            done();
          });
      });

      it('should not create a request to a ride offer created by the same user', function (done) {
        chai
          .request(app)
          .post('/api/v1/rides/1/requests')
          .set('Authorization', token)
          .send({
            userId: 5,
          })
          .end((err, res) => {
            expect(err).to.not.exist;
            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal(
              'You can not request for a ride you offered',
            );
            done();
          });
      });
    });

    describe('when passed invalid userId', function () {
      it('should not create a new ride offer request', function (done) {
        chai
          .request(app)
          .post('/api/v1/rides/1/requests')
          .set('Authorization', token)
          .send({
            userId: '',
          })
          .end((err, res) => {
            expect(err).to.not.exist;
            expect(res.status).to.equal(400);
            expect(Object.keys(res.body.errors).length).to.be.above(0);
            done();
          });
      });
    });
  });
});
