import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app, { server } from '../../index';
import Token from '../../utils/Token';
import pool from '../../models/db';

const token = `Bearer ${Token.generateToken(3)}`;

chai.use(chaiHttp);

describe('RIDE REQUEST CONTROLLER API', function () {
  // empty out ride offers collection, then add one entry
  before(function (done) {
    pool
      .query(
        'INSERT INTO users (fullname, email, password) VALUES ($1, $2, $3)',
        ['Femi Kuti', 'femi.kuti@mail.com', 'passywordy'],
      )
      .then(() => {
        done();
      });
  });

  before(function (done) {
    pool
      .query(
        'INSERT INTO rides (origin, destination, date, time, seats, userid) values ($1, $2, $3, $4, $5, $6)',
        ['lagos', 'ibadan', '2018-07-02', '15:30', 5, 1],
      )
      .then(() => {
        done();
      });
  });

  before(function (done) {
    pool
      .query('INSERT INTO requests(userid, rideid) values (3, 1)')
      .then(() => {
        done();
      });
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
        const sameUserToken = `Bearer ${Token.generateToken(1)}`;
        chai
          .request(app)
          .post('/api/v1/rides/1/requests')
          .set('Authorization', sameUserToken)
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
  });
});
