import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app, { server } from '../../index';
import { RideOffers } from '../../dataStore/RideOffers';

chai.use(chaiHttp);

describe('RIDE CONTROLLER API', function () {
  // empty out ride offers collection, then add one entry
  before(function () {
    RideOffers.length = 0;
    RideOffers.push({ id: RideOffers.length + 1, from: 'egbeda', to: 'ketu' });
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
});
