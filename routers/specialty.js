const express = require('express');
const SpecialtyController = require("../controllers/specialty");

const api = express.Router();

api.get("/specialty", SpecialtyController.getSpecialties);

module.exports = api;