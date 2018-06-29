import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import pool from '../../models/db';
import app, { server } from '../../index';

chai.use(chaiHttp);

describe('USER CONTROLLER API', function () {
  // empty users table
  before(function (done) {
    pool
      .query('DELETE FROM requests; DELETE FROM rides; DELETE FROM users;')
      .then(() => {
        done();
      })
      .catch((error) => {
        throw error;
      });
  });

  after(function (done) {
    server.close();
    done();
  });

  describe('SIGN UP route handler', function () {
    describe('when passed valid data', function () {
      it('should create a new user and respond with jwt', function (done) {
        const userData = {
          fullName: 'John Doe',
          email: 'jdtesting@mail.com',
          password: 'passywordy',
        };
        chai
          .request(app)
          .post('/api/v1/auth/signup')
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
    });
  });

  describe('SIGN IN route handler', function () {
    describe('when passed valid data/credentials', function () {
      it('should authenticate a user respond with jwt', function (done) {
        const userData = {
          email: 'jdtesting@mail.com',
          password: 'passywordy',
        };
        chai
          .request(app)
          .post('/api/v1/auth/login')
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
  });
});
