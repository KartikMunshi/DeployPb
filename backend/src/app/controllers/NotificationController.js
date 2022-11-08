import * as Yup from 'yup';
import { Op } from 'sequelize';
import TblNotification from '../models/TblNotification';

class NotificationController {
  async index(req, res) {
    try {
      const { Type, UserId } = req.query;
      let TblNotifications = [];

      const attributes = ['NotificationId','UserId', 'Type', 'EventId', 'ComplaintId','En_Title','Hi_Title','ImageName','Seen','IsActive','CreatedBy','CreatedDate','ModifiedBy','ModifiedDate'];

      switch (true) {
        case Type && UserId == null: {
            TblNotifications = await TblNotification.findAll({
            where: { Type: { [Op.like]: `${Type}%` } },
            include: ['TblComplaint','TblEvent','CreatedByUser'],
            attributes,
          });
          break;
        }
        case UserId && Type == null: {
            TblNotifications = await TblNotification.findAll({
            where: { UserId: { [Op.like]: `${UserId}%` } },
            include: ['TblComplaint','TblEvent','CreatedByUser'],
            attributes,
          });
          break;
        }
        case UserId && Type: {
            TblNotifications = await TblNotification.findAll({
            where: {
                Type: { [Op.like]: `${Type}%` },
                UserId: { [Op.like]: `${UserId}%` },
                include: ['TblComplaint','TblEvent','CreatedByUser'],
              attributes,
            },
          });
          break;
        }
        default:
            TblNotifications = await TblNotification.findAll({
              include: ['TblComplaint','TblEvent','CreatedByUser'],
            attributes,
          });
          break;
      }

      return res.status(200).json(TblNotifications);
    } catch (error) {
      return res.status(400).json({ error: 'Unable to find Notifications' });
    }
  }

  async show(req, res) {
    const { NotificationId } = req.params;
    const attributes = ['NotificationId','UserId', 'Type', 'EventId', 'ComplaintId','En_Title','Hi_Title','ImageName','Seen','IsActive','CreatedBy','CreatedDate','ModifiedBy','ModifiedDate'];

    try {
      const Notifications = await TblNotification.findOne({
        where: { NotificationId },
        include: ['TblComplaint','TblEvent','CreatedByUser'],
        attributes,
      });

      if (!Notifications) {
        return res.status(400).json({ error: 'Notification not found' });
      }

      return res.status(200).json(Notifications);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to find Notification' });
    }
  }


  // Get Notification List by UserId for mobile view
  async GetNotificationsByUserId (req, res){
    const { UserId } = req.params;
    const attributes = ['NotificationId','UserId', 'Type', 'EventId', 'ComplaintId','En_Title','Hi_Title','ImageName','Seen','IsActive','CreatedBy','CreatedDate','ModifiedBy','ModifiedDate'];
    let notifList = [];
  
    try{
        const loggedInUserObj = await User.findOne({
            where : { UserId, IsActive : true },
        });
  
        if(loggedInUserObj){
          notifList = await TblNotification.findAll({
                where : { UserId : UserId, IsActive : true},
                include: ['TblEvent','TblComplaint'],
                order: [['NotificationId','DESC']],
                attributes,
            })
        }
        if (notifList && notifList.length > 0){
            return res.status(200).json(notifList);
        }
        return res.status(200).json({ error : 'Notifications not found'});
    }
    catch(error){
        return res.status(500).json({ error : ' Unable to find Notification'});
    }
    }
  
  // Change Notification Status Seen Unseen for mobile view and web project (put api)
    async ChangeNotificationStatus (req, res){
    const { NotificationId } = req.params;
    const attributes = ['NotificationId', 'UserId', 'Type', 'EventId', 'ComplaintId','En_Title','Hi_Title','ImageName','Seen','IsActive','CreatedBy','CreatedDate','ModifiedBy','ModifiedDate'];
    let notifObj = null;
  
    try{
        
        if(NotificationId){
          
          const result = await TblNotification.sequelize.transaction(async (t) => {
  
            notifObj = await TblNotification.findOne({
              where : { NotificationId : NotificationId, IsActive : true },
              attributes,
            })
  
            if (notifObj) {
              
              const userInfoToUpdate = {};
      
                userInfoToUpdate.Seen = true;
               
                await notifObj.update(userInfoToUpdate, {
                  transaction: t,
                });
            }
  
            return true;
          });
        }
        if (notifObj){
            return res.status(200).json({ Status: "True" , Message : 'Notification Status Changed Successfully' , Details: NotificationId });
        }
        return res.status(200).json({ error : 'Notification Status Not Change'});
    }
    catch(error){
        return res.status(500).json({ error : 'Unable to Change Notification Status'});
    }
    }

}

export default new NotificationController();