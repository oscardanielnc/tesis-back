const express = require('express');
const SysDataController = require("../controllers/sysData");

const api = express.Router();

api.get("/sys-data/location", SysDataController.getLocations);
api.get("/sys-data/language", SysDataController.getLanguage);

module.exports = api;