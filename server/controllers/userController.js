import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../models/db';

export default class User {
  static signup(req, res) {
    const { fullName, email, password } = req.body;
    pool
      .query(
        'INSERT INTO users(fullname, email, password, created_at) values($1, $2, $3, NOW())',
        [fullName, email, bcrypt.hashSync(password, 10)],
      )
      .then(() => {
        pool
          .query('SELECT * FROM users WHERE email=$1', [email])
          .then((result) => {
            // create token
            const token = jwt.sign(
              { id: result.rows[0].id },
              process.env.SECRET,
              { expiresIn: 86400 },
            );
            return res.status(201).json({
              status: 'success',
              token,
            });
          });
      })
      .catch(() => {
        return res.status(500).json({
          status: 'error',
          error: 'error creating user',
        });
      });
  }
}
