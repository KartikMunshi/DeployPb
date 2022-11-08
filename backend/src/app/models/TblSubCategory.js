import bcrypt from 'bcryptjs';
import Sequelize, { Model } from 'sequelize';

class TblSubCategories extends Model {
  static init(sequelize) {
    super.init(
      {
        SubCategoryId: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        CategoryId: {type: Sequelize.INTEGER },
        En_Name: {type: Sequelize.STRING },
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
      this.belongsTo(models.TblCategories, { foreignKey: 'CategoryId', foreignKeyConstraint: true, as: 'TblCategory' });
    }
  }
export default TblSubCategories;