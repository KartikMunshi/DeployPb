import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import User from '../app/models/User';
import Address from '../app/models/Address';
import Phone from '../app/models/Phone';
import TblBlock from '../app/models/TblBlock';
import TblDistrict from '../app/models/TblDistrict';
import TblEvent from '../app/models/TblEvent';
import TblComplaint from '../app/models/TblComplaint';
import TblState from '../app/models/TblState';
import TblCategories from '../app/models/TblCategory';
import TblPanchayat from '../app/models/TblPanchayat';
import TblWards from '../app/models/TblWard';
import TblSubCategories from '../app/models/TblSubCategory';
import TblNotification from '../app/models/TblNotification';
import TblRole from '../app/models/TblRole';
import TblStatu from '../app/models/TblStatu';
import TblEventUser from '../app/models/TblEventUser';

const models = [User, Address, Phone, TblState, TblDistrict, TblBlock,TblPanchayat, TblEvent, TblComplaint,
   TblCategories,TblWards,TblSubCategories,TblNotification,TblRole,TblStatu,TblEventUser];
   
class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map((model) => model.init(this.connection));
    models.map((model) => {
      if (model.associate) {
        model.associate(this.connection.models);
      }
      return model;
    });
  }
}

export default new Database();
