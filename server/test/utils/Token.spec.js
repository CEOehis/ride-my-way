import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Token from '../../utils/Token';

dotenv.config();

const user = {
  id: 1,
};

describe('Token helper utility', function () {
  it('should exist', function () {
    expect(Token).to.exist;
  });

  it('should have a static method', function () {
    expect(Token.generateToken).to.be.a(
      'function',
      'generateToken should be a static method of Token',
    );
  });

  describe('generateToken method', function () {
    it('should take a user id and return a jwt token', function (done) {
      const verified = jwt.verify(
        Token.generateToken(user.id),
        process.env.SECRET,
      );
      const { exp, iat, ...actual } = verified;
      expect(actual).to.deep.equal(user);
      done();
    });
  });
});
