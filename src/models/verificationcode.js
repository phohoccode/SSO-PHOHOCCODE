'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class VerificationCodes extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    VerificationCodes.init({
        email: DataTypes.STRING,
        code: DataTypes.STRING,
        type: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'VerificationCodes',
    });
    return VerificationCodes;
};