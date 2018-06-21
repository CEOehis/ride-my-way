import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app, { server } from '../../index';
import { RideOffers } from '../../dataStore/RideOffers';

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
    it('should create a new request to an existing ride offer', function (done) {
      chai
        .request(app)
        .post('/api/v1/rides/1/requests')
        .send({
          userId: 3,
        })
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          expect(res.body.message).to.equal('request to join ride successful');
          done();
        });
    });

    it('should not create a request for a non-existing ride offer', function (done) {
      chai
        .request(app)
        .post('/api/v1/rides/500/requests')
        .send({
          userId: 3,
        })
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(404);
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('The requested ride offer does not exist');
          done();
        });
    });

    it('should not create a request to a ride offer created by the same user');
  });
});
