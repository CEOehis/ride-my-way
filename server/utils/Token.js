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
      expiresIn: '4h',
    });
    return token;
  }

  /**
   * Decodes jwt token
   *
   * @static
   * @param {string} token
   * @returns {number | false} decoded user id or false if invalid
   * @memberof Token
   */
  static decodeToken(token) {
    return jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        const error = new Error(err);
        error.status = 401;
        return error;
      }
      return decoded;
    });
  }
}

export default Token;
