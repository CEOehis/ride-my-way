import bcrypt from 'bcrypt';
import { isEmpty } from 'lodash';
import models from '../models';
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
    return models.User.findOne({
      where: {
        email,
      },
    })
      .then((foundUser) => {
        if (foundUser) {
          return res.status(409).json({
            status: 'error',
            message: 'user with this email already exists',
          });
        }
        return models.User.create({ fullName, email, password })
          .then((user) => {
            // create token
            const token = Token.generateToken(user.userId);
            return res.status(201).json({
              status: 'success',
              user,
              token,
            });
          })
          .catch(() => {
            return res.status(500).json({
              status: 'error',
              message: 'unable to create user account',
            });
          });
      })
      .catch((e) => {
        console.log(e);
        return res.status(500).json({
          status: 'error',
          message: 'error creating user account',
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
    return models.User.findOne({
      where: {
        email,
      },
    })
      .then((user) => {
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
              return res.status(200).json({
                status: 'success',
                user,
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

  /**
   * get user profile
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {json} json object with status and user data/failure response
   * @memberof User
   */
  static getUserProfile(req, res) {
    const { userId } = req;
    return models.User.findOne({
      where: {
        userId,
      }
    })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            status: 'error',
            message: 'User does not exist',
          });
        }
        return res.status(200).json({
          status: 'success',
          user,
        });
      })
      .catch(() => {
        return res.status(500).json({
          status: 'error',
          message: 'Unable to fetch user information',
        });
      });
  }
}
