import chai, { expect, request } from 'chai';
import chaiHttp from 'chai-http';

import Token from '../../utils/Token';
import pool from '../../models/db';
import app, { server } from '../../index';

chai.use(chaiHttp);
const baseUrl = '/api/v1/users';

describe('USER CONTROLLER', function () {
  // empty users table
  before(function (done) {
    pool
      .query('DELETE FROM requests; DELETE FROM rides; DELETE FROM users;')
      .then(() => {
        done();
      })
      .catch(() => {
        done();
      });
  });

  after(function (done) {
    server.close();
    done();
  });

  describe('signup()', function () {
    describe('when passed valid data', function () {
      const userData = {
        fullName: 'John Doe',
        email: 'jdtesting@mail.com',
        password: 'passywordy',
        passwordConfirm: 'passywordy',
      };
      it('should create a new user and respond with jwt', function (done) {
        request(app)
          .post(`${baseUrl}/signup`)
          .send(userData)
          .end((err, res) => {
            expect(err).to.not.exist;
            expect(res.status).to.equal(201);
            expect(res.type).to.equal('application/json');
            expect(res.body.status).to.equal('success');
            expect(res.body.token).to.be.a('string');
            done();
          });
      });

      it('should not create a new user with an existing email', function (done) {
        request(app)
          .post(`${baseUrl}/signup`)
          .send(userData)
          .end((err, res) => {
            expect(err).to.not.exist;
            expect(res.status).to.equal(409);
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal(
              'user with this email already exists',
            );
            done();
          });
      });
    });

    describe('when passed invalid/incomplete data', function () {
      it('should not create a new user', function (done) {
        const userData = {
          fullName: 'John Doe',
          email: 'invalidmail',
          password: 'passywordy',
        };
        request(app)
          .post(`${baseUrl}/signup`)
          .send(userData)
          .end((err, res) => {
            expect(err).to.not.exist;
            expect(res.status).to.equal(400);
            expect(res.type).to.equal('application/json');
            expect(Object.keys(res.body.errors).length).to.be.above(0);
            done();
          });
      });
    });
  });

  describe('signin()', function () {
    describe('when passed valid data/credentials', function () {
      it('should authenticate a user respond with jwt', function (done) {
        const userData = {
          email: 'jdtesting@mail.com',
          password: 'passywordy',
        };
        request(app)
          .post(`${baseUrl}/login`)
          .send(userData)
          .end((err, res) => {
            expect(err).to.not.exist;
            expect(res.status).to.equal(200);
            expect(res.type).to.equal('application/json');
            expect(res.body.status).to.equal('success');
            expect(res.body.token).to.be.a('string');
            done();
          });
      });
    });

    describe('when passed invalid data', function () {
      it('should not authenticate user', function (done) {
        const userData = {
          email: 'jdtesting',
          password: 'passywordy',
        };
        request(app)
          .post(`${baseUrl}/login`)
          .send(userData)
          .end((err, res) => {
            expect(err).to.not.exist;
            expect(res.status).to.equal(400);
            expect(Object.keys(res.body.errors).length).to.be.above(0);
            done();
          });
      });
    });
  });


  describe('getUserProfile()', function () {
    it('should return the users profile', function (done) {
      const token = `Bearer ${Token.generateToken(1)}`;
      request(app)
        .get(`${baseUrl}`)
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          done();
        });
    });

    it('should return error if the users profile does not exist', function (done) {
      const token = `Bearer ${Token.generateToken(34)}`;
      request(app)
        .get(`${baseUrl}`)
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('User does not exist');
          done();
        });
    });
  });
});
