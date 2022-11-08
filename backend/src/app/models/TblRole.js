import bcrypt from 'bcryptjs';
import Sequelize, { Model } from 'sequelize';

class TblRole extends Model {
  static init(sequelize) {
    super.init(
      {   
        RoleId : {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        Name : Sequelize.STRING,
        Discription : Sequelize.STRING,
        IsActive : Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

      return this;
    }
  
  }
export default TblRole;