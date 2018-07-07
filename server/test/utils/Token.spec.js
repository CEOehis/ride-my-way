import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Token from '../../utils/Token';

dotenv.config();

const user = {
  id: 1,
};
let verified;
let token;

describe('Token helper utility', function () {
  before(function (done) {
    token = Token.generateToken(user.id);
    done();
  });

  before(function (done) {
    verified = jwt.verify(token, process.env.SECRET);
    done();
  });

  it('should exist', function () {
    expect(Token).to.exist;
  });

  it('should have a static method: generateToken', function () {
    expect(Token.generateToken).to.be.a(
      'function',
      'generateToken should be a static method of Token',
    );
  });

  it('should have a static method: decodeToken', function () {
    expect(Token.decodeToken).to.be.a(
      'function',
      'decodeToken should be a static method of Token',
    );
  });

  describe('generateToken method', function () {
    it('should take a user id and return a jwt token', function (done) {
      const { exp, iat, ...actual } = verified;
      expect(actual).to.deep.equal(user);
      done();
    });
  });

  describe('decodeToken method', function () {
    it('should take a token and return it decoded', function (done) {
      const decoded = Token.decodeToken(token);
      expect(decoded.id).to.equal(user.id);
      done();
    });
  });

  describe('decodeToken method', function () {
    it('should return error object if invalid token supplied', function (done) {
      const decoded = Token.decodeToken('invalid token ;)');
      expect(decoded).to.be.an('error');
      done();
    });
  });
});
