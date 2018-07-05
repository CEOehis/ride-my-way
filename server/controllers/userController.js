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
    const errors = req.body.validationErrors;
    if (!isEmpty(errors)) {
      return res.status(400).json({ errors });
    }
    const { fullName, email, password } = req.body;
    return pool
      .query(
        'INSERT INTO users(fullname, email, password, created_at) values($1, $2, $3, NOW())',
        [fullName, email, bcrypt.hashSync(password, 10)],
      )
      .then(() => {
        pool
          .query('SELECT * FROM users WHERE email=$1', [email])
          .then((result) => {
            // create token
            const token = Token.generateToken(result.rows[0].id);
            return res.status(201).json({
              status: 'success',
              token,
            });
          });
      })
      .catch(() => {
        return res.status(500).json({
          status: 'error',
          message: 'Unable to create user',
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
    const errors = req.body.validationErrors;
    if (!isEmpty(errors)) {
      return res.status(400).json({ errors });
    }
    const { email, password } = req.body;
    return pool
      .query('SELECT * FROM users WHERE email=$1', [email])
      .then((result) => {
        const user = result.rows[0];
        if (!user) {
          return res.status(404).json({
            status: 'error',
            message: 'Invalid email or password',
          });
        }
        // user exists so check if password supplied matches
        return bcrypt
          .compare(password, user.password)
          .then((valid) => {
            if (valid) {
              const token = Token.generateToken(user.id);
              return res.status(200).json({
                status: 'success',
                token,
              });
            }
            return res.status(401).json({
              status: 'error',
              message: 'Invalid email or password',
            });
          })
          .catch(() => {
            return res.status(500).json({
              status: 'success',
              message: 'Unable to verify user',
            });
          });
      })
      .catch(() => {
        return res.status(500).json({
          status: 'error',
          message: 'Unable to locate resource',
        });
      });
  }
}
