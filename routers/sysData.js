const express = require('express');
const SysDataController = require("../controllers/sysData");

const api = express.Router();

api.get("/sys-data/location", SysDataController.getLocations);
api.get("/sys-data/language", SysDataController.getLanguage);
api.get("/sys-data/emails", SysDataController.getEmailsSystem);
api.post("/sys-data/my-language", SysDataController.setMyLenguage);
api.post("/sys-data/my-certificate", SysDataController.setMyCertificate);
api.put("/sys-data/my-language", SysDataController.updateMyLenguage);
api.put("/sys-data/my-certificate", SysDataController.updateMyCertificate);
api.delete("/sys-data/my-language", SysDataController.deleteMyLenguage);
api.delete("/sys-data/my-certificate", SysDataController.deleteMyCertificate);

module.exports = api;