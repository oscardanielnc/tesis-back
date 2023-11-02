const express = require('express');
const SysDataController = require("../controllers/sysData");

const api = express.Router();

api.post("/sys-data/location", SysDataController.getLocations);
api.post("/sys-data/language", SysDataController.getLanguage);
api.get("/sys-data/emails", SysDataController.getEmailsSystem);
api.put("/sys-data/emails", SysDataController.updateEmailsSystem);
api.post("/sys-data/sectors", SysDataController.getSectors);
api.post("/sys-data/my-language", SysDataController.setMyLenguage);
api.post("/sys-data/my-certificate", SysDataController.setMyCertificate);
api.put("/sys-data/my-language", SysDataController.updateMyLenguage);
api.put("/sys-data/my-certificate", SysDataController.updateMyCertificate);
api.delete("/sys-data/my-language", SysDataController.deleteMyLenguage);
api.delete("/sys-data/my-certificate", SysDataController.deleteMyCertificate);
api.post("/sys-data/maintenance", SysDataController.maintenanceSysData);
api.post("/sys-data/period", SysDataController.createPeriod);
api.get("/sys-data/periods/:idStudent", SysDataController.getPeriods);

module.exports = api;