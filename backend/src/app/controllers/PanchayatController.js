import * as Yup from 'yup';
import { Op } from 'sequelize';
import TblPanchayat from '../models/TblPanchayat';

class PanchayatController {
  async index(req, res) {
    try {
      const { Name, StateId } = req.query;
      let TblPanchayats = [];

      const attributes = ['PanchayatId', 'BlockId', 'CityId', 'Name', 'Hi_Name', 'DistrictId', 'StateId','IsActive','CreatedBy','CreatedDate','ModifiedBy','ModifiedDate'];

      switch (true) {
        case Name && StateId == null: {
            TblPanchayats = await TblPanchayat.findAll({
            where: { Name: { [Op.like]: `${Name}%` } },
            include: ['TblDistrict','TblState','TblBlock'],
            attributes,
          });
          break;
        }
        case StateId && Name == null: {
            TblPanchayats = await TblPanchayat.findAll({
            where: { StateId: { [Op.like]: `${StateId}%` } },
            include: ['TblDistrict','TblState','TblBlock'],
            attributes,
          });
          break;
        }
        case StateId && Name: {
            TblPanchayats = await TblPanchayat.findAll({
            where: {
              Name: { [Op.like]: `${Name}%` },
              StateId: { [Op.like]: `${StateId}%` },
              include: ['TblDistrict','TblState','TblBlock'],
              attributes,
            },
          });
          break;
        }
        default:
            TblPanchayats = await TblPanchayat.findAll({
              include: ['TblDistrict','TblState','TblBlock'],
            attributes,
          });
          break;
      }

      return res.status(200).json(TblPanchayats);
    } catch (error) {
      return res.status(400).json({ error: 'Unable to find Panchayat' });
    }
  }
  async show(req, res) {
    const { PanchayatId } = req.params;
    const attributes = ['PanchayatId', 'BlockId', 'CityId', 'Name', 'Hi_Name', 'DistrictId', 'StateId','IsActive','CreatedBy','CreatedDate','ModifiedBy','ModifiedDate'];

    try {
      const Panchayats = await TblPanchayat.findOne({
        where: { PanchayatId },
        include: ['TblDistrict','TblState','TblBlock'],
        attributes,
      });

      if (!Panchayats) {
        return res.status(400).json({ error: 'Panchayat not found' });
      }

      return res.status(200).json(Panchayats);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to find Panchayat' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
            Name: Yup.string(),
            Hi_Name: Yup.string(),
            StateId: Yup.number(),
            BlockId: Yup.number(),
            CityId: Yup.number(),
            IsActive: Yup.boolean(),
            CreatedBy: Yup.number(),
            CreatedDate: Yup.date(),
            ModifiedBy: Yup.number(),
            ModifiedDate: Yup.date()   
          })

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    const  Panchayat  = req.body;
    //const attributes = ['PanchayatId', 'Name', 'Hi_Name'];

    try {
      const result = await TblPanchayat.sequelize.transaction(async (t) => {
        
          const hasUser = await TblPanchayat.findOne({ where: { Name: Panchayat.Name } });

          if (hasUser) {
            throw new Error('Panchayat already exists');
          }

          await TblPanchayat.create(Panchayat, {
            transaction: t,
          });
        
        return true;
      });

      const allPanchayats = await TblPanchayat.findAll();
      const PanchID =  await TblPanchayat.PanchayatId;
      console.log(PanchID);

      return res.status(200).json({ Status: "True" , Message : 'Panchayat added successfully' , Details: PanchID });
    } catch (err) {
      return res.status(400).json({ error: err.message || 'Validation fails' });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
            Name: Yup.string().nullable(),
            Hi_Name: Yup.string().nullable(),
            StateId: Yup.number().nullable(),
            DistrictId: Yup.number().nullable(),
            BlockId: Yup.number().nullable(),
            CityId: Yup.number().nullable(),
            IsActive: Yup.boolean().nullable(),
            CreatedBy: Yup.number().nullable(),
            CreatedDate: Yup.date().nullable(),
            ModifiedBy: Yup.number().nullable(),
            ModifiedDate: Yup.date().nullable()
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(400).json({ error: "Hello" });
    }

    const {PanchayatId, Name, Hi_Name, StateId, DistrictId, BlockId, CityId, IsActive, CreatedBy, CreatedDate, ModifiedBy, ModifiedDate } = req.body;

    const panchayat = await TblPanchayat.findByPk(req.body.PanchayatId);
    try {
      const result = await TblPanchayat.sequelize.transaction(async (t) => {

        if (Name || Hi_Name || StateId || DistrictId || BlockId || CityId || IsActive || CreatedBy || CreatedDate || ModifiedBy || ModifiedDate) {
          const userInfoToUpdate = {};

          if (Name) userInfoToUpdate.Name = Name;
          if (Hi_Name) userInfoToUpdate.Hi_Name = Hi_Name;
          if (StateId) userInfoToUpdate.StateId = StateId;
          if (DistrictId) userInfoToUpdate.DistrictId = DistrictId;
          if (BlockId) userInfoToUpdate.BlockId = BlockId;
          if (CityId) userInfoToUpdate.CityId = CityId;
          if (IsActive) userInfoToUpdate.IsActive = IsActive;
          if (CreatedBy) userInfoToUpdate.CreatedBy = CreatedBy;
          if (CreatedDate) userInfoToUpdate.CreatedDate = CreatedDate;
          if (ModifiedBy) userInfoToUpdate.ModifiedBy = ModifiedBy;
          if (ModifiedDate) userInfoToUpdate.ModifiedDate = ModifiedDate;


          await panchayat.update(userInfoToUpdate, {
            transaction: t,
          });
        }

        return true;
      });

      const updatedUser = await TblPanchayat.findOne({
        where: req.body.PanchayatId,
        //include: ['addresses', 'phones'],
        attributes: ['PanchayatId', 'Name', 'Hi_Name', 'StateId', 'DistrictId', 'BlockId', 'CityId', 'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'],
      });

      return res.status(201).json({Status: "True" , Message : 'Panchayat updated successfully' , Details: updatedUser});
    } catch (error) {
      return res.status(400).json({ error: "Something went wrong" });
    }
  }
}

export default new PanchayatController();