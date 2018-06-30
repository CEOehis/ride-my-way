import Token from '../utils/Token';

/**
 * auth class to authenticate/authorize access to protected routes
 *
 * @export
 * @class auth
 */
export default class auth {
  /**
   * verifies if a user is authorized
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response objec
   * @param {object} next next middleware function
   * @returns {json}
   * @memberof auth
   */
  static authenticateUser(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(403).json({
        status: 'error',
        message: 'No token provided',
      });
    }
    if (authorization.split(' ')[0] === 'Bearer') {
      const token = authorization.split(' ')[1];
      const userId = Token.decodeToken(token);
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'invalid token',
        });
      }
    }
    // user authorised to access resource
    return next();
  }
}
