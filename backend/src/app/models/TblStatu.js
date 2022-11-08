import Sequelize, { Model } from 'sequelize';

class TblStatu extends Model {
  static init(sequelize) {
    super.init(
      {
        StatusId: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        En_Name: Sequelize.STRING,
        Hi_Name: Sequelize.STRING,
        IsAcitve: Sequelize.BOOLEAN
      },
      {
        sequelize,
      }
    );
  }
}

export default TblStatu;