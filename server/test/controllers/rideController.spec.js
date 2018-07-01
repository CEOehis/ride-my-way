import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app, { server } from '../../index';
import { RideOffers } from '../../dataStore/RideOffers';
import Token from '../../utils/Token';
import pool from '../../models/db';

const token = `Bearer ${Token.generateToken(1)}`;

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
        'INSERT INTO users (fullname, email, password) values ($1, $2, $3)',
        ['Marylin Doe', 'md@mail.com', 'passywordy'],
      )
      .then(() => {
        pool.query('SELECT * FROM users LIMIT 1').then((resulti) => {
          const userId = resulti.rows[0].id;
          pool.query(
            'INSERT INTO rides (origin, destination, date, time, seats, userid) values ($1, $2, $3, $4, $5, $6)',
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
      chai
        .request(app)
        .get('/api/v1/rides')
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
        const rideId = result.rows[0].id;
        chai
          .request(app)
          .get(`/api/v1/rides/${rideId}`)
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
      chai
        .request(app)
        .get('/api/v1/rides/30')
        .set('Authorization', token)
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
          .post('/api/v1/users/rides')
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
              'userid',
            );
            done();
          });
      });
    });

    describe('when passed invalid data', function () {
      it('should not create a new ride offer', function (done) {
        chai
          .request(app)
          .post('/api/v1/users/rides')
          .set('Authorization', token)
          .send({
            id: RideOffers.length + 1,
            from: '   ',
            to: 'East Brianbury',
            userId: 1,
            pricePerSeat: 241,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
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
