import bcrypt from 'bcryptjs';
import Sequelize, { Model } from 'sequelize';

class TblComplaint extends Model {
  static init(sequelize) {
    super.init(
      {
        ComplaintsId : {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        Title : Sequelize.STRING,
        ComplaintUserId: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
      return this;
    }
    static associate(models) {
      this.belongsTo(models.TblCategories, { foreignKey: 'CategoryId', foreignKeyConstraint: true, as: 'TblCategories' });
      this.belongsTo(models.TblSubCategories, { foreignKey: 'SubCategoryId', foreignKeyConstraint: true , as: 'TblSubCategories'});
      this.belongsTo(models.TblStatu, { foreignKey: 'StatusId', foreignKeyConstraint: true, as: 'TblStatu' });
      this.belongsTo(models.User, { foreignKey: 'ComplaintUserId', foreignKeyConstraint: true, as: 'ComplaintUser' });
      this.belongsTo(models.User, { foreignKey: 'AssignUserId', foreignKeyConstraint: true, as: 'AssignUser' });
    }
  }
export default TblComplaint;