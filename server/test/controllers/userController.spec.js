import chai, { expect, request } from 'chai';
import chaiHttp from 'chai-http';

import pool from '../../models/db';
import app, { server } from '../../index';

chai.use(chaiHttp);
const baseUrl = '/api/v1/users';

describe('USER CONTROLLER API', function () {
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

  describe('SIGN UP route handler', function () {
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

  describe('SIGN IN route handler', function () {
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
});
