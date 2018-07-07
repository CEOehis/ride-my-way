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
    if (authorization.split(' ')[0] !== 'Bearer') {
      // invalid auth string
      return res.status(401).json({
        status: 'error',
        message: 'invalid authorization token',
      });
    }
    const token = authorization.split(' ')[1];
    const decoded = Token.decodeToken(token);
    if (typeof decoded.id === 'undefined') {
      return next(decoded);
    }
    // set user in request object for future use
    req.userId = decoded.id;
    // user authorised to access resource
    return next();
  }
}
