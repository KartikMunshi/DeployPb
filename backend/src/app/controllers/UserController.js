import * as Yup from 'yup';
import { Op } from 'sequelize';
import User from '../models/User';
import Address from '../models/Address';
import Phone from '../models/Phone';

class UserController {
  async index(req, res) {
    try {
      const { name, email } = req.query;
      let users = [];

      const attributes = ['UserId', 'RoleId', 'FirstName', 'LastName', 'Phone', 'Gender', 'ProfileImage',
        'ImageName', 'Password', 'Address', 'StateId', 'CityId', 'DistrictId', 'BlockId', 'PanchayatId', 'WardId',
        'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate', 'OTP', 'IsAdmin'
      ];

      switch (true) {
        case name && email == null: {
          users = await User.findAll({
            where: { name: { [Op.like]: `${name}%` } },
            include: ['TblPanchayat', 'TblWard', 'TblRole'],
            attributes,
          });
          break;
        }
        case email && name == null: {
          users = await User.findAll({
            where: { email: { [Op.like]: `${email}%` } },
            include: ['TblPanchayat', 'TblWard', 'TblRole'],
            attributes,
          });
          break;
        }
        case email && name: {
          users = await User.findAll({
            where: {
              name: { [Op.like]: `${name}%` },
              email: { [Op.like]: `${email}%` },
              include: ['TblPanchayat', 'TblWard', 'TblRole'],
              attributes,
            },
          });
          break;
        }
        default:
          users = await User.findAll({
            include: ['TblPanchayat', 'TblWard', 'TblRole'],
            attributes,
          });
          break;
      }

      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json({ error: 'Unable to find users' });
    }
  }

  async show(req, res) {
    const { UserId } = req.params;
    const attributes = ['UserId', 'RoleId', 'FirstName', 'LastName', 'Phone', 'Gender', 'ProfileImage',
      'ImageName', 'Password', 'Address', 'StateId', 'CityId', 'DistrictId', 'BlockId', 'PanchayatId', 'WardId',
      'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate', 'OTP', 'IsAdmin'
    ];

    try {
      const user = await User.findOne({
        where: { UserId },
        include: ['TblPanchayat', 'TblWard', 'TblRole'],
        attributes,
      });

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to find User' });
    }
  }


  async store(req, res) {
    const schema = Yup.object().shape({

      RoleId: Yup.string().nullable(),
      FirstName: Yup.string().nullable(),
      LastName: Yup.string().nullable(),
      Phone: Yup.string().nullable(),
      Gender: Yup.string().nullable(),
      ProfileImage: Yup.string().nullable(),
      ImageName: Yup.string().nullable(),
      IsPhoneVerified: Yup.boolean().nullable(),
      Password: Yup.string().nullable(),
      Address: Yup.string().nullable(),
      StateId: Yup.number().nullable(),
      CityId: Yup.number().nullable(),
      DistrictId: Yup.number().nullable(),
      BlockId: Yup.number().nullable(),
      PanchayatId: Yup.number().nullable(),
      WardId: Yup.number().nullable(),
      LastLogin: Yup.date().nullable(),
      IsActive: Yup.boolean().nullable(),
      CreatedBy: Yup.number().nullable(),
      CreatedDate: Yup.date().nullable(),
      ModifiedBy: Yup.number().nullable(),
      ModifiedDate: Yup.date().nullable(),
      IsAdmin: Yup.boolean().nullable(),

    })

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    const user = req.body;

    try {
      const result = await User.sequelize.transaction(async (t) => {
        const hasUser = await User.findOne({ where: { FirstName: user.FirstName } });

        if (hasUser) {
          throw new Error('User already exists');
        }

        await User.create(user, {
          transaction: t,
        });

        return true;
      });

      const allUsers = await User.findAll();
      const UserID = await User.UserId;
      console.log(UserID);

      // return res.status(200).json(allBlocks);
      return res.status(200).json({ Status: "True", Message: 'User added successfully', Details: UserID });
    } catch (err) {
      return res.status(400).json({ error: err.message || 'Validation fails' });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      RoleId: Yup.number().nullable(),
      FirstName: Yup.string().nullable(),
      LastName: Yup.string().nullable(),
      Phone: Yup.number().nullable(),
      Gender: Yup.string().nullable(),
      ProfileImage: Yup.string().nullable(),
      ImageName: Yup.string().nullable(),
      IsPhoneVerified: Yup.boolean().nullable(),
      Password: Yup.number().nullable(),
      Address: Yup.string().nullable(),
      StateId: Yup.number().nullable(),
      DistrictId: Yup.number().nullable(),
      BlockId: Yup.number().nullable(),
      CityId: Yup.number().nullable(),
      WardId: Yup.string().nullable(),
      LastLogin: Yup.string().nullable(),
      IsAdmin: Yup.number().nullable(),
      DeviceToken: Yup.number().nullable(),
      IsActive: Yup.boolean().nullable(),
      CreatedBy: Yup.number().nullable(),
      CreatedDate: Yup.date().nullable(),
      ModifiedBy: Yup.number().nullable(),
      ModifiedDate: Yup.date().nullable(),
            
    

    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(400).json({ error: "Hello" });
    }

    const {UserId, RoleId, FirstName, LastName, Phone, Gender, ProfileImage, ImageName, IsPhoneVerified, Password, Address, StateId, DistrictId, BlockId, CityId, WardId, LastLogin, IsActive, CreatedBy, CreatedDate, ModifiedBy, ModifiedDate, IsAdmin, DeviceToken } = req.body;

    const complaint = await User.findByPk(req.body.UserId);
    try {
      const result = await User.sequelize.transaction(async (t) => {

        if (RoleId || FirstName || LastName || Phone || Gender || ProfileImage || ImageName || IsPhoneVerified || Password || Address || StateId || DistrictId || BlockId || CityId || WardId || LastLogin || IsActive || CreatedBy || CreatedDate || ModifiedBy || ModifiedDate || IsAdmin || DeviceToken ) {
          const userInfoToUpdate = {};

          if (RoleId) userInfoToUpdate.RoleId = RoleId;
          if (FirstName) userInfoToUpdate.FirstName = FirstName;
          if (LastName) userInfoToUpdate.LastName = LastName;
          if (Phone) userInfoToUpdate.Phone = Phone;
          if (Gender) userInfoToUpdate.Gender = Gender;
          if (ProfileImage) userInfoToUpdate.ProfileImage = ProfileImage;
          if (ImageName) userInfoToUpdate.ImageName = ImageName;
          if (IsPhoneVerified) userInfoToUpdate.IsPhoneVerified = IsPhoneVerified;
          if (Password) userInfoToUpdate.Password = Password;
          if (Address) userInfoToUpdate.Address = Address;
          if (StateId) userInfoToUpdate.StateId = StateId;
          if (DistrictId) userInfoToUpdate.DistrictId = DistrictId;
          if (BlockId) userInfoToUpdate.BlockId = BlockId;
          if (CityId) userInfoToUpdate.CityId = CityId;
          if (WardId) userInfoToUpdate.WardId = WardId;
          if (LastLogin) userInfoToUpdate.LastLogin = LastLogin;
          if (IsActive) userInfoToUpdate.IsActive = IsActive;
          if (CreatedBy) userInfoToUpdate.CreatedBy = CreatedBy;
          if (CreatedDate) userInfoToUpdate.CreatedDate = CreatedDate;
          if (ModifiedBy) userInfoToUpdate.ModifiedBy = ModifiedBy;
          if (ModifiedDate) userInfoToUpdate.ModifiedDate = ModifiedDate;
          if (IsAdmin) userInfoToUpdate.IsAdmin = IsAdmin;
          if (DeviceToken) userInfoToUpdate.Comment = DeviceToken;
         

          await complaint.update(userInfoToUpdate, {
            transaction: t,
          });
        }

        return true;
      });

      const updatedUser = await User.findOne({
        where: req.body.UserId,
        //include: ['addresses', 'phones'],
        attributes: ['UserId', 'RoleId', 'FirstName', 'LastName', 'Phone', 'Gender', 'ProfileImage', 'ImageName', 'IsPhoneVerified', 'Password', 'Address', 'StateId', 'DistrictId', 'BlockId', 'CityId', 'WardId', 'LastLogin', 'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate', 'IsAdmin', 'DeviceToken'],
      });

      return res.status(201).json({Status: "True" , Message : 'User updated successfully' , Details: updatedUser});
    } catch (error) {
      return res.status(400).json({ error: "Something went wrong" });
    }
  }
}

export default new UserController();