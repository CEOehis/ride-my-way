import chai, { expect, request } from 'chai';
import chaiHttp from 'chai-http';

import app, { server } from '../../index';
import Token from '../../utils/Token';
import pool from '../../models/db';

const token = `Bearer ${Token.generateToken(3)}`;
const baseUrl = '/api/v1/rides';

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
      })
      .catch(() => {
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
      })
      .catch(() => {
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

      it('should not create a request for a non-existing ride offer', function (done) {
        request(app)
          .post(`${baseUrl}/500/requests`)
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
        request(app)
          .post(`${baseUrl}/1/requests`)
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

  describe('GET all ride offer requests route handler', function () {
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

    it('should return appropriate message if no requests exist', function (done) {
      const rideCreatorToken = `Bearer ${Token.generateToken(1)}`;
      request(app)
        .get(`${baseUrl}/2/requests`)
        .set('Authorization', rideCreatorToken)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(404);
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('No ride requests found for this ride offer');
          done();
        });
    });
  });

  describe('PUT ride offer requests route handler', function () {
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
          expect(res.body.message).to.equal('You are not allowed to respond to another users ride requests');
          done();
        });
    });

    it('should update the status of a request', function (done) {
      const userToken = `Bearer ${Token.generateToken(1)}`;
      request(app)
        .put(`${baseUrl}/1/requests/2`)
        .set('Authorization', userToken)
        .send({
          status: 'accepted',
        })
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Successfully accepted ride request');
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
          expect(res.body.message).to.equal('The requested ride was not found');
          done();
        });
    });
  });
});
