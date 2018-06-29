import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class Token {
  /**
   * Generates jwt token
   *
   * @static
   * @param {object} user
   * @returns {string} jwt token
   * @memberof Token
   */
  static generateToken(id) {
    const token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 86400,
    });
    return token;
  }
}

export default Token;
