import chai, { expect, request } from 'chai';
import chaiHttp from 'chai-http';

import app, { server } from '../../index';
import Token from '../../utils/Token';
import pool from '../../models/db';

const token = `Bearer ${Token.generateToken(1)}`;
const baseUrl = '/api/v1/rides';

chai.use(chaiHttp);

describe('RIDE CONTROLLER API', function () {
  // empty out ride offers collection, then add one entry
  const rideOffer = {
    origin: 'Reichelchester',
    destination: 'Port Liliane',
    date: '2018-02-18',
    time: '12:30',
    seats: 2,
  };

  before(function (done) {
    const values = Object.keys(rideOffer).map((key) => {
      return rideOffer[key];
    });
    pool
      .query(
        'INSERT INTO users ("fullName", "email", "password") values ($1, $2, $3)',
        ['Marylin Doe', 'md@mail.com', 'passywordy'],
      )
      .then(() => {
        pool.query('SELECT * FROM users LIMIT 1').then((result) => {
          const { userId } = result.rows[0];
          pool.query(
            'INSERT INTO rides ("origin", "destination", "departureDate", "departureTime", "seats", "userId") values ($1, $2, $3, $4, $5, $6)',
            [...values, userId],
          );
        });
      });
    done();
  });

  after(function (done) {
    server.close();
    done();
  });

  describe('GET all ride offers route handler', function () {
    it('should respond with an array of all ride offers', function (done) {
      request(app)
        .get(baseUrl)
        .set('Authorization', token)
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
      pool.query('SELECT * FROM rides LIMIT 1').then((result) => {
        const { rideId } = result.rows[0];
        request(app)
          .get(`${baseUrl}/${rideId}`)
          .set('Authorization', token)
          .end((err, res) => {
            expect(err).to.not.exist;
            expect(res.status).to.equal(200);
            expect(res.type).to.equal('application/json');
            expect(res.body.status).to.equal('success');
            expect(res.body.ride).to.be.an('object');
            done();
          });
      });
    });

    it('should respond with a "404" message if resource does not exits', function (done) {
      request(app)
        .get(`${baseUrl}/30`)
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('requested ride offer was not found');
          done();
        });
    });
  });

  describe('POST ride offer route handler', function () {
    describe('when passed valid data', function () {
      it('should respond with success message along with created ride offer resource', function (done) {
        request(app)
          .post(baseUrl)
          .set('Authorization', token)
          .send({
            origin: 'Lake Tobinport',
            destination: 'East Brianbury',
            seats: 1,
            date: '2018-01-07',
            time: '14:30',
          })
          .end((err, res) => {
            expect(err).to.not.exist;
            expect(res.status).to.equal(201);
            expect(res.type).to.equal('application/json');
            expect(res.body.status).to.equal('success');
            expect(res.body.ride).to.be.an('object');
            expect(res.body.ride).to.include.keys(
              'origin',
              'destination',
              'seats',
              'userId',
            );
            done();
          });
      });

      it('should not create a duplicate ride offer resource', function (done) {
        request(app)
          .post(baseUrl)
          .set('Authorization', token)
          .send({
            origin: 'Lake Tobinport',
            destination: 'East Brianbury',
            seats: 1,
            date: '2018-01-07',
            time: '14:30',
          })
          .end((err, res) => {
            expect(err).to.not.exist;
            expect(res.status).to.equal(409);
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal('you have already created this ride offer');
            done();
          });
      });
    });

    describe('when passed invalid data', function () {
      it('should not create a new ride offer', function (done) {
        request(app)
          .post(baseUrl)
          .set('Authorization', token)
          .send({
            from: '   ',
            to: 'East Brianbury',
            userId: 1,
            pricePerSeat: 241,
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
