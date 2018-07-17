import bcrypt from 'bcrypt';
import { isEmpty } from 'lodash';
import pool from '../models/db';
import Token from '../utils/Token';

/**
 * User controller
 *
 * @export
 * @class User
 */
export default class User {
  /**
   * sign up user
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express request object
   * @returns {json} json object with status and token/response data
   * @memberof User
   */
  static signup(req, res) {
    // check for validation errors
    const errors = req.validationErrors;
    if (!isEmpty(errors)) {
      return res.status(400).json({ errors });
    }
    const { fullName, email, password } = req.body;
    // check within database to see if user exists
    return pool
      .query('SELECT "email" FROM users WHERE "email"=$1', [email])
      .then((selectResult) => {
        if (selectResult.rowCount !== 0) {
          return res.status(409).json({
            status: 'error',
            message: 'user with this email already exists',
          });
        }
        return pool
          .query(
            'INSERT INTO users("fullName", "email", "password") values($1, $2, $3)',
            [fullName, email, bcrypt.hashSync(password, 10)],
          )
          .then(() => {
            pool
              .query('SELECT "userId", "fullName", "phone", "email" FROM users WHERE "email"=$1', [email])
              .then((result) => {
                const user = result.rows[0];
                // create token
                const token = Token.generateToken(user.userId);
                return res.status(201).json({
                  status: 'success',
                  user,
                  token,
                });
              });
          })
          .catch(() => {
            return res.status(500).json({
              status: 'error',
              message: 'unable to create user account',
            });
          });
      });
  }

  /**
   * login user
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {json} json object with status and token/response data
   * @memberof User
   */
  static signin(req, res) {
    // check for validation errors
    const errors = req.validationErrors;
    if (!isEmpty(errors)) {
      return res.status(400).json({ errors });
    }
    const { email, password } = req.body;
    return pool
      .query('SELECT "userId", "fullName", "phone", "email", "password" FROM users WHERE "email"=$1', [email])
      .then((result) => {
        const user = result.rows[0];
        if (!user) {
          return res.status(404).json({
            status: 'error',
            message: 'invalid email or password',
          });
        }
        // user exists so check if password supplied matches
        return bcrypt
          .compare(password, user.password)
          .then((valid) => {
            if (valid) {
              const token = Token.generateToken(user.userId);
              // use rest operator to separate password from user into 'userSafeData'
              // so it is safe to return to client
              // eslint-disable-next-line
              const { password, ...userSafeData } = user;
              return res.status(200).json({
                status: 'success',
                user: userSafeData,
                token,
              });
            }
            return res.status(401).json({
              status: 'error',
              message: 'invalid email or password',
            });
          })
          .catch(() => {
            return res.status(500).json({
              status: 'error',
              message: 'unable to verify user',
            });
          });
      })
      .catch(() => {
        return res.status(500).json({
          status: 'error',
          message: 'unable to fetch user information',
        });
      });
  }
}
