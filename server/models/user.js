import bcrypt from 'bcrypt';
import omit from 'lodash.omit';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate(signupData) {
        signupData.password = bcrypt.hashSync(signupData.password, 10);
      },
    },
  });

  User.prototype.toJSON = function toJSON() {
    return omit(this.dataValues, 'password');
  };

  User.associate = (models) => {
    const { Ride } = models;
    User.hasMany(Ride, {
      foreignKey: 'userId',
    });
  };
  return User;
};
