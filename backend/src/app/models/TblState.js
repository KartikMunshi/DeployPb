import Sequelize, { Model } from 'sequelize';

class TblState extends Model {
  static init(sequelize) {
    super.init(
      {
        StateId : {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        Name: {type: Sequelize.STRING },
      },
      {
        sequelize,
      });
      return this;
    }
  }
export default TblState;
