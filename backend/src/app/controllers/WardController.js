import * as Yup from 'yup';
import { Op } from 'sequelize';
import TblWard from '../models/TblWard';

class WardController {
  async index(req, res) {
    try {
      const { Name, Hi_Name } = req.query;
      let TblWards = [];

      const attributes = ['WardId', 'Name', 'WardNo', 'StateId', 'DistrictId', 'BlockId', 'PanchayatId', 'Hi_Name', 'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'];

      switch (true) {
        case Name && Hi_Name == null: {
          TblWards = await TblWard.findAll({
            where: { Name: { [Op.like]: `${Name}%` } },
            include: ['TblPanchayat', 'TblState', 'TblBlock', 'TblDistrict'],
            attributes,
          });
          break;
        }
        case Hi_Name && Name == null: {
          TblWards = await TblWard.findAll({
            where: { Hi_Name: { [Op.like]: `${Hi_Name}%` } },
            include: ['TblPanchayat', 'TblState', 'TblBlock', 'TblDistrict'],
            attributes,
          });
          break;
        }
        case Name && Hi_Name: {
          TblWards = await TblWard.findAll({
            where: {
              Name: { [Op.like]: `${Name}%` },
              Hi_Name: { [Op.like]: `${Hi_Name}%` },
              include: ['TblPanchayat', 'TblState', 'TblBlock', 'TblDistrict'],
              attributes,
            },
          });
          break;
        }
        default:
          TblWards = await TblWard.findAll({
            include: ['TblPanchayat', 'TblState', 'TblBlock', 'TblDistrict'],
            attributes,
          });
          break;
      }

      return res.status(200).json(TblWards);
    } catch (error) {
      return res.status(400).json({ error: 'Unable to find Ward' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
            WardNo: Yup.number().nullable(),
            Name: Yup.string().nullable(),
            Hi_Name: Yup.string().nullable(),
            BlockId:Yup.number().nullable(),
            PanchayatId:Yup.number().nullable(),
            DistrictId: Yup.number().nullable(),
            StateId: Yup.number().nullable(),
            IsActive: Yup.boolean().nullable(),
            CreatedBy: Yup.number().nullable(),
            CreatedDate:Yup.date().nullable(),
            ModifiedBy: Yup.number().nullable(),
            ModifiedDate:Yup.date().nullable(),
          })
        
    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    const ward = req.body;

    try {
      const result = await TblWard.sequelize.transaction(async (t) => {
        const hasUser = await TblWard.findOne({ where: { Name: ward.Name } });

          if (hasUser) {
            throw new Error('Ward already exists');
          }

          await TblWard.create(ward, {
            transaction: t,
          });
        
        return true;
      });

      const allWard = await TblWard.findAll();
      const WardID =  await TblWard.WardId;
      console.log(WardID);

      // return res.status(200).json(allBlocks);
      return res.status(200).json({ Status: "True" , Message : 'Ward added successfully' , Details: WardID });
    } catch (err) {
      return res.status(400).json({ error: err.message || 'Validation fails' });
    }
  }

  async show(req, res) {
    const { WardId } = req.params;
    const attributes = ['WardId', 'Name', 'WardNo', 'StateId', 'DistrictId', 'BlockId', 'PanchayatId', 'Hi_Name', 'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'];

    try {
      const wards = await TblWard.findOne({
        where: { WardId },
        include: ['TblPanchayat', 'TblState', 'TblBlock', 'TblDistrict'],
        attributes,
      });

      if (!wards) {
        return res.status(400).json({ error: 'Ward not found' });
      }

      return res.status(200).json(wards);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to find Ward' });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      Name: Yup.string().nullable(),
      WardNo: Yup.number().nullable(),
      StateId: Yup.number().nullable(),
      DistrictId: Yup.number().nullable(),
      BlockId: Yup.number().nullable(),
      PanchayatId: Yup.number().nullable(),
      Hi_Name: Yup.string().nullable(),
      IsActive: Yup.boolean().nullable(),
      CreatedBy: Yup.number().nullable(),
      CreatedDate:Yup.date().nullable(),
      ModifiedBy: Yup.number().nullable(),
      ModifiedDate:Yup.date().nullable()
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(400).json({ error: "Hello" });
    }

    const {WardId, Name, WardNo, StateId, DistrictId, BlockId, PanchayatId, Hi_Name, IsActive, CreatedBy, CreatedDate, ModifiedBy, ModifiedDate } = req.body;

    const ward = await TblWard.findByPk(req.body.WardId);
    try {
      const result = await TblWard.sequelize.transaction(async (t) => {

        if (Name || WardNo || StateId || DistrictId || BlockId || PanchayatId || Hi_Name || IsActive || CreatedBy || CreatedDate || ModifiedBy || ModifiedDate) {
          const userInfoToUpdate = {};

          if (Name) userInfoToUpdate.Name = Name;
          if (WardNo) userInfoToUpdate.WardNo = WardNo;
          if (StateId) userInfoToUpdate.StateId = StateId;
          if (DistrictId) userInfoToUpdate.DistrictId = DistrictId;
          if (Hi_Name) userInfoToUpdate.Hi_Name = Hi_Name;
          if (PanchayatId) userInfoToUpdate.PanchayatId = PanchayatId;
          if (BlockId) userInfoToUpdate.BlockId = BlockId;
          if (IsActive) userInfoToUpdate.IsActive = IsActive;
          if (CreatedBy) userInfoToUpdate.CreatedBy = CreatedBy;
          if (CreatedDate) userInfoToUpdate.CreatedDate = CreatedDate;
          if (ModifiedBy) userInfoToUpdate.ModifiedBy = ModifiedBy;
          if (ModifiedDate) userInfoToUpdate.ModifiedDate = ModifiedDate;


          await ward.update(userInfoToUpdate, {
            transaction: t,
          });
        }

        return true;
      });

      const updatedUser = await TblWard.findOne({
        where: req.body.WardId,
        //include: ['addresses', 'phones'],
        attributes: ['WardId', 'Name', 'WardNo', 'StateId', 'DistrictId', 'BlockId', 'PanchayatId', 'Hi_Name', 'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate' ],
      });

      return res.status(201).json({Status: "True" , Message : 'Ward updated successfully' , Details: updatedUser});
    } catch (error) {
      return res.status(400).json({ error: "Something went wrong" });
    }
  }
}

export default new WardController();