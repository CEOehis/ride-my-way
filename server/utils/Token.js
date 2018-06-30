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

  /**
   * Decodes jwt token
   *
   * @static
   * @param {string} token
   * @returns {number | false} decoded user id or false if invalid
   * @memberof Token
   */
  static decodeToken(token) {
    const userId = jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return false;
      }
      return decoded.id;
    });
    return userId;
  }
}

export default Token;
