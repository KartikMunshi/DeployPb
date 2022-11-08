import * as Yup from 'yup';
import { Op } from 'sequelize';
import TblComplaint from '../models/TblComplaint';
import User from '../models/User';
import TblPanchayat from '../models/TblPanchayat';

const Sequelize = require('sequelize');

class ComplaintController {

    async index(req, res) {
        try {
            const { Title, ComplaintsId } = req.query;
            let TblComplaints = [];

            const attributes = ['ComplaintsId', 'ComplaintUserId', 'Title', 'Description', 'CategoryId', 'SubCategoryId', 'Image', 'ImageName', 'AssignUserId', 'StatusId', 'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'Month', 'Comment', 'Private'];

            switch (true) {
                case Title && ComplaintsId == null: {
                    TblComplaints = await TblComplaint.findAll({
                        where: { Title: { [Op.like]: `${Title}%` } },
                        include: ['TblCategories','TblSubCategories','TblStatu','ComplaintUser','AssignUser'],
                        attributes,
                    });
                    break;
                }
                case ComplaintsId && Title == null: {
                    TblComplaints = await TblComplaint.findAll({
                        where: {
                            ComplaintsId: { [Op.like]: `${ComplaintsId}%` },
                            include: ['TblCategories','TblSubCategories','TblStatu','ComplaintUser','AssignUser'],
                            attributes,
                        }
                    });
                }
                case ComplaintsId && Title : {
                    TblComplaints = await TblComplaint.findAll({
                        where: {
                            Title: { [Op.like]: `${Title}%` },
                            ComplaintsId: { [Op.like]: `${ComplaintsId}%` },
                            include: ['TblCategories','TblSubCategories','TblStatu','ComplaintUser','AssignUser'],
                            attributes,
                        }
                    });
                    break;
                }
                default :
                TblComplaints = await TblComplaint.findAll({
                  include: ['TblCategories','TblSubCategories','TblStatu','ComplaintUser','AssignUser'],
                    attributes,
                });
                break;
            }

            return res.status(200).json(TblComplaints);
        }
        catch(error){
            return res.status(400).json({ error: 'Unable to find Complaints' });
        }
    }


    async show (req, res){

        const { ComplaintsId } = req.params;
        const attributes = ['ComplaintsId', 'ComplaintUserId', 'Title', 'Description', 'CategoryId', 'SubCategoryId', 'Image', 'ImageName', 'AssignUserId', 'StatusId', 'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'Month', 'Comment', 'Private'];
   
        try{
            const complanits = await TblComplaint.findOne({
                where : { ComplaintsId },
                include: ['TblCategories','TblSubCategories','TblStatu','ComplaintUser','AssignUser'],
                attributes,
            });

            if (!complanits){
                return res.status(200).json({ error : 'Complaint not found'});
            }
            return res.status(200).json(complanits);
        }
        catch(error){
            return res.status(500).json({ error : ' Unable to find Complaint'});
        }
    }

    async updateComplaint(req, res) {
        const schema = Yup.object().shape({
                ComplaintUserId: Yup.number().nullable(),
                Title: Yup.string().nullable(),
                Description: Yup.string().nullable(),
                CategoryId: Yup.number().nullable(),
                SubCategoryId: Yup.number().nullable(),
                Image: Yup.string().nullable(),
                ImageName: Yup.string().nullable(),
                AssignUserId: Yup.number().nullable(),
                StatusId: Yup.number().nullable(),
                IsActive: Yup.boolean().nullable(),
                CreatedBy: Yup.number().nullable(),
                CreatedDate: Yup.date().nullable(),
                ModifiedBy: Yup.number().nullable(),
                ModifiedDate: Yup.date().nullable(),
                Month: Yup.string().nullable(),
                Comment: Yup.string().nullable(),
                Private: Yup.string().nullable()
        });
    
        try {
          await schema.validate(req.body);
        } catch (err) {
          return res.status(400).json({ error: "Hello" });
        }
    
        const {ComplaintsId, AssignUserId, StatusId } = req.body;

        try {
            if (tblEventGraphObj) {
                Totals = await User.findOne({
                    where: { PanchayatId },
                })
          }
         } 
         catch (err) {
            return res.status(400).json({ error: "Hello" });
          }
    
        const complaint = await TblComplaint.findByPk(req.body.ComplaintsId);
        try {
          const result = await TblComplaint.sequelize.transaction(async (t) => {
    
            if ( AssignUserId || StatusId ) {
              const userInfoToUpdate = {};
    
              if (AssignUserId) userInfoToUpdate.AssignUserId = AssignUserId;
              if (StatusId) userInfoToUpdate.StatusId = StatusId;

              await complaint.update(userInfoToUpdate, {
                transaction: t,
              });
            }
    
            return true;
          });
    
          const updatedUser = await TblComplaint.findOne({
            where: req.body.ComplainsId,
            //include: ['addresses', 'phones'],
            include: ['TblCategories','TblSubCategories','TblStatu','ComplaintUser','AssignUser'],
          });
    
          return res.status(201).json({Status: "True" , Message : 'Complaint updated successfully' , Details: updatedUser});
        } catch (error) {
          return res.status(400).json({ error: "Something went wrong" });
        }
      }

      // Panchayat specific user complaints (when complaint is not private)
    async GetAllComplaintListByUserId (req, res){
        const { UserId } = req.params;
        const attributes = ['ComplaintsId', 'ComplaintUserId', 'Title', 'Description', 'CategoryId', 'SubCategoryId', 'Image', 'ImageName', 'AssignUserId', 'StatusId', 'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'Month', 'Comment', 'Private'];
        let complaintList = [];
        let userListObj = [];
        let complaintListAll = [];
        try{
            const loggedInUserObj = await User.findOne({
                where : { UserId, IsActive : true },
            });
  
            if(loggedInUserObj){
  
              userListObj = await User.findAll({
                where : { PanchayatId : loggedInUserObj.PanchayatId, IsActive : true },
              });
  
              if(userListObj){
                
                for await (const user of userListObj) {
                  complaintList = await TblComplaint.findAll({
                    where : { ComplaintUserId : user.UserId, IsActive : true, Private : false },
                    include: ['TblCategories','TblSubCategories','TblStatu','ComplaintUser','AssignUser'],
                    attributes,
                   })
  
                   if(complaintList && complaintList.length > 0){
  
                    for await (const compObj of complaintList){
                      complaintListAll.push(compObj);
                    }
                   }
                }
              }
            }
            if (!complaintListAll){
                return res.status(200).json({ error : 'Complaint not found'});
            }
            return res.status(200).json(complaintListAll);
        }
        catch(error){
            return res.status(500).json({ error : ' Unable to find Complaint'});
        }
      }
  // User Specific complaints (Display the list of complaints which is created by user)
      async GetMyComplaintListByUserId (req, res){
      const { UserId } = req.params;
      const attributes = ['ComplaintsId', 'ComplaintUserId', 'Title', 'Description', 'CategoryId', 'SubCategoryId', 'Image', 'ImageName', 'AssignUserId', 'StatusId', 'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'Month', 'Comment', 'Private'];
  
      let complaintListMy = [];
      try{
          const loggedInUserObj = await User.findOne({
              where : { UserId, IsActive : true },
          });
  
          if(loggedInUserObj){
  
            complaintListMy = await TblComplaint.findAll({
              where: Sequelize.and(
                {IsActive : true },
                Sequelize.or(
                  { ComplaintUserId: UserId },
                  { AssignUserId: UserId },
                )
              ),
              include: ['TblCategories','TblSubCategories','TblStatu','ComplaintUser','AssignUser'],
              order: [['ComplaintsId','DESC']],
              attributes,
            })
          }
          if (!complaintListMy){
              return res.status(200).json({ error : 'Complaint not found'});
          }
          return res.status(200).json(complaintListMy);
      }
      catch(error){
          return res.status(500).json({ error : ' Unable to find Complaint'});
      }
      }
  // Add Complaints from mobile view.
      async store(req, res) {
          const schema = Yup.object().shape({
              ComplaintUserId: Yup.number().nullable(),
              Title: Yup.string().nullable(),
              Description: Yup.string().nullable(),
              CategoryId: Yup.number().nullable(),
              SubCategoryId: Yup.number().nullable(),
              Image: Yup.string().nullable(),
              ImageName: Yup.string().nullable(),
              AssignUserId: Yup.number().nullable(),
              StatusId: Yup.number().nullable(),
              IsActive: Yup.boolean().nullable(),
              CreatedBy: Yup.number().nullable(),
              CreatedDate: Yup.date().nullable(),
              ModifiedBy: Yup.number().nullable(),
              ModifiedDate: Yup.date().nullable(),
              Month: Yup.string().nullable(),
              Comment: Yup.string().nullable(),
              Private: Yup.string().nullable()
          });
          try {
            await schema.validate(req.body);
          } catch (err) {
            return res.status(400).json({ error: err.message });
          }
  
          const complaint = req.body;
       
          try {
            const result = await TblComplaint.sequelize.transaction(async (t) => {
              const hasUser = await TblComplaint.findOne({ where: { Title: complaint.Title } });
      
                if (hasUser) {
                  throw new Error('Compliaint already exists');
                }
  
                if(complaint.ComplaintUserId && complaint.ComplaintUserId > 0){
                  const loggedInUserObj = await User.findOne({ 
                   where: Sequelize.and(
                      { UserId: complaint.ComplaintUserId, IsActive : true },
                      Sequelize.or(
                        { RoleId: [3,4] },
                      )
                    )
                  });
  
                  if(loggedInUserObj){
                    const wardMemObj = await User.findOne({ 
                      where: {IsActive : true, PanchayatId : loggedInUserObj.PanchayatId, RoleId : 4 },
                     });
                     const adminObj = await User.findOne({ 
                      where: {IsActive : true, PanchayatId : loggedInUserObj.PanchayatId, RoleId : 2 },
                     });
                    if(loggedInUserObj.RoleId == 3){
                       if(wardMemObj){
                        complaint.AssignUserId = wardMemObj.UserId;
                       }
                       else{
                        complaint.AssignUserId = adminObj.UserId;
                       }
                    }
                    else if(loggedInUserObj.RoleId == 4){
                      if(adminObj){
                        complaint.AssignUserId = adminObj.UserId;
                       }
                       else{
                        complaint.AssignUserId = loggedInUserObj.UserId;
                       }
                    }
  
                    await TblComplaint.create(complaint, {
                      transaction: t,
                    });
                  }
                }
                
              return true;
            });
          
            return res.status(200).json({ Status: "True" , Message : 'Complaint added sucessfully'});
          } catch (err) {
            return res.status(400).json({ error: err.message || 'Validation fails' });
          }
      }

      // Panchayat specific complaint List (when complaint is not private)
  async GetAllComplaintListByPanchayatId(req, res) {
    const { PanchayatId } = req.params;
    const attributes = ['ComplaintsId', 'ComplaintUserId', 'Title', 'Description', 'CategoryId', 'SubCategoryId', 'Image', 'ImageName', 'AssignUserId', 'StatusId', 'IsActive', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'Month', 'Comment', 'Private'];
    let complaintList = [];
    let userListObj = [];
    let complaintListAll = [];
    try {
      const panchyatObj = await TblPanchayat.findOne({
        where: { PanchayatId, IsActive: true },
      });

      if (panchyatObj) {

        userListObj = await User.findAll({
          where: { PanchayatId : PanchayatId , IsActive: true },
        });

        if (userListObj) {

          for await (const user of userListObj) {
            complaintList = await TblComplaint.findAll({
              where: { ComplaintUserId: user.UserId, IsActive: true, Private: false },
              include: ['TblCategories','TblSubCategories','TblStatu','ComplaintUser','AssignUser'],
              attributes,
            })

            if (complaintList && complaintList.length > 0) {

              for await (const compObj of complaintList) {
                complaintListAll.push(compObj);
              }
            }
          }
        }
      }
      if (!complaintListAll) {
        return res.status(200).json({ error: 'Complaint not found' });
      }
      return res.status(200).json(complaintListAll);
    }
    catch (error) {
      return res.status(500).json({ error: ' Unable to find Complaint' });
    }
  }
}

export default new ComplaintController();