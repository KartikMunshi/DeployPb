import * as Yup from 'yup';
import { Op } from 'sequelize';
import TblSubCategory from '../models/TblSubCategory';

class SubCategoryController {
  async index(req, res) {
    try {
      const { En_Name, Hi_Name } = req.query;
      let TblSubCategories = [];

      const attributes = ['SubCategoryId', 'CategoryId', 'En_Name', 'Hi_Name','IsActive','CreatedBy','CreatedDate','ModifiedBy','ModifiedDate' ];

      switch (true) {
        case En_Name && Hi_Name == null: {
            TblSubCategories = await TblSubCategory.findAll({
            where: { En_Name: { [Op.like]: `${En_Name}%` } },
            include: ['TblCategory'],
            attributes,
          });
          break;         
        }
        case Hi_Name && En_Name == null: {
            TblSubCategories = await TblSubCategory.findAll({
            where: { Hi_Name: { [Op.like]: `${Hi_Name}%` } },
            include: ['TblCategory'],
            attributes,
          });
          break;
        }
        case En_Name && Hi_Name: {
            TblSubCategories = await TblSubCategory.findAll({
            where: {
                En_Name: { [Op.like]: `${En_Name}%` },
              Hi_Name: { [Op.like]: `${Hi_Name}%` },
              include: ['TblCategory'],
              attributes,
            },
          });
          break;
        }
        default:
            TblSubCategories = await TblSubCategory.findAll({
              include: ['TblCategory'],
            attributes,
          });
          break;
      }
      return res.status(200).json(TblSubCategories);
    } 
    catch (error) {
      return res.status(400).json({ error: 'Unable to find TblSubCategory' });
    }
  }

  async show(req, res) {
    const { SubCategoryId } = req.params;
    const attributes = ['SubCategoryId', 'CategoryId','En_Name', 'Hi_Name','IsActive','CreatedBy','CreatedDate','ModifiedBy','ModifiedDate' ];

    try {
      const subcategory = await TblSubCategory.findOne({
        where: { SubCategoryId },
        order:[['SubCategoryId','DESC']],
        include: ['TblCategory'],
        attributes,
      });

      if (!subcategory) {
        return res.status(400).json({ error: 'SubCategories not found' });
      }

      return res.status(200).json(subcategory);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to find SubCategories' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      CategoryId: Yup.number().nullable(),
      En_Name: Yup.string().nullable(),
      Hi_Name: Yup.string().nullable(),
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

    const subCategory = req.body;

    try {
      const result = await TblSubCategory.sequelize.transaction(async (t) => {
        const hasUser = await TblSubCategory.findOne({ where: { En_Name: subCategory.En_Name } });

        if (hasUser) {
          throw new Error('SubCategory already exists');
        }

        await TblSubCategory.create(subCategory, {
          transaction: t,
        });

        return true;
      });

      const allSubCategories = await TblSubCategory.findAll();
      const SubCategoryID = await TblSubCategory.SubCategoryId;
      console.log(SubCategoryID);

      // return res.status(200).json(allBlocks);
      return res.status(200).json({ Status: "True", Message: 'SubCategory added successfully', Details: SubCategoryID });
    } catch (err) {
      return res.status(400).json({ error: err.message || 'Validation fails' });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      CategoryId: Yup.number().nullable(),
      En_Name: Yup.string().nullable(),
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

    const {SubCategoryId, CategoryId, En_Name, Hi_Name, IsActive, CreatedBy, CreatedDate, ModifiedBy, ModifiedDate } = req.body;

    const subcategory = await TblSubCategory.findByPk(req.body.SubCategoryId);
    try {
      const result = await TblSubCategory.sequelize.transaction(async (t) => {

        if (CategoryId || En_Name || Hi_Name || IsActive || CreatedBy || CreatedDate || ModifiedBy || ModifiedDate) {
          const userInfoToUpdate = {};

          if (CategoryId) userInfoToUpdate.CategoryId = CategoryId;
          if (En_Name) userInfoToUpdate.En_Name = En_Name;
          if (Hi_Name) userInfoToUpdate.Hi_Name = Hi_Name;
          if (IsActive) userInfoToUpdate.IsActive = IsActive;
          if (CreatedBy) userInfoToUpdate.CreatedBy = CreatedBy;
          if (CreatedDate) userInfoToUpdate.CreatedDate = CreatedDate;
          if (ModifiedBy) userInfoToUpdate.ModifiedBy = ModifiedBy;
          if (ModifiedDate) userInfoToUpdate.ModifiedDate = ModifiedDate;


          await subcategory.update(userInfoToUpdate, {
            transaction: t,
          });
        }

        return true;
      });

      const updatedUser = await TblSubCategory.findOne({
        where: req.body.SubCategoryId,
        //include: ['addresses', 'phones'],
        attributes: ['CategoryId', 'En_Name', 'Hi_Name', 'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'],
      });

      return res.status(201).json({Status: "True" , Message : 'SubCategory updated successfully' , Details: updatedUser});
    } catch (error) {
      return res.status(400).json({ error: "Something went wrong" });
    }
  }
}

export default new SubCategoryController();