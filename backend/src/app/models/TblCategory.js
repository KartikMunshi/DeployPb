import Sequelize, { Model } from 'sequelize';

class TblCategories extends Model {
  static init(sequelize) {
    super.init(
      {
        CategoryId: {type: Sequelize.INTEGER(), primaryKey: true, autoIncrement: true},
        En_Name: {type: Sequelize.STRING },
        Hi_Name: {type: Sequelize.STRING },
        IsActive: {type: Sequelize.BOOLEAN },
        CreatedBy: {type: Sequelize.INTEGER },
        CreatedDate: {type: Sequelize.DataTypes.TIME },
        ModifiedBy: {type: Sequelize.INTEGER },
        ModifiedDate: {type: Sequelize.DataTypes.TIME  },
      },
      {
        sequelize,
      }
    );
      return this;
    }
  
  }
export default TblCategories;