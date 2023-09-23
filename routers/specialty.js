const express = require('express');
const SpecialtyController = require("../controllers/specialty");

const api = express.Router();

api.post("/specialties", SpecialtyController.getSpecialties);
api.post("/specialty", SpecialtyController.createSpecialty);
api.put("/specialty", SpecialtyController.updateSpecialty);

module.exports = api;