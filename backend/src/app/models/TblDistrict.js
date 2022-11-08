import bcrypt from 'bcryptjs';
import Sequelize, { Model } from 'sequelize';

class TblDistrict extends Model {
  static init(sequelize) {
    super.init(
      {
        DistrictId : {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        StateId: {type: Sequelize.INTEGER },
        CityId: {type: Sequelize.INTEGER },
        Name: {type: Sequelize.STRING },
        Hi_Name: {type: Sequelize.STRING },
        IsActive: {type: Sequelize.BOOLEAN },
        CreatedBy: {type: Sequelize.INTEGER },
        CreatedDate: {type: Sequelize.DataTypes.TIME },
        ModifiedBy: {type: Sequelize.INTEGER },
        ModifiedDate:{type: Sequelize.DataTypes.TIME },
      },
      {
        sequelize,
      }
    );
      return this;
    }
    static associate(models) {
      this.belongsTo(models.TblState, { foreignKey: 'StateId', foreignKeyConstraint: true , as: 'TblState'});
    }
  }
export default TblDistrict;
