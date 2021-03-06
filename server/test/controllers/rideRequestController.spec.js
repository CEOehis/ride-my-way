import chai, { expect, request } from 'chai';
import chaiHttp from 'chai-http';

import app, { server } from '../../index';
import Token from '../../utils/Token';
import pool from '../../models/db';

const token = `Bearer ${Token.generateToken(2)}`;
const baseUrl = '/api/v1/rides';

chai.use(chaiHttp);

describe('RIDE REQUEST CONTROLLER', function () {
  // empty out ride offers collection, then add one entry
  before(function (done) {
    pool
      .query(
        'INSERT INTO users ("fullName", "email", "password") VALUES ($1, $2, $3)',
        ['Femi Kuti', 'femi.kuti@mail.com', 'passywordy'],
      )
      .then(() => {
        done();
      })
      .catch(() => {
        done();
      });
  });

  before(function (done) {
    pool
      .query(
        'INSERT INTO rides ("origin", "destination", "departureDate", "departureTime", "seats", "userId") values ($1, $2, $3, $4, $5, $6)',
        ['lagos', 'ibadan', '2018-07-02', '15:30', 5, 1],
      )
      .then(() => {
        done();
      })
      .catch(() => {
        done();
      });
  });

  before(function (done) {
    pool
      .query('INSERT INTO requests("userId", "rideId") values (3, 1)')
      .then(() => {
        done();
      });
  });

  after(function (done) {
    server.close();
    done();
  });

  describe('createRequest()', function () {
    describe('when passed valid data', function () {
      it('should create a new request to an existing ride offer', function (done) {
        request(app)
          .post(`${baseUrl}/1/requests`)
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
      it('should not create a duplicate request to an existing ride offer', function (done) {
        request(app)
          .post(`${baseUrl}/1/requests`)
          .set('Authorization', token)
          .end((err, res) => {
            expect(err).to.not.exist;
            expect(res.status).to.equal(409);
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal(
              'you have already requested to join this ride',
            );
            done();
          });
      });

      it('should not create a request for a non-existing ride offer', function (done) {
        request(app)
          .post(`${baseUrl}/500/requests`)
          .set('Authorization', token)
          .end((err, res) => {
            expect(err).to.not.exist;
            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal(
              'requested ride offer does not exist',
            );
            done();
          });
      });

      it('should not create a request to a ride offer created by the same user', function (done) {
        const sameUserToken = `Bearer ${Token.generateToken(1)}`;
        request(app)
          .post(`${baseUrl}/1/requests`)
          .set('Authorization', sameUserToken)
          .end((err, res) => {
            expect(err).to.not.exist;
            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal(
              'you can not request for a ride you offered',
            );
            done();
          });
      });
    });
  });

  describe('getRideRequests()', function () {
    it('should return all requests for a ride offer', function (done) {
      const rideCreatorToken = `Bearer ${Token.generateToken(1)}`;
      request(app)
        .get(`${baseUrl}/1/requests`)
        .set('Authorization', rideCreatorToken)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          expect(res.body.requests).to.be.an('array');
          done();
        });
    });
  });

  describe('respondToRequests()', function () {
    it('should not allow a user respond to another users ride requests', function (done) {
      const otherUserToken = `Bearer ${Token.generateToken(3)}`;
      request(app)
        .put(`${baseUrl}/1/requests/2`)
        .set('Authorization', otherUserToken)
        .send({
          status: 'accepted',
        })
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal(
            'you are not allowed to respond to another users ride requests',
          );
          done();
        });
    });

    it('should respond with message if ride request does not exist', function (done) {
      const otherUserToken = `Bearer ${Token.generateToken(1)}`;
      request(app)
        .put(`${baseUrl}/1/requests/20`)
        .set('Authorization', otherUserToken)
        .send({
          status: 'accepted',
        })
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('ride request does not exist');
          done();
        });
    });

    it('should update the status of a request', function (done) {
      const userToken = `Bearer ${Token.generateToken(1)}`;
      request(app)
        .put(`${baseUrl}/1/requests/2`)
        .set('Authorization', userToken)
        .send({
          status: 'accept',
        })
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal(
            'Successfully accepted ride request',
          );
          done();
        });
    });

    it('should respond with appropriate message if requested ride does not exist', function (done) {
      const userToken = `Bearer ${Token.generateToken(1)}`;
      request(app)
        .put(`${baseUrl}/30/requests/2`)
        .set('Authorization', userToken)
        .send({
          status: 'accepted',
        })
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal(
            'requested ride offer was not found',
          );
          done();
        });
    });
  });

  describe('getRequestsByRideId()', function () {
    it('should fetch all requests belonging to a particular ride', function (done) {
      const url = '/api/v1/requests?rideId=1';
      request(app)
        .get(url)
        .set('Authorization', token)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(200);
          expect(res.body.requests).to.be.an('array');
          done();
        });
    });

    it('should return a 400 if wrong query param is supplied', function (done) {
      const url = '/api/v1/requests?rideId=one';
      request(app)
        .get(url)
        .set('Authorization', token)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('invalid query parameter supplied');
          done();
        });
    });
  });
});
