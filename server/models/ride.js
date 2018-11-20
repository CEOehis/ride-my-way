module.exports = (sequelize, DataTypes) => {
  const Ride = sequelize.define('Ride', {
    rideId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departureDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    departureTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});
  Ride.associate = (models) => {
    const { User } = models;
    Ride.belongsTo(User, {
      onDelete: 'CASCADE',
      foreignKey: 'userId',
    });
  };
  return Ride;
};
