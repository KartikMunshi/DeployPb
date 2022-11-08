import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import UserController from './app/controllers/UserController';
import BlockController from './app/controllers/BlockController';
import DistrictController from './app/controllers/DistrictController';
import ComplaintController from './app/controllers/ComplaintController';
import EventController from './app/controllers/EventController';
import PanchayatController from './app/controllers/PanchayatController';
import CategoryController from './app/controllers/CategoryController';
import SubCategoryController from './app/controllers/SubCategoryController';
import WardController from './app/controllers/WardController';
import NotificationController from './app/controllers/NotificationController';
import RoleController from './app/controllers/RoleController';
import DropdownController from './app/controllers/DropdownController';
import RegionWiseReportController from './app/controllers/RegionWiseReportController';

const routes = new Router();
routes.post('/session', SessionController.store);
routes.use(authMiddleware);

// User Module
routes.get('/userList', UserController.index);
routes.get('/users/:UserId', UserController.show);
routes.post('/addUser', UserController.store);
routes.put('/updateUser', UserController.update);

//#region
// Block Module
routes.get('/blockList', BlockController.index);
routes.get('/blocks/:BlockId', BlockController.show);
routes.post('/addBlock', BlockController.store);
routes.put('/updateBlock', BlockController.update);

// District Module
routes.get('/districtList', DistrictController.index);
routes.get('/districts/:DistrictId', DistrictController.show);
routes.post('/addDistrict', DistrictController.store);
routes.put('/updateDistrict', DistrictController.update);

//Panchayat Module
routes.get('/panchayatList', PanchayatController.index);
routes.get('/panchayat/:PanchayatId', PanchayatController.show);
routes.post('/addPanchayat', PanchayatController.store);
routes.put('/updatePanchayat', PanchayatController.update);

//Ward Module
routes.get('/wardList', WardController.index);
routes.post('/addWard', WardController.store);
routes.put('/updateWard', WardController.update);
routes.get('/ward/:WardId', WardController.show);
//#endregion

// Category Module
routes.get('/categoryList', CategoryController.index);
routes.post('/addCategory', CategoryController.store);
routes.get('/category/:CategoryId', CategoryController.show);
routes.put('/updateCategory', CategoryController.update);

// SubCategory Module
routes.get('/subCategoryList', SubCategoryController.index);
routes.get('/subCategory/:SubCategoryId', SubCategoryController.show);
routes.post('/addSubCategory', SubCategoryController.store);
routes.put('/updateSubCategory', SubCategoryController.update);

// Event Module 
routes.get('/eventList', EventController.index);
routes.get('/events/:EventId', EventController.show);
routes.post('/addEvent', EventController.store);
routes.put('/updateEvent', EventController.update);

// Events on Mobile Application
routes.get('/allEvents/:UserId', EventController.GetEventListByUserId);
routes.get('/eventUserList/:EventId', EventController.GetEventUsersByEventId);
routes.get('/GetEventListByPanchayatId/:PanchayatId', EventController.GetEventListByPanchayatId);

// Complaint Module
routes.get('/complaintList', ComplaintController.index);
routes.get('/complaints/:ComplaintsId', ComplaintController.show);
routes.put('/updateComplaintWeb', ComplaintController.updateComplaint);
//Complaints on Mobile Appication
routes.put('/addComplaint', ComplaintController.store);
routes.get('/allComplaints/:UserId', ComplaintController.GetAllComplaintListByUserId);
routes.get('/myComplaints/:UserId', ComplaintController.GetMyComplaintListByUserId);
routes.get('/panchayatComplaints/:PanchayatId', ComplaintController.GetAllComplaintListByPanchayatId);

//Notification
routes.get('/notificationList',NotificationController.index)
routes.get('/notification/:NotificationId',NotificationController.show)
// Notifications on Mobile Appication
routes.get('/notificationList/:UserId',NotificationController.GetNotificationsByUserId);
routes.get('/changeNotifStatus/:NotificationId',NotificationController.ChangeNotificationStatus);

// Role Module
routes.get('/roleList', RoleController.index)

// Region Wise Count
routes.get('/totalfilteredCounts/:PanchayatId', RegionWiseReportController.TotalfilteredCounts)
routes.get('/totalCounts', RegionWiseReportController.TotalCounts)
routes.get('/getTotalFilteredComplaint/:PanchayatId', RegionWiseReportController.GetTotalComplaint)

//Event Graph
routes.get('/GetEventGraphData', RegionWiseReportController.GetEventGraphData)
routes.get('/GetFilteredEventGraphData/:PanchayatId', RegionWiseReportController.GetFilteredEventGraphData)

// Dropdown api routes
routes.get('/stateDDList', DropdownController.stateList);
routes.get('/districtDDList/:StateId', DropdownController.districtList);
routes.get('/blockDDList/:DistrictId', DropdownController.blockList);
routes.get('/panchayatDDList/:BlockId', DropdownController.panchayatList);
routes.get('/wardDDList/:PanchayatId', DropdownController.wardList);
routes.get('/assignToDDList/:UserId', DropdownController.assignToUserList);

// Dropdowns on Mobile Appication
routes.get('/categoryDDList', DropdownController.categoryList);
routes.get('/subCategoryDDList/:CategoryId', DropdownController.subCategoryList);

routes.get('/GetStatusList', DropdownController.GetComplaintStatus);


export default routes;
